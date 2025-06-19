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

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (item.orderItem?.order?.orderCode?.toLowerCase().includes(searchLower)) ||
          (item.orderItem?.order?.user?.fullName?.toLowerCase().includes(searchLower)) ||
          (item.orderItem?.order?.user?.email?.toLowerCase().includes(searchLower))
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${page.baseUrl}/api/orders/ticket-instances/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Gagal memuat data tiket: ${response.status}`);
      }

      const result = await response.json();
      
      // Debug: Log the response data structure
      console.log("API Response:", result);
      
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Format data tidak valid dari API");
      }

      setData(result.data);
      setFilteredData(result.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Open validation modal
  const openValidationModal = (item, status) => {
    setSelectedItem(item);
    setValidationStatus(status);
    setShowValidationModal(true);
  };

  // Validate ticket attendance
  const validateTicket = async () => {
    try {
      if (!selectedItem || !selectedItem.qrCode) {
        throw new Error("Data tiket tidak valid");
      }

      const response = await fetch(
        `${page.baseUrl}/api/orders/validate-attendance`,
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
      
      // Update local data instead of refetching all
      setData(prevData => 
        prevData.map(item => 
          item._id === selectedItem._id 
            ? { ...item, attendanceStatus: validationStatus } 
            : item
        )
      );
      
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
    try {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
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
                  placeholder="Cari berdasarkan kode order, nama pengunjung, atau email..."
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
              <div className="alert alert-danger d-flex align-items-center">
                <FiAlertCircle className="me-2 flex-shrink-0" />
                <div>{error}</div>
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
                        <tr key={item._id || index}>
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
                                <FiXCircle className="me-1" /> Batal
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="alert alert-warning mb-0 d-flex align-items-center">
                            <FiAlertCircle className="me-2 flex-shrink-0" />
                            <div>
                              {searchTerm 
                                ? "Tidak ada data yang cocok dengan pencarian" 
                                : "Tidak ada data kunjungan yang tersedia"}
                            </div>
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
                        <strong>Nama Pengunjung:</strong> {selectedItem.orderItem?.order?.user?.fullName || "-"}
                      </li>
                      <li className="list-group-item">
                        <strong>Email:</strong> {selectedItem.orderItem?.order?.user?.email || "-"}
                      </li>
                      <li className="list-group-item">
                        <strong>Tanggal Kunjungan:</strong> {formatDate(selectedItem.orderItem?.order?.visitDate)}
                      </li>
                      <li className="list-group-item">
                        <strong>Status Saat Ini:</strong> {getStatusBadge(selectedItem.attendanceStatus)}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Rincian Tiket</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Jenis Tiket</th>
                            <th>Harga</th>
                            <th>Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{selectedItem.orderItem?.ticket?.type || "Tiket Museum"}</td>
                            <td>Rp{selectedItem.orderItem?.ticketPrice?.toLocaleString("id-ID") || "0"}</td>
                            <td>{selectedItem.orderItem?.quantity || "1"}</td>
                          </tr>
                        </tbody>
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
                  className="btn btn-secondary"
                  onClick={() => setShowValidationModal(false)}
                >
                  Tutup
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
        <div 
          className={`toast show position-fixed bottom-0 end-0 m-3 ${notification.type === "success" ? "bg-success" : "bg-danger"}`}
          style={{ zIndex: 1100 }}
        >
          <div className="d-flex align-items-center p-2">
            {notification.type === "success" 
              ? <FiCheckCircle className="me-2 flex-shrink-0" size={20} />
              : <FiAlertCircle className="me-2 flex-shrink-0" size={20} />
            }
            <div className="toast-body text-white">
              {notification.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white ms-auto"
              onClick={() => setNotification(null)}
            ></button>
          </div>
        </div>
      )}
    </>
  );
}