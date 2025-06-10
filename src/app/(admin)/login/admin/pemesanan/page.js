"use client";
import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const token = getCookie("token");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Jika token tidak ada, langsung redirect
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Jika token expired / tidak valid
        if (res.status === 401) {
          deleteCookie("token");
          router.push("/login");
          return;
        }

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
  }, [token, router]);

  const handleDownloadPDF = async () => {
    setLoadingPDF(true);
    try {
      const res = await fetch("/api/admin/cetak-pdf");
      if (!res.ok) throw new Error("Gagal generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

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

  const openDetailModal = (order) => setSelectedOrder(order);
  const closeDetailModal = () => setSelectedOrder(null);

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container-fluid py-5">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="card-title mb-0 fw-semibold">Data Pemesanan Tiket</h2>
              <button
                onClick={handleDownloadPDF}
                className="btn btn-success btn-sm"
                disabled={loadingPDF}
              >
                <i className="bi bi-file-earmark-arrow-down me-2"></i>
                {loadingPDF ? "Membuat PDF..." : "Cetak PDF"}
              </button>
            </div>
            <div className="card-body p-4">
              <p className="text-muted mb-4">
                Melihat detail data pemesanan tiket museum termasuk nama pengunjung, jenis tiket, metode pembayaran, dan total.
              </p>
              <div className="table-responsive">
                <table className="table mb-0" style={{ boxShadow: "none" }}>
                  <thead className="table-primary">
                    <tr>
                      <th>No</th>
                      <th>Kode Pemesanan</th>
                      <th>Nama Pengunjung</th>
                      <th>Banyak Tiket</th>
                      <th>Tanggal Berkunjung</th>
                      <th>Metode Pembayaran</th>
                      <th>Total Pembayaran</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order, index) => {
                        const totalQty = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                        const totalPrice = order.orderItems?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;
                        return (
                          <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>{order.orderCode}</td>
                            <td>{order.visitorName || "-"}</td>
                            <td>{totalQty}</td>
                            <td>{new Date(order.visitDate).toLocaleDateString("id-ID")}</td>
                            <td>{order.payment?.paymentMethod || "-"}</td>
                            <td>{`Rp${totalPrice.toLocaleString("id-ID")}`}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => openDetailModal(order)}
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          Tidak ada data pemesanan.
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

      {selectedOrder && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeDetailModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detail Pemesanan</h5>
                <button type="button" className="btn-close" onClick={closeDetailModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Nama Pengunjung:</strong> {selectedOrder.visitorName}</p>
                <p><strong>Tanggal Berkunjung:</strong> {new Date(selectedOrder.visitDate).toLocaleDateString("id-ID")}</p>
                <p><strong>Jenis Tiket:</strong></p>
                <ul>
                  {selectedOrder.orderItems?.map((item) => (
                    <li key={item.id}>
                      {item.ticket?.type || "Tiket"} - Jumlah: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeDetailModal}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
