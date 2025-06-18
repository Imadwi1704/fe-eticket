"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import page from "@/config/page";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Destination Info", path: "/aboutnext" },
    { name: "Sejarah", path: "/historynext" },
    { name: "Koleksi", path: "/venues" },
    { name: "Galeri", path: "/galeri" },
    { name: "Review & Contact", path: "/contacts" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getFirstName = (fullName) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };

  useEffect(() => {
    const shouldOpenLogin = localStorage.getItem("openLoginModal");
    if (shouldOpenLogin === "true") {
      window.dispatchEvent(new CustomEvent("openLoginModal"));
      localStorage.removeItem("openLoginModal");
    }
  }, []);

  useEffect(() => {
    const handleOpenLogin = () => setShowLogin(true);
    window.addEventListener("openLoginModal", handleOpenLogin);
    return () => window.removeEventListener("openLoginModal", handleOpenLogin);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getCookie("token");
      if (token) {
        try {
          const response = await fetch(
            page.baseUrl+"/api/users/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setIsLoggedIn(true);
            // Safely handle fullName with fallback
            const userName = userData.fullName || userData.name;
            setFullName(userName);
            setCookie("fullName", userName, { path: "/" });
          } else {
            console.error("Failed to fetch user data");
            // Clear invalid token
            deleteCookie("token");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = getCookie("token");
      if (token) {
        // Panggil API logout jika diperlukan
        await fetch(page.baseUrl+"/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Hapus semua cookies dan state
      deleteCookie("token");
      deleteCookie("fullName");
      setIsLoggedIn(false);
      setFullName("");
      setShowProfileMenu(false);

      // Redirect ke halaman home setelah logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfileMenu = () => {
    if (!showProfileMenu) return null;
    return (
      <ul
        className="dropdown-menu dropdown-menu-end show position-absolute bg-white shadow rounded"
        style={{ right: 0, top: "100%" }}
        aria-labelledby="profileDropdown"
      >
        <li>
          <Link
            href="/profile"
            className="dropdown-item"
            onClick={() => setShowProfileMenu(false)}
          >
            Profile Saya
          </Link>
        </li>
        <li>
          <Link
            href="/orders"
            className="dropdown-item"
            onClick={() => setShowProfileMenu(false)}
          >
            History Pemesanan
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button
            className="dropdown-item text-danger"
            onClick={() => {
              handleLogout();
              setShowProfileMenu(false);
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    );
  };

  return (
    <header
      className={`navbar navbar-expand-lg fixed-top py-0 ${
        isSticky ? "bg-white shadow-sm" : "bg-transparent"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="container d-flex justify-content-between align-items-center px-1">
        <Link href="/" className="navbar-brand fw-bold fs-5">
          <span className={isSticky ? "text-dark" : "text-white"}>
            Ruwa Jurai
          </span>
        </Link>

        {/* Mobile */}
        <div className="d-lg-none d-flex align-items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Link href="/register" className="btn btn-light btn-sm">
                Daftar
              </Link>
              <Link href="/login" className="btn btn-light btn-sm">
                Login
              </Link>
            </>
          ) : (
            <div className="position-relative" ref={navRef}>
              <button
                className="btn btn-light btn-sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <i className="bi bi-person-circle me-2"></i>
                {getFirstName()} {/* Use safe function here */}
              </button>
              {renderProfileMenu()}
            </div>
          )}
          <button
            className="btn btn-sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            style={{ fontSize: "1.3rem", color: isSticky ? "#000" : "#fff" }}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Desktop */}
        <nav className="d-none d-lg-flex align-items-center gap-1 py-1 px-1 small">
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0 small">
            {navItems.map((item, idx) => (
              <li className="nav-item position-relative" key={idx}>
                <Link
                  href={item.path}
                  className={`nav-link px-1 py-2 ${
                    isSticky ? "text-dark" : "text-white"
                  }`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <div
                      className="position-absolute bottom-0 start-0 w-100 bg-primary"
                      style={{
                        height: "3px",
                        borderRadius: "3px 3px 0 0",
                        transform: "scaleX(1)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          {!isLoggedIn ? (
            <>
              <Link
                href="/register"
                className={`btn btn-sm rounded-pill ${
                  isSticky ? "btn-outline-dark" : "btn-light"
                }`}
              >
                Daftar
              </Link>
              <Link
                href="/login"
                className={`btn btn-sm rounded-pill ${
                  isSticky ? "btn-dark" : "btn-light"
                }`}
              >
                Login
              </Link>
            </>
          ) : (
            <div className="position-relative" ref={navRef}>
              <button
                className="btn d-flex align-items-center gap-2"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className={isSticky ? "text-dark" : "text-white"}>
                  {getFirstName()}
                </span>
                <i
                  className={`bi bi-person-circle fs-4 ${
                    isSticky ? "text-dark" : "text-white"
                  }`}
                  style={{
                    borderRadius: "50%",
                    padding: "8px",
                  }}
                ></i>
              </button>
              {renderProfileMenu()}
            </div>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="bg-primary d-lg-none py-3 px-4">
          <ul className="navbar-nav d-flex flex-column gap-1 small">
            {navItems.map((item, idx) => (
              <li key={idx} className="nav-item">
                <Link
                  href={item.path}
                  className="nav-link text-white px-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
