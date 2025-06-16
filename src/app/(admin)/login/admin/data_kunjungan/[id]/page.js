/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiTrash2,
  FiEdit,
  FiRefreshCw,
} from "react-icons/fi";

export default function DataKunjungan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const params = useParams();
  const id = params.id;

  const token = getCookie("token");

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Tidak Ada Data Order");
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateTicket = async (status) => {
    try {
      if (!data) return;

      const response = await fetch(
        "http://localhost:5001/api/orders/validate-qrcode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            qrCode: data.orderItems[0]?.ticketInstances[0]?.qrCode,
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Validasi gagal");
      }

      setNotification({
        message: result.message || "Validasi berhasil",
        type: "success",
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Validasi error:", error);
      setNotification({
        message: error.message || "Terjadi kesalahan saat validasi",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token, id]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/orders/${selectedItem.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setNotification({
          message: "Data kunjungan berhasil dihapus",
          type: "success",
        });
        fetchData(); // Refresh data
      } else {
        const result = await res.json();
        throw new Error(result.message || "Gagal menghapus data");
      }
    } catch (err) {
      setNotification({
        message: err.message || "Terjadi kesalahan saat menghapus data",
        type: "error",
      });
    }
    setShowConfirmModal(false);
  };

  const NotificationToast = ({ notification }) => {
    if (!notification) return null;

    const bgColor =
      notification.type === "success"
        ? "bg-green-100 border-l-4 border-green-500"
        : "bg-red-100 border-l-4 border-red-500";

    const textColor =
      notification.type === "success" ? "text-green-700" : "text-red-700";

    const icon =
      notification.type === "success" ? (
        <FiCheckCircle className="text-green-500 mr-3" size={20} />
      ) : (
        <FiAlertCircle className="text-red-500 mr-3" size={20} />
      );

    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
        <div
          className={`${bgColor} ${textColor} p-4 rounded-lg shadow-lg flex items-start max-w-md`}
        >
          {icon}
          <div className="flex-1">
            <p className="font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container-fluid p-4 p-md-5">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="card-title fw-semibold text-white mb-0">
                Data Kunjungan - Tiket ID: {id}
              </h2>
              <button
                onClick={handleRefresh}
                className="btn btn-sm btn-outline-light d-flex align-items-center"
              >
                <FiRefreshCw className="me-1" /> Refresh
              </button>
            </div>
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <FiAlertCircle className="me-2" /> {error}
                </div>
              ) : data ? (
                <div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h4>Detail Pesanan</h4>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Kode Pesanan</th>
                            <td>{data.orderCode}</td>
                          </tr>
                          <tr>
                            <th>Nama Pemesan</th>
                            <td>{data.user?.fullName}</td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>{data.user?.email}</td>
                          </tr>
                          <tr>
                            <th>Tanggal Kunjungan</th>
                            <td>{formatDate(data.visitDate)}</td>
                          </tr>
                          <tr>
                            <th>Status Kehadiran</th>
                            <td>
                              <span
                                className={`badge ${
                                  data.attendanceStatus === "ARRIVED"
                                    ? "bg-success"
                                    : data.attendanceStatus === "NOT_ARRIVED"
                                    ? "bg-warning"
                                    : "bg-secondary"
                                }`}
                              >
                                {data.attendanceStatus === "ARRIVED"
                                  ? "Hadir"
                                  : data.attendanceStatus === "NOT_ARRIVED"
                                  ? "Belum Hadir"
                                  : "Belum Divalidasi"}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-6">
                      <h4>Validasi Kunjungan</h4>
                      <div className="d-flex gap-2 mb-3">
                        <button
                          onClick={() => validateTicket("ARRIVED")}
                          className="btn btn-success"
                          disabled={data.attendanceStatus === "ARRIVED"}
                        >
                          Validasi Hadir
                        </button>
                        <button
                          onClick={() => validateTicket("NOT_ARRIVED")}
                          className="btn btn-warning"
                          disabled={data.attendanceStatus === "NOT_ARRIVED"}
                        >
                          Batalkan Kehadiran
                        </button>
                      </div>
                      <div className="alert alert-info">
                        <p>
                          <strong>QR Code:</strong>{" "}
                          {data.orderItems[0]?.ticketInstances[0]?.qrCode ||
                            "Tidak tersedia"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h4 className="mt-4">Detail Tiket</h4>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}>
                        <tr className="text-dark">
                          <th>No</th>
                          <th>Jenis Tiket</th>
                          <th>Harga</th>
                          <th>Jumlah</th>
                          <th>Total</th>
                          <th>Status Tiket</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.orderItems?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ticket?.name}</td>
                            <td>Rp {item.price?.toLocaleString("id-ID")}</td>
                            <td>{item.quantity}</td>
                            <td>Rp {(item.price * item.quantity)?.toLocaleString("id-ID")}</td>
                            <td>
                              <span
                                className={`badge ${
                                  item.ticketInstances[0]?.attendanceStatus ===
                                  "ARRIVED"
                                    ? "bg-success"
                                    : item.ticketInstances[0]?.attendanceStatus ===
                                      "NOT_ARRIVED"
                                    ? "bg-warning"
                                    : "bg-secondary"
                                }`}
                              >
                                {item.ticketInstances[0]?.attendanceStatus ===
                                "ARRIVED"
                                  ? "Hadir"
                                  : item.ticketInstances[0]?.attendanceStatus ===
                                    "NOT_ARRIVED"
                                  ? "Belum Hadir"
                                  : "Belum Divalidasi"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  <FiAlertCircle className="me-2" /> Data tidak ditemukan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ borderBottomColor: "rgba(13, 110, 253, 0.2)" }}
              >
                <h5 className="modal-title fw-bold" style={{ color: "#0d6efd" }}>
                  Konfirmasi Penghapusan
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus data kunjungan ini?</p>
                <p className="fw-bold">
                  {selectedItem?.orderCode} - {selectedItem?.visitorName}
                </p>
              </div>
              <div
                className="modal-footer"
                style={{ borderTopColor: "rgba(13, 110, 253, 0.2)" }}
              >
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Batal
                </button>
                <button
                  className="btn text-white"
                  onClick={handleConfirmDelete}
                  style={{ backgroundColor: "#dc3545" }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <NotificationToast notification={notification} />
    </>
  );
}