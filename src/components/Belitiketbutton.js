"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Belitiketbutton = () => {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  return (
    <button
      style={{
        ...styles.button,
        backgroundColor: hover ? "#0D6EFD" : "#0D6EFD",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => router.push("/register/ticket")}
      type="button"
    >
      Beli Tiket
    </button>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Belitiketbutton;
