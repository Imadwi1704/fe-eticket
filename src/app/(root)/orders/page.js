"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";

export default function Ordersnext() {
  const [orders, setOrders] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/order/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setOrders(result.data);
        } else {
          console.error("Gagal memuat data:", result?.message);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <section className="card border-0"  style={{ backgroundColor: "#fef9dc" }}>
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 fw-bold text-dark mb-0">History Pemesanan</h2>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-filter"></i> Filter
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-sort-down"></i> Urutkan
                </button>
              </div>
            </div>

            <div className="table-responsive rounded-3 overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="bg-gradient-primary text-black">
                  <tr>
                    <th className="text-center">No</th>
                    <th>Kode Pemesanan</th>
                    <th>Tiket Yang di Pilih</th>
                    <th className="text-center">Jumlah</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">Belum ada riwayat pemesanan</td>
                    </tr>
                  ) : (
                    orders.map((order, index) => {
                      const totalQty = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                      const totalPrice = order.orderItems.reduce(
                        (sum, item) => sum + item.quantity * item.ticketPrice,
                        0
                      );

                      const firstTicket = order.orderItems[0]?.ticket?.type || "-";

                      return (
                        <tr key={order.id}>
                          <td className="text-center align-middle">{index + 1}</td>
                          <td className="align-middle">
                            <span className="badge bg-light text-dark border">{order.orderCode}</span>
                          </td>
                          <td className="align-middle">{firstTicket}</td>
                          <td className="text-center align-middle">{totalQty}</td>
                          <td className="align-middle">
                            {new Date(order.visitDate).toLocaleDateString("id-ID")}
                          </td>
                          <td className="align-middle">
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill fw-medium">
                              <i className="bi bi-check-circle me-2"></i>
                              {order.status || "Berhasil"}
                            </span>
                          </td>
                          <td className="align-middle fw-medium">Rp {totalPrice.toLocaleString("id-ID")}</td>
                          <td className="text-center align-middle">
                            <Link href={`/orders/detail/${order.id}`}>
                              <i className="bi bi-eye me-2" title="Lihat Detail"></i>
                            </Link>
                            <a
                              href={`http://localhost:5001/api/order/${order.id}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="bi bi-printer" title="Download Tiket"></i>
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
