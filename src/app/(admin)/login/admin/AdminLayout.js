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
  const [tickets, setTickets] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/ticket");
        const data = await res.json();
        if (res.ok) {
          setTickets(data);
        } else {
          console.error("Gagal ambil tiket:", data.message);
        }
      } catch (err) {
        console.error("Error fetch tiket:", err);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewRes = await fetch("http://localhost:5001/api/reviews", {
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
              date: new Date(review.createdAt).toLocaleDateString("id-ID"),
            })) || [];
          setReviews(enrichedReviews);
        }
      } catch (error) {
        console.error("Gagal mengambil data review:", error);
      }
    };

    if (token) fetchReviews();
  }, [token]);

  const isActive = (path) => pathname === path ? "sidebar-item active" : "sidebar-item";

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
        <i className={`bi ${activeDropdown === key ? "bi-chevron-up" : "bi-chevron-down"} ms-auto`} />
      </a>
      {activeDropdown === key && <ul className="sidebar-dropdown ps-4">{children}</ul>}
    </li>
  );

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
        <aside className="left-sidebar" style={{ backgroundColor: "#714D29" }}>
          <div>
            <div className="brand-logo d-flex align-items-center justify-content-between">
              <a href="/login/admin/dashboard" className="text-nowrap logo-img">
                <h2 className="text-bold text-white">ERUWAIJUARAI</h2>
              </a>
              <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer">
                <i className="ti ti-x fs-8"></i>
              </div>
            </div>

            <nav className="sidebar-nav scroll-sidebar" data-simplebar="init">
              <ul id="sidebarnav">
                {renderSidebarItem("/login/admin/dashboard", "ti ti-layout-dashboard", "Dashboard")}
                {renderSidebarItem("/login/admin/data_tiket", "ti ti-id", "Data Tiket")}
                {renderSidebarItem("/login/admin/data_venues", "ti ti-grid-dots", "Data Koleksi")}
                {renderSidebarItem("/login/admin/data_user", "bi bi-people-fill me-2", "Data User")}

                {renderDropdown(
                  "kunjungan",
                  "bi bi-ticket-detailed-fill me-2",
                  "Data Status Kunjungan",
                  tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <li key={ticket.id} className="sidebar-subitem">
                        <a
                          href={`/login/admin/data_kunjungan/${ticket.id}`}
                          className="sidebar-link d-block py-2 ps-3"
                        >
                          <i className="bi bi-tag-fill me-2"></i>
                          {ticket.type}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="sidebar-subitem">
                      <span className="text-muted small">Tidak ada tiket</span>
                    </li>
                  )
                )}

                {renderSidebarItem("/login/admin/data_pembayaran", "bi bi-people-fill me-2", "Data Pembayaran")}
                {renderSidebarItem("/login/admin/pemesanan", "ti ti-file-description", "Data Pemesanan")}

                {renderDropdown(
                  "laporan",
                  "bi bi-clipboard2-data-fill me-2",
                  "Laporan",
                  <>
                    <li className="sidebar-subitem">
                      <a href="/login/admin/laporan_penilaian" className="sidebar-link d-block py-2 ps-3">
                        <i className="bi bi-star-fill me-2"></i>
                        Penilaian Museum Lampung
                      </a>
                    </li>
                    <li className="sidebar-subitem">
                      <a href="/login/admin/filter_laporan" className="sidebar-link d-block py-2 ps-4">
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
                <button className="btn sidebartoggler nav-icon me-3" id="headerCollapse" type="button">
                  <i className="ti ti-menu-2" />
                </button>

                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center">
                    <button className="btn position-relative" type="button" onClick={() => setShowModal(true)}>
                      <i className="ti ti-bell-ringing fs-5" />
                      {reviews.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {reviews.length}
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
                    >
                      <img
                        src="/assets/images/profile/user-1.jpg"
                        alt="Foto Profil Admin"
                        width={40}
                        height={40}
                        className="rounded-circle border border-2 border-white"
                      />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end mt-2 shadow" aria-labelledby="profileDropdown">
                      <li>
                        <a className="dropdown-item d-flex align-items-center" href="/login/admin/profile">
                          <i className="ti ti-user me-2"></i> Profile
                        </a>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <a className="dropdown-item d-flex align-items-center" href="/login">
                          <i className="ti ti-logout me-2"></i> Logout
                        </a>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </nav>
          </header>

          <div className="container-fluid p-4" style={{ backgroundColor: "rgba(248, 244, 225, 1)", minHeight: "calc(100vh - 80px)" }}>
            {children}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-white">
                <h5 className="modal-title">
                  {selectedReview ? "Detail Review" : "Daftar Review Pengunjung"}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setSelectedReview(null); }} />
              </div>

              <div className="modal-body p-4">
                {selectedReview ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="fw-bold">Nama:</label>
                      <p>{selectedReview.user?.fullName}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Rating:</label>
                      <div className="text-warning">{'★'.repeat(selectedReview.score)}</div>
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
                            <span className="fw-bold">{review.user?.fullName}</span><br />
                            <small className="text-muted">{review.date}</small>
                          </div>
                          <span className="badge bg-primary rounded-pill">{review.score}/5</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-4">Tidak ada review tersedia</div>
                    )}
                  </div>
                )}
              </div>

              {selectedReview && (
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedReview(null)}>
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