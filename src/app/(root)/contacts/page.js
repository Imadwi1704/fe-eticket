"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Footer from "@/components/Footer";
import { getCookie } from "cookies-next";

export default function Review() {
  const [review, setReview] = useState({
    score: "",
    comment: "",
    userId: "",
  });
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State untuk modal
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
      console.log("Review fetched:", result);

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
        setShowModal(true); // Tampilkan modal
        fetchReviews();
      } else {
        alert(result.message || "Gagal menyimpan review");
      }
    } catch (error) {
      console.error("Error saat menyimpan review:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <>
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center"
        id="aboutnext"
        style={{
          height: "60vh",
          backgroundImage: "url('/assets/images/museum.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
            zIndex: 1,
          }}
        ></div>

        <div
          className="position-relative text-white text-center z-2"
          style={{ zIndex: 2 }}
        >
          <h1 className="fw-bold display-5">Contact & Review Museum Lampung</h1>
          <div
            style={{
              width: "80px",
              height: "5px",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              margin: "10px auto",
            }}
          ></div>
        </div>
      </section>

      <section className="section-padding" id="review">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-12 mx-auto">
              <form
                onSubmit={handleSubmit}
                className="shadow p-5 rounded"
                style={{ backgroundColor: "#F8F4E1", borderRadius: "20px" }}
              >
                <input type="hidden" name="userId" value={review.userId} />
                <p className="mb-4" style={{ color: "#444" }}>
                  Silahkan kirimkan saran dan masukan Anda setelah berkunjung di
                  Museum Lampung
                </p>

                <div className="mb-3">
                  <label className="form-label">Rating (1–5):</label>
                  <input
                    type="number"
                    name="score"
                    value={review.score}
                    onChange={handleChange}
                    className="form-control rounded"
                    placeholder="Contoh: 5"
                    min="1"
                    max="5"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Saran dan Masukan:</label>
                  <textarea
                    name="comment"
                    className="form-control rounded"
                    value={review.comment}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tulis saran dan masukan Anda di sini..."
                    required
                  />
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 mt-2 rounded-0"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Sukses */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Terima Kasih!</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{message}</p>
                </div>
                <div className="modal-footer">
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
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          ></div>
        </>
      )}

      {/* Google Maps */}
      <section className="section-padding">
        <div className="container">
          <div className="ratio ratio-16x9">
            <iframe
              className="google-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.292852728222!2d105.23834287498384!3d-5.372234694606639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40dab5d8b8ddfb%3A0xb2235987d49dad2f!2sMuseum%20Lampung!5e0!3m2!1sid!2sid!4v1742337921781!5m2!1sid!2sid"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />

      {/* Script Tambahan */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}
