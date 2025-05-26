"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef} from "react";
import Link from "next/link";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Spinner from "../../src/components/spinner";

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
        // Verifikasi token ke backend
        const res = await fetch("http://localhost:5001/api/auth/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) throw new Error("Invalid token");
        
        // Set cookie dengan opsi keamanan
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
    // Simpan halaman sebelumnya
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

  {renderGoogleLoginButton()}

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
    <header className="navbar navbar-expand-lg fixed-top py-2">
      <div className="container d-flex justify-content-between align-items-center px-2">
        <Link href="/" className="navbar-brand fw-bold fs-5">
          Ruwai Jurai
        </Link>

        {/* Mobile */}
        <div className="d-lg-none d-flex align-items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Link href="/register" className="btn btn-light btn-sm">
                Daftar
              </Link>
              <button
                className="btn btn-light btn-sm"
                onClick={() => setShowLogin(true)}
              >
                Masuk
              </button>
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
            style={{ fontSize: "1.3rem" }}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Desktop */}
        <nav className="d-none d-lg-flex align-items-center gap-2 py-1 px-2 small">
        <ul className="navbar-nav d-flex flex-row gap-0 mb-0 small">
          {navItems.map((item, idx) => (
            <li className="nav-item" key={idx}>
              <Link
                href={item.path}
                className={`nav-link px-1 py-0 ${pathname === item.path ? "active text-white" : "text-white"}`}

              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
          {!isLoggedIn ? (
            <>
              <Link
                href="/register"
                className="btn btn-outline-light btn-sm rounded-pill"
              >
                Daftar
              </Link>
              <button
                className="btn btn-light btn-sm rounded-pill"
                onClick={() => setShowLogin(true)}
              >
                Masuk
              </button>
            </>
          ) : (
            <div className="position-relative" ref={navRef}>
              <button
                className="btn d-flex align-items-center gap-2"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className="text-white">{fullName.split(" ")[0]}</span>
                <i
                  className="bi bi-person-circle fs-4 text-white"
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

    {/* Login Modal */}
{showLogin && (
  <div
    className="modal fade show d-block"
    tabIndex={-1}
    role="dialog"
    aria-modal="true"
    style={{
      backgroundColor: "rgba(0,0,0,0.6)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 1050,
    }}
    onClick={() => setShowLogin(false)}
  >
    <div
      className="modal-dialog modal-dialog-centered"
      role="document"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content shadow-lg p-4 rounded-3" style={{ border: 'none' }}>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold fs-4 text-primary">Masuk Akun</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowLogin(false)}
            aria-label="Close"
          />
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="modal-body pt-1">
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label text-muted">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control form-control-lg rounded-2"
                placeholder="contoh@email.com"
                required
                style={{ padding: '12px' }}
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label text-muted">
                Kata Sandi
              </label>
              <div className="input-group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg rounded-2"
                  placeholder="Masukkan kata sandi"
                  required
                  style={{ padding: '12px' }}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-muted`} />
                </button>
              </div>
            </div>

            {/* Lupa Password */}
            <div className="d-flex justify-content-end mb-4">
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-primary"
                onClick={() => {
                  setShowForgotPassword(true);
                  setShowLogin(false);
                }}
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 mb-3 rounded-2 fw-semibold"
              disabled={loading}
              style={{ 
                height: '50px',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span>Memproses...</span>
                </div>
              ) : "Masuk"}
            </button>

            {/* Separator */}
            <div className="d-flex align-items-center my-4">
              <div className="border-top flex-grow-1" />
              <span className="mx-3 text-muted">atau</span>
              <div className="border-top flex-grow-1" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="btn btn-outline-danger btn-lg w-100 d-flex align-items-center justify-content-center gap-3 rounded-2 fw-semibold"
              onClick={handleGoogleLogin}
              style={{ 
                height: '50px',
                transition: 'all 0.3s ease'
              }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width="20"
                height="20"
              />
              <span>Masuk dengan Google</span>
            </button>

            {/* Register Link */}
            <div className="text-center mt-4 pt-3">
              <p className="mb-0 text-muted">
                Belum punya akun?{' '}
                <a
                  href="/register"
                  className="text-decoration-none fw-semibold text-primary"
                  onClick={() => setShowLogin(false)}
                >
                  Daftar sekarang
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    ``
    
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowForgotPassword(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Lupa Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForgotPassword(false)}
                />
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="forgotEmail" className="form-label">
                      Masukkan Email Anda
                    </label>
                    <input
                      id="forgotEmail"
                      name="forgotEmail"
                      type="email"
                      className="form-control"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Kirim Kode Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowResetPasswordModal(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Reset Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowResetPasswordModal(false)}
                />
              </div>
              <form onSubmit={handleSubmitReset}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">
                      Kode Reset
                    </label>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      className="form-control"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="newPassword" className="form-label">
                      Password Baru
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "Sembunyikan" : "Tampilkan"}
                    </button>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="confirmPassword" className="form-label">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "Sembunyikan" : "Tampilkan"}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Memproses..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
