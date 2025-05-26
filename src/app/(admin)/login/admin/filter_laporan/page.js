"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Template from "@/components/admin/Template";

const FilterLaporan = () => {
  const router = useRouter();
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [daftarTiket, setDaftarTiket] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");

  const tahunSekarang = new Date().getFullYear();
  const daftarTahun = Array.from({ length: tahunSekarang - 2009 }, (_, i) => tahunSekarang - i);

  useEffect(() => {
  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/ticket");
      const data = await res.json();
      console.log("Data tiket:", data); // <--- Tambahkan ini

      if (res.ok) {
        // Cek apakah data.tickets atau data langsung array
        setDaftarTiket(data.tickets || data); 
      } else {
        console.error("Gagal ambil tiket:", data.message);
      }
    } catch (err) {
      console.error("Error fetch tiket:", err);
    }
  };

  fetchTickets();
}, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bulan || !tahun || !selectedTicket) {
      alert("Silakan pilih tiket, bulan, dan tahun terlebih dahulu.");
      return;
    }

    // Redirect ke halaman laporan dengan query string
    router.push(
      `/login/admin/filter_laporan/laporan?tiket=${selectedTicket}&bulan=${bulan}&tahun=${tahun}`
    );
  };

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="container">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h2 className="card-title fw-semibold mb-4">Filter Laporan Pemesanan</h2>
            <p className="mb-4 text-muted">
              Gunakan filter di bawah ini untuk melihat data tiket berdasarkan bulan dan tahun.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Filter Tiket */}
              <div className="form-group row mb-4">
                <label htmlFor="tiket" className="col-sm-4 col-form-label fw-bold">
                  Tiket
                </label>
                <div className="col-sm-8">
                 <select
  id="tiket"
  name="tiket"
  className="form-select text-black"
  value={selectedTicket}
  onChange={(e) => setSelectedTicket(e.target.value)}
  required
>
  <option value="">--- Pilih Tiket ---</option>
  <option value="semua">Semua Tiket</option>
  {Array.isArray(daftarTiket) &&
    daftarTiket.map((tiket) => (
      <option key={tiket.id} value={tiket.id}>
        {tiket.type}
      </option>
    ))}
</select>

                </div>
              </div>

              {/* Filter Bulan */}
              <div className="form-group row mb-4">
                <label htmlFor="bulan" className="col-sm-4 col-form-label fw-bold">
                  Bulan
                </label>
                <div className="col-sm-8">
                  <select
                    id="bulan"
                    name="bulan"
                    className="form-select text-black"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                    required
                  >
                    <option value="">--- Pilih Bulan ---</option>
                    {[
                      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                    ].map((namaBulan, index) => (
                      <option key={index} value={(index + 1).toString().padStart(2, "0")}>
                        {namaBulan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Tahun */}
              <div className="form-group row mb-4">
                <label htmlFor="tahun" className="col-sm-4 col-form-label fw-bold">
                  Tahun
                </label>
                <div className="col-sm-8">
                  <select
                    id="tahun"
                    name="tahun"
                    className="form-select text-black"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    required
                  >
                    <option value="">--- Pilih Tahun ---</option>
                    {daftarTahun.map((thn) => (
                      <option key={thn} value={thn}>
                        {thn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tombol Submit */}
              <div className="text-start">
                <button
                  type="submit"
                  className="btn d-flex align-items-center px-4 py-2"
                  style={{
                    backgroundColor: "#714D29",
                    color: "white",
                    border: "none",
                    fontSize: "16px",
                    transition: "0.3s",
                  }}
                >
                  <i className="bi bi-search me-2" style={{ fontSize: "18px" }}></i>
                  Filter Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default FilterLaporan;
