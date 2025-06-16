/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Footer from "@/components/Footer";
import { getCookie } from "cookies-next";
import {
  FiClock,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiStar,
  FiSend,
} from "react-icons/fi";

export default function Review() {
  const [review, setReview] = useState({
    score: "",
    comment: "",
    userId: "",
  });
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("review"); // "review" or "contact"
  const token = getCookie("token");

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.id) {
          setReview((prev) => ({ ...prev, userId: payload.id }));
        }
      } catch (err) {
        console.error("Error parsing token:", err);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [token]);

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/reviews", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok) {
        const reviews = Array.isArray(result.data) ? result.data : [];
        setList(reviews);
      } else {
        console.error("Gagal fetch review:", result.message);
      }
    } catch (err) {
      console.error("Error fetchReviews:", err);
    }
  };

  const handleChange = (e) => {
    setReview((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Anda harus login terlebih dahulu.");
      return;
    }

    const score = Number(review.score);
    if (score < 1 || score > 5) {
      alert("Rating harus antara 1 sampai 5.");
      return;
    }

    try {
      const payload = { ...review, score };

      const res = await fetch("http://localhost:5001/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("Terima kasih telah memberikan penilaian!");
        setReview({ score: "", comment: "", userId: review.userId });
        setShowModal(true);
        fetchReviews();
      } else {
        alert(result.message || "Gagal menyimpan review");
      }
    } catch (error) {
      console.error("Error saat menyimpan review:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const renderStars = (score) => {
    return (
      <div className="d-flex">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={i < score ? "text-warning" : "text-muted"}
            fill={i < score ? "#ffc107" : "transparent"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center"
        id="aboutnext"
        style={{
          height: "65vh",
          backgroundImage: "url('/assets/images/museum.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(rgb(0 0 0 / 70%), rgb(0 0 0 / 40%))",
            zIndex: 1,
          }}
        ></div>

        <div
          className="position-relative text-white text-center z-2 p-3"
          style={{ zIndex: 2 }}
        >
          <h1 className="fw-bold display-4 mb-3">
            Kontak & Ulasan Museum Lampung
          </h1>
          <p
            className="lead mb-4 mx-auto text-white"
            style={{ maxWidth: "600px" }}
          >
            Berikan ulasan Anda dan temukan informasi kontak untuk Museum Negeri
            &ldquo;Ruwa Jurai&ldquo;
          </p>
        </div>

        {/* Gelombang Dekoratif */}
        <div
          className="position-absolute bottom-0 start-0 w-100"
          style={{ zIndex: 3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path
              fill="#f8f9fa"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Tab Navigasi */}
      <div className="container mb-5">
        <div className="d-flex justify-content-center">
          <div
            className="nav nav-pills bg-white rounded-pill shadow-sm p-1"
            style={{ width: "fit-content" }}
          >
            <button
              className={`nav-link rounded-pill px-4 py-2 ${
                activeTab === "review" ? "active bg-primary" : ""
              }`}
              onClick={() => setActiveTab("review")}
            >
              Beri Ulasan
            </button>
            <button
              className={`nav-link rounded-pill px-4 py-2 ${
                activeTab === "contact" ? "active bg-primary" : ""
              }`}
              onClick={() => setActiveTab("contact")}
            >
              Lihat Ulasan
            </button>
          </div>
        </div>
      </div>

      {/* Konten Tab */}
      <section className="section-padding bg-light" id="review">
        <div className="container">
          {activeTab === "review" ? (
            <div className="row">
              {/* Card Informasi Museum - Sebelah Kiri */}
              <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                  <div className="card-header bg-primary text-white py-2">
                    <h3 className="mb-0 text-center text-white fw-bold">
                      Informasi Museum
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    {[
                      {
                        icon: <FiClock size={28} />,
                        title: "Jam Operasional",
                        content: "Selasa-Minggu: 08.00 - 16.00",
                      },
                      {
                        icon: <FiMapPin size={28} />,
                        title: "Lokasi",
                        content: "Jl. Z.A. Pagar Alam No.64, Bandar Lampung",
                      },
                      {
                        icon: <FiPhone size={28} />,
                        title: "Kontak",
                        content: "(0721) 703 621",
                      },
                      {
                        icon: <FiCalendar size={28} />,
                        title: "Didirikan",
                        content: "24 September 1988",
                      },
                    ].map((item, index) => (
                      <div className="mb-4 pb-3 border-bottom" key={index}>
                        <div className="d-flex align-items-start">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                            <span className="text-primary">{item.icon}</span>
                          </div>
                          <div>
                            <h6 className="text-primary mb-1">{item.title}</h6>
                            <p className="fw-bold mb-0 text-dark">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Beri Ulasan - Tanpa Card */}
              <div className="col-lg-8 col-md-12">
                <div className="p-3 p-lg-4">
                  <h3 className="mb-4 text-center text-primary fw-bold">
                    Beri Ulasan Anda
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="userId" value={review.userId} />
                    <p className="mb-4 text-center text-muted">
                      Silahkan kirimkan saran dan masukan Anda setelah
                      berkunjung di Museum Lampung
                    </p>

                    {/* Input Rating */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Rating (1–5):
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="number"
                          name="score"
                          value={review.score}
                          onChange={handleChange}
                          className="form-control rounded-pill"
                          style={{ maxWidth: "80px" }}
                          placeholder="0"
                          min="1"
                          max="5"
                          required
                        />
                        <div className="ms-3">
                          {renderStars(
                            review.score ? parseInt(review.score) : 0
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Textarea Komentar */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Saran dan Masukan:
                      </label>
                      <textarea
                        name="comment"
                        className="form-control rounded-3"
                        value={review.comment}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tulis saran dan masukan Anda di sini..."
                        required
                        style={{ border: "1px solid #ced4da" }}
                      />
                    </div>

                    {/* Tombol Kirim */}
                    <div className="text-center mt-5">
                      <button
                        type="submit"
                        className="btn btn-primary px-3 py-2 rounded-pill fw-bold d-flex align-items-center mx-auto"
                        style={{ fontSize: "16px" }}
                      >
                        Kirim Ulasan <FiSend className="ms-2" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                  <div className="card-header bg-primary text-white py-2">
                    <h3 className="mb-0 text-center text-white">
                      Ulasan Pengunjung
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    {list.length > 0 ? (
                      <div className="row g-4">
                        {list.map((item, index) => (
                          <div className="col-md-6" key={index}>
                            <div className="bg-white p-4 rounded-3 shadow-sm h-100 border-start border-4 border-primary">
                              <div className="d-flex justify-content-between">
                                <h5 className="fw-bold text-primary">
                                  {item.user.name || "Pengunjung"}
                                </h5>
                                <div className="text-muted small">
                                  {new Date(
                                    item.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="mb-3">
                                {renderStars(item.score)}
                              </div>
                              <p className="mb-0" style={{ color: "#555" }}>
                                &ldquo;{item.comment}&ldquo;
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                          <FiStar size={36} className="text-primary" />
                        </div>
                        <h5 className="fw-bold mb-3">Belum Ada Ulasan</h5>
                        <p className="text-muted mb-0">
                          Jadilah yang pertama memberikan ulasan tentang Museum
                          Lampung!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Google Maps */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-header bg-primary text-white py-2">
                  <h3 className="mb-0 text-center text-white">
                    Lokasi Museum Lampung
                  </h3>
                </div>
                <div className="card-body p-0">
                  <div className="ratio ratio-16x9">
                    <iframe
                      className="border-0"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.292852728222!2d105.23834287498384!3d-5.372234694606639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40dab5d8b8ddfb%3A0xb2235987d49dad2f!2sMuseum%20Lampung!5e0!3m2!1sid!2sid!4v1742337921781!5m2!1sid!2sid"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Peta Lokasi Museum Lampung"
                    />
                  </div>
                  <div className="p-4 bg-light border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="fw-bold mb-1">
                          Museum Negeri Provinsi Lampung &ldquo;Ruwa
                          Jurai&ldquo;
                        </h5>
                        <p className="text-muted mb-0">
                          Jl. Z.A. Pagar Alam No.64, Bandar Lampung
                        </p>
                      </div>
                      <a
                        href="https://goo.gl/maps/2XqJv9QcXyQ2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary rounded-pill px-4"
                      >
                        <FiMapPin className="me-2" /> Petunjuk Arah
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Sukses */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 overflow-hidden border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Terima Kasih!</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-5 text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                  <FiStar size={48} className="text-primary" fill="#0D6EFD" />
                </div>
                <h4 className="fw-bold mb-3">Ulasan Anda Telah Terkirim</h4>
                <p className="lead mb-4">{message}</p>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 py-2"
                  onClick={() => setShowModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Script Tambahan */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />

      <style jsx global>{`
        .navbar {
          z-index: 1000 !important;
        }
        body.modal-open {
          overflow: hidden;
          padding-right: 0 !important;
        }

        .nav-pills .nav-link.active {
          background-color: #0d6efd !important;
          color: white !important;
        }

        .nav-pills .nav-link {
          color: #495057;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .btn-primary {
          background-color: #0d6efd;
          border-color: #0d6efd;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #0b5ed7;
          border-color: #0a58ca;
          transform: translateY(-2px);
        }

        .hero-section {
          overflow: hidden;
        }

        .section-padding {
          padding: 5rem 0;
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 50vh;
          }

          .section-padding {
            padding: 3rem 0;
          }
        }
      `}</style>
    </div>
  );
}
