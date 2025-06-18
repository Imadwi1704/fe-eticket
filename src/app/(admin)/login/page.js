"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiArrowRight,
  FiChevronLeft,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import page from "@/config/page";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  // State management
  const [formData, setFormData] = useState({
    email: emailParam || "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(emailParam ? "verify" : "login");
  const [recoveryData, setRecoveryData] = useState({
    email: emailParam || "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out-quad",
      offset: 50,
    });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "login") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRecoveryData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Email dan password harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${page.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Set cookies
        setCookie("token", data.data.token, {
          maxAge: 60 * 60 * 24,
          path: "/",
        });
        setCookie("userRole", data.data.role, {
          maxAge: 60 * 60 * 24,
          path: "/",
        });

        // Redirect based on role
        const redirectPath =
          data.data.role === "ADMIN" ? "/login/admin/dashboard" : "/";
        router.push(redirectPath);
      } else {
        toast.error(data.message || "Login gagal. Email atau password salah!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    setCookie("redirectAfterLogin", window.location.pathname, {
      maxAge: 60 * 5,
      path: "/",
    });
    window.location.href = `${page.baseUrl}/api/auth/google`;
  };

  // Check Google auth status
  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        const res = await fetch(`${page.baseUrl}/api/auth/login/success`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCookie("token", data.token, {
              maxAge: 60 * 60 * 24,
              path: "/",
            });
            setCookie("userRole", data.user.role, {
              maxAge: 60 * 60 * 24,
              path: "/",
            });

            const redirectPath =
              data.user.role === "admin" ? "/admin/dashboard" : "/";
            router.push(redirectPath);
          }
        }
      } catch (error) {
        console.error("Google auth check error:", error);
      }
    };

    checkGoogleAuth();
  }, [router]);

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!recoveryData.email) {
      toast.error("Email harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${page.baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Kode verifikasi telah dikirim ke email Anda");
        setActiveTab("verify");
        // Update URL without refresh
        router.push(
          `/login?email=${encodeURIComponent(recoveryData.email)}`,
          undefined,
          { shallow: true }
        );
      } else {
        toast.error(data.message || "Gagal mengirim kode verifikasi");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Terjadi kesalahan saat memproses permintaan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!recoveryData.verificationCode) {
      toast.error("Kode verifikasi harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${page.baseUrl}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recoveryData.email,
          code: recoveryData.verificationCode,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        toast.success("Kode verifikasi valid");
        setActiveTab("reset");
      } else {
        toast.error(data.message || "Kode verifikasi tidak valid");
      }
    } catch (error) {
      console.error("Verify code error:", error);
      toast.error("Terjadi kesalahan saat memverifikasi kode");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validation
    const { verificationCode, newPassword, confirmPassword } = recoveryData;
    if (!verificationCode || !newPassword || !confirmPassword) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password minimal 8 karakter!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${page.baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recoveryData.email,
          code: verificationCode,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (
        res.ok &&
        (data.status === "success" ||
          data.message?.toLowerCase().includes("berhasil") ||
          data.msg?.toLowerCase().includes("berhasil"))
      ) {
        toast.success(
          data.message ||
            data.msg ||
            "Password berhasil direset. Silakan login."
        );
        setActiveTab("login");
        setRecoveryData({
          email: "",
          verificationCode: "",
          newPassword: "",
          confirmPassword: "",
        });
        router.push("/login", undefined, { shallow: true });
      } else {
        toast.error(data.message || data.msg || "Gagal mereset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Terjadi kesalahan saat mereset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Render login form
  const renderLoginForm = () => (
    <div data-aos="fade-up">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Masuk ke Akun Anda</h2>
        <p className="text-muted">
          Silakan masuk menggunakan email dan password
        </p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FiMail />
            </span>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FiLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
              minLength={8}
            />
            <button
              type="button"
              className="input-group-text bg-transparent border-0"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="remember" />
            <label className="form-check-label" htmlFor="remember">
              Ingat saya
            </label>
          </div>
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => {
              setActiveTab("forgot");
              setRecoveryData((prev) => ({ ...prev, email: formData.email }));
            }}
          >
            Lupa password?
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Memproses...
            </>
          ) : (
            <>
              <FiArrowRight className="me-2" />
              Masuk
            </>
          )}
        </button>

        <div className="text-center mb-3">
          <span className="text-muted">Atau masuk dengan</span>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary w-100 py-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="me-2" size={20} />
          Google
        </button>
      </form>
    </div>
  );

  // Render forgot password form
  const renderForgotPasswordForm = () => (
    <div data-aos="fade-up">
      <button
        type="button"
        className="btn btn-link p-0 mb-3 d-flex align-items-center"
        onClick={() => setActiveTab("login")}
      >
        <FiChevronLeft className="me-1" />
        Kembali ke login
      </button>

      <div className="text-center mb-4">
        <h2 className="fw-bold">Lupa Password</h2>
        <p className="text-muted">
          Masukkan email Anda untuk menerima kode verifikasi
        </p>
      </div>

      <form onSubmit={handleForgotPassword}>
        <div className="mb-3">
          <label htmlFor="recoveryEmail" className="form-label">
            Email
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FiMail />
            </span>
            <input
              type="email"
              className="form-control"
              id="recoveryEmail"
              name="email"
              value={recoveryData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Mengirim...
            </>
          ) : (
            "Kirim Kode Verifikasi"
          )}
        </button>
      </form>
    </div>
  );

  // Render verification code form
  const renderVerifyCodeForm = () => (
    <div data-aos="fade-up">
      <button
        type="button"
        className="btn btn-link p-0 mb-3 d-flex align-items-center"
        onClick={() => {
          setActiveTab("forgot");
          router.push("/login", undefined, { shallow: true });
        }}
      >
        <FiChevronLeft className="me-1" />
        Kembali
      </button>

      <div className="text-center mb-4">
        <h2 className="fw-bold">Verifikasi Kode</h2>
        <p className="text-muted">
          Masukkan kode verifikasi yang dikirim ke {recoveryData.email}
        </p>
      </div>

      <form onSubmit={handleResetPassword}>
        <div className="mb-3">
          <label htmlFor="verificationCode" className="form-label">
            Kode Verifikasi
          </label>
          <input
            type="text"
            className="form-control"
            id="verificationCode"
            name="verificationCode"
            value={recoveryData.verificationCode}
            onChange={handleChange}
            placeholder="Masukkan kode verifikasi"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            Password Baru
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FiLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="newPassword"
              name="newPassword"
              value={recoveryData.newPassword}
              onChange={handleChange}
              placeholder="Masukkan password baru"
              required
              minLength={8}
            />
            <button
              type="button"
              className="input-group-text bg-transparent border-0"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Konfirmasi Password
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FiLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={recoveryData.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi password baru"
              required
              minLength={8}
            />
            <button
              type="button"
              className="input-group-text bg-transparent border-0"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Memproses...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="container-fluid">
        <div className="row g-0">
          {/* Image Section */}
          <div className="col-lg-6 d-none d-lg-flex bg-primary bg-opacity-10 justify-content-center align-items-center">
            <div className="p-5 text-center">
              <Image
                src="/assets/images/lampung-logo.png"
                alt="Logo Lampung"
                width={300}
                height={300}
                className="img-fluid"
                priority
              />
              <div className="mt-4">
                <h4 className="fw-bold mb-1 text-primary">ERUWAIJUARAI</h4>
                <p className="text-muted small">Halaman Login E-Ruwai Jurai</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="p-4 p-md-5 w-100" style={{ maxWidth: "500px" }}>
              {activeTab === "login" && renderLoginForm()}
              {activeTab === "forgot" && renderForgotPasswordForm()}
              {activeTab === "verify" && renderVerifyCodeForm()}

              {activeTab === "login" && (
                <div className="text-center mt-4 pt-3">
                  <p className="small text-muted">
                    © {new Date().getFullYear()} ERUWAIJUARAI. All rights
                    reserved.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
