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
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    

  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const dummyChartData = {
        labels: ["Anak-anak", "Dewasa", "Mahasiswa"],
        datasets: [
          {
            label: "Jumlah Tiket Terjual",
            data: [20, 50, 30],
            backgroundColor: ["#FFBE3C", "#FF928A", "#74DCF1"],
            borderRadius: 5,
          },
        ],
      };
      setChartData(dummyChartData);
    }
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="page-wrapper" id="main-wrapper">
      <Template />

      <div className="main-content p-4">
        {/* Welcome */}
        <h2 className="fw-bold mb-4">
          Selamat Datang di Halaman Admin <br /> ERUWAIJURAI
        </h2>

        {/* Info Cards */}
        <div className="d-flex gap-3 mb-4 flex-wrap">
          <div
            className="p-3"
            style={{
              backgroundColor: "#FFBE3C",
              width: "285px",
              height: "130px",
              borderRadius: "40px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <i class="fas fa-child tiket-anak-icon"></i>            
            <div>{data?.koleksi ?? 0} Banyak Tiket Anak-anak yang dipesan</div>
          </div>
          <div
            className="p-3"
            style={{
              backgroundColor: "#FF928A",
              width: "285px",
              height: "130px",
              borderRadius: "40px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <div>👥</div>
            <div>{data?.pengunjung ?? 0} Banyak Tiket Dewasa dipesan</div>
          </div>
          <div
            className="p-3"
            style={{
              backgroundColor: "#74DCF1",
              width: "285px",
              height: "130px",
              borderRadius: "40px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <div>🎓</div>
            <div>{data?.pengunjung ?? 0}  Banyak Tiket Mahasiswa dipesan</div>
          </div>
        </div>

        {/* Total */}
        <h3 className="fw-bold mb-4">Total Pembelian Seluruh Tiket: {data ? (data.koleksi + data.pengunjung * 2) : 0} Tiket</h3>

        {/* Filter dan Grafik */}
        <div className="card mb-4">
          <div className="card-body">
            <label htmlFor="filterBulan" className="fw-bold me-2">
              Tanggal:
            </label>
            <input
              type="month"
              id="filterBulan"
              className="form-control mb-3"
              style={{ maxWidth: "200px" }}
              value={selectedMonth}
              onChange={handleMonthChange}
            />

            <h5 className="text-center mb-4">Grafik Pembelian Tiket per Bulan</h5>
            <div style={{ minHeight: "300px" }}>
              {selectedMonth && chartData.labels ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              ) : (
                <p className="text-center text-muted">Pilih bulan untuk melihat grafik.</p>
              )}
            </div>
          </div>
        </div>

        {/* Data Tiket */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Data Tiket</h5>
            <div className="table-responsive">
              <table className="table mb-0" style={{ boxShadow: "none" }}>
                <thead className="fs-4" style={{ backgroundColor: "rgba(116, 80, 45, 0.18)" }}>
                  <tr>
                    <th>No</th>
                    <th>Kode Tiket</th>
                    <th>Jenis Tiket</th>
                    <th>Syarat dan Ketentuan</th>
                    <th>Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dummy row */}
                  <tr>
                    <td>1</td>
                    <td>TK001</td>
                    <td>Tiket Anak-anak</td>
                    <td>
                      <span className="badge bg-primary rounded-3 fw-semibold">Umur &lt; 12 Tahun</span>
                    </td>
                    <td>Rp 20.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Data Pemesanan */}
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
                  {/* Dummy Row */}
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
                  {/* Bisa ganti pakai mapping data di sini */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
