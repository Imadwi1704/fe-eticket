"use client";

import Template from "@components/admin/Template";
import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { getCookie } from "cookies-next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState({});
  const token = getCookie("token");

  // Fetch data tiket dari API
  const fetchData = async () => {
    if (!token) {
      console.error("Token tidak tersedia.");
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

      if (res.ok) {
        setTickets(result);
        setLoading(false);
      } else {
        console.error("Gagal mengambil data:", result.metaData?.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat fetch:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Data chart dummy
  const generateSalesData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      labels: months,
      datasets: [
        {
          label: "Tiket Reguler",
          data: months.map(() => Math.floor(Math.random() * 100) + 50),
          backgroundColor: "#0d6efd",
          borderColor: "#0d6efd",
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: "Tiket VIP",
          data: months.map(() => Math.floor(Math.random() * 50) + 20),
          backgroundColor: "#3b8cff",
          borderColor: "#3b8cff",
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: "Tiket Keluarga",
          data: months.map(() => Math.floor(Math.random() * 30) + 10),
          backgroundColor: "#6ea8fe",
          borderColor: "#6ea8fe",
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  };

  const applyFilter = () => {
    // Sementara tetap menggunakan data dummy
    setChartData(generateSalesData());
  };

  const cardStyle = {
    border: "none",
    borderRadius: "10px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardHoverStyle = {
    transform: "translateY(-5px)",
  };

  return (
    <div
      className="dashboard-container"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Template />

      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold mb-0 text-primary">
              Dashboard Admin ERUWAIJURAI
            </h2>
            <p className="text-muted">Analisis dan manajemen data tiket</p>
          </div>
        </div>

        {/* Filter dan Ringkasan */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <h5 className="card-title text-primary">Filter Tanggal</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Dari Tanggal</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sampai Tanggal</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="form-control"
                    />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={applyFilter}>
                  Terapkan Filter
                </button>
              </div>
            </div>
          </div>

          {/* Ringkasan */}
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div
                  className="card h-100 text-white"
                  style={{
                    ...cardStyle,
                    background:
                      "linear-gradient(135deg, #0d6efd 0%, #3b8cff 100%)",
                  }}
                >
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-white">
                      Total Tiket Terjual
                    </h6>
                    <h3 className="card-title fw-bold text-white">1,248</h3>
                    <p className="card-text small text-white">Bulan ini</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div
                  className="card h-100 text-white"
                  style={{
                    ...cardStyle,
                    background:
                      "linear-gradient(135deg, #198754 0%, #2da56a 100%)",
                  }}
                >
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-white">
                      Total Pendapatan
                    </h6>
                    <h3 className="card-title fw-bold text-white">
                      Rp 24.560.000
                    </h3>
                    <p className="card-text small text-white">Bulan ini</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row mb-4">
          <div className="col-lg-8 mb-4">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <h5 className="card-title text-primary">
                  Penjualan Tiket per Bulan
                </h5>
                {chartData.labels ? (
                  <Bar data={chartData} options={{ responsive: true }} />
                ) : (
                  <p>Belum ada data chart</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <h5 className="card-title text-primary">Trend Penjualan</h5>
                {chartData.labels ? (
                  <Line
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Total Penjualan",
                          data: chartData.labels.map((_, i) =>
                            chartData.datasets.reduce(
                              (sum, d) => sum + d.data[i],
                              0
                            )
                          ),
                          backgroundColor: "rgba(13, 110, 253, 0.2)",
                          borderColor: "#0d6efd",
                          borderWidth: 3,
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                  />
                ) : (
                  <p>Belum ada data trend</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Tiket */}
        <div className="row">
          <div className="col-12">
            <div className="card mb-4" style={cardStyle}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title text-primary mb-0">Data Tiket</h5>
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-download me-1"></i> Export
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-4">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead
                        style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                      >
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
                              <td>
                                {" "}
                                <span className="badge bg-primary bg-opacity-10 text-white w-50">
                                  {ticket.code || "-"}
                                </span>
                              </td>
                              <td>{ticket.type || "-"}</td>
                              <td>
                                {typeof ticket.price === "number"
                                  ? new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(ticket.price)
                                  : "-"}
                              </td>
                              <td
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {ticket.terms || "-"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
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
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding-top: 80px;
        }
        .card:hover {
          transform: ${cardHoverStyle.transform};
          box-shadow: ${cardHoverStyle.boxShadow};
        }
        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
}
