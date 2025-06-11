"use client";
import { useState } from "react";
import Template from "@/components/admin/Template";
import Image from "next/image";

export default function AdminProfile() {
  const [admin, setAdmin] = useState({
    nama: "Admin ERUWAIJUARAI",
    email: "admin@museumlampung.id",
    jabatan: "Administrator",
    foto: "", // bisa base64 atau URL foto
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdmin((prev) => ({
          ...prev,
          foto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Hanya file JPG atau PNG yang diperbolehkan.");
    }
  };

  return (
    <>
      <Template />
      <div className="container py-5">
        <div className="card shadow p-4">
          <h3 className="mb-4">Profil Admin</h3>
          <div className="row">
            <div className="col-md-4 text-center">
              <Image
                src={admin.foto || "/default-avatar.png"}
                alt="Foto Admin"
                className="img-thumbnail rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              {editMode && (
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  className="form-control"
                  onChange={handleFileChange}
                />
              )}
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  className="form-control"
                  value={admin.nama}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={admin.email}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Jabatan</label>
                <input
                  type="text"
                  name="jabatan"
                  className="form-control"
                  value={admin.jabatan}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="d-flex justify-content-end">
                {editMode ? (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => setEditMode(false)}
                    >
                      Simpan
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
