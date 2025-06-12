"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";

export default function TicketAdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [ticket, setTicket] = useState({
    code: "",
    type: "",
    price: "",
    terms: "",
  });

  const token = getCookie("token");

  // Auto-dismiss notification after 10 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5001/api/ticket", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showNotification("Gagal mengambil data tiket", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const showNotification = (message, type) => {
    setNotification({ message, type, id: Date.now() });
  };

  const handleAddTicket = () => {
    setTicket({ code: "", type: "", price: "", terms: "" });
    setShowModal(true);
  };

  const handleEditTicket = (item) => {
    setTicket(item);
    setShowEditModal(true);
  };

  const handleDeleteTicket = (item) => {
    setTicket(item);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/ticket/${ticket.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setData(data.filter((i) => i.id !== ticket.id));
      showNotification("Tiket berhasil dihapus", "success");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      showNotification("Gagal menghapus tiket", "error");
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...ticket,
        price: Number(ticket.price),
      };

      const method = showModal ? "POST" : "PUT";
      const url = showModal
        ? "http://localhost:5001/api/ticket"
        : `http://localhost:5001/api/ticket/${ticket.id}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (showModal) {
        setData([...data, result]);
        showNotification("Tiket berhasil ditambahkan", "success");
      } else {
        setData(data.map((i) => (i.id === ticket.id ? result : i)));
        showNotification("Tiket berhasil diperbarui", "success");
      }

      setShowModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving ticket:", error);
      showNotification("Gagal menyimpan tiket", "error");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const NotificationToast = ({ notification }) => {
    if (!notification) return null;

    const bgColor = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
    }[notification.type];

    const icon = {
      success: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      error: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    }[notification.type];

    return (
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${bgColor} text-white rounded-lg shadow-lg overflow-hidden animate-fade-in`}
      >
        <div className="flex items-center p-4 w-full max-w-xs">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3 text-sm font-normal flex-1">
            {notification.message}
          </div>
          <button
            type="button"
            className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20 focus:outline-none"
            onClick={() => setNotification(null)}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="h-1 bg-white bg-opacity-30 w-full">
          <div className="h-full bg-white bg-opacity-70 animate-progress" />
        </div>
      </div>
    );
  };

  return (
    <>
      <Template />

      {/* Notification Toast */}
      <NotificationToast notification={notification} />

      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container py-5">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title fw-semibold mb-0 text-white">
                Data Tiket Museum Lampung
              </h2>
            </div>
            <div className="card-body p-4">
              <p className="text-muted mb-4">
                Kelola data tiket museum. Anda dapat menambah, mengedit, atau
                menghapus tiket.
              </p>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div></div>
                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleAddTicket}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Tambah Tiket
                </button>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Memuat data...</p>
                </div>
              ) : data.length === 0 ? (
                <div className="text-center py-5">
                  <i
                    className="bi bi-ticket-perforated text-muted"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <p className="mt-3 text-muted">Belum ada data tiket</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-primary">
                      <tr>
                        <th width="5%">No</th>
                        <th width="15%">Kode Tiket</th>
                        <th width="20%">Jenis Tiket</th>
                        <th width="15%">Harga</th>
                        <th width="30%">Syarat dan Ketentuan</th>
                        <th width="15%">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <span className="badge bg-primary bg-opacity-10 text-white w-50">
                              {item.code}
                            </span>
                          </td>
                          <td>{item.type}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "300px" }}
                            title={item.terms}
                          >
                            {item.terms}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                onClick={() => handleEditTicket(item)}
                              >
                                <i className="bi bi-pencil me-1"></i> Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                onClick={() => handleDeleteTicket(item)}
                              >
                                <i className="bi bi-trash me-1"></i> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white">
                  <i className="bi bi-ticket-perforated me-2 "></i>
                  Tambah Tiket Baru
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">
                      Kode Tiket <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      value={ticket.code}
                      onChange={handleChange}
                      placeholder="Contoh: TKT-001"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Jenis Tiket <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="type"
                      className="form-control"
                      value={ticket.type}
                      onChange={handleChange}
                      placeholder="Contoh: Dewasa, Anak-anak, Pelajar"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Harga <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">Rp</span>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={ticket.price}
                        onChange={handleChange}
                        placeholder="Contoh: 15000"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Syarat dan Ketentuan{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="terms"
                      className="form-control"
                      rows="5"
                      value={ticket.terms}
                      onChange={handleChange}
                      placeholder="Masukkan syarat dan ketentuan tiket"
                      required
                    ></textarea>
                    <div className="form-text">
                      Gunakan titik koma (;) untuk memisahkan poin-poin
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-save me-1"></i> Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white">
                  <i className="bi bi-ticket-perforated me-2"></i>
                  Edit Tiket
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">
                      Kode Tiket <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      value={ticket.code}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Jenis Tiket <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="type"
                      className="form-control"
                      value={ticket.type}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Harga <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">Rp</span>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={ticket.price}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Syarat dan Ketentuan{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="terms"
                      className="form-control"
                      rows="5"
                      value={ticket.terms}
                      onChange={handleChange}
                      required
                    ></textarea>
                    <div className="form-text">
                      Gunakan titik koma (;) untuk memisahkan poin-poin
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-save me-1"></i> Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title text-white"
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Konfirmasi Hapus
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus tiket berikut?</p>
                <div className="alert alert-warning p-2">
                  <p className="mb-1">
                    <strong>Kode:</strong> {ticket.code}
                  </p>
                  <p className="mb-1">
                    <strong>Jenis:</strong> {ticket.type}
                  </p>
                  <p className="mb-0">
                    <strong>Harga:</strong> {formatPrice(ticket.price)}
                  </p>
                </div>
                <p className="text-black">Aksi ini tidak dapat dibatalkan!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  <i className="bi bi-trash me-1"></i> Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-progress {
          animation: progress 10s linear forwards;
        }
        .modal-header {
          background-color: #d32f2f !important;
          color: white;
        }
      `}</style>
    </>
  );
}
