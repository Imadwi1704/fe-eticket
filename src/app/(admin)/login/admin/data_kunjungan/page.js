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
  const token = getCookie("token");

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter data
  useEffect(() => {
    const filtered = data.filter(item => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.qrCode?.toLowerCase().includes(searchLower)) ||
        (item.orderItem?.order?.orderCode?.toLowerCase().includes(searchLower)) ||
        (item.orderItem?.order?.user?.fullName?.toLowerCase().includes(searchLower)) ||
        (item.orderItem?.order?.user?.email?.toLowerCase().includes(searchLower))
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${page.baseUrl}/api/orders/ticket-instances/admin`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error(`Gagal memuat data: ${response.status}`);

      const result = await response.json();
      
      if (!Array.isArray(result.data)) {
        throw new Error("Format data tidak valid");
      }

      setData(result.data);
      setFilteredData(result.data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle validation
  const validateSingleTicket = async () => {
    try {
      if (!selectedItem?.qrCode) throw new Error("QR Code tidak valid");

      const response = await fetch(
        `${page.baseUrl}/api/orders/validate-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            qrCode: selectedItem.qrCode, // Hanya kirim QR code yang dipilih
            status: validationStatus,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Validasi gagal");

      // Update hanya item yang divalidasi
      setData(prev => prev.map(item => 
        item.qrCode === selectedItem.qrCode 
          ? { ...item, attendanceStatus: validationStatus } 
          : item
      ));

      setNotification({
        message: `Berhasil validasi tiket ${selectedItem.qrCode}`,
        type: "success"
      });
      setShowValidationModal(false);
    } catch (error) {
      setNotification({
        message: error.message || "Gagal validasi",
        type: "error"
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ARRIVED": return <span className="badge bg-success">Hadir</span>;
      case "NOT_ARRIVED": return <span className="badge bg-warning">Belum Hadir</span>;
      default: return <span className="badge bg-secondary">Belum Divalidasi</span>;
    }
  };

  return (
    <>
      <Template />
      <div className="container-fluid py-4  min-vh-100">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2 className="card-title fw-semibold text-white mb-0">
              <FiUser className="me-2" /> Data Kunjungan
            </h2>
            <button onClick={fetchData} className="btn btn-sm btn-outline-light">
              <FiRefreshCw className="me-1" /> Refresh
            </button>
          </div>
          
          <div className="card-body p-4">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text"><FiSearch /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari berdasarkan QR Code, nama, atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Loading/Error States */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
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
                      <th>QR Code</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <tr key={item._id || item.qrCode || index}>
                          <td>{index + 1}</td>
                          <td><span className="badge bg-light text-dark">{item.qrCode}</span></td>
                          <td>
                            <FiUser className="me-2 text-primary" />
                            {item.orderItem?.order?.user?.fullName || "-"}
                          </td>
                          <td>
                            <FiMail className="me-2 text-primary" />
                            {item.orderItem?.order?.user?.email || "-"}
                          </td>
                          <td>
                            <FiCalendar className="me-2 text-primary" />
                            {formatDate(item.orderItem?.order?.visitDate)}
                          </td>
                          <td>{getStatusBadge(item.attendanceStatus)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setValidationStatus("ARRIVED");
                                  setShowValidationModal(true);
                                }}
                                className="btn btn-sm btn-success"
                                disabled={item.attendanceStatus === "ARRIVED"}
                              >
                                <FiCheck /> Validasi
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setValidationStatus("NOT_ARRIVED");
                                  setShowValidationModal(true);
                                }}
                                className="btn btn-sm btn-warning"
                                disabled={item.attendanceStatus === "NOT_ARRIVED"}
                              >
                                <FiXCircle /> Batal
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="alert alert-warning mb-0">
                            <FiAlertCircle className="me-2" />
                            {searchTerm ? "Data tidak ditemukan" : "Tidak ada data"}
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

      {/* Single Ticket Validation Modal */}
      {showValidationModal && selectedItem && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {validationStatus === "ARRIVED" 
                    ? "Validasi Kehadiran" 
                    : "Batalkan Kehadiran"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowValidationModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <strong>QR Code:</strong> {selectedItem.qrCode}
                </div>
                <ul className="list-group mb-3">
                  <li className="list-group-item">
                    <strong>Nama:</strong> {selectedItem.orderItem?.order?.user?.fullName || "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Status Saat Ini:</strong> {getStatusBadge(selectedItem.attendanceStatus)}
                  </li>
                </ul>
                <div className="alert alert-warning">
                  Anda akan memvalidasi <strong>1 tiket</strong> dengan QR Code: {selectedItem.qrCode}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowValidationModal(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className={`btn ${validationStatus === "ARRIVED" ? "btn-success" : "btn-warning"}`}
                  onClick={validateSingleTicket}
                >
                  {validationStatus === "ARRIVED" ? "Konfirmasi Hadir" : "Batalkan Kehadiran"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`toast show position-fixed bottom-0 end-0 m-3 ${notification.type === "success" ? "bg-success" : "bg-danger"}`}
          style={{ zIndex: 1100 }}>
          <div className="d-flex align-items-center p-2">
            {notification.type === "success" ? (
              <FiCheckCircle className="me-2" size={20} />
            ) : (
              <FiAlertCircle className="me-2" size={20} />
            )}
            <div className="toast-body text-white">
              {notification.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white ms-auto"
              onClick={() => setNotification(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}