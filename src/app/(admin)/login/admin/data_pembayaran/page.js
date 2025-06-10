"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/payments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setPayments(result.data);
        } else {
          console.error("Gagal mengambil data:", result?.message || "Tidak diketahui");
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container-fluid py-5">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title fw-semibold mb-0 text-white">Data Pembayaran Pengunjung</h2>
            </div>
            <div className="card-body p-4">
              <p className="text-muted mb-4">
                Melihat data nama pengunjung, jenis tiket, tanggal kunjungan, status pembayaran, dan total pembayaran.
              </p>
              <div className="table-responsive">
                <table className="table mb-0" style={{ boxShadow: "none" }}>
                  <thead className="table-primary">
                    <tr>
                      <th>No</th>
                      <th>Kode Pemesanan</th>
                      <th>Nama Pengunjung</th>
                      <th>Tanggal Kunjungan</th>
                      <th>Status Pembayaran</th>
                      <th>Tanggal Pembayaran</th>
                      <th>Total Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(payments) && payments.length > 0 ? (
                      payments.map((payment, index) => (
                        <tr key={payment.id}>
                          <td>{index + 1}</td>
                          <td>{payment.order?.orderCode || "-"}</td>
                          <td>{payment.user?.fullName || "-"}</td>
                          <td>{payment.visitDate || "-"}</td>
                          <td>{payment.paymentStatus || "-"}</td>
                          <td>{payment.transactionDate || "-"}</td>
                          <td>{payment.totalAmount ? `Rp${payment.totalAmount.toLocaleString("id-ID")}` : "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Tidak ada data pembayaran.
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
