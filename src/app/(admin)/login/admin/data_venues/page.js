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
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import Image from "next/image";
import page from "@/config/page";
import LoadingSpinner from "@/components/spinner";

export default function VenueAdminPage() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [venue, setVenue] = useState({
    name: "",
    year: "",
    description: "",
    photo: "",
  });
  const [showImage, setShowImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = getCookie("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${page.baseUrl}/api/venue`, {
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
        showNotification("Failed to load venue data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddVenue = () => {
    setVenue({ name: "", year: "", description: "", photo: "" });
    setShowImage(null);
    setShowModal(true);
  };

  const handleEditVenue = (item) => {
    setVenue(item);
    setShowImage(
      item.photo 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.photo}`
        : null
    );
    setShowEditModal(true);
  };

  const handleDeleteVenue = (item) => {
    setVenue(item);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`${page.baseUrl}/api/venue/${venue.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setData(data.filter((i) => i.id !== venue.id));
      showNotification("Venue successfully deleted");
    } catch (error) {
      console.error("Error deleting venue:", error);
      showNotification("Failed to delete venue", "error");
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenue((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showNotification("Only JPG, PNG or WEBP files are allowed", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      showNotification("Image size should be less than 2MB", "error");
      return;
    }

    setVenue((prev) => ({ ...prev, photo: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setShowImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!venue.name || !venue.year) {
      showNotification("Name and year are required fields", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const method = showModal ? "POST" : "PUT";
      const url = showModal
        ? `${page.baseUrl}/api/venue`
        : `${page.baseUrl}/api/venue/${venue.id}`;

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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.metaData?.message || "Failed to save data");
      }

      const result = await res.json();
      const newVenue = result.data || venue;

      if (showModal) {
        setData([...data, newVenue]);
        showNotification("Venue successfully added");
      } else {
        setData(data.map((i) => (i.id === venue.id ? newVenue : i)));
        showNotification("Venue successfully updated");
      }

      setShowModal(false);
      setShowEditModal(false);
      setVenue({ name: "", year: "", description: "", photo: "" });
      setShowImage(null);
    } catch (error) {
      console.error("Error while saving venue:", error);
      showNotification(error.message || "Error occurred while saving data", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setShowConfirmModal(false);
    setVenue({ name: "", year: "", description: "", photo: "" });
    setShowImage(null);
  };

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container-fluid py-5">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title fw-semibold text-white mb-0">
                  Venue Management
                </h2>
                <button
                  className="btn btn-light btn-sm d-flex align-items-center"
                  onClick={handleAddVenue}
                >
                  <FiPlus size={16} className="me-1" />
                  Add Venue
                </button>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <p className="text-muted mb-0">
                  Manage venue data. You can add, edit, or delete venues.
                </p>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <LoadingSpinner />
                </div>
              ) : data.length === 0 ? (
                <div className="text-center py-5">
                  <FiImage size={48} className="text-muted mb-3" />
                  <h4>No Venues Found</h4>
                  <p className="text-muted">
                    There are no venues available. Add a new venue to get started.
                  </p>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={handleAddVenue}
                  >
                    <FiPlus size={16} className="me-1" />
                    Add Venue
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th>Description</th>
                        <th>Photo</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.year}</td>
                          <td className="text-truncate" style={{ maxWidth: "200px" }}>
                            {item.description || "-"}
                          </td>
                          <td>
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden border">
                              {item.photo ? (
                                <Image
                                  width={100}
                                  height={100}
                                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.photo}?t=${new Date().getTime()}`}
                                  alt={item.name}
                                  className="img-thumbnail"
                                  style={{ 
                                    objectFit: "cover",
                                    width: "50px",
                                    height: "50px"
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiYjMzszMztjdXJyZW50Q29sb3ImIzMzOzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNCAxNmw0LjU4Ni00LjU4NmEyIDIgMCAwMTIuODI4IDBMMTYgMTZtLTItMmwxLjU4Ni0xLjU4NmEyIDIgMCAwMTIuODI4IDBMMjAgMTRtLTYtNmguMDFNNiAyMGgxMmEyIDIgMCAwMDItMlY2YTIgMiAwIDAwLTItMkg2YTIgMiAwIDAwLTIgMnYxMmEyIDIgMCAwMDIgMnoiPjwvcGF0aD48L3N2Zz4=";
                                  }}
                                />
                              ) : (
                                <FiImage className="text-muted" size={20} />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                onClick={() => handleEditVenue(item)}
                              >
                                <FiEdit2 size={14} className="me-1" /> Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                onClick={() => handleDeleteVenue(item)}
                              >
                                <FiTrash2 size={14} className="me-1" /> Delete
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
        <div className="modal show d-block fade" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {showModal ? "Add New Venue" : "Edit Venue"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label required">Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={venue.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label required">Year</label>
                        <input
                          type="text"
                          name="year"
                          className="form-control"
                          value={venue.year}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          className="form-control"
                          rows="3"
                          value={venue.description}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Photo {!showModal && "(Leave empty to keep current)"}
                        </label>
                        <input
                          type="file"
                          name="photo"
                          accept="image/jpeg, image/png, image/webp"
                          className="form-control"
                          onChange={handleFileUpload}
                        />
                        {showImage && (
                          <div className="mt-3 text-center">
                            <Image
                              src={showImage}
                              alt="Preview"
                              width={200}
                              height={150}
                              className="img-thumbnail"
                              style={{
                                maxHeight: "200px",
                                objectFit: "contain"
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        {showModal ? "Adding..." : "Updating..."}
                      </>
                    ) : (
                      showModal ? "Add Venue" : "Update Venue"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal show d-block fade" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <FiAlertTriangle size={48} className="text-danger mb-3" />
                  <h5>Are you sure you want to delete this venue?</h5>
                  <p className="fw-bold">{venue.name}</p>
                  <p className="text-muted">This action cannot be undone.</p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div 
            className={`toast show ${notification.type === "success" ? "bg-success" : "bg-danger"} text-white`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">
                {notification.type === "success" ? "Success" : "Error"}
              </strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setNotification(null)}
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body d-flex align-items-center">
              {notification.type === "success" ? (
                <FiCheckCircle className="me-2" size={20} />
              ) : (
                <FiAlertTriangle className="me-2" size={20} />
              )}
              {notification.message}
            </div>
            <div 
              className="progress" 
              style={{ height: "3px" }}
            >
              <div 
                className={`progress-bar ${notification.type === "success" ? "bg-white" : "bg-warning"}`}
                style={{ width: "100%" }}
                onAnimationEnd={() => setNotification(null)}
              ></div>
            </div>
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
