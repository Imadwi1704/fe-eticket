"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";
import page from "@/config/page";
import {
  FiStar,
  FiUser,
  FiCalendar,
  FiFileText,
  FiDownload,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
} from "react-icons/fi";

export default function AdminPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [scoreFilter, setScoreFilter] = useState("all");
  const token = getCookie("token");

  // Fetch reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const reviewRes = await fetch(page.baseUrl + "/api/reviews", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!reviewRes.ok) {
          throw new Error("Gagal mengambil data review");
        }

        const reviewData = await reviewRes.json();

        const enrichedReviews =
          reviewData.data?.reviews?.map((review) => ({
            ...review,
            userName: review.user?.fullName || "Anonymous",
            date: new Date(review.createdAt),
            formattedDate: new Date(review.createdAt).toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            ),
          })) || [];

        setReviews(enrichedReviews);
        setFilteredReviews(enrichedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReviews();
    }
  }, [token]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...reviews];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (review) =>
          review.userName.toLowerCase().includes(term) ||
          review.comment?.toLowerCase().includes(term) ||
          review.id?.toString().includes(term)
      );
    }

    // Apply score filter
    if (scoreFilter !== "all") {
      result = result.filter(
        (review) => review.score.toString() === scoreFilter
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredReviews(result);
  }, [reviews, searchTerm, scoreFilter, sortConfig]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Render star rating
  const renderStars = (score) => {
    return (
      <div className="d-flex">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={i < score ? "text-warning" : "text-muted"}
            fill={i < score ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  // Refresh data
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    const reviewRes = fetch(page.baseUrl + "/api/reviews", {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (reviewRes.ok) {
      const reviewData = reviewRes.json();
      const enrichedReviews =
        reviewData.data?.reviews?.map((review) => ({
          ...review,
          userName: review.user?.fullName || "Anonymous",
          date: new Date(review.createdAt),
          formattedDate: new Date(review.createdAt).toLocaleDateString(
            "id-ID",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          ),
        })) || [];

      setReviews(enrichedReviews);
    } else {
      setError("Gagal memuat ulang data");
    }
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    try {
      const token = getCookie("token"); 
      const response = await fetch(
        `${page.baseUrl}/api/reviews/ReviewPDF?token=${token}`, 
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengunduh laporan");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laporan-review-museum.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengunduh laporan: " + error.message);
    }
  };

  return (
    <>
      <Template />
      <div className="container-fluid py-4">
        <div className="card shadow-sm border-0 overflow-hidden">
          {/* Card Header */}
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center mt-5">
            <h2 className="card-title fw-semibold text-white mb-0">
              <FiFileText className="me-2" /> Laporan Penilaian Museum Lampung
            </h2>
            <div>
              <button
                onClick={handleRefresh}
                className="btn btn-sm btn-outline-light me-2"
                disabled={loading}
              >
                <FiRefreshCw className={loading ? "spin" : ""} />
                {loading ? "Memuat..." : "Refresh"}
              </button>
              <button onClick={handleDownloadPDF} className="btn btn-success">
                <FiDownload className="me-1" /> Cetak PDF
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="card-body p-4">
            {/* Search and Filter Bar */}
            <div className="row mb-4 g-3">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text">
                    <FiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari berdasarkan nama, komentar, atau ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FiFilter className="me-2" />
                  Filter {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="col-12 mt-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="mb-3">Filter Lanjutan</h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Filter Nilai</label>
                          <select
                            className="form-select"
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                          >
                            <option value="all">Semua Nilai</option>
                            <option value="1">1 Bintang</option>
                            <option value="2">2 Bintang</option>
                            <option value="3">3 Bintang</option>
                            <option value="4">4 Bintang</option>
                            <option value="5">5 Bintang</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">
                            Urutkan Berdasarkan
                          </label>
                          <select
                            className="form-select"
                            value={sortConfig.key}
                            onChange={(e) =>
                              setSortConfig({
                                ...sortConfig,
                                key: e.target.value,
                              })
                            }
                          >
                            <option value="date">Tanggal</option>
                            <option value="score">Nilai</option>
                            <option value="userName">Nama Pengunjung</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Arah Urutan</label>
                          <select
                            className="form-select"
                            value={sortConfig.direction}
                            onChange={(e) =>
                              setSortConfig({
                                ...sortConfig,
                                direction: e.target.value,
                              })
                            }
                          >
                            <option value="desc">Terbaru/Tertinggi</option>
                            <option value="asc">Terlama/Terendah</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Memuat data penilaian...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <FiAlertCircle className="me-2" size={20} />
                <div>{error}</div>
              </div>
            )}

            {/* Data Table */}
            {!loading && !error && (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>No</th>
                      <th
                        onClick={() => requestSort("id")}
                        style={{ cursor: "pointer" }}
                      >
                        Kode Review
                        {sortConfig.key === "id" && (
                          <span className="ms-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        onClick={() => requestSort("userName")}
                        style={{ cursor: "pointer" }}
                      >
                        Nama Pengunjung
                        {sortConfig.key === "userName" && (
                          <span className="ms-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        onClick={() => requestSort("date")}
                        style={{ cursor: "pointer" }}
                      >
                        Tanggal
                        {sortConfig.key === "date" && (
                          <span className="ms-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        onClick={() => requestSort("score")}
                        style={{ cursor: "pointer" }}
                      >
                        Nilai
                        {sortConfig.key === "score" && (
                          <span className="ms-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th>Saran dan Masukan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review, index) => (
                        <tr key={review.id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {review.id || "-"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FiUser className="me-2 text-primary" />
                              {review.userName}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FiCalendar className="me-2 text-primary" />
                              {review.formattedDate}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {renderStars(review.score)}
                              <span className="ms-2 fw-bold">
                                {review.score}
                              </span>
                            </div>
                          </td>
                          <td
                            className="text-wrap"
                            style={{ maxWidth: "300px" }}
                          >
                            {review.comment || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="alert alert-warning mb-0">
                            Tidak ada data yang sesuai dengan filter
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination and Summary */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Menampilkan {filteredReviews.length} dari {reviews.length}{" "}
                penilaian
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary" disabled>
                  Sebelumnya
                </button>
                <button className="btn btn-outline-primary" disabled>
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
        .table thead th {
          border-bottom-width: 1px;
          font-weight: 600;
        }
        .card-header {
          border-bottom: none;
        }
      `}</style>
    </>
  );
}
