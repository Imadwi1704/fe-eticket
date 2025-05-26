
"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Script from "next/script";
import { getCookie } from "cookies-next";

export default function Ticket() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [userId, setUserId] = useState(null);
  const token = getCookie("token");
  const [loadingUser, setLoadingUser] = useState(true);
  // Load Midtrans Snap Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-WDRe2Jb6Aks6uNaO");
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
        console.error("Gagal mengambil tiket:", data.message);
      }
    } catch (error) {
      console.error("Kesalahan:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data); // untuk debugging
      console.log(data.user.id); // akses ID di dalam objek 'user'

      if (res.ok) {
        setUserId(data.user.id);
      } else {
        console.error("Gagal ambil user:", data.message);
      }
    } catch (err) {
      console.error("Error ambil user:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  // Fetch Ticket Data
  useEffect(() => {
    if (!token) return;

    fetchTickets();
    fetchUser();
  }, [token]);

  console.log(userId, "id");
  const handleSelectTicket = (ticket) => {
    const existing = selectedTicket.find((item) => item.id === ticket.id);
    let updated;
    if (existing) {
      updated = selectedTicket.map((item) =>
        item.id === ticket.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updated = [...selectedTicket, { ...ticket, qty: 1 }];
    }
    setSelectedTicket(updated);
    updateTotal(updated);
  };

  const handleRemoveTicket = (id) => {
    const updated = selectedTicket
      .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
      .filter((item) => item.qty > 0);
    setSelectedTicket(updated);
    updateTotal(updated);
  };

  const updateTotal = (list) => {
    const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotalPrice(total);
  };

  const handleConfirmOrder = async () => {
    console.log("userId:", userId);
    if (!selectedDate) return alert("Pilih tanggal terlebih dahulu.");
    if (selectedTicket.length === 0) return alert("Pilih minimal 1 tiket.");
    if (!userId) return alert("Gagal mendapatkan data user.");

    const ticketList = selectedTicket.map((item) => ({
      ticketId: item.id,
      quantity: item.qty,
    }));

    try {
      const res = await fetch("http://localhost:5001/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          ticketList,
          visitDate: selectedDate,
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
            },
            onPending: (res) => {
              alert("Pembayaran tertunda.");
              console.log(res);
            },
            onError: (res) => {
              alert("Pembayaran gagal.");
              console.log(res);
            },
            onClose: () => {
              alert("Popup pembayaran ditutup.");
            },
          });
        } else {
          alert("Midtrans Snap belum dimuat.");
        }
      } else {
        alert("Gagal memproses pembayaran.");
        console.error(result);
      }
    } catch (error) {
      console.error("Error payment:", error);
      alert("Terjadi kesalahan saat memulai pembayaran.");
    }
  };

  return (
    <>
      {/* Midtrans Snap.js */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-WDRe2Jb6Aks6uNaO"
        strategy="beforeInteractive"
      />

      <main className="py-5 bg-light">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-9 col-11">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Beli Tiket Museum</h2>
                <p className="text-muted">
                  Pilih tanggal dan tiket yang ingin dibeli.
                </p>
              </div>

              <form
                className="p-4 shadow-lg rounded bg-white"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="mb-4">
                  <label htmlFor="tanggal" className="form-label fw-bold">
                    Tanggal Kunjungan:
                  </label>
                  <input
                    type="date"
                    id="tanggal"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="alert alert-warning">
                  <i className="fas fa-info-circle me-2"></i> Pembelian untuk
                  uji coba sistem.
                </div>

                <div className="row">
                  {tickets.map((ticket) => {
                    const selected = selectedTicket.find(
                      (item) => item.id === ticket.id
                    );
                    return (
                      <div key={ticket.id} className="col-12 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="fw-bold">{ticket.type}</h6>
                              <p className="text-muted small mb-1">
                                {ticket.terms}
                              </p>
                              <strong>
                                Rp {ticket.price.toLocaleString("id-ID")}
                              </strong>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleSelectTicket(ticket)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                              <span className="badge bg-secondary fs-6">
                                {selected?.qty || 0}
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleRemoveTicket(ticket.id)}
                                disabled={!selected}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-end mt-4">
                  <h5>
                    Total:{" "}
                    <strong>Rp {totalPrice.toLocaleString("id-ID")}</strong>
                  </h5>
                  <button
                    className="btn btn-success mt-3"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmationModal"
                    disabled={
                      !selectedDate || selectedTicket.length === 0 || !userId
                    }
                  >
                    Beli Tiket
                  </button>
                </div>
              </form>

              {/* Modal Konfirmasi */}
              <div
                className="modal fade"
                id="confirmationModal"
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Konfirmasi Pemesanan</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>
                        <strong>Tanggal:</strong> {selectedDate}
                      </p>
                      <p>
                        <strong>Tiket:</strong>
                      </p>
                      <ul className="list-unstyled">
                        {selectedTicket.map((item) => (
                          <li key={item.id}>
                            {item.type} - Rp{" "}
                            {item.price.toLocaleString("id-ID")} x {item.qty}
                          </li>
                        ))}
                      </ul>
                      <hr />
                      <h5>Total: Rp {totalPrice.toLocaleString("id-ID")}</h5>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleConfirmOrder}
                      >
                        Konfirmasi
                      </button>
                    </div>
                  </div>
                </div>
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
