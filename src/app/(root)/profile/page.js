"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import Footer from "@/components/Footer";
import { FiUser, FiMail, FiPhone, FiLock, FiEdit, FiEye, FiEyeOff} from "react-icons/fi";
import { AsYouType } from "libphonenumber-js";

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
  });

  const [showModal, setShowModal] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        if (res.ok && result.data) {
          setUserData({
            fullName: result.data.fullName || "",
            email: result.data.email || "",
            phoneNumber: result.data.phoneNumber || "",
          });

          setEditData({
            fullName: result.data.fullName || "",
            phoneNumber: result.data.phoneNumber || "",
            password: "",
          });
        } else {
          console.error("Gagal mengambil data profil:", result.message);
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
    try {
      const res = await fetch("http://localhost:5001/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const result = await res.json();

      if (res.ok) {
        setUserData((prev) => ({
          ...prev,
          fullName: editData.fullName,
          phoneNumber: editData.phoneNumber,
        }));
        setShowModal(false);
        alert("Profil berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui profil: " + result.message);
      }
    } catch (error) {
      console.error("Error saat update:", error);
    }
  };

  return (
    <>
      <section className="section-padding" id="profile">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-12 mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-black fw-bold position-relative d-inline-block pb-2">
                  Profil Pengguna
                  <span
                    style={{
                      display: "block",
                      width: "100px",
                      height: "5px",
                      backgroundColor: "#714D29",
                      margin: "8px auto 0",
                      borderRadius: "5px",
                    }}
                  />
                </h2>
              </div>

              <div className="card shadow border-0" style={{ backgroundColor: "#f5ede1" }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold">Informasi Akun</h5>
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => setShowModal(true)}
                    >
                      <FiEdit className="me-1" />
                      Edit Profil
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FiMail className="text-muted" /> Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      className="form-control bg-light"
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FiUser className="text-muted" /> Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={userData.fullName}
                      className="form-control bg-light"
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FiPhone className="text-muted" /> Nomor Telepon
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">+62</span>
                      <input
                        type="text"
                        value={formatPhoneNumber(userData.phoneNumber)}
                        className="form-control bg-light"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Edit Profil */}
              {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profil</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="modal-body">
              {/* Nama Lengkap */}
              <div className="mb-3">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleEditChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Nomor Telepon */}
              <div className="mb-3">
                <label>Nomor Telepon</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editData.phoneNumber}
                  onChange={handleEditChange}
                  className="form-control"
                  pattern="^[0-9]{10,15}$"
                  maxLength={15}
                  placeholder="Contoh: 081234567890"
                  required
                />
              </div>

              {/* Password Lama */}
              <div className="mb-3">
                <label>Password Saat Ini</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={editData.currentPassword || ""}
                    onChange={handleEditChange}
                    className="form-control"
                    placeholder="Masukkan password saat ini"
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              {/* Password Baru */}
              <div className="mb-3">
                <label>Password Baru (opsional)</label> 
                <div className="input-group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="password"
                    value={editData.password || ""}
                    onChange={handleEditChange}
                    className="form-control"
                    placeholder="Password baru"
                    minLength={6}
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div className="mb-3">
                <label>Konfirmasi Password Baru</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={editData.confirmPassword || ""}
                    onChange={handleEditChange}
                    className="form-control"
                    placeholder="Ulangi password baru"
                    minLength={6}
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
        </div>
        </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
