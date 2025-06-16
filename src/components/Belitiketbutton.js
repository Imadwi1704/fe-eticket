"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTicketAlt } from "react-icons/fa";

const Belitiketbutton = () => {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  return (
    <button
      className="flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        height: "40px",
        padding: hover ? "0 18px 0 14px" : "0 14px",
        backgroundColor: "#0D6EFD",
        borderRadius: "20px",
        border: "none",
        cursor: "pointer",
        gap: "10px",
        minWidth: "40px",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => router.push("/register/ticket")}
      type="button"
    >
      <FaTicketAlt
        className="text-white"
        size={20}
        style={{
          flexShrink: 0,
          transition: "transform 0.3s ease-in-out",
          transform: hover ? "scale(1)" : "scale(1.1)",
        }}
      />
      <span
        className="text-white text-[13px] font-medium whitespace-nowrap"
        style={{
          display: hover ? "inline-block" : "none",
          transition: "all 0.3s ease-in-out",
          opacity: hover ? 1 : 0,
          marginLeft: hover ? "8px" : "-10px", // Changed from 0px to 8px for consistent spacing
          transform: hover ? "translateX(0)" : "translateX(-4px)", // Added subtle movement
        }}
      >
        Beli Tiket
      </span>
    </button>
  );
};

export default Belitiketbutton;
