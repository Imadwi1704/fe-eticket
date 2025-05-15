"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";

export default function ticketAdminPage() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState({name: "", price: "", terms: "", photo: "" });

  const token = getCookie("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/ticket", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const result = await res.json();
        setData(result)
        if (res.ok === 200) {
          setData(result)
        } else {
          console.error("Gagal mengambil data:", result.metaData?.message);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleAddTicket = () => {
    setTicket({code: "", type: "", price: "", terms: "" });
    setShowModal(true);
  };

  const handleEditTicket = (item) => {
    console.log(item,"item di modal update")
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
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setData(data.filter((i) => i.id !== ticket.id));
        setMessage("Tiket berhasil dihapus");
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
    setTicket((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async () => {
    try {
      const payload = {
        ...ticket,
        price: Number(ticket.price)
      }
      console.log(payload,"payload")
      const method = showModal ? "POST" : "PUT";
      const url = showModal
        ? "http://localhost:5001/api/ticket"
        : `http://localhost:5001/api/ticket/${ticket.id}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok < 300) {
        if (showModal) {
          setData([...data, ticket]);
        } else {
          setData(data.map((i) => (i.id === ticket.id ? ticket : i)));
        }

        setMessage(showModal ? "Tiket berhasil ditambahkan" : "Tiket berhasil diperbarui");
        setShowModal(false);
        setShowEditModal(false);
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
              <h2 className="fw-semibold mb-4">Data Tiket</h2>
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={handleAddTicket}>
                  + Tambah Data
                </button>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead style={{ backgroundColor: "rgba(116, 80, 45, 0.18)" }}>
                    <tr>
                      <th>No</th>
                      <th>Kode Tiket</th>
                      <th>Jenis Tiket</th>
                      <th>Harga</th>
                      <th>Syarat dan Ketntuan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={item.id}>  
                        <td>{idx + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.type}</td>
                        <td>{item.price}</td>
                        <td>{item.terms}</td>
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditTicket(item)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTicket(item)}>Hapus</button>
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
                <h5 className="modal-title">{showModal ? "Tambah Tiket" : "Edit Tiket"}</h5>
                <button className="btn-close" onClick={() => { setShowModal(false); setShowEditModal(false); }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Kode Tiket</label>
                  <input type="text" name="code" className="form-control" value={ticket.code} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Jenis Tiket</label>
                  <input type="text" name="type" className="form-control" value={ticket.type} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input type="number" name="price" className="form-control" value={ticket.price} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Syarat dan ketentuan</label>
                  <textarea name="terms" className="form-control" rows="5" value={ticket.terms} onChange={handleChange}></textarea>
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
                <p>Apakah Anda yakin ingin menghapus Tiket ini?</p>
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
