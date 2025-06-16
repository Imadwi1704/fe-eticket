/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Script from "next/script";
import { getCookie } from "cookies-next";
import DatePicker from "react-datepicker";
import { id } from "date-fns/locale";
import { isMonday, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

// Daftar libur nasional 2025 (contoh)
const nationalHolidays = [
  new Date(2025, 0, 1), // Tahun Baru
  new Date(2025, 0, 6), // Hari Raya Natal
  new Date(2025, 1, 8), // Isra Mi'raj
  new Date(2025, 2, 11), // Hari Raya Nyepi
  new Date(2025, 3, 18), // Jumat Agung
  new Date(2025, 4, 1), // Hari Buruh
  new Date(2025, 4, 29), // Kenaikan Isa Almasih
  new Date(2025, 5, 1), // Hari Lahir Pancasila
  new Date(2025, 5, 16), // Idul Fitri
  new Date(2025, 7, 17), // Hari Kemerdekaan
  new Date(2025, 10, 5), // Maulid Nabi
  new Date(2025, 11, 25), // Hari Raya Natal
  new Date(2025, 11, 26), // Cuti Bersama Natal
];

export default function Ticket() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie("token");

  // Load Midtrans Snap Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-WDRe2Jb6Aks6uNaO");
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/ticket", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(data);
      } else {
        setError("Gagal mengambil data tiket");
        console.error("Gagal mengambil tiket:", data.message);
      }
    } catch (error) {
      setError("Koneksi jaringan bermasalah");
      console.error("Kesalahan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUserId(data.user.id);
      } else {
        console.error("Gagal ambil user:", data.message);
      }
    } catch (err) {
      console.error("Error ambil user:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Anda perlu login terlebih dahulu");
      setLoading(false);
      return;
    }

    fetchTickets();
    fetchUser();
  }, [token]);

  const handleQuantityChange = (ticket, newQty) => {
    // Ensure quantity is a number between 0 and 10
    const quantity = Math.min(Math.max(parseInt(newQty) || 0, 0), 10);

    let updated;
    if (quantity === 0) {
      updated = selectedTicket.filter((item) => item.id !== ticket.id);
    } else {
      const existing = selectedTicket.find((item) => item.id === ticket.id);
      if (existing) {
        updated = selectedTicket.map((item) =>
          item.id === ticket.id ? { ...item, qty: quantity } : item
        );
      } else {
        updated = [...selectedTicket, { ...ticket, qty: quantity }];
      }
    }
    setSelectedTicket(updated);
    updateTotal(updated);
  };
  const updateTotal = (list) => {
    const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotalPrice(total);
  };

  const handleConfirmOrder = async () => {
    if (!selectedDate) return alert("Pilih tanggal terlebih dahulu.");
    if (selectedTicket.length === 0) return alert("Pilih minimal 1 tiket.");
    if (!userId) return alert("Gagal mendapatkan data user.");

    const ticketList = selectedTicket.map((item) => ({
      ticketId: item.id,
      quantity: item.qty,
    }));

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          ticketList,
          visitDate: format(selectedDate, "yyyy-MM-dd"),
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === "success") {
        const snapToken = result.data.snapToken;

        const modalEl = document.getElementById("confirmationModal");
        if (modalEl) {
          const bootstrapModal = window.bootstrap.Modal.getInstance(modalEl);
          bootstrapModal?.hide();
        }

        if (window.snap) {
          window.snap.pay(snapToken, {
            onSuccess: (res) => {
              alert("Pembayaran berhasil!");
              console.log(res);
              // Reset form after successful payment
              setSelectedDate(null);
              setSelectedTicket([]);
              setTotalPrice(0);
            },
            onPending: (res) => {
              alert("Pembayaran tertunda. Silakan selesaikan pembayaran Anda.");
              console.log(res);
            },
            onError: (res) => {
              alert("Pembayaran gagal. Silakan coba lagi.");
              console.log(res);
            },
            onClose: () => {
              console.log("Popup pembayaran ditutup");
            },
          });
        } else {
          alert("Midtrans Snap belum dimuat. Silakan refresh halaman.");
        }
      } else {
        alert(result.message || "Gagal memproses pembayaran.");
        console.error(result);
      }
    } catch (error) {
      console.error("Error payment:", error);
      alert("Terjadi kesalahan saat memulai pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  // Cek apakah tanggal termasuk hari Senin atau libur nasional
  const isDateDisabled = (date) => {
    return (
      isMonday(date) ||
      nationalHolidays.some((holiday) => holiday.getTime() === date.getTime())
    );
  };

  // Custom class untuk styling kalender
  const dayClassName = (date) => {
    if (isMonday(date)) {
      return "monday-day";
    }
    if (
      nationalHolidays.some((holiday) => holiday.getTime() === date.getTime())
    ) {
      return "holiday-day";
    }
    return "";
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-WDRe2Jb6Aks6uNaO"
        strategy="beforeInteractive"
      />

      <style jsx global>{`
        .monday-day {
          color: #0d6efd !important;
          font-weight: bold;
          position: relative;
        }
        .monday-day::after {
          content: " (Senin)";
          font-size: 0.7em;
        }
        .holiday-day {
          color: #dc3545 !important;
          font-weight: bold;
          background-color: #f8d7da !important;
        }
        .react-datepicker__day--disabled {
          color: #ccc !important;
          cursor: not-allowed;
        }
        .ticket-card {
          transition: transform 0.2s, box-shadow 0.2s;
          border-radius: 10px;
          overflow: hidden;
          border: none;
        }
        .ticket-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .ticket-card.selected {
          border: 2px solid #0d6efd;
          background-color: #f8f9fa;
        }
        .quantity-input {
          width: 60px;
          text-align: center;
          border-radius: 5px;
          border: 1px solid #ced4da;
          padding: 5px;
        }
        .total-box {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .date-picker-container {
          position: relative;
        }
        .date-picker-container .react-datepicker-wrapper {
          width: 100%;
        }
        .date-info {
          font-size: 0.85rem;
          color: #6c757d;
          margin-top: 5px;
        }
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .spinner {
          width: 3rem;
          height: 3rem;
        }

        /* Perbaikan untuk form-control focus */
        .ticket-page .form-control:focus {
          background-color: #fff !important;
          border-color: #86b7fe !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
          color: #000 !important;
        }

        /* Khusus untuk quantity input */
        .quantity-input:focus {
          border-color: #86b7fe !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
          outline: none;
        }
      `}</style>

      <main className="py-5 bg-light min-vh-100">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <p className="lead text-muted">
                  Pilih tanggal kunjungan dan jumlah tiket yang diinginkan
                </p>
              </div>

              {error ? (
                <div className="alert alert-danger text-center">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                  {!token && (
                    <div className="mt-2">
                      <a href="/login" className="btn btn-sm btn-primary">
                        Login Sekarang
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="row">
                      <div className="col-md-6 mb-4 mb-md-0">
                        <div className="date-picker-container mb-4">
                          <label
                            htmlFor="tanggal"
                            className="form-label fw-bold"
                          >
                            <i className="fas fa-calendar-alt me-2"></i>
                            Tanggal Kunjungan
                          </label>
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            locale={id}
                            dateFormat="dd MMMM yyyy"
                            minDate={new Date()}
                            filterDate={(date) => !isDateDisabled(date)}
                            dayClassName={dayClassName}
                            className="form-control form-control-lg"
                            placeholderText="Pilih tanggal"
                            required
                          />
                          <div className="date-info">
                            <i className="fas fa-info-circle me-1"></i>
                            Hari Senin dan hari libur nasional tutup
                          </div>
                        </div>

                        <div className="alert alert-info">
                          <h5 className="alert-heading">
                            <i className="fas fa-lightbulb me-2"></i>
                            Informasi Penting
                          </h5>
                          <ul className="mb-0">
                            <li>Pembelian tiket minimal 1 hari sebelumnya</li>
                            <li>Tiket tidak dapat dibatalkan setelah dibeli</li>
                            <li>Waktu kunjungan: 09:00 - 17:00 WIB</li>
                          </ul>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <h4 className="fw-bold mb-4">
                          <i className="fas fa-ticket-alt me-2"></i>
                          Pilih Tiket
                        </h4>

                        <div className="mb-4">
                          {tickets.map((ticket) => {
                            const selected = selectedTicket.find(
                              (item) => item.id === ticket.id
                            );
                            const quantity = selected?.qty || 0;

                            return (
                              <div
                                key={ticket.id}
                                className={`ticket-card card mb-3 ${
                                  quantity > 0 ? "selected" : ""
                                }`}
                              >
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h5 className="fw-bold mb-1">
                                        {ticket.type}
                                      </h5>
                                      <p className="text-muted small mb-2">
                                        {ticket.terms}
                                      </p>
                                      <p className="text-success mb-0">
                                        Rp{" "}
                                        {ticket.price.toLocaleString("id-ID")}
                                      </p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() =>
                                          handleQuantityChange(
                                            ticket,
                                            quantity - 1
                                          )
                                        }
                                        disabled={quantity <= 0}
                                      >
                                        <i className="fas fa-minus"></i>
                                      </button>
                                      <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={quantity}
                                        onChange={(e) =>
                                          handleQuantityChange(
                                            ticket,
                                            e.target.value
                                          )
                                        }
                                        className="quantity-input"
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm"
                                        onClick={() =>
                                          handleQuantityChange(
                                            ticket,
                                            quantity + 1
                                          )
                                        }
                                        disabled={quantity >= 10}
                                      >
                                        <i className="fas fa-plus"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="total-box mt-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Total Pembayaran:</h5>
                            <h3 className="fw-bold text-primary mb-0">
                              Rp {totalPrice.toLocaleString("id-ID")}
                            </h3>
                          </div>
                          <button
                            className="btn btn-primary btn-lg w-100 py-3"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#confirmationModal"
                            disabled={
                              !selectedDate ||
                              selectedTicket.length === 0 ||
                              !userId ||
                              loading
                            }
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Memproses...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-shopping-cart me-2"></i>
                                Lanjutkan Pembayaran
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Konfirmasi */}
        <div
          className="modal fade"
          id="confirmationModal"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white">
                  <i className="fas fa-check-circle me-2 text-white"></i>
                  Konfirmasi Pemesanan
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <p className="text-dark">Detail Pesanan</p>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tanggal Kunjungan:</span>
                    <strong>
                      {selectedDate && format(selectedDate, "dd MMMM yyyy")}
                    </strong>
                  </div>
                </div>

                <p className="text-dark">Tiket yang dibeli:</p>
                <ul className="list-group mb-4">
                  {selectedTicket.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{item.type}</strong>
                        <div className="text-muted small">
                          Rp {item.price.toLocaleString("id-ID")} x {item.qty}
                        </div>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        Rp {(item.price * item.qty).toLocaleString("id-ID")}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <h5 className="fw-bold mb-0">Total:</h5>
                  <h4 className="fw-bold text-primary mb-0">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </h4>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" data-bs-dismiss="modal">
                  <i className="fas fa-times me-2"></i>
                  Batal
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card me-2 text-white"></i>
                      Konfirmasi Pembayaran
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}
