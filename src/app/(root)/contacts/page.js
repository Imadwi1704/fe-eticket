"use client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import page from "@/config/page";
import {
  FiClock,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiStar,
  FiSend,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import Footer from "@/components/Footer";

export default function Review() {
  const [review, setReview] = useState({
    score: "",
    comment: "",
    userId: "",
  });
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = getCookie("token");

  // Get user ID from token if exists
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

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Fetch reviews from API
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${page.baseUrl}/api/reviews`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result.success && result.data) {
        setReviewsData({
          reviews: result.data.reviews || [],
          averageRating: result.data.averageRating || 0,
          totalReviews: result.data.totalReviews || 0,
        });
      } else {
        throw new Error(result.message || "Invalid data format received");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Gagal memuat ulasan. Silakan coba lagi nanti.");
      setReviewsData({
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setReview((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  // Submit review to server
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

      const res = await fetch(`${page.baseUrl}/api/reviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan review");
      }

      setMessage("Terima kasih telah memberikan penilaian!");
      setReview({ score: "", comment: "", userId: review.userId });
      setShowModal(true);
      fetchReviews(); // Refresh reviews after submission
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  // Render star rating component
  const renderStars = (score) => {
    return (
      <div className="d-flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={i < score ? "text-warning" : "text-secondary"}
            fill={i < score ? "#ffc107" : "transparent"}
          />
        ))}
      </div>
    );
  };

  // Museum information data
  const museumInfo = [
    {
      icon: <FiClock className="text-primary" />,
      label: "Jam Operasional",
      value: "Selasa-Minggu: 08.00-16.00",
    },
    {
      icon: <FiMapPin className="text-primary" />,
      label: "Lokasi",
      value: "Jl. Z.A. Pagar Alam No.64, Bandar Lampung",
    },
    {
      icon: <FiPhone className="text-primary" />,
      label: "Kontak",
      value: "(0721) 703 621",
    },
    {
      icon: <FiCalendar className="text-primary" />,
      label: "Didirikan",
      value: "24 September 1988",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          height: "50vh",
          backgroundImage: "url('/assets/images/our2.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="container position-relative text-center text-white px-4">
          <h1 className="display-4 fw-bold mb-3">Kontak & Ulasan Museum</h1>
          <p
            className="lead mb-0 mx-auto text-white"
            style={{ maxWidth: "600px" }}
          >
            Berikan ulasan Anda dan temukan informasi kontak Museum Negeri Ruwa
            Jurai
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Museum Info Card */}
            <div className="col-lg-5">
              <div className=" h-100">
                <div className="card-body p-4">
                  <h5 className="text-primary mb-4 fw-bold">
                    Informasi Museum
                  </h5>
                  <div className="list-group list-group">
                    {museumInfo.map((item, i) => (
                      <div
                        key={i}
                        className="list-group-item border-0 px-0 py-3"
                      >
                        <div className="d-flex">
                          <div className="me-3">{item.icon}</div>
                          <div>
                            <small className="text-muted">{item.label}</small>
                            <p className="mb-0 fw-medium">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="col-lg-7">
              <div className="card  h-100 ">
                <div
                  className="card-body p-4 p-md-5"
                  style={{ backgroundColor: "#0D6EFD1A" }}
                >
                  <div className="text-center mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                      <FiStar size={28} className="text-primary" />
                    </div>
                    <h3 className="h4 fw-bold">Beri Ulasan Anda</h3>
                    <p className="text-dark mb-0">
                      Bagikan pengalaman Anda mengunjungi Museum Lampung
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="mx-auto"
                    style={{ maxWidth: "600px" }}
                  >
                    <div className="mb-4">
                      <label className="form-label fw-medium">Rating</label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="btn p-0 me-1"
                              onClick={() =>
                                setReview({ ...review, score: star.toString() })
                              }
                              aria-label={`Rate ${star} star`}
                            >
                              <FiStar
                                size={28}
                                className={
                                  star <= (review.score || 0)
                                    ? "text-warning"
                                    : "text-secondary"
                                }
                                fill={
                                  star <= (review.score || 0)
                                    ? "#ffc107"
                                    : "transparent"
                                }
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-primary fw-medium">
                          {review.score
                            ? `${review.score} bintang`
                            : "Pilih rating"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-medium">
                        Ulasan Anda
                      </label>
                      <textarea
                        name="comment"
                        value={review.comment}
                        onChange={handleChange}
                        className="form-control"
                        rows={5}
                        placeholder="Ceritakan pengalaman Anda mengunjungi museum..."
                        required
                        style={{ resize: "none" }}
                      />
                    </div>

                    <div className="text-center mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary px-4 py-2 fw-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <FiSend className="me-2" />
                            Kirim Ulasan
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h2 className="fw-bold">Ulasan Pengunjung</h2>
                <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                  <div className="d-flex align-items-center">
                    {renderStars(reviewsData.averageRating)}
                    <span className="ms-2 fw-medium">
                      {reviewsData.averageRating.toFixed(1)} (
                      {reviewsData.totalReviews} ulasan)
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                  <button
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={fetchReviews}
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Memuat...</span>
                  </div>
                  <p className="mt-2">Memuat ulasan...</p>
                </div>
              ) : reviewsData.reviews.length > 0 ? (
                <div className="row g-4">
                  {reviewsData.reviews.map((item, i) => (
                    <div className="col-md-5" key={i}>
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <FiUser className="text-primary" />
                              </div>
                              <h6 className="mb-0 fw-medium">
                                {item.user?.fullName || "Pengunjung"}
                              </h6>
                            </div>
                            <small className="text-muted">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="mb-3">{renderStars(item.score)}</div>
                          <p
                            className="mb-0"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {item.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                    <FiStar size={28} className="text-primary" />
                  </div>
                  <h4 className="fw-bold mb-2">Belum Ada Ulasan</h4>
                  <p className="text-muted">
                    Jadilah yang pertama memberikan ulasan!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-3">
        <div className="">
          <div className="row justify-content-center">
            <div className="col-lg-15">
              <div className="card ">
                <div className="card-body p-0">
                  <div className="ratio ratio-16x9">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.292852728222!2d105.23834287498384!3d-5.372234694606639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40dab5d8b8ddfb%3A0xb2235987d49dad2f!2sMuseum%20Lampung!5e0!3m2!1sid!2sid!4v1742337921781!5m2!1sid!2sid"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Peta Lokasi Museum Lampung"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
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

      {/* Custom Styles */}
      <style jsx global>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #0d6efd !important;
          color: #000000 !important;
          background-color: #ffffff !important;
        }
        .card {
          transition: all 0.3s ease;
          border-radius: 0.5rem;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        textarea.form-control {
          min-height: 120px;
        }
        .modal-content {
          border-radius: 0.5rem;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
