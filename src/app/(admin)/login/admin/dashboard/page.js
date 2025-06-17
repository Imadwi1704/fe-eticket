"use client";

import Template from "@components/admin/Template";
import { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import page from "@/config/page"
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PieController,
  ArcElement,
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
import { FiRefreshCw, FiDownload, FiUsers, FiDollarSign, FiTicket } from "react-icons/fi";
import { format, subDays, subMonths } from "date-fns";
import id from "date-fns/locale/id";

ChartJS.register(
  BarElement,
  LineElement,
  PieController,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [visitorStats, setVisitorStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [startDate, setStartDate] = useState(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const token = getCookie("token");

  // Format date to Indonesian locale
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "EEEE, d MMMM yyyy", { locale: id });
  };

  // Format date to short version
  const formatShortDate = (dateString) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "d MMM yyyy", { locale: id });
  };

  // Format currency to IDR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!token) {
      console.error("Token tidak tersedia.");
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [statsRes, ordersRes, visitorsRes, revenueRes] = await Promise.all([
        fetch(`${page.baseUrl}/api/admin/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${page.baseUrl}/api/admin/dashboard/recent-orders?limit=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${page.baseUrl}/api/admin/dashboard/visitor-stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${page.baseUrl}/api/admin/dashboard/revenue-stats?year=${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Process responses
      if (!statsRes.ok || !ordersRes.ok || !visitorsRes.ok || !revenueRes.ok) {
        throw new Error("Gagal mengambil data dashboard");
      }

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      const visitorsData = await visitorsRes.json();
      const revenueData = await revenueRes.json();

      setStats(statsData.data);
      setRecentOrders(ordersData.data);
      setVisitorStats(visitorsData.data);
      setRevenueStats(revenueData.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply date filter
  const applyFilter = () => {
    fetchDashboardData();
  };

  // Handle year change for revenue chart
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token, selectedYear]);

  // Chart data generators
  const generateMonthlySalesChart = () => {
    if (!stats?.monthlySales) return null;

    return {
      labels: stats.monthlySales.map(item => item.month),
      datasets: [
        {
          label: "Dewasa",
          data: stats.monthlySales.map(item => item.dewasa),
          backgroundColor: "#0d6efd",
          borderColor: "#0d6efd",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Anak",
          data: stats.monthlySales.map(item => item.anak),
          backgroundColor: "#20c997",
          borderColor: "#20c997",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Mahasiswa",
          data: stats.monthlySales.map(item => item.mahasiswa),
          backgroundColor: "#6c757d",
          borderColor: "#6c757d",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const generateVisitorTrendChart = () => {
    if (!visitorStats?.dailyStats) return null;

    return {
      labels: visitorStats.dailyStats.map(item => formatShortDate(item.date)),
      datasets: [
        {
          label: "Pengunjung Harian",
          data: visitorStats.dailyStats.map(item => item.count),
          backgroundColor: "rgba(13, 110, 253, 0.2)",
          borderColor: "#0d6efd",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  const generateRevenueChart = () => {
    if (!revenueStats?.monthlyRevenue) return null;

    return {
      labels: revenueStats.monthlyRevenue.map(item => item.month),
      datasets: [
        {
          label: "Pendapatan",
          data: revenueStats.monthlyRevenue.map(item => item.revenue),
          backgroundColor: [
            "#198754",
            "#20c997",
            "#0dcaf0",
            "#6c757d",
            "#0d6efd",
            "#6610f2",
            "#d63384",
            "#fd7e14",
            "#ffc107",
            "#212529",
            "#6f42c1",
            "#dc3545",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const cardStyle = {
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardHoverStyle = {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: "#f8f9fa" }}>
      <Template />

      <div className="container-fluid p-4 p-md-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold mb-0 text-primary">Dashboard Admin ERUWAIJURAI</h2>
                <p className="text-muted mb-0">Analisis dan manajemen data museum</p>
              </div>
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                ) : (
                  <FiRefreshCw className="me-1" />
                )}
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div
              className="card h-100 text-white"
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #0d6efd 0%, #3b8cff 100%)",
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white opacity-75">
                      Total Koleksi
                    </h6>
                    <h3 className="card-title fw-bold text-white mb-0">
                      {stats?.totalCollections || 0}
                    </h3>
                  </div>
                </div>
                <p className="card-text small text-white mt-2">
                  {stats?.currentDate ? formatDate(stats.currentDate) : "Memuat tanggal..."}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div
              className="card h-100 text-white"
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #198754 0%, #2da56a 100%)",
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white opacity-75">
                      Total Pengunjung
                    </h6>
                    <h3 className="card-title fw-bold text-white mb-0">
                      {stats?.totalVisitors || 0}
                    </h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-2 rounded">
                    <FiUsers size={24} className="text-white" />
                  </div>
                </div>
                <p className="card-text small text-white mt-2">
                  {visitorStats?.totalVisitors || 0} pengunjung dalam periode terpilih
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div
              className="card h-100 text-white"
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #fd7e14 0%, #ff9e42 100%)",
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white opacity-75">
                      Total Pendapatan
                    </h6>
                    <h3 className="card-title fw-bold text-white mb-0">
                      {revenueStats?.totalRevenue ? formatCurrency(revenueStats.totalRevenue) : "Rp0"}
                    </h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-2 rounded">
                    <FiDollarSign size={24} className="text-white" />
                  </div>
                </div>
                <p className="card-text small text-white mt-2">
                  Tahun {selectedYear}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card mb-3" style={cardStyle}>
              <div className="card-body">
                <h5 className="card-title text-primary mb-3">Filter Tanggal</h5>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Dari Tanggal</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="form-control form-control-sm"
                      locale={id}
                      dateFormat="dd MMMM yyyy"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Sampai Tanggal</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="form-control form-control-sm"
                      locale={id}
                      dateFormat="dd MMMM yyyy"
                    />
                  </div>
                  <div className="col-12 mt-2">
                    <button 
                      className="btn btn-primary btn-sm w-100" 
                      onClick={applyFilter}
                      disabled={loading}
                    >
                      Terapkan Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-3" style={cardStyle}>
              <div className="card-body">
                <h5 className="card-title text-primary mb-3">Filter Tahun Pendapatan</h5>
                <div className="row g-2">
                  <div className="col-md-8">
                    <select
                      className="form-select form-select-sm text-dark"
                      value={selectedYear}
                      onChange={(e) => handleYearChange(parseInt(e.target.value))}
                      disabled={loading}
                    >
                      {[2022, 2023, 2024, 2025].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <button 
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => setSelectedYear(new Date().getFullYear())}
                      disabled={loading}
                    >
                      Tahun Ini
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-lg-8 mb-4">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title text-primary mb-0">
                    Penjualan Tiket per Bulan
                  </h5>
                </div>
                {generateMonthlySalesChart() ? (
                  <Bar 
                    data={generateMonthlySalesChart()} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${context.raw} tiket`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }} 
                  />
                ) : (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title text-primary mb-0">
                    Distribusi Pendapatan
                  </h5>
                </div>
                {generateRevenueChart() ? (
                  <Pie 
                    data={generateRevenueChart()} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.label}: ${formatCurrency(context.raw)}`;
                            }
                          }
                        }
                      }
                    }} 
                  />
                ) : (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-6 mb-4">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title text-primary mb-0">
                    Trend Kunjungan Harian
                  </h5>
                </div>
                {generateVisitorTrendChart() ? (
                  <Line 
                    data={generateVisitorTrendChart()} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.raw} pengunjung`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }} 
                  />
                ) : (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title text-primary mb-0">
                    Pesanan Terbaru
                  </h5>
                  <button className="btn btn-sm btn-outline-primary d-flex align-items-center">
                    <FiDownload className="me-1" /> Export
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-sm table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order, index) => (
                          <tr key={order.id || index}>
                            <td>
                              <span className="badge bg-opacity-10 text-primary">
                                {order.orderCode}
                              </span>
                            </td>
                            <td>{order.user?.fullName || '-'}</td>
                            <td>{formatShortDate(order.visitDate)}</td>
                            <td>
                              {order.attendanceStatus === 'ARRIVED' ? (
                                <span className="badge bg-success">Hadir</span>
                              ) : (
                                <span className="badge bg-secondary">Belum</span>
                              )}
                            </td>
                            <td className="text-end">
                              {order.payment?.totalAmount ? formatCurrency(order.payment.totalAmount) : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-3">
                            {loading ? (
                              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                            ) : (
                              "Tidak ada data pesanan terbaru"
                            )}
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
      </div>

      <style jsx>{`
        .dashboard-container {
          padding-top: 80px;
          min-height: 100vh;
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