"use client";

import Template from "@components/admin/Template";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { getCookie } from "cookies-next";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.warn("Token tidak tersedia");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/api/ticket", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        console.log("Data tiket yang diterima:", result); // DEBUG

        if (res.ok && result?.data) {
          setTickets(result.data);
        } else {
          console.error("Gagal mengambil data tiket:", result?.message || "Unknown error");
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch tiket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container">
        <Template />

        <div className="main-content p-4">
          <h2 className="fw-bold mb-4">
            Selamat Datang di Halaman Admin <br /> ERUWAIJURAI
          </h2>

          {/* Data Tiket */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Data Tiket</h5>

              {loading ? (
                <p>Loading data tiket...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead style={{ backgroundColor: "rgba(116, 80, 45, 0.18)" }}>
                      <tr>
                        <th>No</th>
                        <th>Kode Tiket</th>
                        <th>Jenis Tiket</th>
                        <th>Harga</th>
                        <th>Syarat dan Ketentuan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.length > 0 ? (
                        tickets.map((ticket, index) => (
                          <tr key={ticket.id || index}>
                            <td>{index + 1}</td>
                            <td>{ticket.code || "-"}</td>
                            <td>{ticket.type || "-"}</td>
                            <td>
                              {typeof ticket.price === "number"
                                ? new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  }).format(ticket.price)
                                : "-"}
                            </td>
                            <td>{ticket.terms || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            Tidak ada data tiket.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Data Pemesanan (Dummy) */}
          <div className="card">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Data Pemesanan</h5>
              <div className="table-responsive">
                <table className="table mb-0" style={{ boxShadow: "none" }}>
                  <thead className="fs-4" style={{ backgroundColor: "rgba(116, 80, 45, 0.18)" }}>
                    <tr>
                      <th>No</th>
                      <th>Kode Pemesanan</th>
                      <th>Nama Pengunjung</th>
                      <th>Tiket Dipilih</th>
                      <th>Banyak Tiket</th>
                      <th>Tanggal Berkunjung</th>
                      <th>Status</th>
                      <th>Total Pembelian</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>ORD123456</td>
                      <td>Sunil Joshi</td>
                      <td>Tiket Reguler</td>
                      <td>2</td>
                      <td>2025-05-01</td>
                      <td>
                        <span className="badge bg-primary rounded-3 fw-semibold">
                          Berhasil
                        </span>
                      </td>
                      <td>Rp 100.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
