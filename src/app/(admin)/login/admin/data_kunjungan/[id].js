"use client";
import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";

export default function DataKunjungan() {
  const [data, setData] = useState(null);
  const { id } = router.query; // Ambil id dari URL

  useEffect(() => {
    if (!id) return; // Hindari fetch jika id belum tersedia
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/data_kunjungan/${id}`); 
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

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
