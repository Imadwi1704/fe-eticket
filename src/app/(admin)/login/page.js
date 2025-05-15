"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Image from "next/image";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("email dan password harus diisi!");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      // Set cookie token
      setCookie("token", data.response.token, {
        maxAge: 60 * 60 * 24, // 1 hari
        path: "/",
      });
  console.log(data)
      if (res.ok && data.metaData?.code === 200) {
        router.push("/login/admin/dashboard");
      } else {
        alert(data.metaData?.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan saat login.");
    }
  };
  
  

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div
        style={{ backgroundColor: "#fff", width: "800px", maxWidth: "90%" }}
      >

        <div className="row">
          {/* Kolom Gambar */}
          <div className="col-md-6 d-flex justify-content-center align-items-center border p-3">
            <img
              src="/assets/images/lampung-logo.png"
              alt="Logo Lampung"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          {/* Kolom Form */}
          <div
            className="col-md-6 border p-4"
            style={{ backgroundColor: "#F7F1DD" }}
          >
            <h4 className="fw-bold text-center mb-2">ERUWAIJUARAI</h4>
            <p className="text-center" style={{ fontSize: "12px" }}>
              Silakan masukkan Username dan Password akun Admin
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">email:</label>
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Password:</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
  type="submit"
  className="btn w-50 f-bold text-white"
  style={{
    backgroundColor: "#714D29",
    borderRadius: "20px",
    padding: "10px 0",  // Sesuaikan padding agar button lebih proporsional
    textAlign: "center", // Pastikan teks di tengah
  }}
>
  Login
</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
