"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiMail, FiPhone, FiArrowLeft, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      router.replace("/");
    } else {
      // Cek sessionStorage untuk data registrasi
      const savedFormData = sessionStorage.getItem('registerFormData');
      const savedUserId = sessionStorage.getItem('verificationUserId');
      const savedRegStep = sessionStorage.getItem('registerStep');

      if (savedRegStep && savedRegStep === '2') {
        if (savedFormData) {
          setFormData(JSON.parse(savedFormData));
        }
        if (savedUserId) {
          setUserId(savedUserId);
        }
        setRegStep(2);
      }
      setChecked(true);
    }
  }, [router]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, resendDisabled]);

  if (!checked) return null;

  const showModal = (message) => {
    setModalMessage(message);
    if (typeof window !== "undefined" && window.bootstrap) {
      new window.bootstrap.Modal(modalRef.current).show();
    }
  };

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    // Simpan formData ke sessionStorage saat berubah
    if (regStep === 1) {
      sessionStorage.setItem('registerFormData', JSON.stringify(newFormData));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { fullName, phoneNumber, email, password, confirmPassword } = formData;

    if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
      setIsLoading(false);
      return showModal("Mohon lengkapi semua data!");
    }
    
    if (!/^[a-zA-Z\s]{3,}$/.test(fullName)) {
      setIsLoading(false);
      return showModal("Nama lengkap minimal 3 karakter dan hanya boleh berisi huruf");
    }
    
    if (!/^\d{10,15}$/.test(phoneNumber)) {
      setIsLoading(false);
      return showModal("Nomor handphone harus 10-15 digit angka");
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsLoading(false);
      return showModal("Format email tidak valid");
    }
    
    if (password.length < 6) {
      setIsLoading(false);
      return showModal("Password minimal 6 karakter");
    }
    
    if (password !== confirmPassword) {
      setIsLoading(false);
      return showModal("Konfirmasi password tidak cocok!");
    }

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phoneNumber, email, password }),
      });

      const result = await res.json();
      setIsLoading(false);

      if (res.ok) {
        setUserId(result.userId);
        // Simpan data ke sessionStorage
        sessionStorage.setItem('registerFormData', JSON.stringify(formData));
        sessionStorage.setItem('verificationUserId', result.userId);
        sessionStorage.setItem('registerStep', '2');
        
        setRegStep(2);
        startResendTimer();
        showModal("Kode verifikasi telah dikirim ke email Anda. Silakan cek email.");
      } else {
        if (
          result.msg &&
          result.msg.toLowerCase().includes("belum verifikasi") &&
          result.userId
        ) {
          setUserId(result.userId);
          // Simpan data ke sessionStorage
          sessionStorage.setItem('registerFormData', JSON.stringify(formData));
          sessionStorage.setItem('verificationUserId', result.userId);
          sessionStorage.setItem('registerStep', '2');
          
          setRegStep(2);
          startResendTimer();
          showModal("Email sudah terdaftar tapi belum diverifikasi. Kami telah mengirim ulang kode.");
        } else {
          showModal(result.msg || "Terjadi kesalahan saat mendaftar.");
        }
      }
    } catch (error) {
      setIsLoading(false);
      showModal("Terjadi kesalahan saat mendaftar.");
      console.error(error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!verificationCode || verificationCode.length !== 6) {
      setIsLoading(false);
      return showModal("Mohon masukkan kode verifikasi 6 digit.");
    }

    try {
      // Gunakan userId dari state atau sessionStorage
      const verifyUserId = userId || sessionStorage.getItem('verificationUserId');
      
      if (!verifyUserId) {
        setIsLoading(false);
        return showModal("Sesi verifikasi tidak valid. Silakan daftar ulang.");
      }

      const res = await fetch("http://localhost:5001/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: verifyUserId,
          code: verificationCode,
        }),
      });
      const result = await res.json();
      setIsLoading(false);

      if (res.ok) {
        // Hapus data sessionStorage setelah verifikasi berhasil
        sessionStorage.removeItem('registerFormData');
        sessionStorage.removeItem('verificationUserId');
        sessionStorage.removeItem('registerStep');
        
        showModal("Verifikasi berhasil! Anda dapat login sekarang.");
        setTimeout(() => {
          localStorage.setItem("openLoginModal", "true");
          router.replace("/");
        }, 2000);
      } else {
        showModal("Verifikasi gagal: " + (result.message || "Kode salah."));
      }
    } catch {
      setIsLoading(false);
      showModal("Terjadi kesalahan saat verifikasi.");
    }
  };
  
  const startResendTimer = () => {
    setResendDisabled(true);
    setResendTimer(60);
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    try {
      setIsLoading(true);
      // Gunakan email dari formData atau sessionStorage
      const resendEmail = formData.email || JSON.parse(sessionStorage.getItem('registerFormData'))?.email;
      
      if (!resendEmail) {
        setIsLoading(false);
        return showModal("Email tidak ditemukan. Silakan daftar ulang.");
      }

      const res = await fetch("http://localhost:5001/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const result = await res.json();
      setIsLoading(false);

      if (res.ok) {
        startResendTimer();
        showModal("Kode verifikasi baru telah dikirim ke email Anda.");
      } else {
        showModal("Gagal mengirim ulang kode: " + (result.message || "Email Sudah Diverifikasi."));
      }
    } catch {
      setIsLoading(false);
      showModal("Terjadi kesalahan saat mengirim ulang kode.");
    }
  };

  const primaryColor = "#0d6efd";
  const secondaryColor = "#e9f0ff";

  const formStyle = {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(13, 110, 253, 0.15)",
    border: "1px solid rgba(13, 110, 253, 0.2)"
  };

  const handleGoogleLogin = () => {
    sessionStorage.setItem("preAuthPath", window.location.pathname);
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <>
      <section className="section-padding min-vh-100 d-flex align-items-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="text-center mb-5">
                <h1 className="display-5 fw-bold mb-3 text-primary">
                  Daftar Akun Baru
                </h1>
                <p className="text-muted fs-5">Mulai petualangan Anda dengan Museum Ruwai Jurai</p>
              </div>

              {regStep === 1 && (
                <div className="p-4 p-md-5" style={formStyle}>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
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
                          <label className="text-muted">
                            <FiUser className="me-2" /> Nama Lengkap
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="tel"
                            name="phoneNumber"
                            className="form-control"
                            placeholder="Nomor Handphone"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                          <label className="text-muted">
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
                          <label className="text-muted">
                            <FiMail className="me-2" /> Alamat Email
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating position-relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                          />
                          <label className="text-muted">
                            <FiLock className="me-2" /> Password
                          </label>
                          <button
                            type="button"
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                        <div className="form-text text-muted small ms-2">Minimal 6 karakter</div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating position-relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Konfirmasi Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                          />
                          <label className="text-muted">
                            <FiLock className="me-2" /> Konfirmasi Password
                          </label>
                          <button
                            type="button"
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 py-3 fw-semibold"
                          disabled={isLoading}
                          style={{ backgroundColor: primaryColor, border: "none" }}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Memproses...
                            </>
                          ) : (
                            "Daftar Sekarang"
                          )}
                        </button>
                      </div>

                      <div className="col-12 text-center my-4">
                        <div className="d-inline-block px-3 bg-white position-relative z-1 text-muted">
                          atau lanjutkan dengan
                        </div>
                        <hr className="mt-n2" />
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-lg rounded-pill px-4"
                          onClick={handleGoogleLogin}
                        >
                          <FcGoogle className="me-2 fs-5" /> Google
                        </button>
                      </div>

                      <div className="col-12 text-center pt-2">
                        <span className="text-muted">Sudah punya akun?{" "}</span>
                        <Link href="/login" className="text-primary fw-semibold">
                          Masuk disini
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {regStep === 2 && (
                <div className="p-4 p-md-5" style={formStyle}>
                  <button
                    className="btn btn-link text-decoration-none mb-3 text-primary"
                    onClick={() => {
                      setRegStep(1);
                      sessionStorage.removeItem('registerStep');
                      sessionStorage.removeItem('verificationUserId');
                    }}
                  >
                    <FiArrowLeft className="me-2" /> Kembali
                  </button>

                  <form onSubmit={handleVerify}>
                    <div className="text-center mb-4">
                      <div className="mb-3">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" style={{width: "80px", height: "80px"}}>
                          <FiCheckCircle size={40} className="text-primary" />
                        </div>
                      </div>
                      <h4 className="fw-bold mb-2 text-primary">Verifikasi Email</h4>
                      <p className="text-muted mb-4">
                        Kami telah mengirim kode verifikasi ke <br />
                        <span className="fw-semibold">{formData.email}</span>
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Kode Verifikasi</label>
                      <div className="d-flex justify-content-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          className="form-control form-control-lg text-center verification-input"
                          value={verificationCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 6) setVerificationCode(val);
                          }}
                          placeholder="------"
                          required
                        />
                      </div>
                      <div className="form-text text-center mt-2">
                        Masukkan 6 digit kode yang dikirim ke email Anda
                      </div>
                    </div>

                    <div className="d-grid gap-3">
                      <button
                        type="submit"
                        className="btn btn-primary py-3 fw-semibold"
                        disabled={isLoading}
                        style={{ backgroundColor: primaryColor, border: "none" }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Memverifikasi...
                          </>
                        ) : (
                          "Verifikasi Akun"
                        )}
                      </button>
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-decoration-none"
                          onClick={handleResendCode}
                          disabled={resendDisabled}
                        >
                          Tidak menerima kode?{" "}
                          <span className="text-primary fw-semibold">
                            {resendDisabled ? `Kirim ulang (${resendTimer}s)` : "Kirim Ulang"}
                          </span>
                        </button>
                      </div>
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
            <div className="modal-header border-0 position-relative">
              <h5 className="modal-title fw-bold">Notifikasi</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body py-4 text-center">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3" style={{width: "60px", height: "60px"}}>
                <FiCheckCircle size={28} className="text-primary" />
              </div>
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
          max-width: 280px;
          letter-spacing: 12px;
          font-size: 1.75rem;
          font-weight: 600;
          border: 2px solid #0d6efd;
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          background-color: #f8f9fa;
          color: #0d6efd;
        }
        
        .verification-input::placeholder {
          color: #ced4da;
          letter-spacing: normal;
        }
        
        .form-floating label {
          display: flex;
          align-items: center;
          color: #6c757d;
        }
        
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .section-padding {
          padding: 5rem 0;
        }
        
        @media (max-width: 768px) {
          .section-padding {
            padding: 3rem 0;
          }
          
          .verification-input {
            max-width: 240px;
            font-size: 1.5rem;
            letter-spacing: 8px;
          }
        }
        
        .btn-primary {
          background-color: #0d6efd;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background-color: #0b5ed7;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }
      `}</style>

      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}