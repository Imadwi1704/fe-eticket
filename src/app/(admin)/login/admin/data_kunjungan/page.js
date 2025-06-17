"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import page from '@/config/page';

import {
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiCalendar,
  FiCheck,
  FiXCircle,
  FiSearch,
} from "react-icons/fi";

export default function DataKunjungan() {
  // State management
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const params = useParams();
  const id = params.id;
  const token = getCookie("token");

  // Fetch data on component mount
  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        page.baseUrl+"/api/orders/ticket-instances/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memuat data tiket");
      }

      const result = await response.json();
      setData(result.data);
      setFilteredData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open validation modal
  const openValidationModal = (item, status) => {
    setSelectedItem(item);
    setValidationStatus(status);
    setShowValidationModal(true);
  };

  // Validate ticket attendance
  const validateTicket = async () => {
    try {
      const response = await fetch(
        page.baseUrl+"/api/orders/validate-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            qrCode: selectedItem.qrCode,
            status: validationStatus,
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
      fetchData();
      setShowValidationModal(false);
    } catch (error) {
      console.error("Error validasi:", error);
      setNotification({
        message: error.message || "Terjadi kesalahan saat validasi",
        type: "error",
      });
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchData();
  };

  // Format date to Indonesian locale
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "ARRIVED":
        return <span className="badge bg-success">Hadir</span>;
      case "NOT_ARRIVED":
        return <span className="badge bg-warning">Belum Hadir</span>;
      default:
        return <span className="badge bg-secondary">Belum Divalidasi</span>;
    }
  };

  return (
    <>
      <Template />
      <div className="container-fluid py-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2 className="card-title fw-semibold text-white mb-0">
              <FiUser className="me-2" /> Data Kunjungan Pengunjung
            </h2>
            <button
              onClick={handleRefresh}
              className="btn btn-sm btn-outline-light d-flex align-items-center"
            >
              <FiRefreshCw className="me-1" /> Refresh
            </button>
          </div>
          
          <div className="card-body p-4">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari berdasarkan kode order atau nama pengunjung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Memuat data kunjungan...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger">
                <FiAlertCircle className="me-2" /> {error}
              </div>
            )}

            {/* Data Table */}
            {!loading && !error && (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>No</th>
                      <th>Kode Order</th>
                      <th>Nama Pemesan</th>
                      <th>Email</th>
                      <th>Tanggal Kunjungan</th>
                      <th>Status Kunjungan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <tr key={`${item._id}-${index}`}>
                          <td>{index + 1}</td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {item.orderItem?.order?.orderCode || "-"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FiUser className="me-2 text-primary" />
                              {item.orderItem?.order?.user?.fullName || "-"}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FiMail className="me-2 text-primary" />
                              {item.orderItem?.order?.user?.email || "-"}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FiCalendar className="me-2 text-primary" />
                              {formatDate(item.orderItem?.order?.visitDate)}
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(item.attendanceStatus)}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => openValidationModal(item, "ARRIVED")}
                                className="btn btn-sm btn-success"
                                disabled={item.attendanceStatus === "ARRIVED"}
                              >
                                <FiCheck className="me-1" /> Validasi
                              </button>
                              <button
                                onClick={() => openValidationModal(item, "NOT_ARRIVED")}
                                className="btn btn-sm btn-warning"
                                disabled={item.attendanceStatus === "NOT_ARRIVED"}
                              >
                                <FiXCircle className="me-1 btn-danger" /> Batal
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="alert alert-warning mb-0">
                            <FiAlertCircle className="me-2" /> Tidak ada data yang ditemukan
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

      {/* Validation Modal */}
      {showValidationModal && selectedItem && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {validationStatus === "ARRIVED" ? "Validasi Kehadiran" : "Batalkan Kehadiran"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowValidationModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Detail Pengunjung</h6>
                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item">
                        <strong>Kode Order:</strong> {selectedItem.orderItem?.order?.orderCode || "-"}
                      </li>
                      <li className="list-group-item">
                        <strong>Nama Pengunjung:</strong> {selectedItem.orderItem?.user?.fullName || "-"}
                      </li>
                      <li className="list-group-item">
                        <strong>Email:</strong> {selectedItem.user?.email || "-"}
                      </li>
                      <li className="list-group-item">
                        <strong>Tanggal Kunjungan:</strong> {formatDate(selectedItem.orderItem?.order?.visitDate)}
                      </li>
                      <li className="list-group-item">
                        <strong>Status Saat Ini:</strong> {getStatusBadge(selectedItem.orderItem?.order?.attendanceStatus)}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Rincian Pemesanan</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Jenis Tiket</th>
                            <th>Harga</th>
                            <th>Jumlah</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItem.orderItems?.map((item, index) => (
                            <tr key={`order-item-${item._id || index}`}>
                              <td>{item.orderItem?.ticket?.type || "Tiket Museum"}</td>
                              <td>Rp{item.orderItem?.ticketPrice?.toLocaleString("id-ID") || "0"}</td>
                              <td>{item.orderItem?.quantity || "0"}</td>
                              <td>Rp{((item.orderItem?.ticketPrice || 0) * (item.quantity || 0)).toLocaleString("id-ID")}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end fw-bold">Total</td>
                            <td className="fw-bold">
                              Rp{selectedItem.orderItems?.reduce(
                                (sum, item) => sum + ((item.orderItem?.ticketPrice || 0) * (item.orderItem?.quantity || 0)), 
                                0
                              ).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="alert alert-info mt-3">
                      <p className="mb-1"><strong>QR Code:</strong> {selectedItem.qrCode || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowValidationModal(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className={`btn ${validationStatus === "ARRIVED" ? "btn-success" : "btn-warning"}`}
                  onClick={validateTicket}
                >
                  {validationStatus === "ARRIVED" ? "Konfirmasi Kehadiran" : "Batalkan Kehadiran"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`toast show position-fixed bottom-0 end-0 m-3 ${notification.type === "success" ? "bg-success" : "bg-danger"}`}>
          <div className="toast-header">
            <strong className="me-auto text-white">
              {notification.type === "success" ? "Sukses" : "Error"}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setNotification(null)}
            ></button>
          </div>
          <div className="toast-body text-white">
            {notification.message}
          </div>
        </div>
      )}
    </>
  );
}