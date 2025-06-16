"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { Spinner, Form, Alert } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import id from "date-fns/locale/id";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function Ordersnext() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(null);
  const token = getCookie("token");

  const handleDownload = async (orderId) => {
    try {
      setDownloadLoading(orderId);
      const response = await fetch(`${API_URL}/orders/${orderId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengunduh tiket");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tiket-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading ticket:", error);
      setError(error.message);
    } finally {
      setDownloadLoading(null);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/orders/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal memuat data");
        }

        const result = await res.json();
        setOrders(result.data || []);
        setFilteredOrders(result.data || []);
      } catch (error) {
        console.error("Fetch orders error:", error);
        setError(error.message);
        
        // If unauthorized, redirect to login
        if (error.message.includes("Unauthorized")) {
          window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      window.location.href = "/login";
    }
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning bg-opacity-25 text-warning";
      case "Confirmed":
      case "ARRIVED":
        return "bg-primary bg-opacity-10 text-primary";
      case "Cancelled":
      case "CANCELLED":
        return "bg-danger bg-opacity-10 text-danger";
      case "NOT_ARRIVED":
        return "bg-secondary bg-opacity-10 text-secondary";
      default:
        return "bg-secondary bg-opacity-10 text-secondary";
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy", { locale: id });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = orders.filter((order) =>
      order.orderCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  return (
    <>
      <Navbar />
      <main className="container py-5 min-vh-100">
        <section className="card border-0 shadow-lg" style={{ backgroundColor: "#f0f9ff" }}>
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h2 fw-bold text-primary mb-0">
                <i className="bi bi-clock-history me-2"></i>Riwayat Pemesanan
              </h2>
              <Form.Control
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Cari kode pemesanan..."
                className="w-auto"
              />
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Memuat data...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-5">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-ticket-perforated display-4 text-muted mb-3"></i>
                  <p className="text-muted mb-0">Belum ada riwayat pemesanan</p>
                  <Link href="/" className="btn btn-primary mt-3">
                    Pesan Tiket Sekarang
                  </Link>
                </div>
              </div>
            ) : (
              <div className="table-responsive rounded-3 overflow-hidden">
                <table className="table table-hover mb-0">
                  <thead style={{ backgroundColor: "#0d6efd", color: "white" }}>
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
                    {filteredOrders.map((order, index) => {
                      const totalQty = order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                      const totalPrice = order.orderItems?.reduce(
                        (sum, item) => sum + (item.quantity || 0) * (item.ticketPrice || 0),
                        0
                      ) || 0;

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
                              {order.orderItems?.map((item, idx) => (
                                <span key={idx} className="text-nowrap">
                                  {item.ticket?.type || "Tiket tidak tersedia"}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="text-center">{totalQty}</td>
                          <td>{formatDate(order.visitDate)}</td>
                          <td>
                            <span className={`badge rounded-pill fw-medium ${getStatusBadge(order.attendanceStatus)}`}>
                              <i className="bi bi-circle-fill me-2" style={{ fontSize: "0.6rem" }}></i>
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
                                disabled={downloadLoading === order.id}
                              >
                                {downloadLoading === order.id ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <i className="bi bi-download"></i>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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