"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Pakai next/navigation untuk push URL
import Template from "@/components/admin/Template";

const FilterLaporan = () => {
  const router = useRouter();
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());

  const tahunSekarang = new Date().getFullYear();
  const daftarTahun = Array.from({ length: tahunSekarang - 2009 }, (_, i) => tahunSekarang - i);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bulan || !tahun) {
      alert("Silakan pilih bulan dan tahun terlebih dahulu.");
      return;
    }

    // Redirect ke halaman laporan dengan query bulan & tahun
    router.push(`/login/admin/filter_laporan/laporan?bulan=${bulan}&tahun=${tahun}`);
  };

  return (
    <>
      <Template />
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h2 className="card-title fw-semibold mb-4">Filter Data Tiket</h2>
            <p className="mb-4 text-muted">
              Gunakan filter di bawah ini untuk melihat data tiket berdasarkan bulan dan tahun.
            </p>

            <form onSubmit={handleSubmit}>
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
    </>
  );
};

export default FilterLaporan;
