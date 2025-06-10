"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out-quad' });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Email dan password harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setCookie("token", data.data.token, { maxAge: 60 * 60 * 24, path: "/" });
        router.push("/login/admin/dashboard");
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container-fluid">
        <div className="row g-0">
          {/* Image Section */}
          <div className="col-lg-6 d-none d-lg-flex bg-primary bg-opacity-10 justify-content-center align-items-center">
            <div className="p-5 text-center">
              <Image
                src="/assets/images/lampung-logo.png"
                alt="Logo Lampung"
                width={400}
                height={400}
                className="img-fluid"
              />
              <div className="mt-4">
                <h4 className="fw-bold mb-1 text-primary">ERUWAIJUARAI</h4>
                <p className="text-muted small">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="p-5 w-100" style={{ maxWidth: "500px" }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-3 text-primary">Selamat Datang</h2>
                <p className="text-muted">Silakan masuk ke akun admin Anda</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-medium text-primary">Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#0e6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="#0e6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium text-primary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#0e6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12C2 12 5 6 12 6C19 6 22 12 22 12C22 12 19 18 12 18C5 18 2 12 2 12Z" stroke="#0e6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="input-group-text bg-transparent"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-end mb-4">
                  <a href="#" className="text-decoration-none small text-primary">
                    Lupa password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Memproses...
                    </div>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      MASUK
                    </span>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3">
                <p className="small text-muted">
                  © {new Date().getFullYear()} ERUWAIJUARAI. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;