"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import id from "date-fns/locale/id";

export default function Ordersnext() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie("token");

  const handleDownload = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/order/${orderId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Gagal mengunduh tiket');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tiket-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Gagal mengunduh tiket');
    }
  };

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
          setError(result?.message || 'Gagal memuat data');
        }
      } catch (error) {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning bg-opacity-25 text-warning';
      case 'Confirmed':
        return 'bg-success bg-opacity-10 text-success';
      case 'Cancelled':
        return 'bg-danger bg-opacity-10 text-danger';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'dd MMMM yyyy', { locale: id });
  };

  return (
    <>
      <Navbar />

      <main className="container py-5 min-vh-100">
        <section className="card border-0 shadow-lg" style={{ backgroundColor: "#fef9dc" }}>
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h2 fw-bold text-dark mb-0">
                <i className="bi bi-clock-history me-2"></i>Riwayat Pemesanan
              </h2>
              <div className="d-flex gap-2">
                <button className="btn btn-light btn-sm px-3 rounded-pill">
                  <i className="bi bi-filter me-2"></i>Filter
                </button>
                <button className="btn btn-light btn-sm px-3 rounded-pill">
                  <i className="bi bi-sort-down-alt me-2"></i>Urutkan
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Memuat data...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : (
              <div className="table-responsive rounded-3 overflow-hidden">
                <table className="table table-hover mb-0">
                  <thead className="bg-gradient-primary text-black" style={{ background: "linear-gradient(135deg, #ffd700 0%, #fef9dc 100%)" }}>
                    <tr>
                      <th className="text-center">#</th>
                      <th>Kode</th>
                      <th>Tiket</th>
                      <th className="text-center">Qty</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="d-flex flex-column align-items-center">
                            <i className="bi bi-ticket-perforated display-4 text-muted mb-3"></i>
                            <p className="text-muted mb-0">Belum ada riwayat pemesanan</p>
                            <Link href="/" className="btn btn-primary mt-3">
                              Pesan Tiket Sekarang
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, index) => {
                        const totalQty = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                        const totalPrice = order.orderItems.reduce(
                          (sum, item) => sum + item.quantity * item.ticketPrice,
                          0
                        );

                        return (
                          <tr key={order.id} className="align-middle">
                            <td className="text-center fw-medium">{index + 1}</td>
                            <td>
                              <span className="badge bg-light text-dark border border-2 border-primary">
                                {order.orderCode}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                {order.orderItems.map((item, idx) => (
                                  <span key={idx} className="text-nowrap">
                                    {item.ticket?.type}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="text-center">{totalQty}</td>
                            <td>{formatDate(order.visitDate)}</td>
                            <td>
                              <span className={`badge rounded-pill fw-medium ${getStatusBadge(order.attendanceStatus)}`}>
                                <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.6rem' }}></i>
                                {order.attendanceStatus || "Pending"}
                              </span>
                            </td>
                            <td className="fw-bold text-primary">
                              Rp{totalPrice.toLocaleString("id-ID")}
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-2 justify-content-center">
                                <Link 
                                  href={`/orders/detail/${order.id}`}
                                  className="btn btn-sm btn-outline-primary rounded-circle p-2"
                                  title="Detail"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <button 
                                  onClick={() => handleDownload(order.id)}
                                  className="btn btn-sm btn-outline-success rounded-circle p-2"
                                  title="Download"
                                >
                                  <i className="bi bi-download"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}