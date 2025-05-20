"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { getCookie } from "cookies-next";

export default function Ticket() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticket, setTicket] = useState([]);
  const token = getCookie("token");

  // Jika token menyimpan userId, parsing dari token bisa dilakukan di sini (misal JWT)
  // Untuk contoh ini, kita asumsikan userId = 1
  const userId = 1;

  useEffect(() => {
  const script = document.createElement('script');
  script.src = "https://app.midtrans.com/snap/snap.js";
  script.setAttribute("data-client-key", "SB-Mid-client-WDRe2Jb6Aks6uNaO"); 
  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
  };
}, []);


  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/ticket", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setTicket(result);
        } else {
          console.error("Gagal mengambil data:", result?.message || "Tidak diketahui");
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleSelectTicket = (Ticket) => {
    const existing = selectedTicket.find((item) => item.id === Ticket.id);
    let updated;
    if (existing) {
      updated = selectedTicket.map((item) =>
        item.id === Ticket.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updated = [...selectedTicket, { ...Ticket, qty: 1 }];
    }
    setSelectedTicket(updated);
    updateTotal(updated);
  };

  const handleRemoveTicket = (id) => {
    const updated = selectedTicket
      .map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);
    setSelectedTicket(updated);
    updateTotal(updated);
  };

  const updateTotal = (list) => {
    const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotalPrice(total);
  };

  async function handleConfirmOrder() {
    if (!selectedDate) {
      alert("Silakan pilih tanggal kunjungan terlebih dahulu.");
      return;
    }
    if (selectedTicket.length === 0) {
      alert("Silakan pilih minimal 1 tiket.");
      return;
    }

    // Prepare data ticketList sesuai backend (contoh: { ticketId, quantity })
    const ticketList = selectedTicket.map((item) => ({
      ticketId: item.id,
      quantity: item.qty,
    }));

    try {
      const response = await fetch("http://localhost:5001/api/payment", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Kalau API perlu auth
        },
        body: JSON.stringify({
          userId,
          ticketList,
          visitDate: selectedDate,
        }),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        const snapToken = data.data.snapToken;

        // Tutup modal bootstrap manual supaya tidak tabrakan dengan popup Midtrans
        const modalEl = document.getElementById("confirmationModal");
        if (modalEl) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }

        // Pastikan window.snap ada dulu
        if (window.snap) {
          window.snap.pay(snapToken, {
            onSuccess: function (result) {
              alert("Pembayaran berhasil!");
              console.log(result);
              // Redirect atau reload halaman jika perlu
            },
            onPending: function (result) {
              alert("Pembayaran tertunda, silakan selesaikan pembayaran.");
              console.log(result);
            },
            onError: function (result) {
              alert("Pembayaran gagal, silakan coba lagi.");
              console.log(result);
            },
            onClose: function () {
              alert("Anda menutup popup pembayaran.");
            },
          });
        } else {
          alert("Midtrans Snap SDK belum terload.");
        }
      } else {
        alert("Gagal memulai pembayaran: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saat initiate payment:", error);
      alert("Terjadi kesalahan saat proses pembayaran.");
    }
  }

  return (
    <>
      <Navbar />
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-WDRe2Jb6Aks6uNaO"
        strategy="beforeInteractive"
      />
      <main className="py-5 pt-5 bg-light">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-9 col-11">
              <div className="text-center mb-4">
                <h2 className="text-dark fw-bold">Beli Tiket Masuk Museum Lampung</h2>
                <p className="text-muted">Pilih tanggal kunjungan dan jenis tiket yang diinginkan.</p>
              </div>

              <form className="p-4 shadow-lg rounded bg-white" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label htmlFor="tanggal" className="form-label fw-bold">
                    Pilih Tanggal Berkunjung:
                  </label>
                  <input
                    type="date"
                    id="tanggal"
                    name="tgl_berkunjung"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="alert alert-warning border-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Penjualan tiket hanya untuk uji coba terbatas.
                </div>

                <div className="row">
                  {ticket.map((Ticket) => {
                    const selected = selectedTicket.find((item) => item.id === Ticket.id);
                    return (
                      <div key={Ticket.id} className="col-12 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="fw-bold mb-1">{Ticket.type}</h6>
                                <p className="text-muted small mb-2">{Ticket.terms}</p>
                                <span className="text-black fw-bold">
                                  Rp {Ticket.price.toLocaleString("id-ID")}
                                </span>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  type="button"
                                  onClick={() => handleSelectTicket(Ticket)}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                                <span className="badge bg-secondary fs-6">
                                  {selected?.qty || 0}
                                </span>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  type="button"
                                  onClick={() => handleRemoveTicket(Ticket.id)}
                                  disabled={!selected}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-end mt-4">
                  <h5 className="text-dark">
                    Subtotal:{" "}
                    <span className="text-black fw-bold">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </h5>
                  <button
                    type="button"
                    className="btn btn-success mt-3"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmationModal"
                    disabled={!selectedDate || selectedTicket.length === 0}
                  >
                    Beli Tiket
                  </button>
                </div>
              </form>

              {/* MODAL KONFIRMASI */}
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
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>
                        <strong>Tanggal Berkunjung:</strong> {selectedDate}
                      </p>
                      <p>
                        <strong>Rincian Tiket:</strong>
                      </p>
                      <ul className="list-unstyled">
                        {selectedTicket.map((item) => (
                          <li key={item.id}>
                            {item.type} - Rp {item.price.toLocaleString("id-ID")} x {item.qty}
                          </li>
                        ))}
                      </ul>
                      <hr />
                      <h5 className="fw-bold">
                        Total: Rp {totalPrice.toLocaleString("id-ID")}
                      </h5>
                      <p className="mt-2">Apakah Anda yakin ingin memesan tiket ini?</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleConfirmOrder}
                      >
                        Konfirmasi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* END MODAL */}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Script tambahan */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}
