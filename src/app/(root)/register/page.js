"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Footer from "@/components/Footer";
import { getCookie } from "cookies-next";

export default function Register() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      router.replace("/");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  const showModal = (message) => {
    setModalMessage(message);
    if (typeof window !== "undefined" && window.bootstrap) {
      new window.bootstrap.Modal(modalRef.current).show();
    }
  };

  const handleChange = (e) => {
    setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phoneNumber, email, password, confirmPassword } = formData;

    if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
      return showModal("Mohon lengkapi semua data!");
    }
    if (password !== confirmPassword) {
      return showModal("Konfirmasi password tidak cocok!");
    }

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phoneNumber, email, password }),
      });
      const result = await res.json();

      if (res.ok) {
        // Berhasil daftar, lanjut ke step verifikasi
        setRegStep(2);
        showModal("Kode verifikasi telah dikirim ke email Anda. Silakan cek email.");
      } else {
        showModal("Gagal daftar: " + (result.message || "Terjadi kesalahan."));
      }
    } catch {
      showModal("Terjadi kesalahan saat mendaftar.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      return showModal("Mohon masukkan kode verifikasi.");
    }

    try {
      const res = await fetch("http://localhost:5001/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });
      const result = await res.json();

      if (res.ok) {
  showModal("Verifikasi berhasil! Anda dapat login sekarang.");
 setTimeout(() => {
  // Simpan info bahwa user harus buka modal login
  localStorage.setItem("openLoginModal", "true");
  router.replace("/");
}, 2000);
} else {
        showModal("Verifikasi gagal: " + (result.message || "Kode salah."));
      }
    } catch {
      showModal("Terjadi kesalahan saat verifikasi.");
    }
    
  };
  const handleResendCode = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    const result = await res.json();

    if (res.ok) {
      showModal("Kode verifikasi baru telah dikirim ke email Anda.");
    } else {
      showModal("Gagal mengirim ulang kode: " + (result.message || "Email Sudah Diverifikasi."));
    }
  } catch {
    showModal("Terjadi kesalahan saat mengirim ulang kode.");
  }
};

  return (
    <>
      <section className="section-padding" id="register">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-12 mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-black fw-bold position-relative d-inline-block pb-2">
                  Daftar Akun
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

              {regStep === 1 && (
                <form
                  className="custom-form contact-form shadow p-4 rounded"
                  onSubmit={handleSubmit}
                  style={{ backgroundColor: "rgba(205,183,140,0.1)" }}
                >
                  <div className="row g-3">
                    <div className="col-12">
                      <label>Nama Lengkap</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Silahkan Isi Nama Lengkap Anda"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label>Nomor Handphone</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Silahkan Isi Nomor Telepon"
                        pattern="[0-9]{10,15}"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Silahkan Isi Email"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Sandi"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="col-12">
                      <label>Konfirmasi Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Konfirmasi Sandi"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-dark px-4 mt-3">
                        Daftar Sekarang
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {regStep === 2 && (
                <form
                  onSubmit={handleVerify}
                  className="custom-form shadow p-4 rounded"
                  style={{ backgroundColor: "rgba(205,183,140,0.1)" }}
                >
                  <p>
                    Masukkan kode verifikasi yang telah dikirim ke email{" "}
                    <strong>{formData.email}</strong>.
                  </p>
                  <div className="mb-3">
                    <label htmlFor="verificationCode" className="form-label">
                      Kode Verifikasi
                    </label>
                    <input
                      type="number"
                      id="verificationCode"
                      name="verificationCode"
                      className="form-control"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Verifikasi
                  </button>
                  <button
                    type="button"
                    className="btn btn-link mt-2"
                    onClick={handleResendCode}
                  >
                    Belum menerima kode? Kirim ulang
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Bootstrap */}
      <div
        className="modal fade"
        id="feedbackModal"
        tabIndex="-1"
        aria-labelledby="feedbackModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="feedbackModalLabel">
                Informasi
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body text-center">{modalMessage}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Script JS Tambahan */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}
