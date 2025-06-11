"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import Image from "next/image";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const token = getCookie("token");

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
        const res = await fetch("http://localhost:5001/api/reviews", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (res.ok) {
          const data = await res.json();
          const enriched =
            data.data?.reviews?.map((review) => ({
              ...review,
              userName: review.user?.fullName || "Anonymous",
              date: new Date(review.createdAt).toLocaleDateString("id-ID"),
            })) || [];
          setReviews(enriched);
        }
      } catch (err) {
        console.error("Gagal mengambil data review:", err);
      }
    };

    if (token) fetchReviews();
  }, [token]);

  const isActive = (path) => (pathname === path ? "sidebar-item active" : "sidebar-item");

  const renderSidebarItem = (href, iconClass, text) => (
    <li className={isActive(href)}>
      <a href={href} className="sidebar-link d-flex align-items-center">
        <i className={iconClass}></i>
        <span className="hide-menu flex-grow-1">{text}</span>
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
        <i className={iconClass}></i>
        <span className="hide-menu flex-grow-1">{title}</span>
        <i className={`bi ${activeDropdown === key ? "bi-chevron-up" : "bi-chevron-down"} ms-auto`}></i>
      </a>
      {activeDropdown === key && <ul className="sidebar-dropdown ps-4">{children}</ul>}
    </li>
  );

  return (
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
      <aside className="left-sidebar">
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
              {renderSidebarItem("/login/admin/data_gallery", "ti ti-photo", "Data Gallery")}
              {renderSidebarItem("/login/admin/data_user", "bi bi-people-fill me-2", "Data User")}
              {renderDropdown(
                "kunjungan",
                "bi bi-ticket-detailed-fill me-2",
                "Data Status Kunjungan",
                tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <li key={ticket.id} className="sidebar-subitem">
                      <a href={`/login/admin/data_kunjungan/${ticket.id}`} className="sidebar-link d-block py-2 ps-3">
                        <i className="bi bi-tag-fill me-2"></i>{ticket.type}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="sidebar-subitem">
                    <span className="text-muted small">Tidak ada tiket</span>
                  </li>
                )
              )}
              {renderSidebarItem("/login/admin/data_pembayaran", "bi bi-receipt", "Data Pembayaran")}
              {renderSidebarItem("/login/admin/pemesanan", "ti ti-file-description", "Data Pemesanan")}
              {renderDropdown(
                "laporan",
                "bi bi-clipboard2-data-fill me-2",
                "Laporan",
                <>
                  <li className="sidebar-subitem">
                    <a href="/login/admin/laporan_penilaian" className="sidebar-link d-block py-2 ps-3">
                      <i className="bi bi-star-fill me-2"></i>Penilaian Museum Lampung
                    </a>
                  </li>
                  <li className="sidebar-subitem">
                    <a href="/login/admin/filter_laporan" className="sidebar-link d-block py-2 ps-4">
                      <i className="bi bi-receipt-cutoff me-2"></i>Pemesanan
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
              <button className="btn sidebartoggler nav-icon me-3 d-block d-lg-none" id="headerCollapse" type="button">
                <i className="ti ti-menu-2"></i>
              </button>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center">
                  <button className="btn position-relative" type="button" onClick={() => setShowModal(true)} style={{ color: "var(--primary-color)" }}>
                    <i className="ti ti-bell-ringing fs-5"></i>
                    {reviews.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{reviews.length}</span>}
                  </button>
                </div>
                <div className="dropdown d-flex align-items-center">
                  <button className="btn dropdown-toggle d-flex align-items-center border-0 bg-transparent" type="button" data-bs-toggle="dropdown">
                    <Image src="/assets/images/profile/user-1.jpg" alt="Foto Profil Admin" width={40} height={40} className="rounded-circle border border-2 border-primary" />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end mt-2 shadow">
                    <li><a className="dropdown-item d-flex align-items-center" href="/login/admin/profile"><i className="ti ti-user me-2 text-primary"></i> Profile</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item d-flex align-items-center" href="/login"><i className="ti ti-logout me-2 text-primary"></i> Logout</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div className="container-fluid p-0">{children}</div>
      </div>
    </div>
  );
}
