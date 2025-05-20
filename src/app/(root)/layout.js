"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Navbar = dynamic(() => import("../../components/Navbar"), { ssr: false });
const Belitiketbutton = dynamic(() => import("../../components/Belitiketbutton"), { ssr: false });

export default function IndexLayout({ children }) {
  const pathname = usePathname(); 
  return (
    <div>
      <Navbar />
      {children}

      {pathname !== "/register/ticket" && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}>
          <Belitiketbutton />
        </div>
      )}
    </div>
  );
}