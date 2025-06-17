"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { Spinner, Form, Alert, Modal, Button } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import page from '@/config/page';
import { id } from "date-fns/locale";

export default function Ordersnext() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");
  const token = getCookie("token");

  const handleDownload = async (orderId) => {
    try {
      setDownloadLoading(orderId);
      const response = await fetch(`${page.baseUrl}/orders/${orderId}/download`, {
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

  const handlePayment = async (order) => {
    try {
      setSelectedOrder(order);
      setIsLoading(true);
      
      // Fetch payment URL from your backend
      const response = await fetch(`${page.baseUrl}/api/payments/${order.id}/snap-url`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal memuat halaman pembayaran");
      }

      const data = await response.json();
      setPaymentUrl(data.paymentUrl);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentUrl("");
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(page.baseUrl+"/api/orders", {
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "success":
        return "bg-success text-white";
      case "failed":
        return "bg-danger text-white";
      case "expired":
        return "bg-secondary text-white";
      default:
        return "bg-light text-dark";
    }
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
                      <th>Tiket yang di pilih</th>
                      <th className="text-center">Qty</th>
                      <th>Tanggal Berkunjung</th>
                      <th>Status Pembayaran</th>
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
                      const paymentStatus = order.payment?.paymentStatus || "pending";

                      return (
                        <tr key={order.id} className="align-middle">
                          <td className="text-center fw-medium">{index + 1}</td>
                          <td>
                            <span className="badge bg-light text-dark border-primary">
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
                            <span className={`badge rounded-pill ${getStatusBadgeClass(paymentStatus)}`}>
                              <i className="bi bi-circle-fill me-2" style={{ fontSize: "0.6rem" }}></i>
                              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
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
                              {paymentStatus === "pending" ? (
                                <button
                                  onClick={() => handlePayment(order)}
                                  className="btn btn-sm btn-outline-warning rounded-circle p-2"
                                  title="Bayar Sekarang"
                                  disabled={isLoading}
                                >
                                  <i className="bi bi-credit-card"></i>
                                </button>
                              ) : (
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
                              )}
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

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={closePaymentModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Pembayaran Tiket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Memuat halaman pembayaran...</p>
            </div>
          ) : paymentUrl ? (
            <div style={{ height: "500px" }}>
              <iframe 
                src={paymentUrl} 
                title="Payment Gateway"
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          ) : (
            <Alert variant="danger">Gagal memuat halaman pembayaran</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePaymentModal}>
            Tutup
          </Button>
          {paymentUrl && (
            <Button 
              variant="primary" 
              onClick={() => {
                window.open(paymentUrl, "_blank");
                closePaymentModal();
              }}
            >
              Buka di Tab Baru
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}