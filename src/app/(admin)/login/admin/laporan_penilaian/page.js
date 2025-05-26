"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";

export default function AdminPage() {
  const [reviews, setReviews] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewRes = await fetch("http://localhost:5001/api/reviews", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          },
        });

        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          console.log("Review data:", reviewData); // Debug

          const enrichedReviews =
            reviewData.data?.reviews?.map((review) => ({
              ...review,
              userName: review.user?.fullName || "Anonymous",
              date: new Date(review.createdAt).toLocaleDateString("id-ID"),
            })) || [];

          setReviews(enrichedReviews);
        } else {
          console.error("Gagal mengambil data review.");
        }
      } catch (error) {
        console.error("Gagal mengambil reviews:", error);
      }
    };

    if (token) {
      fetchReviews();
    } else {
      console.warn("Token tidak tersedia. Harap login ulang.");
    }
  }, [token]);

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="container">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title fw-semibold mb-4">
              Laporan Penilaian Museum Lampung
            </h3>

            <div className="table-responsive">
              <table className="table mb-0" style={{ boxShadow: "none" }}>
                <thead
                  className="fs-5"
                  style={{ backgroundColor: "rgba(116, 80, 45, 0.18)" }}
                >
                  <tr>
                    <th>No</th>
                    <th>Kode Review</th>
                    <th>Nama Pengunjung</th>
                    <th>Tanggal</th>
                    <th>Nilai</th>
                    <th>Saran dan Masukan</th>
                  </tr>
                </thead>

                <tbody>
                  {reviews.length > 0 ? (
                    reviews.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.userName}</td>
                        <td>{item.date}</td>
                        <td>{item.score}</td>
                        <td>{item.comment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        Tidak ada reviews tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tombol Cetak PDF */}
            <div className="mt-4 text-end">
              <a
                href={`/login/admin/reviews/cetak_pdf`}
                className="btn btn-success"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-file-earmark-arrow-down me-2"></i> Cetak PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
