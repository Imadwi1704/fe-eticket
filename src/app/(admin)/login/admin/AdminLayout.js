"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import Image from "next/image";
import page from "@/config/page";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const token = getCookie("token");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [readReviews, setReadReviews] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const modalRef = useRef(null);

  // Handle click outside sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (window.innerWidth < 992) {
          setIsSidebarOpen(false);
        }
      }
      if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setSelectedReview(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // Fetch reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewRes = await fetch(page.baseUrl + "/api/reviews", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          const enrichedReviews =
            reviewData.data?.reviews?.map((review) => ({
              ...review,
              userName: review.user?.fullName || "Anonymous",
              date: new Date(review.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            })) || [];
          setReviews(enrichedReviews);
        }
      } catch (error) {
        console.error("Gagal mengambil data review:", error);
      }
    };

    if (token) fetchReviews();
  }, [token]);

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/login");
  };

  const isActive = (path) =>
    pathname === path ? "sidebar-item active" : "sidebar-item";

  const renderSidebarItem = (href, iconClass, text) => (
    <li className={isActive(href)}>
      <a className="sidebar-link" href={href}>
        <i className={iconClass} />
        <span className="hide-menu">{text}</span>
      </a>
    </li>
  );

  const renderDropdown = (key, iconClass, title, children) => (
    <li className={`sidebar-item ${activeDropdown === key ? "open" : ""}`}>
      <a
        href="#"
        className="sidebar-link d-flex align-items-center"
        onClick={(e) => {
          e.preventDefault();
          setActiveDropdown(activeDropdown === key ? null : key);
        }}
      >
        <i className={iconClass} />
        <span className="hide-menu flex-grow-1">{title}</span>
        <i
          className={`bi ${
            activeDropdown === key ? "bi-chevron-up" : "bi-chevron-down"
          } ms-auto`}
        />
      </a>
      {activeDropdown === key && (
        <ul className="sidebar-dropdown ps-4">{children}</ul>
      )}
    </li>
  );

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: #0d6efd;
          --primary-light: #e7f1ff;
          --primary-dark: #0b5ed7;
          --sidebar-bg: #0d6efd;
          --sidebar-text: #ffffff;
          --sidebar-hover: rgba(255, 255, 255, 0.1);
          --sidebar-active: rgba(255, 255, 255, 0.2);
          --bs-body-font-family: "Poppins", sans-serif;
        }

        body {
          overflow-x: hidden;
        }

        .left-sidebar {
          background-color: var(--sidebar-bg) !important;
          color: var(--sidebar-text);
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          z-index: 1000;
          transform: translateX(-260px);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .left-sidebar.show-sidebar {
          transform: translateX(0);
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar-nav .sidebar-item .sidebar-link {
          color: var(--sidebar-text);
          transition: background-color 0.2s ease;
        }

        .sidebar-nav .sidebar-item:hover {
          background-color: var(--sidebar-hover);
        }

        .sidebar-nav .sidebar-item.active {
          background-color: var(--sidebar-active);
          border-left: 3px solid white;
        }

        .sidebar-dropdown {
          background-color: rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .sidebar-subitem .sidebar-link {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        .sidebar-subitem:hover {
          background-color: var(--sidebar-hover);
        }

        .brand-logo {
          background-color: var(--primary-dark);
          padding: 15px;
        }

        .btn-primary {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background-color: var(--primary-dark);
          border-color: var(--primary-dark);
        }

        .bg-primary {
          background-color: var(--primary-color) !important;
        }

        .text-primary {
          color: var(--primary-color) !important;
        }

        .badge.bg-primary {
          background-color: var(--primary-color) !important;
        }

        .modal-header {
          background-color: var(--primary-color) !important;
          color: white;
        }

        .navbar {
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 800;
        }

        .dropdown-menu {
          border: 1px solid var(--primary-light);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
        }

        .dropdown-item:hover {
          background-color: var(--primary-light);
        }

        .list-group-item {
          transition: all 0.2s ease;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          opacity: 1;
        }

        .modal-content {
          background: white !important;
          border: none !important;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }

        @media (min-width: 992px) {
          .left-sidebar {
            transform: translateX(0);
            position: relative;
          }
          
          .body-wrapper {
            margin-left: 260px;
          }
        }
      `}</style>

      <div
        className="page-wrapper"
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
      >
        <aside
          ref={sidebarRef}
          className={`left-sidebar ${isSidebarOpen ? "show-sidebar" : ""}`}
        >
          <div>
            <div className="brand-logo d-flex align-items-center justify-content-between">
              <a href="/login/admin/dashboard" className="text-nowrap logo-img">
                <h2 className="text-bold text-white">ERUWAIJUARAI</h2>
              </a>
              <div
                className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className="ti ti-x fs-8"></i>
              </div>
            </div>

            <nav className="sidebar-nav scroll-sidebar" data-simplebar="init">
              <ul id="sidebarnav">
                {renderSidebarItem(
                  "/login/admin/dashboard",
                  "ti ti-layout-dashboard",
                  "Dashboard"
                )}
                {renderSidebarItem(
                  "/login/admin/data_tiket",
                  "ti ti-id",
                  "Data Tiket"
                )}
                {renderSidebarItem(
                  "/login/admin/data_venues",
                  "ti ti-grid-dots",
                  "Data Koleksi"
                )}
                {renderSidebarItem(
                  "/login/admin/data_gallery",
                  "ti ti-photo",
                  "Data Gallery"
                )}
                {renderSidebarItem(
                  "/login/admin/data_user",
                  "bi bi-people-fill me-2",
                  "Data User"
                )}
                {renderSidebarItem(
                  "/login/admin/data_kunjungan",
                  "bi bi-people-fill me-2",
                  "Data Kunjungan"
                )}
                {renderSidebarItem(
                  "/login/admin/data_pembayaran",
                  "bi bi-receipt",
                  "Data Pembayaran"
                )}
                {renderSidebarItem(
                  "/login/admin/pemesanan",
                  "ti ti-file-description",
                  "Data Pemesanan"
                )}

                {renderDropdown(
                  "laporan",
                  "bi bi-clipboard2-data-fill me-2",
                  "Laporan",
                  <>
                    <li className="sidebar-subitem">
                      <a
                        href="/login/admin/laporan_penilaian"
                        className="sidebar-link d-block py-2 ps-3"
                      >
                        <i className="bi bi-star-fill me-2"></i>
                        Penilaian Museum Lampung
                      </a>
                    </li>
                    <li className="sidebar-subitem">
                      <a
                        href="/login/admin/reports"
                        className="sidebar-link d-block py-2 ps-4"
                      >
                        <i className="bi bi-receipt-cutoff me-2"></i>
                        Pemesanan
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </aside>

        <div className="body-wrapper">
          <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light">
              <div className="d-flex align-items-center w-100">
                <button
                  className="btn sidebartoggler nav-icon me-3 d-block d-lg-none"
                  id="headerCollapse"
                  type="button"
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  aria-label="Toggle sidebar"
                >
                  <i className="ti ti-menu-2" />
                </button>

                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center">
                    <button
                      className="btn position-relative"
                      type="button"
                      onClick={() => setShowModal(true)}
                      style={{ color: "var(--primary-color)" }}
                      aria-label="Show notifications"
                    >
                      <i className="ti ti-bell-ringing fs-5" />
                      {reviews.length > 0 &&
                        reviews.filter((r) => !readReviews.includes(r.id))
                          .length > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {
                              reviews.filter((r) => !readReviews.includes(r.id))
                                .length
                            }
                            <span className="visually-hidden">
                              unread notifications
                            </span>
                          </span>
                        )}
                    </button>
                  </div>

                  <div className="dropdown d-flex align-items-center">
                    <button
                      className="btn dropdown-toggle d-flex align-items-center border-0 bg-transparent"
                      type="button"
                      id="profileDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      aria-label="User profile"
                    >
                      <Image
                        src="/assets/images/profile/user-1.jpg"
                        alt="Foto Profil Admin"
                        width={40}
                        height={40}
                        className="rounded-circle border border-2 border-primary"
                        priority
                      />
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end mt-2 shadow"
                      aria-labelledby="profileDropdown"
                    >
                      <li>
                        <a
                          className="dropdown-item d-flex align-items-center"
                          href="/login/admin/profile"
                        >
                          <i className="ti ti-user me-2 text-primary"></i>{" "}
                          Profile
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={handleLogout}
                        >
                          <i className="ti ti-logout me-2 text-primary"></i>{" "}
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
          </header>

          <div className="container-fluid p-0">{children}</div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" />
          <div
            ref={modalRef}
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white py-3 px-4">
                  <h5 className="modal-title fw-bold text-white">
                    {selectedReview
                      ? "Detail Review"
                      : "Daftar Review Pengunjung"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedReview(null);
                    }}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body p-4">
                  {selectedReview ? (
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="fw-semibold text-secondary">
                          Nama:
                        </label>
                        <p className="mb-0">{selectedReview.userName}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-semibold text-secondary">
                          Rating:
                        </label>
                        <div className="text-warning fs-5">
                          {"★".repeat(selectedReview.score)}
                          {"☆".repeat(5 - selectedReview.score)}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-semibold text-secondary">
                          Tanggal:
                        </label>
                        <p className="mb-0">{selectedReview.date}</p>
                      </div>
                      <div className="col-12">
                        <label className="fw-semibold text-secondary">
                          Komentar:
                        </label>
                        <div className="border rounded p-3 bg-light">
                          <p className="mb-0 text-dark">
                            {selectedReview.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="list-group">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <button
                            key={review.id}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-3 mb-2 shadow-sm ${
                              readReviews.includes(review.id) ? "text-muted" : ""
                            }`}
                            onClick={() => {
                              setSelectedReview(review);
                              setReadReviews((prev) => [
                                ...new Set([...prev, review.id]),
                              ]);
                            }}
                            style={{
                              backgroundColor: readReviews.includes(review.id)
                                ? "#f8f9fa"
                                : "var(--primary-light)",
                              cursor: "pointer",
                            }}
                          >
                            <div>
                              <span
                                className={`fw-bold ${
                                  readReviews.includes(review.id)
                                    ? "text-dark"
                                    : "text-primary"
                                }`}
                              >
                                {review.userName}
                              </span>
                              <br />
                              <small
                                className={`${
                                  readReviews.includes(review.id)
                                    ? "text-dark"
                                    : "text-secondary"
                                }`}
                              >
                                {review.date}
                              </small>
                            </div>
                            <span
                              className={`badge rounded-pill ${
                                readReviews.includes(review.id)
                                  ? "bg-secondary"
                                  : "bg-primary"
                              }`}
                            >
                              {review.score}/5
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted">
                          Tidak ada review tersedia
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedReview && (
                  <div className="modal-footer bg-light border-0 px-4 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-pill px-4"
                      onClick={() => setSelectedReview(null)}
                    >
                      ← Kembali ke Daftar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}