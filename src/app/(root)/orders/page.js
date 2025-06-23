"use client";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import {
  Spinner,
  Form,
  Alert,
  Modal,
  Button,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { format, parseISO } from "date-fns";
import page from "@/config/page";
import { id } from "date-fns/locale";

export default function Ordersnext() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const token = getCookie("token");

  const handleDownload = async (orderId) => {
    try {
      setDownloadLoading(orderId);
      const response = await fetch(
        `${page.baseUrl}/orders/${orderId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  const handlePayment = async (payment) => {
    try {
      setSelectedPayment(payment);
      setIsLoading(true);

      if (payment.paymentStatus === "PENDING" && payment.redirectUrl) {
        setPaymentUrl(payment.redirectUrl);
        setShowPaymentModal(true);
        return;
      }

      const response = await fetch(
        `${page.baseUrl}/api/payments/${payment.id}/snap-url`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memuat halaman pembayaran");
      }

      const data = await response.json();
      setPaymentUrl(data.redirectUrl || data.paymentUrl);
      setShowPaymentModal(true);

      setPayments((prev) =>
        prev.map((p) =>
          p.id === payment.id
            ? { ...p, redirectUrl: data.redirectUrl || data.paymentUrl }
            : p
        )
      );
      setFilteredPayments((prev) =>
        prev.map((p) =>
          p.id === payment.id
            ? { ...p, redirectUrl: data.redirectUrl || data.paymentUrl }
            : p
        )
      );
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
    setSelectedPayment(null);
    fetchPayments();
  };

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${page.baseUrl}/api/payments/my-payments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memuat data pembayaran");
      }

      const result = await res.json();
      setPayments(result.data || []);
      setFilteredPayments(result.data || []);
    } catch (error) {
      console.error("Fetch payments error:", error);
      setError(error.message);

      if (error.message.includes("Unauthorized")) {
        window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPayments();
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
    const filtered = payments.filter(
      (payment) =>
        payment.order?.orderCode?.toLowerCase().includes(value.toLowerCase()) ||
        payment.midtransOrderId?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        variant: "warning",
        text: "Pending",
        icon: "clock",
      },
      SUCCESS: { variant: "success", text: "Berhasil", icon: "check-circle" },
      SETTLEMENT: {
        variant: "success",
        text: "Berhasil",
        icon: "check-circle",
      },
      FAILED: { variant: "danger", text: "Gagal", icon: "x-circle" },
      DENY: { variant: "danger", text: "Ditolak", icon: "x-circle" },
      CANCEL: { variant: "danger", text: "Dibatalkan", icon: "x-circle" },
      EXPIRED: {
        variant: "secondary",
        text: "Kadaluarsa",
        icon: "clock-history",
      },
      CHALLENGE: {
        variant: "info",
        text: "Verifikasi",
        icon: "shield-exclamation",
      },
    };

    const statusKey = status?.toUpperCase();
    const statusInfo = statusMap[statusKey] || {
      variant: "light",
      text: status || "Unknown",
      icon: "question-circle",
    };

    return (
      <Badge
        bg={statusInfo.variant}
        className="d-flex align-items-center gap-1"
      >
        <i className={`bi bi-${statusInfo.icon}`}></i>
        {statusInfo.text}
      </Badge>
    );
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary bg-gradient text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold mb-3 text-white">
                Riwayat Pembayaran
              </h1>
              <p className="lead mb-4 text-white">
                Kelola dan lacak semua transaksi pembayaran tiket Anda di satu
                tempat
              </p>
              <div className="d-flex gap-3">
                <Link href="/" className="btn btn-light px-2">
                  <i className="bi bi-arrow-left me-3"></i>
                  Kembali ke Beranda
                </Link>
                <Link href="/" className="btn btn-outline-light px-2">
                  <i className="bi bi-ticket-perforated me-2"></i>
                  Pesan Tiket Baru
                </Link>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <Image
                src="/assets/images/payment-hero.png"
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

      <main className="container py-5 min-vh-100">
        <section className="section-padding bg-white"
          id="riwayat-pembayaran"
          style={{ padding: "50px 0" }}>
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <div>
                <h2 className="h4 fw-bold mb-1">
                  <i className="bi bi-receipt me-2 text-primary"></i>
                  Daftar Transaksi
                </h2>
                <p className="text-muted mb-0">
                  {filteredPayments.length} transaksi ditemukan
                </p>
              </div>

              <div className="d-flex flex-column flex-md-row gap-3">
                <ToggleButtonGroup
                  type="radio"
                  name="view-mode"
                  value={viewMode}
                  onChange={(val) => setViewMode(val)}
                  className="me-md-2"
                >
                  <ToggleButton
                    id="view-mode-grid"
                    value="grid"
                    variant="outline-primary"
                    size="sm"
                  >
                    <i className="bi bi-grid"></i>
                  </ToggleButton>
                  <ToggleButton
                    id="view-mode-list"
                    value="list"
                    variant="outline-primary"
                    size="sm"
                  >
                    <i className="bi bi-list-ul"></i>
                  </ToggleButton>
                </ToggleButtonGroup>

                <Form.Control
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Cari kode pemesanan/pembayaran..."
                  className="w-auto"
                />
              </div>
            </div>

            {error && (
              <Alert
                variant="danger"
                className="mb-4"
                onClose={() => setError(null)}
                dismissible
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Memuat data pembayaran...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-5">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-credit-card display-4 text-muted mb-3 opacity-50"></i>
                  <h5 className="text-muted mb-2">
                    Belum ada riwayat pembayaran
                  </h5>
                  <p className="text-muted mb-3">
                    Mulai pesan tiket Anda sekarang
                  </p>
                  <Link href="/" className="btn btn-primary px-4">
                    <i className="bi bi-ticket-perforated me-2"></i>
                    Pesan Tiket
                  </Link>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="row g-4">
                {filteredPayments.map((payment) => {
                  const order = payment.order;
                  const currentStatus = payment.paymentStatus || "PENDING";
                  const isPending = ["PENDING", "CHALLENGE"].includes(
                    currentStatus?.toUpperCase()
                  );

                  return (
                    <div key={payment.id} className="col-md-6 col-lg-4">
                      <div className="card border-1 h-100 hover-shadow transition-all">
                        <div className="card-body p-4 d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h3 className="h5 mb-0 text-truncate">
                              {order?.orderCode || "Menunggu konfirmasi"}
                            </h3>
                            {getStatusBadge(currentStatus)}
                          </div>

                          <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 text-muted mb-2">
                              <i className="bi bi-credit-card text-dark"></i>
                              <small className="text-dark">
                                {payment.midtransOrderId}
                              </small>
                            </div>
                            <div className="d-flex align-items-center gap-2 text-muted mb-2">
                              <i className="bi bi-calendar-event text-dark"></i>
                              <small className="text-dark">{formatDate(payment.visitDate)}</small>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <small className="fw-bold">Total:</small>
                              <span className="h5 text-primary mb-0">
                                Rp
                                {payment.totalAmount?.toLocaleString("id-ID") ||
                                  "0"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto d-flex gap-2">
                            {order && (
                              <Link
                                href={`/orders/detail/${payment.orderId}`}
                                className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center gap-2 justify-content-center"
                              >
                                <i className="bi bi-eye"></i>
                                <span>Detail</span>
                              </Link>
                            )}

                            {isPending ? (
                              <button
                                onClick={() => handlePayment(payment)}
                                className="btn btn-warning btn-sm flex-grow-1 d-flex align-items-center gap-2 justify-content-center"
                                disabled={isLoading}
                              >
                                <i className="bi bi-credit-card text-white"></i>
                                <span className="text-white">Bayar</span>
                              </button>
                            ) : (
                              order && (
                                <button
                                  onClick={() => handleDownload(order.id)}
                                  className="btn btn-success btn-sm flex-grow-1 d-flex align-items-center gap-2 justify-content-center"
                                  disabled={downloadLoading === order.id}
                                >
                                  {downloadLoading === order.id ? (
                                    <>
                                      <Spinner animation="border" size="sm" />
                                      <span>Memproses...</span>
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-download"></i>
                                      <span>Download</span>
                                    </>
                                  )}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Kode Pemesanan</th>
                      <th>Tanggal Kunjungan</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => {
                      const order = payment.order;
                      const currentStatus = payment.paymentStatus || "PENDING";
                      const isPending = ["PENDING", "CHALLENGE"].includes(
                        currentStatus?.toUpperCase()
                      );

                      return (
                        <tr key={payment.id}>
                          <td>
                            <div className="fw-semibold">
                              {order?.orderCode || "Menunggu konfirmasi"}
                            </div>
                            <small className="text-muted">
                              {payment.midtransOrderId}
                            </small>
                          </td>
                          <td>{formatDate(payment.visitDate)}</td>
                          <td>{getStatusBadge(currentStatus)}</td>
                          <td className="fw-bold text-primary">
                            Rp
                            {payment.totalAmount?.toLocaleString("id-ID") ||
                              "0"}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {order && (
                                <Link
                                  href={`/orders/detail/${payment.orderId}`}
                                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                  title="Detail"
                                >
                                  <i className="bi bi-eye"></i>
                                  <span className="d-none d-md-inline">
                                    Detail
                                  </span>
                                </Link>
                              )}

                              {isPending ? (
                                <button
                                  onClick={() => handlePayment(payment)}
                                  className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                                  disabled={isLoading}
                                  title="Bayar"
                                >
                                  <i className="bi bi-credit-card"></i>
                                  <span className="d-none d-md-inline">
                                    Bayar
                                  </span>
                                </button>
                              ) : (
                                order && (
                                  <button
                                    onClick={() => handleDownload(order.id)}
                                    className="btn btn-success btn-sm d-flex align-items-center gap-1"
                                    disabled={downloadLoading === order.id}
                                    title="Download"
                                  >
                                    {downloadLoading === order.id ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : (
                                      <>
                                        <i className="bi bi-download"></i>
                                        <span className="d-none d-md-inline">
                                          Download
                                        </span>
                                      </>
                                    )}
                                  </button>
                                )
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
      <Modal
        show={showPaymentModal}
        onHide={closePaymentModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-credit-card me-2"></i>
            Pembayaran Tiket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Memuat halaman pembayaran...</p>
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
            <Alert variant="danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Gagal memuat halaman pembayaran
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePaymentModal}>
            <i className="bi bi-x-lg me-2"></i>
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
              <i className="bi bi-box-arrow-up-right me-2"></i>
              Buka di Tab Baru
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}
