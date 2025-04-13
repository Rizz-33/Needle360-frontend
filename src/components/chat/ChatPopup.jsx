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
    isConnected,
    setCurrentUserId,
    hasMore,
    markConversationAsRead,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      setCurrentUserId(user._id);
    }
  }, [user, setCurrentUserId]);

  useEffect(() => {
    if (messagesEndRef.current && !loadingMore) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loadingMore]);

  // Update the effect that handles marking messages as read
  useEffect(() => {
    if (
      activeConversation &&
      messages?.length > 0 &&
      !isLoading &&
      isChatOpen
    ) {
      // Only mark messages as read if the tab is visible and the chat is open
      if (document.visibilityState === "visible") {
        markConversationAsRead(activeConversation._id);
      }
    }
  }, [activeConversation?._id, messages?.length, isLoading, isChatOpen]);

  // Modify the auto-refresh interval
  useEffect(() => {
    if (isChatOpen) {
      // Initial fetch
      fetchConversations();

      if (activeConversation) {
        fetchMessages(activeConversation._id, false);
      }

      // Set up interval for refreshing data
      refreshIntervalRef.current = setInterval(() => {
        fetchConversations();

        if (activeConversation) {
          // Use the silent parameter to avoid UI flicker and preserve read status
          fetchMessages(activeConversation._id, false, true);
        }
      }, 100000); // Use 10 seconds instead of 1000 seconds for more reasonable updates
    }

    // Clean up interval when component unmounts or chat closes
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isChatOpen, activeConversation, fetchConversations, fetchMessages]);

  // Enhance visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        activeConversation &&
        isChatOpen
      ) {
        // When the user returns to the tab, mark messages as read
        console.log("Tab became visible, marking messages as read");
        markConversationAsRead(activeConversation._id);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also add a focus event for more reliable read status tracking
    const handleWindowFocus = () => {
      if (activeConversation && isChatOpen) {
        console.log("Window focused, marking messages as read");
        markConversationAsRead(activeConversation._id);
      }
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleWindowFocus);
    };
  }, [activeConversation, isChatOpen, markConversationAsRead]);

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      sendMessage(newMessage, attachments);
      setNewMessage("");
      setAttachments([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // In ChatPopup.jsx
  const handleScroll = async () => {
    if (
      !messagesContainerRef.current ||
      !activeConversation ||
      !hasMore ||
      isLoading ||
      loadingMore
    )
      return;

    const { scrollTop } = messagesContainerRef.current;
    const isNearTop = scrollTop < 100;

    if (isNearTop) {
      setLoadingMore(true);
      await fetchMessages(activeConversation._id, true);

      // Preserve scroll position after loading more messages
      setTimeout(() => {
        if (messagesContainerRef.current && messages.length > 0) {
          // Keep the same message visible after loading older messages
          const firstVisibleMsg = document.getElementById(
            `msg-${messages[0]._id}`
          );
          if (firstVisibleMsg) {
            firstVisibleMsg.scrollIntoView();
          }
        }
        setLoadingMore(false);
      }, 100);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation?.participants || !user) return null;
    return conversation.participants.find((p) => p._id !== user._id);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
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
          {/* Rest of your component remains unchanged */}
          {/* Header */}
          <div className="bg-secondary text-hoverAccent p-3 flex items-center justify-between">
            {/* Header content... */}
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
                title={isConnected ? "Connected" : "Disconnected"}
              />

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
                      <h3 className="font-medium text-sm">
                        {getOtherParticipant(activeConversation)?.name ||
                          "Chat"}
                      </h3>
                      <p className="text-[11px] opacity-80">
                        {isConnected ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <h3 className="font-medium">Messages</h3>
              )}
            </div>

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
                ) : conversations?.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conversation) => {
                      const otherUser = getOtherParticipant(conversation);
                      const isUnread =
                        conversation.lastMessage &&
                        !conversation.lastMessage.readBy?.includes(user?._id);

                      return (
                        <div
                          key={conversation._id}
                          onClick={() => handleConversationClick(conversation)}
                          className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${
                            isUnread ? "bg-blue-50" : ""
                          }`}
                        >
                          <Avatar user={otherUser} />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-xs truncate">
                                {otherUser?.name || "Unknown"}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {formatTime(
                                  conversation.lastMessage?.createdAt
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
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                >
                  {loadingMore && (
                    <div className="flex justify-center py-2">
                      <Loader size="sm" />
                    </div>
                  )}

                  {isLoading ? (
                    <div className="flex justify-center">
                      <Loader />
                    </div>
                  ) : messages?.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        id={`msg-${message._id}`} // Add this ID
                        className={`flex ${
                          message.sender._id === user?._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="flex flex-col items-end">
                          <div
                            className={`max-w-xs lg:max-w-md px-3 py-2 rounded-full ${
                              message.sender._id === user?._id
                                ? "bg-primary/70 text-white text-sm rounded-br-none"
                                : "bg-gray-100 text-gray-800 text-sm rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-[10px] text-gray-500">
                              {formatTime(message.createdAt)}
                            </span>
                            {message.sender._id === user?._id && (
                              <span className="text-[10px]">
                                {message.isSending ? (
                                  <span className="text-gray-400">•••</span>
                                ) : message.readBy?.length > 1 ? (
                                  <span className="text-blue-500">✓✓</span>
                                ) : (
                                  <span className="text-gray-400">✓</span>
                                )}
                              </span>
                            )}
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
                      className="flex-1 border rounded-full text-xs py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={!isConnected}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={
                        (!newMessage.trim() && attachments.length === 0) ||
                        !isConnected
                      }
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
