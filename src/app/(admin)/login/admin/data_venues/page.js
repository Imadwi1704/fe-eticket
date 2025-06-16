"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";
import {
  FiImage,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheckCircle,
} from "react-icons/fi";
import Image from "next/image";

export default function VenueAdminPage() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const [venue, setVenue] = useState({
    name: "",
    year: "",
    description: "",
    photo: "",
  });
  const [showImage, setShowImage] = useState({});
  const [loading, setLoading] = useState(true);

  const token = getCookie("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/venue", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (res.status === 200) {
          setData(result);
        } else {
          console.error("Failed to fetch data:", result.metaData?.message);
        }
      } catch (error) {
        console.error("Error while fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAddVenue = () => {
    setVenue({ name: "", year: "", description: "", photo: "" });
    setShowModal(true);
  };

  const handleEditVenue = (item) => {
    setVenue(item);
    setShowImage(`http://localhost:5001/uploads/${item.photo}`);
    setShowEditModal(true);
  };

  const handleDeleteVenue = (item) => {
    setVenue(item);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/venue/${venue.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setData(data.filter((i) => i.id !== venue.id));
        setMessage("Collection successfully deleted");
      } else {
        alert(result.metaData?.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error occurred while deleting data.");
    }
    setShowConfirmModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenue((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setVenue((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only JPG or PNG files are allowed.");
    }
  };

  const handleSubmit = async () => {
    try {
      const method = showModal ? "POST" : "PUT";
      const url = showModal
        ? "http://localhost:5001/api/venue"
        : `http://localhost:5001/api/venue/${venue.id}`;

      const formData = new FormData();
      formData.append("name", venue.name);
      formData.append("year", venue.year);
      formData.append("description", venue.description);

      if (venue.photo instanceof File) {
        formData.append("photo", venue.photo);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.status < 300) {
        const newVenue = result.data || venue;
        if (showModal) {
          setData([...data, newVenue]);
        } else {
          setData(data.map((i) => (i.id === venue.id ? newVenue : i)));
        }

        setMessage(
          showModal
            ? "Collection successfully added"
            : "Collection successfully updated"
        );
        setShowModal(false);
        setShowEditModal(false);
        setVenue({ name: "", year: "", description: "", photo: "" });
        setShowImage(null);
      } else {
        alert(result.metaData?.message || "Failed to save data");
      }
    } catch (error) {
      console.error("Error while saving:", error);
      alert("Error occurred while saving data.");
    }
  };

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container-fluid py-5">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title fw-semibold text-white mb-0">
                Data Koleksi Museum Lampung
              </h2>
            </div>
            <div className="card-body p-4">
              <div>
                  <p className="text-muted mb-0">
                    Kelola data koleksi museum. Anda dapat menambah, mengedit,
                    atau menghapus koleksi.
                  </p>
                </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div></div>
                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleAddVenue}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Tambah Koleksi
                </button>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead
                      style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                    >
                      <tr className="text-white">
                        <th className="text-dark">No</th>
                        <th className="text-dark">Kode Koleksi</th>
                        <th className="text-dark">Nama Koleksi</th>
                        <th className="text-dark">Tahun</th>
                        <th className="text-dark">Deskripsi</th>
                        <th className="text-dark">Photo</th>
                        <th className="text-dark">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.year}</td>
                          <td
                            style={{
                              whiteSpace: "pre-wrap",
                              maxWidth: "200px",
                            }}
                          >
                            {item.description}
                          </td>
                          <td>
                            <div
                              className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden border"
                              style={{ borderColor: "rgba(13, 110, 253, 0.2)" }}
                            >
                              {item.photo ? (
                                <Image
                                  style={{ objectFit: "cover" }}
                                  width={"200"}
                                  height={"100"}
                                  src={`http://localhost:5001/uploads/${
                                    item.photo
                                  }?t=${new Date().getTime()}`}
                                  alt={item.name}
                                  className="h-full w-full"
                                  crossOrigin="anonymous"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiYjMzszMztjdXJyZW50Q29sb3ImIzMzOzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNCAxNmw0LjU4Ni00LjU4NmEyIDIgMCAwMTIuODI4IDBMMTYgMTZtLTItMmwxLjU4Ni0xLjU4NmEyIDIgMCAwMTIuODI4IDBMMjAgMTRtLTYtNmguMDFNNiAyMGgxMmEyIDIgMCAwMDItMlY2YTIgMiAwIDAwLTItMkg2YTIgMiAwIDAwLTIgMnYxMmEyIDIgMCAwMDIgMnoiPjwvcGF0aD48L3N2Zz4=";
                                  }}
                                />
                              ) : (
                                <FiImage className="text-muted h-5 w-5" />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm d-flex align-items-center"
                                onClick={() => handleEditVenue(item)}
                                style={{
                                  backgroundColor: "rgba(13, 110, 253, 0.1)",
                                  color: "#0d6efd",
                                }}
                              >
                                <FiEdit2 size={14} className="me-1" /> Edit
                              </button>
                              <button
                                className="btn btn-sm d-flex align-items-center"
                                onClick={() => handleDeleteVenue(item)}
                                style={{
                                  backgroundColor: "rgba(220, 53, 69, 0.1)",
                                  color: "#dc3545",
                                }}
                              >
                                <FiTrash2 size={14} className="me-1" /> Hapus
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

      {/* Add/Edit Modal */}
      {(showModal || showEditModal) && (
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
                <h5 className="modal-title fw-bold text-white">
                  {showModal ? "Tambah Koleksi" : "Edit Koleksi"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setShowEditModal(false);
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Collection Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={venue.name}
                    onChange={handleChange}
                    style={{ borderColor: "rgba(13, 110, 253, 0.3)" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Year</label>
                  <input
                    type="text"
                    name="year"
                    className="form-control"
                    value={venue.year}
                    onChange={handleChange}
                    style={{ borderColor: "rgba(13, 110, 253, 0.3)" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="5"
                    value={venue.description}
                    onChange={handleChange}
                    style={{ borderColor: "rgba(13, 110, 253, 0.3)" }}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Photo (jpg/png)</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/jpeg, image/png"
                    className="form-control"
                    onChange={handleFileUpload}
                    style={{ borderColor: "rgba(13, 110, 253, 0.3)" }}
                  />
                  {showImage && (
                    <div className="mt-3 text-center">
                      <Image
                        src={showImage}
                        alt="Preview"
                        width={50} // pastikan menambahkan width dan height jika pakai next/image
                        height={50}
                        style={{
                     
                          border: "2px dashed rgba(13, 110, 253, 0.3)",
                          borderRadius: "8px",
                          padding: "4px",
                        }}
                      />
                    </div>
                  )}
                
                </div>
              </div>
              <div
                className="modal-footer"
                style={{ borderTopColor: "rgba(13, 110, 253, 0.2)" }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn text-white"
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#0d6efd" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <h5
                  className="modal-title fw-bold text-white"
                >
                  Konfirmasi Hapus
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Apakah Kamu Yakin Menghapus Data Koleksi</p>
                <p className="fw-bold">{venue.name}</p>
              </div>
              <div
                className="modal-footer"
                style={{ borderTopColor: "rgba(13, 110, 253, 0.2)" }}
              >
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
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

      {/* Notification */}
      {message && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3"
          role="alert"
          style={{
            minWidth: "350px",
            animation: "slideIn 0.3s ease-out",
            backgroundColor: "#fff",
            borderLeft: "4px solid #0d6efd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div className="toast-body d-flex align-items-center">
            <FiCheckCircle className="fs-4 me-3" style={{ color: "#0d6efd" }} />
            <div>
              <h6 className="mb-1" style={{ color: "#0d6efd" }}>
                Success!
              </h6>
              <p className="mb-0 text-secondary">{message}</p>
            </div>
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => setMessage("")}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
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
        
      `}</style>
    </>
  );
}
