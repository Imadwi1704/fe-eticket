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
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="shadow rounded-4 overflow-hidden" style={{ 
        width: "1000px", 
        maxWidth: "95%",
        background: "linear-gradient(to right, #F5EFE6 50%, #ffffff 50%)"
      }}>
        <div className="row g-0">
          {/* Image Section */}
          <div className="col-md-6 d-flex justify-content-center align-items-center p-5">
            <div 
              className="p-4 rounded-4 bg-white shadow-sm"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <Image
                src="/assets/images/lampung-logo.png"
                alt="Logo Lampung"
                width={350}
                height={350}
                className="img-fluid"
                style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="col-md-6 p-5">
            <div className="h-100 d-flex flex-column justify-content-center" data-aos="fade-left" data-aos-delay="400">
              <h2 className="fw-bold text-center mb-3" style={{ color: "#6C4F3D", fontSize: "2rem" }}>
                ERUWAIJUARAI
              </h2>
              <p className="text-center text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                Sistem Admin ERUWAIJUARAI Museum Provinsi Lampung
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4" data-aos="fade-up" data-aos-delay="600">
                  <label className="form-label fw-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control rounded-pill pe-5"
                    onChange={handleChange}
                    style={{ padding: "12px 20px", borderColor: "#B08968" }}
                    required
                  />
                </div>

                <div className="mb-5 position-relative" data-aos="fade-up" data-aos-delay="800">
                  <label className="form-label fw-medium">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control rounded-pill pe-5"
                      onChange={handleChange}
                      style={{ padding: "12px 20px", borderColor: "#B08968" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3"
                      style={{ zIndex: 5, color: "#6C4F3D" }}
                    >
                      {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                    </button>
                  </div>
                </div>

                <div data-aos="flip-up" data-aos-delay="1000">
                  <button
                    type="submit"
                    className="btn w-100 fw-bold text-white rounded-pill py-3"
                    style={{
                      backgroundColor: "#6C4F3D",
                      transition: "all 0.3s ease",
                      transform: "translateY(0)"
                    }}
                    disabled={isLoading}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    {isLoading ? (
                      <div className="spinner-border spinner-border-sm text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "MASUK"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
