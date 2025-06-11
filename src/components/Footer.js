import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const CompactFooter = () => {
  const [email, setEmail] = useState("");
  const EmailForm = dynamic(() => import("./EmailForm"), { ssr: false }); // Jika tidak dipakai, bisa hapus baris ini

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Proses submit newsletter
      console.log("Email submitted:", email);
      setEmail("");
    }
  };

  return (
    <footer
      className="text-white position-relative fw-bold"
      style={{
        backgroundColor: "#0D6EFD",
        backgroundImage: "linear-gradient(135deg, #0D6EFD 0%, #0a58ca 100%)",
        padding: "40px 0 20px",
        boxShadow: "0 -5px 20px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="container position-relative"
        style={{ maxWidth: "1200px" }}
      >
        <div className="row g-4">
          {/* Contact Info */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <Image
                width={300}
                height={300}
                src="/assets/images/lampung-logo.png"
                alt="Museum Logo"
                style={{ width: "40px", filter: "brightness(0) invert(1)" }}
              />
              <h4
                className="mb-0 text-white fw-bold"
                style={{ fontSize: "1.1rem" }}
              >
                Museum Lampung
              </h4>
            </div>

            <p
              className="text-white mb-3 fw-bold"
              style={{ lineHeight: "1.6", fontSize: "0.9rem" }}
            >
              Museum Negeri Propinsi Lampung “Ruwa Jurai” merupakan pusat
              pelestarian budaya dan sejarah Lampung dengan lebih dari 15.000
              koleksi bersejarah.
            </p>

            <div className="contact-info">
              <div className="d-flex align-items-start gap-2 mb-2">
                <FiMapPin className="mt-1 flex-shrink-0" size={16} />
                <p className="text-white mb-0" style={{ fontSize: "0.85rem" }}>
                  Jl. ZA. Pagar Alam No.64, Gedong Meneng, Kec. Rajabasa, Kota
                  Bandar Lampung
                </p>
              </div>

              <div className="d-flex align-items-start gap-2 mb-2">
                <FiClock className="mt-1 flex-shrink-0" size={16} />
                <p className="text-white mb-0" style={{ fontSize: "0.85rem" }}>
                  Selasa-Minggu: 08.00–14.00 WIB | Senin & Hari Libur: Tutup
                </p>
              </div>

              <div className="d-flex align-items-start gap-2 mb-2">
                <FiPhone className="mt-1 flex-shrink-0" size={16} />
                <p className="text-white mb-0" style={{ fontSize: "0.85rem" }}>
                  (0721) 703417 | info@museumlampung.id
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-4">
            <h5
              className="text-white fw-bold mb-3"
              style={{ fontSize: "1rem" }}
            >
              Menu Cepat
            </h5>
            <ul className="list-unstyled">
              {[
                "Beranda",
                "Tentang",
                "Sejarah",
                "Koleksi",
                "Galeri",
                "Ulasan",
              ].map((item, index) => (
                <li key={index} className="mb-1">
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-white text-decoration-none d-block py-1 hover-lift"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-4">
            <h5
              className="text-white fw-bold mb-3"
              style={{ fontSize: "1rem" }}
            >
              Newsletter
            </h5>
            <p className="text-white mb-2" style={{ fontSize: "0.85rem" }}>
              Dapatkan informasi terbaru tentang pameran dan acara di Museum
              Lampung.
            </p>
            <form onSubmit={handleNewsletterSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control border-0"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    height: "40px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "0.85rem",
                  }}
                />
                <button
                  className="btn btn-light"
                  type="submit"
                  style={{ height: "40px", width: "40px" }}
                >
                  <FiArrowRight size={16} />
                </button>
              </div>
            </form>

            <h6
              className="text-white fw-bold mb-2"
              style={{ fontSize: "0.9rem" }}
            >
              Follow Kami
            </h6>
            <div className="d-flex gap-2">
              {[
                { icon: <FaFacebookF size={14} />, color: "#3b5998" },
                { icon: <FaTwitter size={14} />, color: "#1da1f2" },
                { icon: <FaInstagram size={14} />, color: "#e1306c" },
                { icon: <FaYoutube size={14} />, color: "#ff0000" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center rounded-circle text-decoration-none"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4 pt-3">
          <div className="col-12">
            <div
              className="text-center text-white-60 pt-3"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
                fontSize: "0.8rem",
              }}
            >
              <p className="mb-0 text-white">
                © {new Date().getFullYear()} Museum Negeri Propinsi Lampung
                “Ruwa Jurai”.{" "}
                <span className="d-block d-sm-inline">
                  All Rights Reserved.
                </span>
              </p>
              <p className="mt-1 mb-0 text-white">
                Developed by{" "}
                <span className="fw-bold">PKL D3 Manajemen Informatika</span> –{" "}
                <span className="d-block d-sm-inline">
                  Politeknik Negeri Lampung
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .text-white {
          color: rgba(255, 255, 255, 0.85);
        }
        .text-white-60 {
          color: rgba(255, 255, 255, 0.6);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          color: white !important;
        }
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .form-control:focus {
          background-color: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }
      `}</style>
    </footer>
  );
};

export default CompactFooter;
