// components/MessageButton.jsx
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import React from "react";
import { useChatStore } from "../../store/Chat.store";

const MessageButton = ({ userId }) => {
  const { setChatOpen, startNewConversation, isChatOpen } = useChatStore();

  const handleClick = () => {
    if (!isChatOpen) {
      startNewConversation(userId);
    }
    setChatOpen(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.button
        className="p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
        onClick={handleClick}
      >
        <MessageCircle size={20} />
      </motion.button>
    </motion.div>
  );
};

export default MessageButton;
