"use client";
import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import page from "@/config/page";
import { FiX, FiCalendar, FiUser, FiCreditCard, FiDollarSign, FiInfo, FiTicket } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getCookie("token");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(page.baseUrl + "/api/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          deleteCookie("token");
          router.push("/login");
          return;
        }

        const result = await res.json();
        if (res.ok) {
          setOrders(result.data);
        } else {
          console.error("Gagal mengambil data:", result?.message || "Tidak diketahui");
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router]);

  const openDetailModal = (order) => setSelectedOrder(order);
  const closeDetailModal = () => setSelectedOrder(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return (
          <span className="badge bg-success rounded-pill d-flex align-items-center">
            <FaCheckCircle className="me-1" /> Lunas
          </span>
        );
      case "PENDING":
        return (
          <span className="badge bg-warning text-dark rounded-pill d-flex align-items-center">
            <FaClock className="me-1" /> Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="badge bg-danger rounded-pill d-flex align-items-center">
            <FaTimesCircle className="me-1" /> Gagal
          </span>
        );
      default:
        return <span className="badge bg-secondary rounded-pill">{status}</span>;
    }
  };

  const getVisitStatus = (visitDate) => {
    const today = new Date();
    const visit = new Date(visitDate);

    if (visit > today) {
      return <span className="badge bg-info rounded-pill">Akan Berkunjung</span>;
    } else if (visit.toDateString() === today.toDateString()) {
      return <span className="badge bg-primary rounded-pill">Berkunjung Hari Ini</span>;
    } else {
      return <span className="badge bg-secondary rounded-pill">Sudah Berkunjung</span>;
    }
  };

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container-fluid py-5">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="card-title mb-0 fw-semibold text-white">Data Pemesanan Tiket</h2>
            </div>
            <div className="card-body p-4">
              <p className="text-muted mb-4">
                Melihat detail data pemesanan tiket museum termasuk nama pengunjung, jenis tiket, metode pembayaran, dan total.
              </p>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Memuat data pemesanan...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-primary">
                      <tr>
                        <th>No</th>
                        <th>Kode Pemesanan</th>
                        <th>Nama Pengunjung</th>
                        <th>Jumlah Tiket</th>
                        <th>Tanggal Berkunjung</th>
                        <th>Status Pembayaran</th>
                        <th>Total</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order, index) => {
                          const totalQty = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                          const totalPrice = order.orderItems?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;
                          return (
                            <tr key={order.id}>
                              <td>{index + 1}</td>
                              <td className="fw-semibold text-primary">{order.orderCode}</td>
                              <td>{order.visitorName || "-"}</td>
                              <td>{totalQty}</td>
                              <td>{new Date(order.visitDate).toLocaleDateString("id-ID")}</td>
                              <td>{getStatusBadge(order.paymentStatus)}</td>
                              <td className="fw-semibold">{`Rp${totalPrice.toLocaleString("id-ID")}`}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  onClick={() => openDetailModal(order)}
                                >
                                  <FiInfo className="me-1" />
                                  Detail
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            <div className="d-flex flex-column align-items-center text-muted">
                              <FiTicket size={48} className="mb-3" />
                              <p>Tidak ada data pemesanan tiket</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeDetailModal}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title d-flex align-items-center">
                  <FiInfo className="me-2" />
                  Detail Pemesanan
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeDetailModal}
                />
              </div>
              
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-4 border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3 d-flex align-items-center">
                          <FiUser className="me-2 text-primary" />
                          Informasi Pengunjung
                        </h6>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Nama Lengkap</p>
                          <p className="fw-semibold">{selectedOrder.visitorName || "-"}</p>
                        </div>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Email</p>
                          <p className="fw-semibold">{selectedOrder.user?.email || "-"}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-muted">No. Telepon</p>
                          <p className="fw-semibold">{selectedOrder.user?.phoneNumber || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card mb-4 border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3 d-flex align-items-center">
                          <FiCalendar className="me-2 text-primary" />
                          Informasi Kunjungan
                        </h6>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Tanggal Kunjungan</p>
                          <p className="fw-semibold">
                            {new Date(selectedOrder.visitDate).toLocaleDateString("id-ID", {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Status Kunjungan</p>
                          <div className="fw-semibold">
                            {getVisitStatus(selectedOrder.visitDate)}
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-muted">Kode Pemesanan</p>
                          <p className="fw-semibold text-primary">{selectedOrder.orderCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3 d-flex align-items-center">
                      <FiTicket className="me-2 text-primary" />
                      Detail Tiket
                    </h6>
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Jenis Tiket</th>
                            <th className="text-center">Harga Satuan</th>
                            <th className="text-center">Jumlah</th>
                            <th className="text-end">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.orderItems?.map((item) => (
                            <tr key={item.id}>
                              <td>{item.ticket?.type || "Tiket"}</td>
                              <td className="text-center">{`Rp${item.price?.toLocaleString("id-ID") || "0"}`}</td>
                              <td className="text-center">{item.quantity}</td>
                              <td className="text-end fw-semibold">{`Rp${item.totalPrice?.toLocaleString("id-ID") || "0"}`}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end fw-bold">Total</td>
                            <td className="text-end fw-bold text-primary">
                              {`Rp${selectedOrder.orderItems?.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toLocaleString("id-ID")}`}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3 d-flex align-items-center">
                          <FiCreditCard className="me-2 text-primary" />
                          Informasi Pembayaran
                        </h6>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Metode Pembayaran</p>
                          <p className="fw-semibold">{selectedOrder.paymentMethod || "-"}</p>
                        </div>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Status Pembayaran</p>
                          <div className="fw-semibold">
                            {getStatusBadge(selectedOrder.paymentStatus)}
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-muted">Tanggal Pembayaran</p>
                          <p className="fw-semibold">
                            {selectedOrder.paymentDate 
                              ? new Date(selectedOrder.paymentDate).toLocaleDateString("id-ID") 
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-primary px-4"
                  onClick={closeDetailModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-content {
          border-radius: 10px;
          overflow: hidden;
        }
        .card {
          border-radius: 8px;
        }
        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .badge {
          padding: 0.5em 0.8em;
          font-size: 0.8em;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}