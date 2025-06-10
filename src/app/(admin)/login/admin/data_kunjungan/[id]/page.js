"use client";
import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { useParams, useRouter } from "next/navigation";

export default function DataKunjungan() {
  const [data, setData] = useState(null);
  const params = useParams();
  const id = params.id;

  // file: utils/validateOrder.js

 const validateOrderByCode = async (code, token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/validate-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Token JWT admin
      },
      body: JSON.stringify({ code }), // Kirim kode pemesanan
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal validasi order');
    }

    return data; // Berisi informasi order dan status validasi
  } catch (error) {
    console.error("Error validating order:", error.message);
    throw error;
  }
};


  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-lg-12">
          <div className="card w-100">
            <div className="card-body p-4">
              <h2 className="card-title fw-semibold text-left mb-2">
                Data Kunjungan - Tiket ID: {id}
              </h2>
              <p className="mb-4">
                Menampilkan pengunjung berdasarkan tiket ID.
              </p>
              <div className="table-responsive">
                <table className="table mb-0" style={{ boxShadow: 'none' }}>
                  <thead className="fs-4" style={{ backgroundColor: 'rgba(116, 80, 45, 0.18)' }}>
                    <tr>
                      <th>No</th>
                      <th>Kode Pesanan</th>
                      <th>Nama Pemesan Tiket</th>
                      <th>Banyak Tiket</th>
                      <th>Tanggal Berkunjung</th>
                      <th>Status Berkunjung</th>
                      <th>Banyak Yang Diberkunjung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data ? (
                      data.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.orderCode}</td>
                          <td>{item.visitorName}</td>
                          <td>{item.visitorDate}</td>
                          <td>{item.status}</td>
                          <td>{item.jumlah_datang}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">Memuat data...</td>
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
