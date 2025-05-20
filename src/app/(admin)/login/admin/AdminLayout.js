"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const token = getCookie("token");

  // Fetch review data
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
          const enrichedReviews = reviewData.data?.reviews?.map((review) => ({
            ...review,
            userName: review.user?.fullName || 'Anonymous',
            date: new Date(review.createdAt).toLocaleDateString('id-ID')
          })) || [];
          setReviews(enrichedReviews);
        }
      } catch (error) {
        console.error("Gagal mengambil data review:", error);
      }
    };

    if (token) fetchReviews();
  }, [token]);

  const isActive = (path) =>
    pathname === path
      ? "sidebar-item selected active-menu"
      : "sidebar-item";

  return (
    <>
      <div
        className="page-wrapper"
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
      >
        {/* Sidebar Start */}
        <aside className="left-sidebar" style={{ backgroundColor: "#714D29" }}>
          <div>
            <div className="brand-logo d-flex align-items-center justify-content-between">
              <a href="/login/admin/dashboard" className="text-nowrap logo-img">
                <h2 className="text-bold text-white">ERUWAIJUARAI</h2>
              </a>
              <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                <i className="ti ti-x fs-8"></i>
              </div>
            </div>

            <nav className="sidebar-nav scroll-sidebar" data-simplebar="init">
              <ul id="sidebarnav">
                <li className={isActive("/login/admin/dashboard")}>
                  <a className="sidebar-link" href="/login/admin/dashboard">
                    <i className="ti ti-layout-dashboard" />
                    <span className="hide-menu">Dashboard</span>
                  </a>
                </li>
                <li className={isActive("/login/admin/data_tiket")}>
                  <a className="sidebar-link" href="/login/admin/data_tiket">
                    <i className="ti ti-id" />
                    <span className="hide-menu">Data Tiket</span>
                  </a>
                </li>
                <li className={isActive("/login/admin/data_venues")}>
                  <a className="sidebar-link" href="/login/admin/data_venues">
                    <i className="ti ti-grid-dots" />
                    <span className="hide-menu">Data Koleksi</span>
                  </a>
                </li>
                <li className={isActive("/login/admin/data_user")}>
                  <a className="sidebar-link" href="/login/admin/data_user">
                     <i className="bi bi-people-fill me-2" />
                    <span className="hide-menu">Data User</span>
                  </a>
                </li>
                <li className={isActive("/login/admin/data_user")}>
                  <a className="sidebar-link" href="/login/admin/data_user">
                     <i className="bi bi-people-fill me-2" />
                    <span className="hide-menu">Data Kunjungan Pengunjung</span>
                  </a>
                </li>
                <li className={isActive("/login/admin/pemesanan")}>
                  <a className="sidebar-link" href="/login/admin/pemesanan">
                    <i className="ti ti-file-description" />
                    <span className="hide-menu">Data Pemesanan</span>
                  </a>
                </li>
                <li className={isActive("/login/admin/filter_laporan")}>
                  <a className="sidebar-link" href="/login/admin/filter_laporan">
                    <i className="ti ti-chart-bar" />
                    <span className="hide-menu">Laporan</span>
                  </a>
                </li>
                <li className={isActive("/login/admin/profile")}>
                  <a className="sidebar-link" href="/login/admin/profile">
                    <i className="ti ti-user" />
                    <span className="hide-menu">Profile</span>
                  </a>
                </li>
                <li className={isActive("/login")}>
                  <a className="sidebar-link" href="/login">
                    <i className="ti ti-logout" />
                    <span className="hide-menu">Logout</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        {/* Sidebar End */}

        {/* Main wrapper */}
        <div className="body-wrapper">
          {/* Header Start */}
          <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light">
              <ul className="navbar-nav align-items-center">
                <li className="nav-item d-block d-xl-none">
                  <button
                    className="btn sidebartoggler nav-icon-hover"
                    id="headerCollapse"
                    type="button"
                  >
                    <i className="ti ti-menu-2" />
                  </button>
                </li>

                {/* Notifikasi */}
                <li className="nav-item">
                  <button
                    className="btn position-relative"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="ti ti-bell-ringing" />
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </button>
                </li>
              </ul>

              <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
                <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                  <li className="nav-item">
                    <img
                      src="/assets/images/profile/user-1.jpg"
                      alt="Profile"
                      width={35}
                      height={35}
                      className="rounded-circle"
                    />
                  </li>
                </ul>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <div className="container-fluid" style={{ backgroundColor: "rgba(248, 244, 225, 1)" }}>
            {children}
          </div>
        </div>
      </div>

{/* Modal Notifikasi */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setShowModal(false);
            setSelectedReview(null);
          }}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header text-white">
                <h5 className="modal-title">
                  {selectedReview ? 'Detail Review' : 'Daftar Review Pengunjung'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                {selectedReview ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="fw-bold">Nama:</label>
                      <p>{selectedReview.user?.fullName}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Rating:</label>
                      <div className="text-warning">
                        {'★'.repeat(selectedReview.score)}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Tanggal:</label>
                      <p>{selectedReview.date}</p>
                    </div>
                    <div className="col-12">
                      <label className="fw-bold">Komentar:</label>
                      <p className="border p-3 rounded">{selectedReview.comment}</p>
                    </div>
                  </div>
                ) : (
                  <div className="list-group">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <button
                          key={review.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                          onClick={() => setSelectedReview(review)}
                        >
                          <div>
                            <span className="fw-bold">{review.user?.fullName}</span>
                            <br />
                            <small className="text-muted">{review.date}</small>
                          </div>
                          <span className="badge bg-primary rounded-pill">
                            {review.score}/5
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        Tidak ada review tersedia
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedReview && (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedReview(null)}
                  >
                    Kembali ke Daftar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}