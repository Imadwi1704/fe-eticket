"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import lampungLogo from "/public/assets/images/lampung-logo.png";
import { getCookie } from "cookies-next";
import page from "@/config/page";
import { Spinner, Alert } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { useParams } from "next/navigation";
// import Cookies from "js-cookie";

export default function DetailPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie("token");

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
      return format(parseISO(dateString), "dd MMMM yyyy", { locale: id });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
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
    window.open(`${page.baseUrl}/api/orders/${id}/download?token=${token}`, "_blank");
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

      <section
        className="section-padding py-5"
        id="detail-order"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4f0ff 100%)",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="text-center mb-5">
                <h2 className="fw-bold text-primary">Detail Pemesanan</h2>
                <p className="text-muted">
                  Berikut detail tiket kunjungan Anda
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Memuat data pemesanan...</p>
                </div>
              ) : error ? (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              ) : order ? (
                <div className="card border-0 shadow-lg overflow-hidden">
                  {/* Header with decorative element */}
                  <div
                    className="bg-primary py-3 px-4 text-white position-relative"
                    style={{
                      background:
                        "linear-gradient(90deg, #0d6efd 0%, #0b5ed7 100%)",
                    }}
                  >
                    <h3 className="fw-bold text-white">E-RUWAJURAI</h3>
                    <div
                      className="position-absolute top-0 end-0 bg-white text-primary fw-bold px-3 py-1 rounded-start-pill m-0 shadow-sm"
                      style={{ fontSize: "0.9rem" }}
                    >
                      TIKET DIGITAL
                    </div>
                  </div>

                  <div className="card-body p-4 p-md-5 position-relative">
                    {/* Order details */}
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="d-flex align-items-center mb-3">
                          <i className="bi bi-receipt-cutoff fs-4 text-primary me-3"></i>
                          <div>
                            <h6 className="mb-0 fw-bold">Kode Pemesanan</h6>
                            <p className="fw-bold text-primary small mb-1">
                              {order.orderCode}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar-check fs-4 text-primary me-3"></i>
                          <div>
                            <h6 className="mb-0 fw-bold">Tanggal Berkunjung</h6>
                            <p className="fw-bold text-primary small mb-1">
                              {formatDate(order.visitDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <i className="bi bi-credit-card fs-4 text-primary me-3"></i>
                          <div>
                            <p className="text-muted small mb-1">
                              Status Pembayaran
                            </p>
                            <h5 className="mb-0">
                              <span
                                className={`badge ${
                                  order.payment?.paymentStatus === "success"
                                    ? "bg-success"
                                    : "bg-warning"
                                } text-white`}
                              >
                                {order.payment?.paymentStatus?.toUpperCase() ||
                                  "PENDING"}
                              </span>
                            </h5>
                          </div>
                        </div>

                        <div className="d-flex align-items-center">
                          <i className="bi bi-cash-coin fs-4 text-primary me-3"></i>
                          <div>
                            <h6 className="mb-0 fw-bold">Metode Pembayaran</h6>
                            <p className="fw-bold text-primary small mb-1">
                              {formatDate(order.payment?.paymentMethod)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ticket items */}
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3 border-bottom pb-2">
                        Rincian Tiket
                      </h5>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="bg-light">
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
                          <tfoot className="bg-light">
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

                    {/* Action buttons */}
                    <div className="d-flex flex-column flex-md-row gap-3">
                      <button
                        onClick={handleDownload}
                        className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3 px-4 flex-grow-1"
                      >
                        <i className="bi bi-download fs-5"></i>
                        Download Tiket
                      </button>

                      {order.payment?.paymentStatus !== "success" && (
                        <button
                          onClick={() =>
                            window.open(order.payment?.paymentUrl, "_blank")
                          }
                          className="btn btn-warning text-white d-flex align-items-center justify-content-center gap-2 py-3 px-4 flex-grow-1"
                        >
                          <i className="bi bi-credit-card fs-3"></i>
                          Lanjutkan Pembayaran
                        </button>
                      )}
                    </div>

                    {/* Decorative elements */}
                    <div
                      className="position-absolute bottom-0 end-0 me-3 mb-2 opacity-10"
                      style={{ width: "150px", zIndex: 0 }}
                    >
                      <Image
                        src={lampungLogo}
                        alt="Logo Lampung"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Alert variant="info" className="text-center">
                  Data pemesanan tidak ditemukan
                </Alert>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
