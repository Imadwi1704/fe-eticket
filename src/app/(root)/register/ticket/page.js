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

  return (
    <>
      <Navbar />
      <main className="py-5 pt-5">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-8 col-10">
              <h2 className="text-center text-dark">
                Beli Tiket Masuk Museum Lampung
              </h2>
              <p className="text-center">
                Pilih tanggal kunjungan dan jenis tiket.
              </p>

              <form
                className="custom-form ticket-form p-4 shadow-lg rounded"
                style={{ backgroundColor: "rgba(205, 183, 140, 0.16)" }}
              >
                <div className="mb-3">
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

                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Penjualan tiket hanya untuk uji coba terbatas.
                </div>

                <div className="row">
                  {ticket.map((Ticket) => {
                    const selected = selectedTicket.find(
                      (item) => item.id === Ticket.id
                    );
                    return (
                      <div key={Ticket.id} className="col-12 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <h6 className="fw-bold">{Ticket.type}</h6>
                            <p className="text-muted small">
                              *Syarat & ketentuan berlaku
                            </p>
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold">
                                IDR {Ticket.price.toLocaleString("id-ID")}
                              </span>
                              <button
                                className="btn border"
                                type="button"
                                onClick={() => handleSelectTicket(Ticket)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                              <div
                                className="border rounded text-center d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                              >
                                {selected?.qty || 0}
                              </div>
                              <button
                                className="btn border"
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
                    );
                  })}
                </div>

                <div className="text-end my-3">
                  <h4>
                    Subtotal: <b>IDR {totalPrice.toLocaleString("id-ID")}</b>
                  </h4>
                  <button
                    type="button"
                    className="btn btn-success"
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
                <div className="modal-dialog">
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
                        Pastikan tiket yang dipilih dan jumlahnya sesuai dengan
                        jumlah pengunjung!
                      </p>
                      <p>
                        <strong>Tanggal Berkunjung:</strong> {selectedDate}
                      </p>
                      <p>
                        <strong>Rincian Pemesanan:</strong>
                      </p>
                      <ul>
                        {selectedTicket.map((item) => (
                          <li key={item.id}>
                            {item.type} = Rp{" "}
                            {item.price.toLocaleString("id-ID")} x {item.qty}
                          </li>
                        ))}
                      </ul>
                      <p className="fw-bold">
                        Total: Rp {totalPrice.toLocaleString("id-ID")}
                      </p>
                      <p>Yakin ingin memesan tiket ini?</p>
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
                        onClick={() => alert("Tiket berhasil dipesan!")}
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

      {/* Script tambahan */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}
