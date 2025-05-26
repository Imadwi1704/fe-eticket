"use client";
import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";


export default function paymentPage() {
  const [payments, setPayment] = useState(null);
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
            setPayment(result.data);
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
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-lg-12">

          {/* Card Section */}
          <div className="card w-100">
            <div className="card-body p-4">
              <h2 className="card-title fw-semibold text-left mb-2">Data Pembayarn</h2>
              <p className="mb-4">
                Berfungsi untuk melihat nama pengunjung, jenis tiket yang dipilih, tanggal berkunjung, status pembayaran dan total pembayaran dari pengunjung.
              </p>

              {/* Table Section */}
              <div className="table-responsive">
                <table className="table mb-0" style={{ boxShadow: 'none' }}>
                  <thead className="fs-4" style={{ backgroundColor: 'rgba(116, 80, 45, 0.18)' }}>
                    <tr>
                      <th>No</th>
                      <th>Kode Pemesanan</th>
                      <th>Nama Pengunjung</th>
                      <th>Tanggal Berkunjung</th>
                      <th>Status Keberhasilan</th>
                      <th>Tanggal Pembayaran</th>
                      <th>Total Pembelian</th>
                    </tr>
                  </thead>
                 <tbody>
                  {Array.isArray(payments) && payments.length > 0 ? (
                    payments.map((payment, index) => (
                      <tr key={payment.id}>
                        <td>{index + 1}</td>
                        <td>{payment.order?.orderCode}</td>
                        <td>{payment.user?.fullName || "-"}</td>
                        <td>{payment.visitDate}</td>
                        <td>{payment.paymentStatus}</td>
                        <td>{payment.transactionDate}</td>
                        <td>{payment.totalAmount || "-"}</td>
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
