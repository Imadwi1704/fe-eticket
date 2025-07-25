
"use client";

import { useState, useEffect, useCallback } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";
import page from "@/config/page";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiTrash2,
  FiEdit,
  FiPlus,
  FiImage,
  FiAlertTriangle
} from "react-icons/fi";
import Image from "next/image";

export default function GalleryAdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, type: "", title: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gallery, setGallery] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    image: null,
    existingImageUrl: "",
  });

  const categories = [
    { value: "GALLERY", label: "Galeri" },
    { value: "FACILITY", label: "Fasilitas" },
    { value: "EVENT", label: "Acara" },
  ];

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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${page.baseUrl}/api/gallery`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok) {
        setData(result.data || result);
      } else {
        setNotification({
          message: "Gagal mengambil data gallery",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: "Terjadi kesalahan saat mengambil data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const handleAddGallery = () => {
    setGallery({
      id: "",
      title: "",
      description: "",
      category: "",
      image: null,
      existingImageUrl: "",
    });
    setModal({ show: true, type: "add", title: "Tambah Gallery" });
  };

  const handleEditGallery = (item) => {
    setGallery({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      image: null,
      existingImageUrl: item.imageUrl,
    });
    setModal({ show: true, type: "edit", title: "Edit Gallery" });
  };

  const handleDeleteGallery = (item) => {
    setGallery(item);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${page.baseUrl}/api/gallery/${gallery.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setData(data.filter((i) => i.id !== gallery.id));
        setNotification({
          message: "Gallery berhasil dihapus",
          type: "success",
        });
      } else {
        const result = await res.json();
        setNotification({
          message: result.message || "Gagal menghapus gallery",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: "Terjadi kesalahan saat menghapus data",
        type: "error",
      });
    }
    setShowConfirmModal(false);
  };

  const mapCategory = (category) => {
    switch (category) {
      case "GALLERY":
        return "Galeri";
      case "FACILITY":
        return "Fasilitas";
      case "EVENT":
        return "Acara";
      default:
        return category || "-";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGallery((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Clean up previous blob URL if exists
      if (gallery.image) {
        URL.revokeObjectURL(URL.createObjectURL(gallery.image));
      }

      setGallery((prev) => ({
        ...prev,
        image: e.target.files[0],
        existingImageUrl: "",
      }));
    }
  };

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (gallery.image) {
        URL.revokeObjectURL(URL.createObjectURL(gallery.image));
      }
    };
  }, [gallery.image]);

  const handleSubmit = async () => {
    if (!gallery.title || !gallery.description || !gallery.category) {
      setNotification({
        message: "Harap isi semua field teks",
        type: "error",
      });
      return;
    }
    if (modal.type === "add" && !gallery.image && !gallery.existingImageUrl) {
      setNotification({
        message: "Harap pilih gambar",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", gallery.title);
    formData.append("description", gallery.description);
    formData.append("category", gallery.category);

   
    formData.append("image", gallery.image);

    try {
      const url =
        modal.type === "add"
          ? `${page.baseUrl}/api/gallery`
          : `${page.baseUrl}/api/gallery/${gallery.id}`;

      const method = modal.type === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        if (modal.type === "add") {
          setData([result.data, ...data]);
        } else {
          setData(data.map((i) => (i.id === gallery.id ? result.data : i)));
        }
        setNotification({
          message: `Gallery berhasil ${
            modal.type === "add" ? "ditambahkan" : "diperbarui"
          }`,
          type: "success",
        });
        setModal({ show: false, type: "", title: "" });
      } else {
        const result = await res.json();
        setNotification({
          message: result.message || "Gagal menyimpan data",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: "Terjadi kesalahan saat menyimpan data",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const NotificationToast = ({ notification, setNotification }) => {
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

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container-fluid p-5">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title fw-semibold text-white mb-0">
                Data Gallery Museum Lampung
              </h2>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <p className="text-muted mb-0">
                    Kelola data gallery untuk menambah, mengedit,
                    atau menghapus koleksi.
                  </p>
                </div>
              </div>
               <div className="d-flex justify-content-between align-items-center mb-4">
                <div></div>
                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleAddGallery}
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
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead
                      style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                    >
                      <tr>
                        <th>No</th>
                        <th>Judul</th>
                        <th>Deskripsi</th>
                        <th>Kategori</th>
                        <th>Gambar</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.title}</td>
                          <td
                            style={{
                              whiteSpace: "pre-wrap",
                              maxWidth: "200px",
                            }}
                          >
                            {item.description}
                          </td>
                          <td>{mapCategory(item.category)}</td>
                          <td>
                            <div
                              className="flex items-center justify-center bg-gray-100 rounded-md overflow-hidden border"
                              style={{ borderColor: "rgba(13, 110, 253, 0.2)" }}
                            >
                              {item.imageUrl ? (
                                <Image
                                  width={100}
                                  height={100}
                                  src={`${
                                    process.env.NEXT_PUBLIC_API_BASE_URL
                                  }/uploads/${
                                    item.imageUrl
                                  }?t=${new Date().getTime()}`}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  crossOrigin="anonymous"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMmU0ZTQiLz48dGV4dCB4PSIyMCIgeT0iNTUiIGZvbnQtc2l6ZT0iMTBweCIgZmlsbD0iIzc3NyI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg==";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                  Tidak Ada Data Image
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm d-flex align-items-center"
                                onClick={() => handleEditGallery(item)}
                                style={{
                                  backgroundColor: "rgba(13, 110, 253, 0.1)",
                                  color: "#0d6efd",
                                }}
                              >
                                <FiEdit size={14} className="me-1" /> Edit
                              </button>
                              <button
                                className="btn btn-sm d-flex align-items-center"
                                onClick={() => handleDeleteGallery(item)}
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
      {modal.show && (
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
                  className="modal-title fw-bold"
                  style={{ color: "#0d6efd" }}
                >
                  {modal.title}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModal({ show: false, type: "", title: "" })}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Judul</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={gallery.title}
                    onChange={handleChange}
                    style={{ borderColor: "rgba(13, 110, 253, 0.3)" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Kategori</label>
                  <select
                    name="category"
                    className="form-control"
                    value={gallery.category}
                    onChange={handleChange}
                    style={{ borderColor: "rgba(13, 110, 253, 0.3)" }}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Deskripsi</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="5"
                    value={gallery.description}
                    onChange={handleChange}
                    style={{ borderColor: "rgba(13, 110, 253, 0.3)" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gambar (jpg/png)</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg, image/png"
                    className="form-control"
                    onChange={handleImageChange}
                    style={{ borderColor: "rgba(13, 110, 253, 0.3)" }}
                  />
                </div>
                <div className="mt-3 text-center">
                  {gallery.image ? (
                    <Image
                      src={URL.createObjectURL(gallery.image)}
                      alt="Preview"
                      width={300}
                      height={200}
                      style={{
                        objectFit: "contain",
                        border: "2px dashed rgba(13, 110, 253, 0.3)",
                        borderRadius: "8px",
                        padding: "4px",
                      }}
                      onLoad={() =>
                        URL.revokeObjectURL(URL.createObjectURL(gallery.image))
                      }
                    />
                  ) : gallery.existingImageUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${gallery.existingImageUrl}`}
                      alt="Existing"
                      width={300}
                      height={200}
                      style={{
                        objectFit: "contain",
                        border: "2px dashed rgba(13, 110, 253, 0.3)",
                        borderRadius: "8px",
                        padding: "4px",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-gray-100 flex items-center justify-center"
                      style={{ width: 300, height: 200 }}
                    >
                      <FiImage className="text-gray-400" size={48} />
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
                  onClick={() => setModal({ show: false, type: "", title: "" })}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  className="btn text-white"
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#0d6efd" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
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
                  className="modal-title fw-bold"
                  style={{ color: "#0d6efd" }}
                >
                  Konfirmasi Penghapusan
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus data gallery ini?</p>
                <p className="fw-bold">{gallery.title}</p>
              </div>
              <div
                className="modal-footer"
                style={{ borderTopColor: "rgba(13, 110, 253, 0.2)" }}
              >
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  className="btn text-white"
                  onClick={handleConfirmDelete}
                  style={{ backgroundColor: "#dc3545" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Notification Modal */}
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
    </>
  );
}
