"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import {getCookie } from "cookies-next";
import {FiImage } from "react-icons/fi";


export default function VenueAdminPage() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const [venue, setVenue] = useState({name: "", year: "", description: "", photo: "" });
  const [showImage, setShowImage] = useState({})

  const token = getCookie("token");

  console.log(venue)

  useEffect(() => {
    if (!token) return;
  
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/venue", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (res.status === 200) {
          setData(result);
        } else {
          console.error("Gagal mengambil data:", result.metaData?.message);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };
  
    fetchData();
  }, [token]);
  

  const handleAddVenue = () => {
    setVenue({name: "", year: "", description: "", photo: "" });
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
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setData(data.filter((i) => i.id !== venue.id));
        setMessage("Koleksi berhasil dihapus");
      } else {
        alert(result.metaData?.message || "Gagal menghapus");
      }      
    } catch (error) {
      console.error("Error delete:", error);
      alert("Terjadi kesalahan saat menghapus data.");
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
      alert("Hanya file JPG atau PNG yang diperbolehkan.");
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
  
      // Cek apakah foto adalah File object
      if (venue.photo instanceof File) {
        formData.append("photo", venue.photo);
      }
  
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
  
      const result = await res.json();
  
      if (res.status < 300) {
        // Ambil data baru dari response
        const newVenue = result.data || venue;
        if (showModal) {
          setData([...data, newVenue]);
        } else {
          setData(data.map((i) => (i.id === venue.id ? newVenue : i)));
        }
  
        setMessage(showModal ? "Koleksi berhasil ditambahkan" : "Koleksi berhasil diperbarui");
        setShowModal(false);
        setShowEditModal(false);
        setVenue({name: "", year: "", description: "", photo: ""});
        setShowImage(null);
      } else {
        alert(result.metaData?.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error saat menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };
  

  console.log(data)

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="container">
          <div className="card w-100 shadow-none">
            <div className="card-body p-5">
              <h2 className="fw-semibold mb-4">Data Koleksi</h2>
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={handleAddVenue}>
                  + Tambah Data
                </button>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead style={{ backgroundColor: "rgba(116, 80, 45, 0.18)" }}>
                    <tr>
                      <th>No</th>
                      <th>Kode Koleksi</th>
                      <th>Nama Koleksi</th>
                      <th>Tahun</th>
                      <th>Deskripsi</th>
                      <th>Foto</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={item.id}>  
                        <td>{idx + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.year}</td>
                        <td style={{ whiteSpace: "pre-wrap", maxWidth: "200px" }}>{item.description}</td>
                        <td>
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          {item.photo ? (
                            <img
                            style={{width: 100, height:100}}
                              src={`http://localhost:5001/uploads/${
                                item.photo
                              }?t=${new Date().getTime()}`}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiYjMzszMztjdXJyZW50Q29sb3ImIzMzOzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNCAxNmw0LjU4Ni00LjU4NmEyIDIgMCAwMTIuODI4IDBMMTYgMTZtLTItMmwxLjU4Ni0xLjU4NmEyIDIgMCAwMTIuODI4IDBMMjAgMTRtLTYtNmguMDFNNiAyMGgxMmEyIDIgMCAwMDItMlY2YTIgMiAwIDAwLTItMkg2YTIgMiAwIDAwLTIgMnYxMmEyIDIgMCAwMDIgMnoiPjwvcGF0aD48L3N2Zz4=";
                              }}
                            />
                          ) : (
                            <FiImage className="text-gray-400 h-5 w-5" />
                          )}
                          </div>

                        </td>
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditVenue(item)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVenue(item)}>Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(showModal || showEditModal) && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{showModal ? "Tambah Koleksi" : "Edit Koleksi"}</h5>
                <button className="btn-close" onClick={() => { setShowModal(false); setShowEditModal(false); }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nama Koleksi</label>
                  <input type="text" name="name" className="form-control" value={venue.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tahun</label>
                  <input type="text" name="year" className="form-control" value={venue.year} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deskripsi</label>
                  <textarea name="description" className="form-control" rows="5" value={venue.description} onChange={handleChange}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Foto (jpg/png)</label>
                  <input type="file" name="photo" accept="image/jpeg, image/png" className="form-control" onChange={handleFileUpload} />
                  {showImage && (
                    <div className="mt-2">
                      <img src={showImage} alt="Preview" style={{ maxHeight: "150px" }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSubmit}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Hapus</h5>
                <button className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus koleksi ini?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={handleConfirmDelete}>Hapus</button>
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="alert alert-success fixed-bottom text-center">
          {message}
        </div>
      )}
    </>
  );
}
