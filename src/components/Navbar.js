"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const navRef = useRef(null);

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Destination Info", path: "/aboutnext" },
    { name: "Sejarah", path: "/historynext" },
    { name: "Koleksi", path: "/venues" },
    { name: "Galeri", path: "/galeri" },
    { name: "Contacts", path: "/contacts" },
  ];

  useEffect(() => {
    const token = getCookie("token");
    const storedUsername = getCookie("username");
    const storedFullName = getCookie("fullName");
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || "Pengunjung");
      setFullName(storedFullName || "Pengunjung");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.response.token) {
        setCookie("token", data.response.token, { maxAge: 60 * 60 * 24, path: "/" });
        setCookie("username", data.response.user.username, { maxAge: 60 * 60 * 24, path: "/" });
        setCookie("fullName", data.response.user.fullName, { maxAge: 60 * 60 * 24, path: "/" });
        setIsLoggedIn(true);
        setUsername(data.response.user.username);
        setFullName(data.response.user.fullName);
        setShowLogin(false);
      } else {
        alert(data.response.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan saat login.");
    }
  };

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("username");
    deleteCookie("fullName");
    setIsLoggedIn(false);
    setUsername("");
    setFullName("");
    setShowProfileMenu(false);
  };

  const renderProfileMenu = () => (
  <div
    className="position-absolute bg-white rounded shadow p-2"
    style={{ top: "110%", right: 0, minWidth: "150px", zIndex: 1000 }}
  >
    {/* Header dengan tombol close */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="small text-muted">Menu</span>
      <button 
        className="btn btn-sm p-0"
        onClick={() => setShowProfileMenu(false)}
        aria-label="Tutup menu"
      >
        × {/* Unicode multiplication X */}
      </button>
    </div>
    {/* Isi menu */}
    <Link href="/profile" className="btn btn-sm w-100 text-start">
      Profile Saya
    </Link>
    <Link href="/orders" className="btn btn-sm w-100 text-start">
      History Pemesanan
    </Link>
    <button className="btn btn-danger btn-sm w-100" onClick={handleLogout}>
      Logout
    </button>
  </div>
);

  return (
    <header className="navbar navbar-expand-lg fixed-top py-2">
      <div className="container d-flex justify-content-between align-items-center px-2">
        <Link href="/" className="navbar-brand text-white fw-bold fs-5">
          Ruwai Jurai
        </Link>

        {/* Mobile */}
        <div className="d-lg-none d-flex align-items-center gap-2">
          {!isLoggedIn ? (
            <>  
              <Link href="/register" className="btn btn-light btn-sm">
                Daftar
              </Link>
              <button className="btn btn-light btn-sm" onClick={() => setShowLogin(true)}>
                Masuk
              </button>
            </>
          ) : (
            <div className="position-relative">
              <button
                className="btn btn-light btn-sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <i className="bi bi-person-circle me-2"></i>{fullName.split(" ")[0]}
              </button>
              {showProfileMenu && renderProfileMenu()}
            </div>
          )}
          <button
            className="btn btn-sm text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            style={{ fontSize: "1.3rem" }}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Desktop */}
        <nav className="d-none d-lg-flex align-items-center gap-3">
          <ul className="navbar-nav d-flex flex-row gap-0 mb-0 small">
            {navItems.map((item, idx) => (
              <li className="nav-item" key={idx}>
                <Link href={item.path} className="nav-link text-white px-2">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          {!isLoggedIn ? (
            <>
              <Link href="/register" className="btn btn-light px-4 rounded-pill">
                Daftar
              </Link>
              <button className="btn btn-light px-4 rounded-pill" onClick={() => setShowLogin(true)}>
                Masuk
              </button>
            </>
          ) : (
            <div className="position-relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="btn text-white d-flex align-items-center gap-2"
              >
                {fullName.split(" ")[0]}
                <i className="bi bi-person-circle fs-4"></i>
              </button>
              {showProfileMenu && renderProfileMenu()}
            </div>
          )}
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <nav ref={navRef} className="position-absolute bg-white rounded shadow-sm p-3" style={{ top: "100%", right: "1rem", width: "230px", zIndex: 999 }}>
            <ul className="navbar-nav">
              {navItems.map((item, idx) => (
                <li className="nav-item mb-2" key={idx}>
                  <Link href={item.path} className="nav-link text-dark" onClick={() => setIsOpen(false)}>
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="mt-3 d-flex flex-column gap-2">
                {!isLoggedIn ? (
                  <>
                    <Link href="/register" className="btn btn-warning btn-sm fw-bold">
                      Daftar
                    </Link>
                    <button className="btn btn-light btn-sm fw-bold" onClick={() => { setShowLogin(true); setIsOpen(false); }}>
                      Masuk
                    </button>
                  </>
                ) : (
                  <button className="btn btn-danger btn-sm fw-bold" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    Logout
                  </button>
                )}
              </li>
            </ul>
          </nav>
        )}

        {/* Modal Login */}
        {showLogin && (
          <div className="modal-backdrop show d-flex align-items-center justify-content-center" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 1050 }} onClick={() => setShowLogin(false)}>
            <div className="bg-white rounded p-4 shadow" style={{ width: "90%", maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Masuk Akun</h5>
                <button className="btn-close" onClick={() => setShowLogin(false)} />
              </div>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Username/Email</label>
                  <input type="email" name="email" id="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Kata Sandi</label>
                  <input type="password" name="password" id="password" className="form-control" required />
                </div>
                <div className="text-center mb-3">
                  <label>Belum Punya Akun ERUWAIJUARAI?</label>
                </div>
                <Link href="/register" className="btn btn-outline-dark w-100 mb-2">Daftar</Link>
                <button type="submit" className="btn btn-dark w-100">Masuk</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
