"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";
import page from "@/config/page";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiTrash2,
} from "react-icons/fi";

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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${page.baseUrl}/api/ticket`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
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
      const res = await fetch(`${page.baseUrl}/api/ticket/${ticket.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await fetchData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...ticket,
        price: Number(ticket.price),
        terms: ticket.terms.split("\n").join("; "),
      };

      const method = showModal ? "POST" : "PUT";
      const url = showModal
        ? page.baseUrl + "/api/ticket"
        : `${page.baseUrl}/api/ticket/${ticket.id}`;

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

      await fetchData();
      showNotification(
        showModal ? "Tiket berhasil ditambahkan" : "Tiket berhasil diperbarui",
        "success"
      );

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

  const renderTerms = (terms) => {
    if (!terms) return <span className="text-muted">Tidak ada syarat</span>;

    return terms.split(";").map(
      (term, index) =>
        term.trim() && (
          <div key={`term-${index}`} className="mb-1">
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            {term.trim()}
          </div>
        )
    );
  };

  return (
    <>
      <Template />

      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container py-5">
          <div className="card shadow-sm border-0 mt-5">
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
                        <tr key={`ticket-${item.id}`}>
                          <td>{idx + 1}</td>
                          <td>
                            <span className="badge bg-primary bg-opacity-10 text-primary w-50">
                              {item.code}
                            </span>
                          </td>
                          <td>{item.type}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td style={{ maxWidth: "300px" }}>
                            {renderTerms(item.terms)}
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
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white">
                  <i className="bi bi-ticket-perforated me-2"></i>
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
                <form onSubmit={handleSubmit}>
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
                      placeholder="Masukkan syarat dan ketentuan, pisahkan dengan titik koma (;) atau baris baru"
                      required
                    />
                    <div className="form-text">
                      Pisahkan setiap poin dengan titik koma (;) atau baris baru
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
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
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
                <form onSubmit={handleSubmit}>
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
                    />
                    <div className="form-text">
                      Pisahkan setiap poin dengan titik koma (;) atau baris baru
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
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(3px)",
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 overflow-hidden">
              <div className="modal-header bg-gradient-danger text-white py-3">
                <h5 className="modal-title text-white d-flex align-items-center">
                  <FiAlertCircle className="me-2" size={24} />
                  <span>Konfirmasi Penghapusan</span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 mb-4">
                  <div className="d-flex">
                    <FiAlertTriangle
                      className="me-2 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <h6 className="alert-heading fw-bold mb-2">Perhatian!</h6>
                      <p className="mb-0">
                        Anda akan menghapus tiket berikut secara permanen:
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-light p-3 rounded mb-4">
                  <div className="d-flex mb-2">
                    <span
                      className="text-muted flex-shrink-0"
                      style={{ width: "80px" }}
                    >
                      Kode:
                    </span>
                    <span className="fw-semibold">{ticket.code}</span>
                  </div>
                  <div className="d-flex mb-2">
                    <span
                      className="text-muted flex-shrink-0"
                      style={{ width: "80px" }}
                    >
                      Jenis:
                    </span>
                    <span className="fw-semibold">{ticket.type}</span>
                  </div>
                  <div className="d-flex">
                    <span
                      className="text-muted flex-shrink-0"
                      style={{ width: "80px" }}
                    >
                      Harga:
                    </span>
                    <span className="fw-semibold">
                      {formatPrice(ticket.price)}
                    </span>
                  </div>
                </div>

                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25">
                  <div className="d-flex">
                    <FiAlertCircle
                      className="me-2 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span className="fw-semibold">
                      Aksi ini tidak dapat dibatalkan!
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4 py-2 rounded-pill d-flex align-items-center"
                  onClick={handleConfirmDelete}
                >
                  <FiTrash2 className="me-2" size={18} />
                  <span>Hapus Permanen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content overflow-hidden">
              <div
                className={`modal-header ${
                  notification.type === "success"
                    ? "bg-gradient-success"
                    : "bg-gradient-danger"
                } text-white border-0`}
              >
                <h5 className="modal-title d-flex align-items-center gap-2">
                  {notification.type === "success" ? (
                    <>
                      <FiCheckCircle size={20} />
                      <span className="text-white">Berhasil!</span>
                    </>
                  ) : (
                    <>
                      <FiAlertTriangle size={20} />
                      <span>Terjadi Kesalahan</span>
                    </>
                  )}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setNotification(null)}
                />
              </div>
              <div className="modal-body text-center p-4">
                <div
                  className={`${
                    notification.type === "success"
                      ? "bg-success bg-opacity-10"
                      : "bg-danger bg-opacity-10"
                  } rounded-circle d-inline-flex p-4 mb-3`}
                >
                  {notification.type === "success" ? (
                    <FiCheckCircle size={40} className="text-success" />
                  ) : (
                    <FiAlertTriangle size={40} className="text-danger" />
                  )}
                </div>
                <h4 className="h5 fw-bold mb-3">
                  {notification.type === "success"
                    ? "Operasi Berhasil"
                    : "Perhatian!"}
                </h4>
                <p className="mb-4 fs-5">{notification.message}</p>
                <button
                  type="button"
                  className={`btn ${
                    notification.type === "success"
                      ? "btn-success px-4 py-2"
                      : "btn-danger px-4 py-2"
                  } rounded-pill fw-medium`}
                  onClick={() => setNotification(null)}
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .modal-backdrop {
          opacity: 0.5 !important;
        }
        .badge.bg-primary-opacity-10 {
          background-color: rgba(13, 110, 253, 0.1) !important;
        }
        .modal {
          backdrop-filter: blur(2px);
        }
        .bg-gradient-danger {
          background: linear-gradient(135deg, #ff4d4d, #d93636);
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
        }
        .modal-content {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border-radius: 12px;
        }
        .rounded-pill {
          border-radius: 50px !important;
        }
        .btn-danger {
          background-color: #ff4d4d;
          border-color: #ff4d4d;
          transition: all 0.3s ease;
        }
        .btn-danger:hover {
          background-color: #d93636;
          border-color: #d93636;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(217, 54, 54, 0.3);
        }
        .btn-outline-secondary:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </>
  );
}