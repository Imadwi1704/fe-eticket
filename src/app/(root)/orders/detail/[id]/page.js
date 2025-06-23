"use client";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import lampungLogo from "/public/assets/images/lampung-logo.png";
import { getCookie } from "cookies-next";
import page from "@/config/page";
import { Spinner, Alert } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import { useParams } from "next/navigation";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";

export default function DetailPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie("token");
  const [showQRModal, setShowQRModal] = useState(false);


  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!id) return;

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${page.baseUrl}/api/orders/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setOrder(result.data);
        } else {
          setError(result?.message || "Gagal mengambil data pemesanan");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat memuat data");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [token, id]);

  const formatDate = (dateString) => {
  try {
    if (!dateString) return "-"; // Kembalikan placeholder kalau tidak ada tanggal
    return format(parseISO(dateString), "dd MMMM yyyy", { locale: id });
  } catch (error) {
    console.error("Format date error:", error);
    return dateString || "-";
  }
};


  
  const calculateTotal = (items) => {
    return (
      items?.reduce(
        (sum, item) => sum + (item.ticketPrice || 0) * (item.quantity || 0),
        0
      ) || 0
    );
  };

  const handleDownload = () => {
    window.open(
      `${page.baseUrl}/api/orders/${id}/download?token=${token}`,
      "_blank"
    );
  };

  if (!token) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="bg-primary bg-gradient text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold mb-3 text-white">
                Detail Pemesanan Tiket
              </h1>
              <p className="lead mb-4 text-white">
                Terima kasih telah melakukan pemesanan tiket. Di halaman ini,
                Anda dapat melihat detail pemesanan, mengunduh tiket digital,
                dan melanjutkan pembayaran jika diperlukan.
              </p>
              <div className="d-flex gap-3">
                <Link href="/orders" className="btn btn-light px-2">
                  <i className="bi bi-arrow-left me-3"></i>
                  Kembali ke Daftar Pemesanan
                </Link>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <Image
                src="/assets/images/detail_tiket.png"
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

      <section
        id="detail-order"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
        }}
        className="py-5"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="mt-3 text-muted">Memuat data pemesanan...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
              ) : order ? (
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                  {/* Header Tiket */}
                  <div
                    className="bg-primary text-white px-4 py-3 position-relative"
                    style={{
                      background:
                        "linear-gradient(90deg, #0d6efd 0%, #0b5ed7 100%)",
                    }}
                  >
                    <h3 className="fw-bold mb-0 text-white">
                      E-RUWAJURAI TICKET
                    </h3>
                    <div
                      className="position-absolute top-0 end-0 bg-white text-primary fw-semibold px-3 py-1 rounded-start-pill shadow-sm"
                      style={{ fontSize: "0.85rem" }}
                    >
                      DIGITAL
                    </div>
                  </div>

                  {/* Body Tiket */}
                  <div className="card-body p-4 p-md-5 bg-white position-relative">
                    {/* Informasi Utama */}
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="d-flex align-items-start mb-3">
                          <i className="bi bi-receipt-cutoff fs-3 text-primary me-3" />
                          <div>
                            <p className="mb-1 text-primary">
                              Kode Pemesanan
                            </p>
                            <p className="fw-bold text-dark mb-0">
                              {order.orderCode}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex align-items-start">
                          <i className="bi bi-calendar-event fs-3 text-primary me-3" />
                          <div>
                            <p className="mb-1 text-primary">
                              Tanggal Berkunjung
                            </p>
                            <p className="fw-bold text-dark mb-0">
                              {formatDate(order?.visitDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-start mb-3">
                          <i className="bi bi-credit-card fs-3 text-primary me-3" />
                          <div>
                            <p className="mb-1 text-primary">
                              Status Pembayaran
                            </p>
                            <span
                              className={`badge rounded-pill px-3 py-1 fs-6 ${
                                order.payment?.paymentStatus === "success"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {order.payment?.paymentStatus?.toUpperCase() ||
                                "PENDING"}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex align-items-start">
                          <i className="bi bi-wallet2 fs-3 text-primary me-3" />
                          <div>
                            <p className="mb-1 text-primary">
                              Metode Pembayaran
                            </p>
                            <p className="fw-bold text-dark mb-0">
                              {order.payment?.paymentMethod || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tabel Tiket */}
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3 border-bottom pb-2">
                        Rincian Tiket
                      </h5>
                      <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                          <thead className="table-light ">
                            <tr>
                              <th>Jenis Tiket</th>
                              <th className="text-end">Harga</th>
                              <th className="text-end">Jumlah</th>
                              <th className="text-end">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.orderItems?.map((item) => (
                              <tr key={item.id}>
                                <td>{item.ticket?.type || "Tiket Museum"}</td>
                                <td className="text-end">
                                  Rp{item.ticketPrice?.toLocaleString("id-ID")}
                                </td>
                                <td className="text-end">{item.quantity}</td>
                                <td className="text-end fw-bold">
                                  Rp
                                  {(
                                    item.ticketPrice * item.quantity
                                  ).toLocaleString("id-ID")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3" className="fw-bold text-end">
                                Total Pembayaran
                              </td>
                              <td className="text-end fw-bold text-primary fs-5">
                                Rp
                                {calculateTotal(
                                  order.orderItems
                                ).toLocaleString("id-ID")}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Tombol Aksi with QR Button */}
                    <div className="d-flex flex-column flex-md-row gap-2 align-items-center">
                      <div className="d-flex gap-2">
                        <Link
                          href="#"
                          onClick={handleDownload}
                          className="btn btn-sm btn-primary d-inline-flex align-items-center justify-content-center gap-1 py-1 px-3 rounded-pill"
                        >
                          <i className="bi bi-download fs-6" />
                          <span className="small">Download Tiket</span>
                        </Link>

                        <button
                          onClick={() => setShowQRModal(true)}
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center justify-content-center gap-1 py-1 px-3 rounded-pill"
                        >
                          <i className="bi bi-qr-code fs-6" />
                          <span className="small">Scan QR</span>
                        </button>
                      </div>

                      {/* Logo Dekoratif */}
                      <div
                        className="position-absolute bottom-0 end-0 opacity-10 me-3 mb-2"
                        style={{ width: "120px", zIndex: 0 }}
                      >
                        <Image
                          src={lampungLogo}
                          alt="Logo Lampung"
                          className="img-fluid"
                        />
                      </div>
                    </div>

                    {/* QR Code Modal */}
                    <Modal
                      show={showQRModal}
                      onHide={() => setShowQRModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Kode QR Tiket</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="text-center">
                        <div className="p-4">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${order.orderCode}`}
                            alt="QR Code"
                            className="img-fluid mb-3"
                          />
                          <p className="text-muted">
                            Scan QR code untuk validasi tiket
                          </p>
                          <p className="fw-bold">{order.orderCode}</p>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setShowQRModal(false)}
                        >
                          Tutup
                        </button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info text-center">
                  Data pemesanan tidak ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
