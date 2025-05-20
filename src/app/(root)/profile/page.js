"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import Footer from "@/components/Footer";
import { FiUser, FiMail, FiPhone, FiLock, FiEdit, FiEye, FiEyeOff } from "react-icons/fi";
import { AsYouType } from "libphonenumber-js";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
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
    confirmPassword: ""
  });
  
  const [showModal, setShowModal] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
      offset: 100
    });
    
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/users/profile", {
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
            confirmPassword: ""
          });
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil profil:", error);
      }
    };

    fetchProfile();
  }, [token]);

  const formatPhoneNumber = (number) => {
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
      const res = await fetch("http://localhost:5001/api/users/profile", {
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
        alert("Profil berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui profil: " + (result.error || result.message));
      }
    } catch (error) {
      console.error("Error saat update:", error);
    }
  };

  return (
    <>
      <section className="section-padding" id="profile">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <div className="text-center mb-5" data-aos="fade-up">
                <h2 className="text-black fw-bold position-relative d-inline-block pb-2">
                  Profil Pengguna
                  <span className="title-line"></span>
                </h2>
                <p className="text-muted mt-3">Kelola informasi profil Anda</p>
              </div>

              <div 
                className="card shadow-lg border-0 rounded-3" 
                style={{ backgroundColor: "#f5ede1" }}
                data-aos="zoom-in"
              >
                <div className="card-body p-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0 fw-bold text-dark">Informasi Akun</h3>
                    <button
                      className="btn btn-primary rounded-pill px-4"
                      onClick={() => setShowModal(true)}
                      data-aos="fade-left"
                    >
                      <FiEdit className="me-2" />
                      Edit Profil
                    </button>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6" data-aos="fade-right">
                      <div className="form-group">
                        <label className="form-label d-flex align-items-center gap-2 text-secondary">
                          <FiMail className="fs-5" /> Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          className="form-control bg-light py-2"
                          readOnly
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-6" data-aos="fade-left">
                      <div className="form-group">
                        <label className="form-label d-flex align-items-center gap-2 text-secondary">
                          <FiUser className="fs-5" /> Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={userData.fullName}
                          className="form-control bg-light py-2"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-12" data-aos="fade-up">
                      <div className="form-group">
                        <label className="form-label d-flex align-items-center gap-2 text-secondary">
                          <FiPhone className="fs-5" /> Nomor Telepon
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">+62</span>
                          <input
                            type="text"
                            value={formatPhoneNumber(userData.phoneNumber)}
                            className="form-control bg-light py-2"
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

        {/* Modal Edit Profil */}
        {showModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div 
                className="modal-content border-0 shadow-lg" 
                style={{ backgroundColor: "#f5ede1" }}
               
              >
                <div className="modal-header border-0 pb-0">
                  <h4 className="modal-title fw-bold text-dark">Edit Profil</h4>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <div className="modal-body pt-0">
                    <div className="row g-3">
                      <div className="col-12" data-aos="fade-up">
                        <div className="form-group">
                          <label className="form-label text-secondary">Nama Lengkap</label>
                          <input
                            type="text"
                            name="fullName"
                            value={editData.fullName}
                            onChange={handleEditChange}
                            className="form-control py-2"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12" data-aos="fade-up">
                        <div className="form-group">
                          <label className="form-label text-secondary">Nomor Telepon</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light">+62</span>
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={editData.phoneNumber}
                              onChange={handleEditChange}
                              className="form-control py-2"
                              pattern="^[0-9]{10,15}$"
                              maxLength={15}
                              placeholder="Contoh: 81234567890"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6" data-aos="fade-up">
                        <div className="form-group">
                          <label className="form-label text-secondary">Password Baru</label>
                          <div className="input-group">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="password"
                              value={editData.password}
                              onChange={handleEditChange}
                              className="form-control py-2"
                              placeholder="••••••"
                              minLength={6}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6" data-aos="fade-up">
                        <div className="form-group">
                          <label className="form-label text-secondary">Konfirmasi Password</label>
                          <div className="input-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={editData.confirmPassword}
                              onChange={handleEditChange}
                              className="form-control py-2"
                              placeholder="••••••"
                              minLength={6}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0 pt-0">
                    <div className="d-flex gap-2 w-100">
                      <button
                        type="button"
                        className="btn btn-outline-danger rounded-pill flex-grow-1"
                        onClick={() => setShowModal(false)}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill flex-grow-1"
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
      </section>

      <Footer />
    </>
  );
}