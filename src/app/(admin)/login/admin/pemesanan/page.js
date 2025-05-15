"use client";
import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/some-data");
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPDF = async () => {
    setLoadingPDF(true);
    try {
      const res = await fetch("/api/admin/cetak-pdf");
      if (!res.ok) throw new Error("Gagal generate PDF");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "laporan_pemesanan.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error saat download PDF:", error);
      alert("Gagal mendownload PDF");
    }
    setLoadingPDF(false);
  };

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-lg-12">

          {/* Card Section */}
          <div className="card w-100">
            <div className="card-body p-4">
              <h2 className="card-title fw-semibold text-left mb-2">Data Pemesanan</h2>
              <p className="mb-4">
                Berfungsi untuk melihat nama pengunjung, jenis tiket yang dipilih, tanggal berkunjung, dan total pembayaran dari pengunjung.
              </p>

              {/* Tombol Cetak PDF */}
              <div className="mb-3 text-end">
                <button
                  onClick={handleDownloadPDF}
                  className="btn btn-success"
                  style={{ padding: "10px 16px", borderRadius: "5px" }}
                  disabled={loadingPDF}
                >
                  <i className="bi bi-file-earmark-arrow-down me-2"></i>
                  {loadingPDF ? "Membuat PDF..." : "Cetak PDF"}
                </button>
              </div>

              {/* Table Section */}
              <div className="table-responsive">
                <table className="table mb-0" style={{ boxShadow: 'none' }}>
                  <thead className="fs-4" style={{ backgroundColor: 'rgba(116, 80, 45, 0.18)' }}>
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
                    {/* Contoh Data Dummy */}
                    <tr>
                      <td>1</td>
                      <td>ORD123456</td>
                      <td>Sunil Joshi</td>
                      <td>Tiket Reguler</td>
                      <td>2</td>
                      <td>2025-05-01</td>
                      <td>
                        <span className="badge bg-primary rounded-3 fw-semibold">Berhasil</span>
                      </td>
                      <td>Rp 100.000</td>
                    </tr>
                    {/* Mapping data aslinya */}
                    {/* {data?.map((item, index) => (
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
                        <td>Rp {item.total_pembelian.toLocaleString()}</td>
                      </tr>
                    ))} */}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
