// components/chat/ChatPopup.jsx
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Send, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/Auth.store";
import { useChatStore } from "../../store/Chat.store";
import Loader from "../ui/Loader";
import Avatar from "./Avatar";

const ChatPopup = () => {
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversation,
    messages,
    isLoading,
    isChatOpen,
    unreadCount,
    setChatOpen,
    setActiveConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startNewConversation,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch conversations when chat opens
  useEffect(() => {
    if (isChatOpen) {
      fetchConversations();
    }
  }, [isChatOpen, fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation?._id) {
      fetchMessages(activeConversation._id);
    }
  }, [activeConversation?._id, fetchMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation || !user) return null;
    return conversation.participants.find((p) => p._id !== user._id);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-4 right-4 w-full max-w-md h-[70vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col z-50"
        >
          {/* Header */}
          <div className="bg-primary text-white p-3 flex items-center justify-between">
            {activeConversation ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="p-1 rounded-full hover:bg-primary-dark transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <Avatar
                    user={getOtherParticipant(activeConversation)}
                    size="sm"
                  />
                  <div>
                    <h3 className="font-medium">
                      {getOtherParticipant(activeConversation)?.name || "Chat"}
                    </h3>
                    <p className="text-xs opacity-80">
                      {activeConversation.isGroup
                        ? `${activeConversation.participants.length} members`
                        : "Online"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <h3 className="font-medium">Messages</h3>
            )}

            <button
              onClick={() => setChatOpen(false)}
              className="p-1 rounded-full hover:bg-primary-dark transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Conversations list */}
            {!activeConversation && (
              <div className="w-full overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conversation) => {
                      const otherUser = getOtherParticipant(conversation);
                      const isUnread =
                        conversation.lastMessage &&
                        !conversation.lastMessage.readBy.includes(user._id);

                      return (
                        <div
                          key={conversation._id}
                          onClick={() => setActiveConversation(conversation)}
                          className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${
                            isUnread ? "bg-blue-50" : ""
                          }`}
                        >
                          <Avatar user={otherUser} />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium truncate">
                                {otherUser?.name || "Unknown"}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {conversation.lastMessage &&
                                  formatTime(
                                    conversation.lastMessage.createdAt
                                  )}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage?.content ||
                                "No messages yet"}
                            </p>
                          </div>
                          {isUnread && (
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Active conversation */}
            {activeConversation && (
              <div className="w-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <Loader />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.sender._id === user._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                            message.sender._id === user._id
                              ? "bg-primary text-white rounded-br-none"
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex justify-end mt-1">
                            <span
                              className={`text-xs ${
                                message.sender._id === user._id
                                  ? "text-white/80"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="border-t p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 rounded-full bg-primary text-white disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPopup;
