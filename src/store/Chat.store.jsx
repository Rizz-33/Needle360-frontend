import { io } from "socket.io-client";
import { create } from "zustand";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

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
  socket: null,
  isConnected: false,
  currentPage: 1,
  hasMore: true,

  // Socket Actions
  initializeSocket: () => {
    const { currentUserId } = get();
    if (!currentUserId) return;

    // Clean up existing socket if any
    get().cleanupSocket();

    console.log("Initializing socket connection...");

    const socket = io(API_BASE_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
      set({ isConnected: true });

      // Rejoin active conversation if any
      const { activeConversation } = get();
      if (activeConversation) {
        socket.emit("joinConversation", activeConversation._id);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      const { activeConversation, messages, currentUserId } = get();

      // Check if this is our own message (already in state)
      const isOwnMessage = message.sender._id === currentUserId;
      const messageExists = messages?.some(
        (msg) =>
          msg._id === message._id ||
          (msg.clientId && msg.clientId === message.clientId)
      );

      // Handle different scenarios
      if (activeConversation?._id === message.conversation) {
        if (!messageExists) {
          set({
            messages: [...(messages || []), message],
          });

          // If not our own message, mark it as read immediately
          if (!isOwnMessage) {
            get().markConversationAsRead(activeConversation._id);
          }
        } else if (isOwnMessage && messageExists) {
          // Update the existing message with server data
          set((state) => ({
            messages: state.messages.map((msg) =>
              (msg.clientId && msg.clientId === message.clientId) ||
              msg._id === message._id
                ? { ...message, clientId: msg.clientId }
                : msg
            ),
          }));
        }
      }

      // Always update conversations list
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv._id === message.conversation
            ? { ...conv, lastMessage: message }
            : conv
        ),
      }));
    });

    // Handle read receipts
    socket.on("messagesRead", ({ conversationId, readBy, messageIds }) => {
      console.log("Messages read event:", {
        conversationId,
        readBy,
        messageIds,
      });
      set((state) => ({
        messages: state.messages.map((msg) =>
          messageIds.includes(msg._id) && !msg.readBy.includes(readBy)
            ? { ...msg, readBy: [...msg.readBy, readBy] }
            : msg
        ),
      }));
    });

    set({ socket });
  },

  cleanupSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // Actions
  setCurrentUserId: (userId) => {
    set({ currentUserId: userId });
    setTimeout(() => {
      get().initializeSocket();
    }, 0);
  },

  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),

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
    }
  },

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set({
        conversations: Array.isArray(data) ? data : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // In useChatStore (Chat.store.js)
  fetchMessages: async (conversationId, loadMore = false) => {
    if (!conversationId) {
      set({ error: "No conversation ID provided", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const { currentPage, hasMore } = get();

      if (loadMore && !hasMore) {
        set({ isLoading: false });
        return;
      }

      const nextPage = loadMore ? currentPage + 1 : 1;

      // Fix the URL path here
      const response = await fetch(
        `${API_BASE_URL}/api/messages/conversation/${conversationId}?page=${nextPage}&limit=50`,
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

      set((state) => ({
        // If loading more, add new messages to existing ones, otherwise replace
        messages: loadMore
          ? [...receivedMessages, ...(state.messages || [])] // Changed order for infinite scrolling up
          : receivedMessages,
        currentPage: nextPage,
        isLoading: false,
        hasMore: data.pagination?.currentPage < data.pagination?.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
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
      // Add a clientId to track this specific message
      clientId: tempId,
    };

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

      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: activeConversation._id,
          content,
          attachments,
          clientId: tempId, // Send the clientId to the server
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedMessage = await response.json();

      // Add the clientId to the saved message for tracking
      savedMessage.clientId = tempId;

      set((state) => {
        // Replace the temp message with the real one
        const newMessages = state.messages.map((msg) =>
          msg._id === tempId ? savedMessage : msg
        );

        return {
          messages: newMessages,
          conversations: state.conversations.map((conv) =>
            conv._id === activeConversation._id
              ? { ...conv, lastMessage: savedMessage }
              : conv
          ),
        };
      });
    } catch (error) {
      console.error("Error sending message:", error);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId) ?? [],
        error: error.message,
      }));
    }
  },

  markConversationAsRead: async (conversationId) => {
    if (!conversationId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${API_BASE_URL}/api/messages/conversation/${conversationId}/read`,
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

      // We don't need to update local state here as the socket event will handle it
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  },

  startNewConversation: async (participantId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ participantId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
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
      console.error("Error starting new conversation:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  deleteMessage: async (messageId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${API_BASE_URL}/api/messages/${messageId}`,
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
      console.error("Error deleting message:", error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
