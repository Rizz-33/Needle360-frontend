// store/Chat.store.js
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
  currentUserId: null, // Add currentUserId to store state

  // Actions
  setCurrentUserId: (userId) => set({ currentUserId: userId }),

  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation });
    // Mark messages as read when conversation is opened
    if (conversation) {
      const { currentUserId } = get();
      set((state) => ({
        messages: state.messages.map((msg) => ({
          ...msg,
          readBy: msg.readBy.includes(currentUserId)
            ? msg.readBy
            : [...msg.readBy, currentUserId],
        })),
      }));
    }
  },

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");

      // Log token presence without exposing full token
      console.log(
        "Making API request with token:",
        token ? "Present" : "Not found"
      );

      const headers = {
        "Content-Type": "application/json",
      };

      // Add token to headers if it exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        credentials: "include", // This sends cookies with the request
        headers,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Rest of the function remains the same...
    } catch (error) {
      console.error("Error fetching conversations:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMessages: async (conversationId) => {
    if (!conversationId) return;

    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${API_BASE_URL}/api/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set({ messages: data.messages || data, isLoading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: async (content, attachments = []) => {
    const { activeConversation, currentUserId } = get();
    if (!activeConversation || (!content && attachments.length === 0)) return;

    const newMessage = {
      sender: currentUserId,
      content,
      conversation: activeConversation._id,
      attachments,
      readBy: [currentUserId],
      createdAt: new Date().toISOString(),
      isSending: true,
    };

    // Optimistic update
    set((state) => ({
      messages: [...state.messages, newMessage],
      conversations: state.conversations.map((conv) =>
        conv._id === activeConversation._id
          ? { ...conv, lastMessage: newMessage }
          : conv
      ),
    }));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: activeConversation._id,
          content,
          attachments,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedMessage = await response.json();

      // Replace optimistic message with saved message
      set((state) => {
        const index = state.messages.findIndex((msg) => msg.isSending);
        if (index === -1) return state;

        const newMessages = [...state.messages];
        newMessages[index] = savedMessage;

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
        messages: state.messages.filter((msg) => !msg.isSending),
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

      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "POST",
        credentials: "include", // This sends cookies with the request
        headers,
        body: JSON.stringify({ participantId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newConversation = await response.json();

      // Rest of your function remains the same
      set((state) => {
        // Add new conversation if it doesn't exist
        const conversationExists = state.conversations.some(
          (c) => c._id === newConversation._id
        );
        return {
          conversations: conversationExists
            ? state.conversations
            : [newConversation, ...state.conversations],
          activeConversation: newConversation,
          isChatOpen: true,
          isLoading: false,
        };
      });

      // Fetch messages for the new conversation
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
        const filteredMessages = state.messages.filter(
          (msg) => msg._id !== messageId
        );
        let newLastMessage = null;

        if (state.activeConversation?.lastMessage?._id === messageId) {
          newLastMessage =
            filteredMessages.length > 0
              ? filteredMessages[filteredMessages.length - 1]
              : null;
        }

        return {
          messages: filteredMessages,
          activeConversation: newLastMessage
            ? {
                ...state.activeConversation,
                lastMessage: newLastMessage,
              }
            : state.activeConversation,
          conversations: state.conversations.map((conv) => {
            if (conv._id === state.activeConversation?._id && newLastMessage) {
              return { ...conv, lastMessage: newLastMessage };
            }
            return conv;
          }),
        };
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
