import { io } from "socket.io-client";
import { create } from "zustand";

const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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

      const response = await fetch(`${BASE_API_URL}/api/conversations`, {
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

      const response = await fetch(`${BASE_API_URL}/api/conversations`, {
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
      console.error("Error deleting message:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // In useChatStore (Chat.store.js) - Modified markConversationAsRead function
  markConversationAsRead: async (conversationId) => {
    if (!conversationId) return;

    const { currentUserId, messages } = get();

    // Update local state immediately to prevent flicker when refreshing
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.conversation === conversationId &&
        msg.sender._id !== currentUserId &&
        !msg.readBy.includes(currentUserId)
          ? { ...msg, readBy: [...msg.readBy, currentUserId] }
          : msg
      ),
      // Also update the read status in conversations list
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

      // We've already updated local state above, so no need to do it again here
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  },

  // Modify the fetchMessages function to preserve read status when refreshing
  fetchMessages: async (conversationId, loadMore = false, silent = false) => {
    if (!conversationId) {
      set({ error: "No conversation ID provided", isLoading: false });
      return;
    }

    // Only set loading if not silent refresh
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

      // Create a map of existing message read statuses to preserve them
      const readStatusMap = {};
      if (silent && existingMessages) {
        existingMessages.forEach((msg) => {
          readStatusMap[msg._id] = msg.readBy || [];
        });
      }

      // Update received messages with preserved read status
      const processedMessages = receivedMessages.map((msg) => {
        // If we already have this message in our state and we're doing a silent refresh,
        // preserve its read status rather than overwriting with server data
        if (silent && readStatusMap[msg._id]) {
          return {
            ...msg,
            readBy: readStatusMap[msg._id],
          };
        }
        return msg;
      });

      set((state) => ({
        // If loading more, add new messages to existing ones, otherwise replace
        messages: loadMore
          ? [...processedMessages, ...(state.messages || [])]
          : processedMessages,
        currentPage: nextPage,
        isLoading: false,
        hasMore: data.pagination?.currentPage < data.pagination?.totalPages,
      }));

      // If not a silent refresh, mark messages as read
      if (!silent) {
        get().markConversationAsRead(conversationId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ error: error.message, isLoading: !silent && false });
    }
  },

  // Update the socket event handler for newMessage
  initializeSocket: () => {
    const { currentUserId } = get();
    if (!currentUserId) return;

    // Clean up existing socket if any
    get().cleanupSocket();

    console.log("Initializing socket connection...");

    const socket = io(BASE_API_URL, {
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
          // Add a flag to indicate if the message should be considered read
          // A message is considered read if:
          // 1. It's our own message
          // 2. The conversation is currently active and visible
          const isRead = isOwnMessage || document.visibilityState === "visible";

          // If the message should be read and the user hasn't read it yet
          if (isRead && !message.readBy.includes(currentUserId)) {
            message.readBy = [...message.readBy, currentUserId];
            // Also mark as read on the server
            if (!isOwnMessage) {
              get().markConversationAsRead(activeConversation._id);
            }
          }

          set({
            messages: [...(messages || []), message],
          });
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
            ? {
                ...conv,
                lastMessage: message,
              }
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
}));
