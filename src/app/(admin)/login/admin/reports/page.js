"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Template from "@/components/admin/Template";
import page from "@/config/page";

const FilterLaporan = () => {
  const router = useRouter();
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [daftarTiket, setDaftarTiket] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const tahunSekarang = new Date().getFullYear();
  const daftarTahun = Array.from(
    { length: tahunSekarang - 2009 },
    (_, i) => tahunSekarang - i
  );

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(page.baseUrl + "/api/ticket");
        const data = await res.json();

        if (res.ok) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!bulan || !tahun || !selectedTicket) {
      alert("Silakan pilih tiket, bulan, dan tahun terlebih dahulu.");
      setIsLoading(false);
      return;
    }

    try {
      const monthNumber = parseInt(bulan);
      const formattedBulan = bulan.padStart(2, '0');
      const startDate = `${tahun}-${formattedBulan}-01`;
      const daysInMonth = new Date(tahun, monthNumber, 0).getDate();
      const endDate = `${tahun}-${formattedBulan}-${daysInMonth}`;
      const category = selectedTicket === "semua" ? undefined : selectedTicket;

      // Navigate directly to the report page with query parameters
      router.push(
        `/login/admin/reports/purchase-report?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}${
          category ? `&category=${encodeURIComponent(category)}` : ""
        }`
      );

    } catch (error) {
      console.error("Error generating report:", error);
      alert(`Gagal membuat laporan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Template />
      <div className="container-fluid py-5" style={{ minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-md-8 mt-5">
            <div className="card border-1 ">
              <div className="card-header bg-primary text-white">
                <h2 className="card-title fw-semibold mb-0 text-white">
                  Filter Laporan Pemesanan
                </h2>
              </div>
              <div className="card-body p-4">
                <p className="mb-4 text-muted">
                  Gunakan filter di bawah ini untuk melihat data tiket berdasarkan
                  bulan dan tahun.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Ticket Filter */}
                  <div className="mb-3">
                    <label htmlFor="tiket" className="form-label fw-bold">
                      Kategori Tiket
                    </label>
                    <select
                      id="tiket"
                      className="form-select"
                      value={selectedTicket}
                      onChange={(e) => setSelectedTicket(e.target.value)}
                      required
                    >
                      <option value="">--- Pilih Kategori ---</option>
                      <option value="semua">Semua Kategori</option>
                      {daftarTiket.map((tiket) => (
                        <option key={tiket.id} value={tiket.type}>
                          {tiket.type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month Filter */}
                  <div className="mb-3">
                    <label htmlFor="bulan" className="form-label fw-bold">
                      Bulan
                    </label>
                    <select
                      id="bulan"
                      className="form-select"
                      value={bulan}
                      onChange={(e) => setBulan(e.target.value)}
                      required
                    >
                      <option value="">--- Pilih Bulan ---</option>
                      {[
                        { value: "01", label: "Januari" },
                        { value: "02", label: "Februari" },
                        { value: "03", label: "Maret" },
                        { value: "04", label: "April" },
                        { value: "05", label: "Mei" },
                        { value: "06", label: "Juni" },
                        { value: "07", label: "Juli" },
                        { value: "08", label: "Agustus" },
                        { value: "09", label: "September" },
                        { value: "10", label: "Oktober" },
                        { value: "11", label: "November" },
                        { value: "12", label: "Desember" },
                      ].map((bulan) => (
                        <option key={bulan.value} value={bulan.value}>
                          {bulan.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="mb-4">
                    <label htmlFor="tahun" className="form-label fw-bold">
                      Tahun
                    </label>
                    <select
                      id="tahun"
                      className="form-select"
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

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Lihat Laporan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterLaporan;