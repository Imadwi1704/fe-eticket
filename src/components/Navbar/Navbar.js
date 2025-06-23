"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import page from "@/config/page";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navRef = useRef(null);
  const profileMenuRef = useRef(null);
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Destination Info", path: "/aboutnext" },
    { name: "Sejarah", path: "/historynext" },
    { name: "Koleksi", path: "/venues" },
    { name: "Galeri", path: "/galeri" },
    { name: "Review & Contact", path: "/contacts" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        navRef.current &&
        !navRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const getFirstName = () => {
    if (!userData?.fullName) return "Profile";
    return userData.fullName.split(" ")[0];
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getCookie("token");
      if (token) {
        try {
          const response = await fetch(`${page.baseUrl}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setIsLoggedIn(true);
            setUserData(data.user);
            setCookie("fullName", data.user.fullName, { path: "/" });
          } else {
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
        await fetch(`${page.baseUrl}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      deleteCookie("token");
      deleteCookie("fullName");
      setIsLoggedIn(false);
      setUserData(null);
      setShowProfileMenu(false);
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header
      className={`navbar navbar-expand-lg fixed-top py-0 ${
        isSticky ? "bg-white shadow-sm" : "bg-transparent"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="container px-3 px-lg-1 d-flex justify-content-between align-items-center w-100">
        {/* ========== Mobile Navbar ========== */}
        <div className="d-lg-none d-flex justify-content-between align-items-center w-100">
          {/* KIRI - Profile / Login */}
          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/register"
                  className={`btn btn-sm rounded-pill ${
                    isSticky ? "btn-outline-dark" : "btn-light"
                  } me-2`}
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
                  className={`btn btn-sm ${
                    isSticky ? "btn-white" : "btn-white"
                  }`}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <i className="bi bi-person-circle fs-5 "></i>
                </button>
                {showProfileMenu && (
                  <div
                    ref={profileMenuRef}
                    className="dropdown-menu show position-absolute bg-white shadow rounded mt-2"
                    style={{ left: 0, minWidth: "200px", zIndex: 1050 }}
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push("/profile");
                      }}
                    >
                      Profile Saya
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push("/orders");
                      }}
                    >
                      History Pemesanan
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Logging out...
                        </>
                      ) : (
                        "Logout"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TENGAH - Logo */}
          <Link href="/" className="navbar-brand mx-auto fw-bold fs-5">
            <span className={isSticky ? "text-dark" : "text-white"}>
              RuwaJurai
            </span>
          </Link>

          {/* KANAN - Hamburger */}
          <button
            className="btn btn-sm border-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            style={{ fontSize: "1.3rem", color: isSticky ? "#000" : "#fff" }}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* ========== Desktop Navbar ========== */}
        <nav className="d-none d-lg-flex align-items-center justify-content-between w-100">
          <Link href="/" className="navbar-brand fw-bold fs-5">
            <span className={isSticky ? "text-dark" : "text-white"}>
              RuwaJurai
            </span>
          </Link>
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0 small">
            {navItems.map((item, idx) => (
              <li className="nav-item position-relative" key={idx}>
                <Link
                  href={item.path}
                  className={`nav-link px-1 py-2 ${
                    isSticky ? "text-dark" : "text-white"
                  } ${pathname === item.path ? "active" : ""}`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <div
                      className="position-absolute bottom-0 start-0 w-100 bg-primary"
                      style={{ height: "3px", borderRadius: "3px 3px 0 0" }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          {!isLoggedIn ? (
            <div className="d-flex gap-2">
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
            </div>
          ) : (
            <div className="position-relative" ref={navRef}>
              <button
                className="btn d-flex align-items-center gap-2 border-0 bg-transparent"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {/* Nama depan */}
                <span className={isSticky ? "text-dark" : "text-white"}>
                  {getFirstName()}
                </span>

                {/* Avatar inisial atau ikon default */}
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: isSticky ? "#e0e0e0" : "#fff",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  {userData?.fullName ? (
                    userData.fullName.charAt(0).toUpperCase()
                  ) : (
                    <i className="bi bi-person-circle fs-5"></i>
                  )}
                </div>
              </button>

              {showProfileMenu && (
                <div
                  ref={profileMenuRef}
                  className="dropdown-menu show position-absolute bg-white shadow rounded mt-2"
                  style={{ right: 0, minWidth: "200px", zIndex: 1050 }}
                >
                  <button
                    className="dropdown-item"
                    onClick={() => router.push("/profile")}
                  >
                    Profile Saya
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => router.push("/orders")}
                  >
                    History Pemesanan
                  </button>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Logging out...
                      </>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* ========== Mobile Menu Dropdown ========== */}
      {isOpen && (
        <div
          className={`d-lg-none py-3 px-4 ${
            isSticky ? "bg-white" : "bg-primary"
          }`}
        >
          <ul className="navbar-nav d-flex flex-column gap-2 small">
            {navItems.map((item, idx) => (
              <li key={idx} className="nav-item">
                <Link
                  href={item.path}
                  className={`nav-link px-2 py-1 ${
                    isSticky ? "text-dark" : "text-white"
                  }`}
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
