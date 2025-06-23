"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEdit,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { AsYouType } from "libphonenumber-js";
import AOS from "aos";
import "aos/dist/aos.css";
import page from "@/config/page";

export default function ProfilePage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
      offset: 100,
    });

    if (!token) {
      setError("No authentication token found");
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(page.baseUrl + "/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok) {
          setUserData({
            fullName: result.user.fullName || "",
            email: result.user.email || "",
            phoneNumber: result.user.phoneNumber || "",
          });

          setEditData({
            fullName: result.user.fullName || "",
            phoneNumber: result.user.phoneNumber || "",
            password: "",
            confirmPassword: "",
          });
          setError(null);
        } else {
          setError(result.message || "Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Terjadi kesalahan saat mengambil profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    try {
      return new AsYouType("ID").input(number);
    } catch {
      return number;
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (editData.password && editData.password !== editData.confirmPassword) {
      alert("Password baru dan konfirmasi tidak cocok!");
      return;
    }

    try {
      const res = await fetch(page.baseUrl + "/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          phoneNumber: editData.phoneNumber,
          password: editData.password || undefined,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setUserData({
          ...userData,
          fullName: editData.fullName,
          phoneNumber: editData.phoneNumber,
        });
        setShowModal(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        alert("Gagal memperbarui profil: " + (result.error || result.message));
      }
    } catch (error) {
      console.error("Error saat update:", error);
      alert("Terjadi kesalahan saat memperbarui profil");
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <section
        className="text-white py-3"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/profile.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-8 text-lg-start text-center">
              <h2 className=" fw-bold mb-2 text-white">
                Selamat Datang <br />
                <span className="text-warning">
                  {userData?.fullName || "Pengguna"}
                </span>
              </h2>
              <p className="lead mb-3 text-white">
                Kelola informasi akun Anda dengan mudah dan aman. Perbarui
                profil dan ganti password kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Information Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="card border-2 rounded-4 overflow-hidden mb-5"
                style={{
                  backgroundColor: "#ffffff",
                  borderLeft: "5px solid #0d6efd",
                }}
              >
                <div className="card-body p-4 p-md-5">
                  <div
                    className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom"
                    style={{ borderColor: "rgba(108, 99, 255, 0.1)" }}
                  >
                    <div>
                      <h3 className="mb-0 fw-bold text-dark">
                        Detail Informasi Akun
                      </h3>
                      <p className="text-muted mb-0 small">
                        Kelola informasi profil Anda dengan aman
                      </p>
                    </div>
                    <button
                      className="btn rounded-pill px-4 py-2 d-flex align-items-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #6c63ff 0%, #0d6edf 100%)",
                        color: "white",
                        border: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(108, 99, 255, 0.3)",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(108, 99, 255, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 4px 15px rgba(108, 99, 255, 0.3)";
                      }}
                      onClick={() => setShowModal(true)}
                      data-aos="fade-left"
                    >
                      <FiEdit className="me-2" />
                      Edit Profil
                    </button>
                  </div>

                  <div className="row g-4 mt-2">
                    <div className="col-md-6" data-aos="fade-right">
                      <div className="form-group">
                        <label className="form-label d-flex align-items-center gap-2 text-dark mb-2">
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "rgba(108, 99, 255, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FiMail style={{ color: "#6c63ff" }} />
                          </div>
                          <span>Email</span>
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          className="form-control py-3 px-3"
                          style={{
                            border: "1px solid rgba(108, 99, 255, 0.2)",
                            borderRadius: "8px",
                            background: "#f8fafc",
                          }}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-6" data-aos="fade-left">
                      <div className="form-group">
                        <label className="form-label d-flex align-items-center gap-2 text-dark mb-2">
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "rgba(108, 99, 255, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FiUser style={{ color: "#6c63ff" }} />
                          </div>
                          <span>Nama Lengkap</span>
                        </label>
                        <input
                          type="text"
                          value={userData.fullName}
                          className="form-control py-3 px-3"
                          style={{
                            border: "1px solid rgba(108, 99, 255, 0.2)",
                            borderRadius: "8px",
                            background: "#f8fafc",
                          }}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-12" data-aos="fade-up">
                      <div className="form-group">
                        <label className="form-label d-flex align-items-center gap-2 text-dark mb-2">
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "rgba(108, 99, 255, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FiPhone style={{ color: "#6c63ff" }} />
                          </div>
                          <span>Nomor Telepon</span>
                        </label>
                        <div className="input-group">
                          <span
                            className="input-group-text py-3 px-3"
                            style={{
                              border: "1px solid rgba(108, 99, 255, 0.2)",
                              borderRight: "none",
                              borderRadius: "8px 0 0 8px",
                              background: "#f8fafc",
                              color: "#6c63ff",
                              fontWeight: "600",
                            }}
                          >
                            +62
                          </span>
                          <input
                            type="text"
                            value={formatPhoneNumber(userData.phoneNumber)}
                            className="form-control py-3 px-3"
                            style={{
                              border: "1px solid rgba(108, 99, 255, 0.2)",
                              borderLeft: "none",
                              borderRadius: "0 8px 8px 0",
                              background: "#f8fafc",
                            }}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Notification */}
      {isSuccess && (
        <div
          className="position-fixed bottom-0 end-0 m-4"
          style={{
            zIndex: 1100,
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <div
            className="d-flex align-items-center p-3 rounded-3 shadow"
            style={{
              background: "linear-gradient(135deg, #d1e7dd 0%, #a3cfbb 100%)",
              borderLeft: "4px solid #198754",
              minWidth: "300px",
            }}
          >
            <FiCheckCircle className="fs-4 me-2" style={{ color: "#198754" }} />
            <div>
              <h6 className="mb-0 fw-bold" style={{ color: "#0f5132" }}>
                Berhasil!
              </h6>
              <small style={{ color: "#0f5132" }}>
                Profil berhasil diperbarui
              </small>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="modal-backdrop fade show d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "600px", width: "100%" }}
          >
            <div
              className="modal-content border-0 rounded-4 overflow-hidden"
              style={{
                borderTop: "4px solid #6c63ff",
                backgroundColor: "#ffffff",
              }}
            >
              <div className="modal-header border-0 pb-0 pt-4 px-4">
                <h4 className="modal-title fw-bold text-dark">Edit Profil</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  style={{ fontSize: "0.8rem" }}
                ></button>
              </div>

              <form onSubmit={handleUpdateProfile}>
                <div className="modal-body pt-0 px-4 pb-3">
                  <div className="row g-3">
                    {/* Nama Lengkap */}
                    <div className="col-12">
                      <label className="form-label text-dark mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={editData.fullName}
                        onChange={handleEditChange}
                        className="form-control py-2 px-3"
                        style={{
                          border: "1px solid rgba(108, 99, 255, 0.3)",
                          borderRadius: "8px",
                        }}
                        required
                      />
                    </div>

                    {/* Nomor Telepon */}
                    <div className="col-12">
                      <label className="form-label text-dark mb-2">
                        Nomor Telepon
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            border: "1px solid rgba(108, 99, 255, 0.3)",
                            borderRight: "none",
                            borderRadius: "8px 0 0 8px",
                            background: "#f8fafc",
                            color: "#6c63ff",
                            fontWeight: "600",
                          }}
                        >
                          +62
                        </span>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editData.phoneNumber}
                          onChange={handleEditChange}
                          className="form-control py-2 px-3"
                          style={{
                            border: "1px solid rgba(108, 99, 255, 0.3)",
                            borderLeft: "none",
                            borderRadius: "0 8px 8px 0",
                          }}
                          pattern="^[0-9]{10,15}$"
                          maxLength={15}
                          placeholder="81234567890"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Baru */}
                    <div className="col-md-6">
                      <label className="form-label text-dark mb-2">
                        Password Baru
                      </label>
                      <div className="input-group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="password"
                          value={editData.password}
                          onChange={handleEditChange}
                          className="form-control py-1 px-3"
                          style={{
                            border: "1px solid rgba(108, 99, 255, 0.3)",
                            borderRadius: "8px 0 0 8px",
                          }}
                          placeholder="••••••"
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary py-3 px-3"
                          style={{
                            border: "1px solid rgba(108, 99, 255, 0.3)",
                            borderRadius: "0 8px 8px 0",
                            backgroundColor: "#ffffff",
                          }}
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="col-md-6">
                      <label className="form-label text-dark mb-2">
                        Konfirmasi Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={editData.confirmPassword}
                          onChange={handleEditChange}
                          className="form-control py-1 px-3"
                          style={{
                            border: "1px solid rgba(108, 99, 255, 0.3)",
                            borderRadius: "8px 0 0 8px",
                          }}
                          placeholder="••••••"
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary py-3 px-3"
                          style={{
                            border: "1px solid rgba(108, 99, 255, 0.3)",
                            borderRadius: "0 8px 8px 0",
                            backgroundColor: "#ffffff",
                          }}
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer border-0 pt-0 px-4 pb-4">
                  <div className="d-flex gap-3 w-100">
                    <button
                      type="button"
                      className="btn rounded-pill flex-grow-1 py-2 px-3"
                      style={{
                        background: "white",
                        color: "#dc3545",
                        border: "1px solid #dc3545",
                        fontWeight: "500",
                      }}
                      onClick={() => setShowModal(false)}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn rounded-pill flex-grow-1 py-2 px-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #6c63ff 0%, #0d6edf 100%)",
                        color: "white",
                        border: "none",
                        fontWeight: "500",
                        boxShadow: "0 4px 15px rgba(108, 99, 255, 0.3)",
                      }}
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .overlay {
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
          z-index: 1;
        }
        .text-white {
          color: #fff !important;
        }

        .form-control:focus {
          background-color: #fff !important;
          border-color: #6c63ff !important;
          box-shadow: 0 0 0 0.25rem rgba(108, 99, 255, 0.25) !important;
          color: #000 !important;
        }
      `}</style>
    </div>
  );
}
