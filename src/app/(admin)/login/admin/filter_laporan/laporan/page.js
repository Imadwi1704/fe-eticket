"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Penting: untuk ambil query
import Template from "@/components/admin/Template";

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const searchParams = useSearchParams();

  // Ambil bulan & tahun dari URL
  const bulan = searchParams.get("bulan");
  const tahun = searchParams.get("tahun");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!bulan || !tahun) return; // Cegah fetch kalau belum ada bulan & tahun
        
        const res = await fetch(`/api/some-data?bulan=${bulan}&tahun=${tahun}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [bulan, tahun]); // Jalankan ulang kalau bulan/tahun berubah

  return (
    <>
      <Template />

      <div className="container mt-4">
        {/* Card Section */}
        <div className="card shadow-sm">
          <div className="card-body p-4">
            {/* Title */}
            <h3 className="card-title fw-semibold mb-4">
              Laporan Transaksi Pemesanan Tiket Museum Lampung Bulan {bulan} Tahun {tahun}
            </h3>

            {/* Table Section */}
            <div className="table-responsive">
              <table className="table mb-0" style={{ boxShadow: "none" }}>
                <thead
                  className="fs-5"
                  style={{ backgroundColor: "rgba(116, 80, 45, 0.18)" }}
                >
                  <tr>
                    <th>No</th>
                    <th>Kode Pemesanan</th>
                    <th>Nama Pengunjung</th>
                    <th>Tiket yang Dipilih</th>
                    <th>Banyak Tiket</th>
                    <th>Tanggal Berkunjung</th>
                    <th>Status Keberhasilan</th>
                    <th>Total Pembelian</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.kode_pemesanan}</td>
                        <td>{item.nama_pengunjung}</td>
                        <td>{item.tiket_dipilih}</td>
                        <td>{item.banyak_tiket}</td>
                        <td>{item.tanggal_berkunjung}</td>
                        <td>
                          <span className="badge bg-primary rounded-3 fw-semibold">
                            {item.status}
                          </span>
                        </td>
                        <td>Rp {item.total_pembelian.toLocaleString("id-ID")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        Tidak ada data tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tombol Cetak PDF */}
            <div className="mt-4 text-end">
              <a
                href={`/login/admin/pemesanan/cetak_pdf?bulan=${bulan}&tahun=${tahun}`}
                className="btn btn-success"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-file-earmark-arrow-down me-2"></i> Cetak PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
