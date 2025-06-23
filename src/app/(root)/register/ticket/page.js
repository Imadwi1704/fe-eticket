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
import page from "@/config/page";
import Link from "next/link";
import Image from "next/image";

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
      const res = await fetch(page.baseUrl + "/api/ticket", {
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
      const res = await fetch(page.baseUrl + "/api/users/profile", {
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
      const res = await fetch(page.baseUrl + "/api/payments", {
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
        .form-control:focus {
          background-color: #fff !important;
          border-color: #86b7fe !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
          color: #000 !important;
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
        .text-white {
          color: #ffffff !important;
        }
      `}</style>

      <div className="overflow-hidden ticket-page">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {/* Hero Section */}
        <section className="bg-primary bg-gradient text-white py-5">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-5 fw-bold mb-3 text-white">
                  Pemesanan Tiket
                </h1>
                <p className="lead mb-4 text-white">
                  Pesan tiket kunjungan Anda dengan mudah dan cepat. Pilih
                  tanggal, jenis tiket, dan jumlah yang diinginkan. Pastikan
                  untuk memilih tanggal yang sesuai dengan jadwal kunjungan
                  Anda.
                </p>
                <div className="d-flex gap-3">
                  <Link href="/" className="btn btn-light px-2">
                    <i className="bi bi-arrow-left me-3"></i>
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 d-none d-lg-block">
                <Image
                  src="/assets/images/ticket.jpg"
                  alt="Payment Illustration"
                  className="img-fluid"
                  width={600}
                  height={400}
                  style={{ maxHeight: "250px", objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {error ? (
                <div className="alert alert-danger text-center rounded-lg shadow-sm">
                  <div className="d-flex align-items-center justify-content-center">
                    <i className="fas fa-exclamation-circle me-3 fs-4"></i>
                    <div>
                      <h5 className="mb-1">Terjadi Kesalahan</h5>
                      <p className="mb-0">{error}</p>
                      {!token && (
                        <div className="mt-3">
                          <a href="/login" className="btn btn-primary px-4">
                            <i className="fas fa-sign-in-alt me-2"></i>
                            Login Sekarang
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card border-0 shadow-lg overflow-hidden bg-white">
                  <div className="card-body p-0">
                    <div className="row g-0">
                      <div className="col-md-6 p-4" style={{backgroundColor: "#0D6EFD1A"} }>
                        <div className="date-picker-container mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="d-flex align-items-center justify-content-center bg-primary p-3 rounded-circle me-2"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i className="fas fa-calendar-alt text-white"></i>
                            </div>
                            <h4 className="fw-bold mb-0 text-dark">Tanggal Kunjungan</h4>
                          </div>

                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            locale={id}
                            dateFormat="dd MMMM yyyy"
                            minDate={new Date()}
                            filterDate={(date) => !isDateDisabled(date)}
                            dayClassName={dayClassName}
                            className="form-control form-control-lg border-2 py-1"
                            placeholderText="Pilih tanggal"
                            required
                          />

                          <div className="mt-2 text-muted">
                            <small>
                              <i className="fas fa-info-circle me-1 text-primary"></i>
                              Hari Senin dan hari libur nasional tutup
                            </small>
                          </div>
                        </div>

                        <div className="alert alert-primary border-start border-primary border-5 rounded-start-0 bg-white">
                          <div className="d-flex">
                            <i className="fas fa-lightbulb text-primary fs-4 me-3"></i>
                            <div>
                              <h5 className="alert-heading fw-bold">
                                Informasi Penting
                              </h5>
                              <ul className="mb-0 ps-3 text-dark">
                                <li className="mb-1 text-dark">
                                  Pembelian tiket minimal 1 hari sebelumnya
                                </li>
                                <li className="mb-1 text-dark">
                                  Tiket tidak dapat dibatalkan setelah dibeli
                                </li>
                                <li className="text-dark">Waktu kunjungan: 08:00 - 14:00 WIB</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 p-4">
                        <div className="d-flex align-items-center mb-4">
                          <div
                            className="d-flex align-items-center justify-content-center bg-primary p-3 rounded-circle me-2"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="fas fa-ticket-alt text-white"></i>
                          </div>

                          <h4 className="fw-bold mb-0">Pilih Tiket</h4>
                        </div>

                        <div className="ticket-list">
                          {tickets.map((ticket) => {
                            const selected = selectedTicket.find(
                              (item) => item.id === ticket.id
                            );
                            const quantity = selected?.qty || 0;

                            return (
                              <div
                                key={ticket.id}
                                className={`ticket-card card mb-3 overflow-hidden transition-all ${
                                  quantity > 0
                                    ? "border-primary border-2 shadow-lg transform scale-[1.02]"
                                    : "border-light"
                                }`}
                                style={{
                                  transition: "all 0.3s ease",
                                  borderRadius: "12px",
                                  borderLeft:
                                    quantity > 0
                                      ? "4px solid #0d6efd"
                                      : "4px solid #f8f9fa",
                                }}
                              >
                                <div className="card-body p-4">
                                  <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                      <h5 className="fw-bold mb-1 text-gradient-primary">
                                        {ticket.type}
                                      </h5>
                                      <p className="text-muted small mb-0">
                                        <i className="fas fa-info-circle me-1 text-primary"></i>
                                        {ticket.terms}
                                      </p>
                                    </div>
                                    <div className="bg-primary bg-opacity-10 px-3 py-2 rounded-pill">
                                      <h4 className="text-primary mb-0 fw-bold">
                                        Rp{" "}
                                        {ticket.price.toLocaleString("id-ID")}
                                      </h4>
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between mt-4">
                                    <div className="quantity-selector d-flex align-items-center">
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-icon rounded-circle"
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
                                      <div className="quantity-display mx-3 px-3 py-1 bg-light rounded">
                                        <span className="fw-bold fs-5">
                                          {quantity}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-outline-success btn-icon rounded-circle"
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

                                    {quantity > 0 && (
                                      <div className="text-end">
                                        <span className="text-muted small d-block">
                                          Subtotal
                                        </span>
                                        <h5 className="text-success mb-0 fw-bold">
                                          Rp{" "}
                                          {(
                                            ticket.price * quantity
                                          ).toLocaleString("id-ID")}
                                        </h5>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {quantity > 0 && (
                                  <div className="selected-indicator bg-primary text-white text-center py-1 small">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Ditambahkan ke keranjang
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="total-box bg-light p-4 rounded mt-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Total Pembayaran:</h5>
                            <h3 className="fw-bold text-dark mb-0">
                              Rp {totalPrice.toLocaleString("id-ID")}
                            </h3>
                          </div>
                          <button
                            className="btn btn-primary btn-lg w-80 py-2 rounded-2"
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle me-2 fs-4"></i>
                  <h5 className="modal-title mb-2 text-white">
                    Konfirmasi Pemesanan
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fas fa-calendar-day me-2"></i>
                      Detail Kunjungan
                    </h6>
                    <div className="bg-light p-3 rounded">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tanggal:</span>
                        <span>
                          {selectedDate && format(selectedDate, "dd MMMM yyyy")}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Jam:</span>
                        <span>08:00 - 14:00 WIB</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fas fa-ticket-alt me-2"></i>
                      Tiket Anda
                    </h6>
                    <div className="bg-light p-3 rounded">
                      {selectedTicket.map((item) => (
                        <div
                          key={item.id}
                          className="d-flex justify-content-between align-items-center mb-2"
                        >
                          <div>
                            <strong>{item.type}</strong>
                            <div className="text-muted small">
                              {item.qty} x Rp{" "}
                              {item.price.toLocaleString("id-ID")}
                            </div>
                          </div>
                          <span className="badge bg-primary rounded-pill px-3 py-2">
                            Rp {(item.price * item.qty).toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary bg-opacity-10 p-3 rounded mt-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className=" mb-0">Total Pembayaran:</h3>
                    <h4 className="fw-bold text-primary mb-0">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-danger px-4"
                  data-bs-dismiss="modal"
                >
                  <i className="fas fa-times me-2"></i>
                  Batal
                </button>
                <button
                  className="btn btn-primary px-4 fw-bold"
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
                      <i className="fas fa-credit-card me-2"></i>
                      Konfirmasi Pembayaran
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
      /* Add these styles to your CSS file */
.ticket-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.text-gradient-primary {
  background: linear-gradient(90deg, #0d6efd, #0dcaf0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  transform: scale(1.1);
}

.quantity-display {
  min-width: 50px;
  text-align: center;
}

.selected-indicator {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
      }`}</style>

      <Footer />
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}
