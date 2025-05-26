"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiMail, FiPhone, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FiInfo } from "react-icons/fi";
import Link from "next/link";
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
  const [userId, setUserId] = useState(null);

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
      // Registrasi baru berhasil
      setUserId(result.userId);
      setRegStep(2);
      showModal("Kode verifikasi telah dikirim ke email Anda. Silakan cek email.");
    } else {
      // Email sudah ada tapi belum diverifikasi
      if (
        result.msg &&
        result.msg.toLowerCase().includes("belum verifikasi") &&
        result.userId
      ) {
        setUserId(result.userId);
        setRegStep(2);
        showModal("Email sudah terdaftar tapi belum diverifikasi. Kami telah mengirim ulang kode.");
      } else {
        // Kasus umum lainnya
        showModal(result.msg || "Terjadi kesalahan saat mendaftar.");
      }
    }
  } catch (error) {
    showModal("Terjadi kesalahan saat mendaftar.");
    console.error(error);
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
          userId: userId,
          code: verificationCode,
        }),
      });
      const result = await res.json();

      if (res.ok) {
  showModal("Verifikasi berhasil! Anda dapat login sekarang.");
 setTimeout(() => {
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

  const primaryColor = "#714D29";
  const secondaryColor = "#cdb78c";

  const formStyle = {
    background: `linear-gradient(135deg, ${secondaryColor}15 0%, #ffffff 100%)`,
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
  };


   const handleGoogleLogin = () => {
    // Simpan halaman sebelumnya
    sessionStorage.setItem("preAuthPath", window.location.pathname);
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <>
      <section className="section-padding min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="text-center mb-5">
                <h1 className="display-5 fw-bold mb-3 position-relative">
                  Daftar Akun Baru
                </h1>
                <p className="text-muted">Mulai petualangan Anda dengan Museum Ruwai Jurai</p>
              </div>

              {regStep === 1 && (
                <div className="p-5" style={formStyle}>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            placeholder="Nama Lengkap"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                          <label>
                            <FiUser className="me-2" /> Nama Lengkap
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="tel"
                            name="phoneNumber"
                            className="form-control"
                            placeholder="Nomor Handphone"
                            pattern="[0-9]{10,15}"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                          <label>
                            <FiPhone className="me-2" /> Nomor Handphone
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Alamat Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                          <label>
                            <FiMail className="me-2" /> Alamat Email
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                          />
                          <label>
                            <FiLock className="me-2" /> Password
                          </label>
                        </div>
                        <div className="form-text text-muted small">Minimal 6 karakter</div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Konfirmasi Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                          />
                          <label>
                            <FiLock className="me-2" /> Konfirmasi Password
                          </label>
                        </div>
                      </div>

                      <div className="col-12 mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 py-3 fw-semibold"
                          style={{ backgroundColor: primaryColor, border: "none" }}
                        >
                          Daftar Sekarang
                        </button>
                      </div>

                      <div className="col-12 text-center">
                        <div className="d-inline-block px-3 bg-white position-relative z-1 text-muted">
                          atau lanjutkan dengan
                        </div>
                        <hr className="mt-n2" />
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-lg rounded-pill px-4"
                          onClick={handleGoogleLogin}
                        >
                          <FcGoogle className="me-2" /> Google
                        </button>
                      </div>

                      <div className="col-12 text-center">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary fw-semibold">
                          Masuk disini
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {regStep === 2 && (
                <div className="p-5" style={formStyle}>
                  <button
                    className="btn btn-link text-decoration-none mb-4"
                    onClick={() => setRegStep(1)}
                  >
                    <FiArrowLeft className="me-2" /> Kembali
                  </button>

                  <form onSubmit={handleVerify}>
                    <div className="text-center mb-5">
                      <div className="mb-4">
                        <FiCheckCircle size={64} className="text-success" />
                      </div>
                      <h4 className="fw-bold mb-3">Verifikasi Email</h4>
                      <p className="text-muted">
                        Kami telah mengirim kode verifikasi ke{" "}
                        <span className="fw-semibold">{formData.email}</span>
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Kode Verifikasi</label>
                      <div className="d-flex gap-2 justify-content-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          className="form-control form-control-lg text-center verification-input"
                          value={verificationCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ""); // Hanya angka
                            if (val.length <= 6) setVerificationCode(val);
                          }}
                          required
                        />

                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary py-3 fw-semibold"
                        style={{ backgroundColor: primaryColor, border: "none" }}
                      >
                        Verifikasi Akun
                      </button>
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={handleResendCode}
                      >
                        Tidak menerima kode? <span className="text-primary">Kirim Ulang</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <div
        className="modal fade"
        id="feedbackModal"
        tabIndex="-1"
        aria-labelledby="feedbackModalLabel"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Notifikasi</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body py-4 text-center">
              <FiInfo className="fs-1 text-primary mb-3" />
              <p className="lead mb-0">{modalMessage}</p>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <button
                type="button"
                className="btn btn-primary px-4"
                data-bs-dismiss="modal"
                style={{ backgroundColor: primaryColor, border: "none" }}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .verification-input {
          max-width: 400px;
          letter-spacing: 8px;
          font-size: 1.5rem;
          border: 2px solid ${primaryColor};
          border-radius: 10px;
          padding: 1rem;
        }
        
        .form-floating label {
          display: flex;
          align-items: center;
          color: #6c757d;
        }
        
        .form-control:focus {
          border-color: ${primaryColor};
          box-shadow: 0 0 0 0.25rem ${primaryColor}40;
        }
      `}</style>

      {/* Scripts tetap sama */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}