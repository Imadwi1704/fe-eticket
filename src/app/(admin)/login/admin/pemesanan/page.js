"use client";
import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";


export default function AdminPage() {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [orders, setOrders] = useState([]);
  const token = getCookie("token");
  
    useEffect(() => {
      if (!token) return;
  
      const fetchData = async () => {
        try {
          const res = await fetch("http://localhost:5001/api/orders", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
  
          const result = await res.json();
          if (res.ok) {
            setOrders(result.data);
          } else {
            console.error("Gagal mengambil data:", result?.message || "Tidak diketahui");
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat fetch:", error);
        }
      };
  
      fetchData();
    }, [token]);

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
                      <th>Metode Pembayaran</th>
                      <th>Total Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody>
                  {Array.isArray(orders) && orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{order.orderCode}</td>
                        <td>{order.visitorName || "-"}</td>
                        <td>{order.orderItem?.ticket?.type}</td>
                        <td>{order.orderItem?.quantity}</td>
                        <td>{order.visitDate}</td>
                        <td>{order.payments?.paymentMethod}</td>
                        <td>{order.transactionDate}</td>
                        <td>{order.totalAmount || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Tidak ada data Pembayaran.
                      </td>
                    </tr>
                    )}
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
