"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTicketAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BeliTiketButton = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      router.push("/register/ticket");
      setIsClicked(false);
    }, 500);
  };

  return (
    <motion.button
      className="flex items-center justify-center overflow-hidden relative"
      style={{
        height: "48px",
        padding: "0 16px",
        backgroundColor: "#0D6EFD",
        borderRadius: "24px",
        border: "none",
        cursor: "pointer",
        gap: "8px",
        minWidth: "48px",
      }}
      whileHover={{ 
        backgroundColor: "#0B5ED7",
        boxShadow: "0 4px 12px rgba(13, 110, 253, 0.3)"
      }}
      whileTap={{ 
        scale: 0.95,
        backgroundColor: "#0A58CA"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      type="button"
      animate={{
        padding: isHovered ? "0 20px 0 16px" : "0 16px",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
    >
      {/* Ticket icon with animation */}
      <motion.div
        animate={{
          rotate: isHovered ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          duration: 0.6
        }}
      >
        <FaTicketAlt
          className="text-white"
          size={20}
          style={{
            flexShrink: 0,
          }}
        />
      </motion.div>

      {/* Text with smooth appear/disappear */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="text-white text-sm font-medium whitespace-nowrap"
            initial={{ 
              opacity: 0,
              x: -10,
              width: 0
            }}
            animate={{ 
              opacity: 1,
              x: 0,
              width: "auto"
            }}
            exit={{ 
              opacity: 0,
              x: -10,
              width: 0
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            Beli Tiket
          </motion.span>
        )}
      </AnimatePresence>

      {/* Click ripple effect */}
      {isClicked && (
        <motion.span
          className="absolute inset-0 bg-white opacity-30 rounded-full"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Subtle glow effect */}
      <motion.span
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.7)" }}
        animate={{
          boxShadow: isHovered 
            ? ["0 0 0 0 rgba(255, 255, 255, 0.7)", "0 0 10px 5px rgba(255, 255, 255, 0)"] 
            : "0 0 0 0 rgba(255, 255, 255, 0)"
        }}
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
    </motion.button>
  );
};

export default BeliTiketButton;