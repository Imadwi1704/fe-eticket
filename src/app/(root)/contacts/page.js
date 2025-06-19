/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Footer from "@/components/Footer";
import { getCookie } from "cookies-next";
import page from "@/config/page";
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
      const res = await fetch(page.baseUrl + "/api/reviews", {
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

      const res = await fetch(page.baseUrl + "/api/reviews/create", {
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
      {/* Hero Section - Simplified */}
      <section
        className="hero-section d-flex align-items-center justify-content-center"
        style={{
          height: "50vh",
          backgroundImage: "url('/assets/images/our2.jpeg')",
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
        <div className="container text-center text-white px-3">
          <h1 className="display-5 fw-bold mb-3">
            Kontak & Ulasan Museum Lampung
          </h1>
          <p className="lead mb-0 mx-auto text-white" style={{ maxWidth: "600px" }}>
            Berikan ulasan Anda dan temukan informasi kontak untuk Museum Negeri
            Ruwa Jurai
          </p>
        </div>
      </section>

      {/* Review Section - More Compact */}
      <section className="py-5 bg-light" id="review">
        <div className="container">
          <div className="row g-4">
            {/* Museum Info Card */}
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="text-primary mb-4 fw-semibold text-center">
                    Informasi Museum
                  </h5>
                  {[
                    {
                      icon: <FiClock />,
                      label: "Jam Operasional",
                      value: "Selasa-Minggu: 08.00-16.00",
                    },
                    {
                      icon: <FiMapPin />,
                      label: "Lokasi",
                      value: "Jl. Z.A. Pagar Alam No.64, Bandar Lampung",
                    },
                    {
                      icon: <FiPhone />,
                      label: "Kontak",
                      value: "(0721) 703 621",
                    },
                    {
                      icon: <FiCalendar />,
                      label: "Didirikan",
                      value: "24 September 1988",
                    },
                  ].map((item, i) => (
                    <div key={i} className="d-flex mb-3">
                      <div className="me-3 text-primary">{item.icon}</div>
                      <div>
                        <div className="text-muted small mb-1">
                          {item.label}
                        </div>
                        <div className="fw-normal">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="col-lg-8">
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <h5 className="text-primary fw-semibold mb-3 text-center">
                  Beri Ulasan Anda
                </h5>
                <p className="text-center text-muted mb-4">
                  Kirimkan saran dan masukan Anda setelah berkunjung ke Museum
                  Lampung.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mx-auto"
                  style={{ maxWidth: "600px" }}
                >
                  <div className="mb-3">
                    <label className="form-label">Rating (1-5)</label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="number"
                        name="score"
                        value={review.score}
                        onChange={handleChange}
                        className="form-control w-auto"
                        min="1"
                        max="5"
                        required
                        style={{ width: "70px" }}
                      />
                      <div>{renderStars(parseInt(review.score || 0))}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Saran dan Masukan</label>
                    <textarea
                      name="comment"
                      value={review.comment}
                      onChange={handleChange}
                      className="form-control"
                      rows={3}
                      placeholder="Tulis komentar Anda..."
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary px-4">
                      Kirim Ulasan <FiSend className="ms-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      {activeTab !== "review" && (
        <section className="py-5 bg-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="p-4">
                  <h5 className="text-primary fw-bold text-center mb-4">
                    Ulasan Pengunjung
                  </h5>
                  {list.length > 0 ? (
                    <div className="row g-3">
                      {list.map((item, i) => (
                        <div className="col-md-6" key={i}>
                          <div className="p-3 border-start border-3 border-primary bg-light rounded h-100">
                            <div className="d-flex justify-content-between">
                              <h6 className="text-primary mb-1">
                                {item.user?.name || "Pengunjung"}
                              </h6>
                              <small className="text-muted">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <div className="mb-2">
                              {renderStars(item.score)}
                            </div>
                            <p className="mb-0 text-muted">{item.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <FiStar size={36} className="text-primary mb-3" />
                      <h6 className="fw-bold mb-2">Belum Ada Ulasan</h6>
                      <p className="text-muted">
                        Jadilah yang pertama memberikan ulasan!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Google Maps - Simplified */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-header bg-primary text-white py-3">
                  <h3 className="h5 mb-0 text-center text white">
                    Lokasi Museum Lampung
                  </h3>
                </div>
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.292852728222!2d105.23834287498384!3d-5.372234694606639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40dab5d8b8ddfb%3A0xb2235987d49dad2f!2sMuseum%20Lampung!5e0!3m2!1sid!2sid!4v1742337921781!5m2!1sid!2sid"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Peta Lokasi Museum Lampung"
                  />
                </div>
                <div className="p-3 bg-white border-top">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                    <div className="text-center text-md-start">
                      <h5 className="h6 fw-bold mb-1">
                        Museum Negeri Provinsi Lampung Ruwa Jurai
                      </h5>
                      <p className="text-muted mb-0">
                        Jl. Z.A. Pagar Alam No.64, Bandar Lampung
                      </p>
                    </div>
                    <a
                      href="https://goo.gl/maps/2XqJv9QcXyQ2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <FiMapPin className="me-1" /> Petunjuk Arah
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal - Simplified */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Terima Kasih!</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <FiStar size={32} className="text-primary" />
                </div>
                <h4 className="h5 fw-bold mb-3">Ulasan Anda Telah Terkirim</h4>
                <p className="mb-4">{message}</p>
                <button
                  type="button"
                  className="btn btn-primary"
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

      {/* Global Styles */}
      <style jsx global>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }

        .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .form-control:focus {
          background-color: #fff !important;
          color: #000 !important;
          border-color: #86b7fe !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
        }

        .btn-primary {
          background-color: #0d6efd;
          border-color: #0d6efd;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background-color: #0b5ed7;
          transform: translateY(-2px);
        }

        textarea.form-control {
          min-height: 120px;
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}
