"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Spinner from "../../src/components/spinner";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [fullName, setFullName] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    const token = getCookie("token");
    const storedFullName = getCookie("fullName");
    if (token) {
      setIsLoggedIn(true);
      setFullName(storedFullName || "Pengunjung");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.data?.token) {
        setCookie("token", data.data.token, { maxAge: 86400 });
        setCookie("fullName", data.data.user.fullName, { maxAge: 86400 });
        setCookie("role", data.data.user.role, { maxAge: 86400 });
        setIsLoggedIn(true);
        setFullName(data.data.user.fullName);
        setShowLogin(false);
      } else {
        alert(data.msg || data.message || "Login gagal");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAndSetToken = async (token) => {
      try {
        const res = await fetch("http://localhost:5001/api/auth/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) throw new Error("Invalid token");
        
        setCookie("token", token, {
          maxAge: 86400,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        
        return true;
      } catch (error) {
        deleteCookie("token");
        return false;
      }
    };

    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const fullName = urlParams.get("fullName");

      if (token && fullName) {
        setLoading(true);
        
        const isValid = await verifyAndSetToken(token);
        
        if (isValid) {
          setCookie("fullName", decodeURIComponent(fullName));
          setIsLoggedIn(true);
          setFullName(decodeURIComponent(fullName));
          window.history.replaceState({}, "", window.location.pathname);
        } else {
          alert("Sesi login tidak valid");
        }
        
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, []);

  const handleGoogleLogin = () => {
    sessionStorage.setItem("preAuthPath", window.location.pathname);
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  const renderGoogleLoginButton = () => (
    <button
      type="button"
      className="btn btn-danger w-100 position-relative"
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span className="ms-2">Memproses...</span>
        </>
      ) : (
        "Login dengan Google"
      )}
    </button>
  );

  const handleLogout = () => {
    fetch("http://localhost:5001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      deleteCookie("token");
      deleteCookie("role");
      deleteCookie("fullName");
      setIsLoggedIn(false);
      setFullName("");
      setShowProfileMenu(false);
    });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target.forgotEmail.value;
    try {
      const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Kode reset password telah dikirim ke email Anda");
        setShowForgotPassword(false);
        setShowResetPasswordModal(true);
      } else {
        alert(data.msg || "Gagal mengirim email reset password");
      }
    } catch {
      alert("Terjadi kesalahan saat mengirim permintaan reset password");
    }
  };

  const handleSubmitReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Password tidak cocok");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password berhasil direset. Silakan login kembali.");
        setShowResetPasswordModal(false);
        setShowLogin(true);
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || "Gagal mereset password");
      }
    } catch {
      alert("Terjadi kesalahan saat mereset password");
    } finally {
      setIsSubmitting(false);
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
            Profil Saya
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
      className={`navbar navbar-expand-lg fixed-top py-0 ${isSticky ? "bg-white shadow-sm" : "bg-transparent"}`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="container d-flex justify-content-between align-items-center px-1">
        <Link href="/" className="navbar-brand fw-bold fs-5">
          <span className={isSticky ? "text-dark" : "text-white"}>Ruwa Jurai</span>
        </Link>

        {/* Mobile */}
        <div className="d-lg-none d-flex align-items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Link href="/register" className="btn btn-light btn-sm">
                Daftar
              </Link>
              <Link href="/login" className="btn btn-light btn-sm">
                Masuk
              </Link>
              
            </>
          ) : (
            <div className="position-relative" ref={navRef}>
              <button
                className="btn btn-light btn-sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <i className="bi bi-person-circle me-2"></i>
                {fullName.split(" ")[0]}
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
                  className={`nav-link px-1 py-2 ${isSticky ? "text-dark" : "text-white"}`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <div 
                      className="position-absolute bottom-0 start-0 w-100 bg-primary"
                      style={{ 
                        height: "3px",
                        borderRadius: "3px 3px 0 0",
                        transform: "scaleX(1)",
                        transition: "transform 0.3s ease"
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
                className={`btn btn-sm rounded-pill ${isSticky ? "btn-outline-dark" : "btn-light"}`}
              >
                Daftar
              </Link>
              <Link
              href="/login"
                className={`btn btn-sm rounded-pill ${isSticky ? "btn-dark" : "btn-light"}`}
                
              >
                Masuk
              </Link>
            </>
          ) : (
            <div className="position-relative" ref={navRef}>
              <button
                className="btn d-flex align-items-center gap-2"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className={isSticky ? "text-dark" : "text-white"}>{fullName.split(" ")[0]}</span>
                <i
                  className={`bi bi-person-circle fs-4 ${isSticky ? "text-dark" : "text-white"}`}
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