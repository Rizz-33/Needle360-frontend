import { create } from "zustand";
import { disconnectSocket, getSocket } from "../lib/socket";

const BASE_API_URL = import.meta.env.VITE_API_URL || "https://needle360.online";

export const useChatStore = create((set, get) => ({
  // State
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  isChatOpen: false,
  unreadCount: 0,
  currentUserId: null,
  isConnected: false,
  currentPage: 1,
  hasMore: true,
  socketError: null,

  // Actions
  cleanupSocket: () => {
    const socket = getSocket();
    if (socket) {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("newMessage");
      socket.off("messagesRead");
    }
    disconnectSocket();
    set({ isConnected: false, socketError: null });
  },

  setCurrentUserId: (userId) => {
    set({ currentUserId: userId });
    get().initializeSocket();
  },

  initializeSocket: () => {
    const { currentUserId } = get();
    if (!currentUserId) {
      set({ error: "User ID not available" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      set({ error: "Authentication token missing" });
      return;
    }

    // Clean up any existing connection
    get().cleanupSocket();

    const socket = getSocket();
    if (!socket) {
      set({ error: "Failed to initialize socket connection" });
      return;
    }

    // Connection events
    socket.on("connect", () => {
      console.log("ChatStore: Socket connected");
      set({ isConnected: true, socketError: null });

      // Join user's personal room
      socket.emit("joinRoom", {
        userId: currentUserId,
        role: "user", // Replace with actual role from your auth system
      });

      // Rejoin active conversation if exists
      const { activeConversation } = get();
      if (activeConversation) {
        socket.emit("joinConversation", activeConversation._id);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      set({
        isConnected: false,
        socketError: `Connection failed: ${err.message}`,
      });

      if (err.message.includes("Authentication error")) {
        console.error("Authentication failed - invalid or missing token");
        // Handle token refresh or redirect to login
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      set({ isConnected: false });
    });

    // Message events
    socket.on("newMessage", (message) => {
      const { activeConversation, messages, currentUserId } = get();
      const isOwnMessage = message.sender._id === currentUserId;
      const messageExists = messages?.some(
        (msg) => msg._id === message._id || msg.clientId === message.clientId
      );

      if (activeConversation?._id === message.conversation) {
        if (!messageExists) {
          const isRead = isOwnMessage || document.visibilityState === "visible";
          if (isRead && !message.readBy.includes(currentUserId)) {
            message.readBy = [...message.readBy, currentUserId];
            if (!isOwnMessage) {
              get().markConversationAsRead(activeConversation._id);
            }
          }
          set({ messages: [...(messages || []), message] });
        } else if (isOwnMessage && messageExists) {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.clientId === message.clientId || msg._id === message._id
                ? { ...message, clientId: msg.clientId }
                : msg
            ),
          }));
        }
      }

      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv._id === message.conversation
            ? { ...conv, lastMessage: message }
            : conv
        ),
      }));
    });

    socket.on("messagesRead", ({ conversationId, readBy, messageIds }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          messageIds.includes(msg._id) && !msg.readBy.includes(readBy)
            ? { ...msg, readBy: [...msg.readBy, readBy] }
            : msg
        ),
      }));
    });

    set({ isConnected: socket.connected });
  },

  setChatOpen: (isOpen) => {
    if (isOpen) {
      get().fetchConversations();
    }
    set({ isChatOpen: isOpen });
  },

  setActiveConversation: (conversation) => {
    const { socket } = get();

    if (get().activeConversation) {
      socket?.emit("leaveConversation", get().activeConversation._id);
    }

    set({
      activeConversation: conversation,
      messages: [],
      isLoading: true,
      currentPage: 1,
      hasMore: true,
    });

    if (conversation) {
      socket?.emit("joinConversation", conversation._id);
      get().fetchMessages(conversation._id);
      get().markConversationAsRead(conversation._id);
    }
  },

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${BASE_API_URL}/api/conversations`, {
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const data = await response.json();
      set({
        conversations: Array.isArray(data) ? data : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching conversations:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: async (content, attachments = []) => {
    const { activeConversation, currentUserId } = get();
    if (!activeConversation || (!content && attachments.length === 0)) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      _id: tempId,
      sender: { _id: currentUserId },
      content,
      conversation: activeConversation._id,
      attachments,
      readBy: [currentUserId],
      createdAt: new Date().toISOString(),
      isSending: true,
      clientId: tempId,
    };

    // Optimistic update
    set((state) => ({
      messages: [...(state.messages || []), newMessage],
      conversations: state.conversations.map((conv) =>
        conv._id === activeConversation._id
          ? { ...conv, lastMessage: newMessage }
          : conv
      ),
    }));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${BASE_API_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: activeConversation._id,
          content,
          attachments,
          clientId: tempId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to send message: ${response.status}`
        );
      }

      const savedMessage = await response.json();
      savedMessage.clientId = tempId;

      // Update with server response
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? savedMessage : msg
        ),
        conversations: state.conversations.map((conv) =>
          conv._id === activeConversation._id
            ? { ...conv, lastMessage: savedMessage }
            : conv
        ),
      }));

      // Emit socket event if connected
      const socket = getSocket();
      if (socket?.connected) {
        socket.emit("newMessage", savedMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
      // Rollback optimistic update
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId) ?? [],
        error: error.message,
      }));
    }
  },

  // Add this new method to mark messages as read via socket
  socketMarkMessagesAsRead: (conversationId, messageIds) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit("markMessagesAsRead", {
        conversationId,
        messageIds,
      });
    }
  },

  startNewConversation: async (participantId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${BASE_API_URL}/api/conversations`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ participantId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const newConversation = await response.json();

      set((state) => ({
        conversations: [newConversation, ...state.conversations],
        activeConversation: newConversation,
        isChatOpen: true,
        isLoading: false,
      }));

      get().fetchMessages(newConversation._id);
    } catch (error) {
      console.error(
        `ChatStore: Error starting new conversation - ${error.message}`
      );
      set({
        error: `Failed to start conversation: ${error.message}`,
        isLoading: false,
      });
    }
  },

  deleteMessage: async (messageId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${BASE_API_URL}/api/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set((state) => {
        const filteredMessages =
          state.messages?.filter((msg) => msg._id !== messageId) ?? [];

        let newLastMessage = null;
        if (state.activeConversation?.lastMessage?._id === messageId) {
          newLastMessage =
            filteredMessages[filteredMessages.length - 1] || null;
        }

        return {
          messages: filteredMessages,
          activeConversation: newLastMessage
            ? { ...state.activeConversation, lastMessage: newLastMessage }
            : state.activeConversation,
          conversations: state.conversations.map((conv) =>
            conv._id === state.activeConversation?._id && newLastMessage
              ? { ...conv, lastMessage: newLastMessage }
              : conv
          ),
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Error deleting message:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  markConversationAsRead: async (conversationId) => {
    if (!conversationId) return;

    const { currentUserId, messages } = get();

    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.conversation === conversationId &&
        msg.sender._id !== currentUserId &&
        !msg.readBy.includes(currentUserId)
          ? { ...msg, readBy: [...msg.readBy, currentUserId] }
          : msg
      ),
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId &&
        conv.lastMessage &&
        conv.lastMessage.sender._id !== currentUserId
          ? {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                readBy: conv.lastMessage.readBy.includes(currentUserId)
                  ? conv.lastMessage.readBy
                  : [...conv.lastMessage.readBy, currentUserId],
              },
            }
          : conv
      ),
    }));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${BASE_API_URL}/api/messages/conversation/${conversationId}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error.message);
    }
  },

  fetchMessages: async (conversationId, loadMore = false, silent = false) => {
    if (!conversationId) {
      set({ error: "No conversation ID provided", isLoading: false });
      return;
    }

    if (!silent) {
      set({ isLoading: true, error: null });
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const {
        currentPage,
        hasMore,
        messages: existingMessages,
        currentUserId,
      } = get();

      if (loadMore && !hasMore) {
        set({ isLoading: false });
        return;
      }

      const nextPage = loadMore ? currentPage + 1 : 1;

      const response = await fetch(
        `${BASE_API_URL}/api/messages/conversation/${conversationId}?page=${nextPage}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const receivedMessages = Array.isArray(data.messages)
        ? data.messages
        : [];

      const readStatusMap = {};
      if (silent && existingMessages) {
        existingMessages.forEach((msg) => {
          readStatusMap[msg._id] = msg.readBy || [];
        });
      }

      const processedMessages = receivedMessages.map((msg) => {
        if (silent && readStatusMap[msg._id]) {
          return { ...msg, readBy: readStatusMap[msg._id] };
        }
        return msg;
      });

      set((state) => ({
        messages: loadMore
          ? [...processedMessages, ...(state.messages || [])]
          : processedMessages,
        currentPage: nextPage,
        isLoading: false,
        hasMore: data.pagination?.currentPage < data.pagination?.totalPages,
      }));

      if (!silent) {
        get().markConversationAsRead(conversationId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      set({ error: error.message, isLoading: !silent && false });
    }
  },
}));
