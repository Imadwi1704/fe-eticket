"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import page from "@/config/page";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navRef = useRef(null);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Destination Info", path: "/aboutnext" },
    { name: "Sejarah", path: "/historynext" },
    { name: "Koleksi", path: "/venues" },
    { name: "Galeri", path: "/galeri" },
    { name: "Review & Contact", path: "/contacts" },
  ];

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler for profile menu and mobile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close profile menu if clicked outside
      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(e.target) &&
        navRef.current && 
        !navRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
      
      // Close mobile menu if clicked outside
      if (
        isOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(e.target) &&
        !navRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Get first name from profile
  const getFirstName = () => {
    if (!profile?.fullName) return "Profile";
    return profile.fullName.split(" ")[0];
  };

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getCookie("token");
      if (token) {
        try {
          const response = await fetch(
            `${page.baseUrl}/api/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setIsLoggedIn(true);
            setProfile(userData);
            setCookie("fullName", userData.fullName, { path: "/" });
          } else {
            console.error("Failed to fetch user data");
            deleteCookie("token");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = getCookie("token");
      if (token) {
        await fetch(`${page.baseUrl}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      deleteCookie("token");
      deleteCookie("fullName");
      setIsLoggedIn(false);
      setProfile(null);
      setShowProfileMenu(false);
      setIsOpen(false);

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render profile dropdown menu
  const renderProfileMenu = () => {
    if (!showProfileMenu) return null;
    
    return (
      <div
        ref={profileMenuRef}
        className={`dropdown-menu ${isOpen ? 'position-static d-block' : 'position-absolute'} bg-white shadow rounded mt-2`}
        style={{
          right: 0,
          minWidth: '200px',
          zIndex: 1000,
        }}
      >
        <Link
          href="/profile"
          className="dropdown-item py-2 px-3"
          onClick={() => {
            setShowProfileMenu(false);
            setIsOpen(false);
          }}
        >
          Profile Saya
        </Link>
        <Link
          href="/orders"
          className="dropdown-item py-2 px-3"
          onClick={() => {
            setShowProfileMenu(false);
            setIsOpen(false);
          }}
        >
          History Pemesanan
        </Link>
        <div className="dropdown-divider"></div>
        <button
          className="dropdown-item py-2 px-3 text-danger"
          onClick={() => {
            handleLogout();
            setShowProfileMenu(false);
            setIsOpen(false);
          }}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    );
  };

  return (
    <header
      className={`navbar navbar-expand-lg fixed-top py-0 ${
        isSticky ? "bg-white shadow-sm" : "bg-transparent"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="container d-flex justify-content-between align-items-center px-3 px-lg-1">
        {/* Brand logo */}
        <Link href="/" className="navbar-brand fw-bold fs-5">
          <span className={isSticky ? "text-dark" : "text-white"}>
            RuwaJurai
          </span>
        </Link>

        {/* Mobile controls */}
        <div className="d-lg-none d-flex align-items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Link 
                href="/register" 
                className={`btn btn-sm ${isSticky ? 'btn-outline-dark' : 'btn-outline-light'}`}
              >
                Daftar
              </Link>
              <Link 
                href="/login" 
                className={`btn btn-sm ${isSticky ? 'btn-dark' : 'btn-light'}`}
              >
                Login
              </Link>
            </>
          ) : (
            <div className="position-relative" ref={navRef}>
              <button
                className={`btn btn-sm d-flex align-items-center ${isSticky ? 'btn-outline-dark' : 'btn-outline-light'}`}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <i className="bi bi-person-circle me-1"></i>
                <span className="d-none d-sm-inline">
                  {getFirstName()}
                </span>
              </button>
              {renderProfileMenu()}
            </div>
          )}
          <button
            className="btn btn-sm border-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            style={{ fontSize: "1.3rem", color: isSticky ? "#000" : "#fff" }}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="d-none d-lg-flex align-items-center gap-3 py-1 px-1 small">
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0 small">
            {navItems.map((item, idx) => (
              <li className="nav-item position-relative" key={idx}>
                <Link
                  href={item.path}
                  className={`nav-link px-1 py-2 ${
                    isSticky ? "text-dark" : "text-white"
                  } ${pathname === item.path ? 'active' : ''}`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <div
                      className="position-absolute bottom-0 start-0 w-100 bg-primary"
                      style={{
                        height: "3px",
                        borderRadius: "3px 3px 0 0",
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
                  isSticky ? "btn-outline-dark" : "btn-outline-light"
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
                className="btn d-flex align-items-center gap-2 border-0 bg-transparent p-0"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className={isSticky ? "text-dark" : "text-white"}>
                  {getFirstName()}
                </span>
                <i
                  className={`bi bi-person-circle fs-4 ${
                    isSticky ? "text-dark" : "text-white"
                  }`}
                ></i>
              </button>
              {renderProfileMenu()}
            </div>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div 
          ref={mobileMenuRef}
          className={`d-lg-none py-3 px-4 ${isSticky ? 'bg-white' : 'bg-primary'}`}
          style={{ 
            zIndex: 999,
            position: 'absolute',
            width: '100%',
            top: '100%',
            left: 0
          }}
        >
          <ul className="navbar-nav d-flex flex-column gap-2 small">
            {navItems.map((item, idx) => (
              <li key={idx} className="nav-item">
                <Link
                  href={item.path}
                  className={`nav-link px-2 py-1 ${isSticky ? 'text-dark' : 'text-white'} ${
                    pathname === item.path ? 'fw-bold' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link
                    href="/profile"
                    className={`nav-link px-2 py-1 ${isSticky ? 'text-dark' : 'text-white'} ${
                      pathname === '/profile' ? 'fw-bold' : ''
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setShowProfileMenu(false);
                    }}
                  >
                    Profile Saya
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/orders"
                    className={`nav-link px-2 py-1 ${isSticky ? 'text-dark' : 'text-white'} ${
                      pathname === '/orders' ? 'fw-bold' : ''
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setShowProfileMenu(false);
                    }}
                  >
                    History Pemesanan
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link px-2 py-1 w-100 text-start bg-transparent border-0 ${
                      isSticky ? 'text-dark' : 'text-white'
                    }`}
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                      setShowProfileMenu(false);
                    }}
                    disabled={loading}
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}