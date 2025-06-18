"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Template from "@/components/admin/Template";
import { FiDownload, FiFilter, FiSearch, FiCalendar } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import Image from "next/image";
import page from "@/config/page";

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState({
    totalByCategory: {},
    totalAll: 0,
  });
  const searchParams = useSearchParams();

  // Get parameters from URL
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!startDate || !endDate) return;
        setLoading(true);

        const queryString = new URLSearchParams({
          startDate,
          endDate,
          ...(category && { category }),
        }).toString();

        const res = await fetch(
          `${page.baseUrl}/api/admin/reports/purchase-report?${queryString}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const result = await res.json();

        if (result.status === "success") {
          setData(result.data);
          setFilteredData(result.data);
          setSummary({
            totalByCategory: result.totalByCategory,
            totalAll: result.totalAll,
          });
        } else if (result.status === "empty") {
          setData([]);
          setFilteredData([]);
          setSummary({
            totalByCategory: {},
            totalAll: 0,
          });
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, category]);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (item) =>
          item.user?.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.orderItems?.some((oi) =>
            oi.ticket?.type.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return (
          <span className="badge bg-success rounded-pill d-flex align-items-center">
            <FaCheckCircle className="me-1" /> Lunas
          </span>
        );
      case "PENDING":
        return (
          <span className="badge bg-warning text-dark rounded-pill d-flex align-items-center">
            <FaClock className="me-1" /> Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="badge bg-danger rounded-pill d-flex align-items-center">
            <FaTimesCircle className="me-1" /> Gagal
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary rounded-pill">{status}</span>
        );
    }
  };

  const getVisitStatus = (visitDate) => {
    const today = new Date();
    const visit = new Date(visitDate);

    if (visit > today) {
      return (
        <span className="badge bg-info rounded-pill">Akan Berkunjung</span>
      );
    } else if (visit.toDateString() === today.toDateString()) {
      return (
        <span className="badge bg-primary rounded-pill">
          Berkunjung Hari Ini
        </span>
      );
    } else {
      return (
        <span className="badge bg-secondary rounded-pill">
          Sudah Berkunjung
        </span>
      );
    }
  };

  const calculateTotalTickets = () => {
    return filteredData.reduce((total, order) => {
      return (
        total + order.orderItems?.reduce((sum, oi) => sum + oi.quantity, 0) || 0
      );
    }, 0);
  };

  const handleGeneratePDF = async () => {
    try {
      const requestBody = {
        startDate,
        endDate,
        category: category || undefined,
        generatePdf: true,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/reports`,
        {
          method: "POST", // ✅ Ganti jadi POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody), // ✅ Body hanya diizinkan di POST/PUT
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to generate PDF");

      const result = await res.json();

      if (result.status === "success") {
        window.open(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${result.fileUrl}`,
          "_blank"
        );
      } else {
        throw new Error(result.message || "Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Template />
      <div className="container-fluid py-4" style={{ minHeight: "100vh" }}>
        <div className="row">
          <div className="col-12 mt-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="card-title fw-semibold mb-0 text-white">
                    Laporan Transaksi Tiket Museum Lampung
                  </h2>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-white text-primary fs-6 me-3">
                      <FiCalendar className="me-1" />
                      {new Date(startDate).toLocaleDateString("id-ID")} -{" "}
                      {new Date(endDate).toLocaleDateString("id-ID")}
                    </span>
                    {category && (
                      <span className="badge bg-light text-dark fs-6">
                        Kategori: {category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-body p-4">
                {/* Filter and Search Section */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FiSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Cari berdasarkan nama, kode pemesanan, atau tiket..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                      >
                        <FiFilter className="me-1" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <button
                      className="btn btn-success"
                      onClick={handleGeneratePDF}
                    >
                      <FiDownload className="me-2" />
                      Cetak Laporan
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Memuat data...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-semibold">#</th>
                          <th className="fw-semibold">Kode</th>
                          <th className="fw-semibold">Pengunjung</th>
                          <th className="fw-semibold">Tiket</th>
                          <th className="fw-semibold text-center">Jumlah</th>
                          <th className="fw-semibold">Tanggal Kunjungan</th>
                          <th className="fw-semibold text-center">
                            Pembayaran
                          </th>
                          <th className="fw-semibold text-center">
                            Status Kunjungan
                          </th>
                          <th className="fw-semibold">Metode</th>
                          <th className="fw-semibold text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length > 0 ? (
                          filteredData.map((item, index) => (
                            <tr key={item.id} className="hover-highlight">
                              <td>{index + 1}</td>
                              <td className="fw-semibold text-primary">
                                {item.orderCode}
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <span className="fw-medium">
                                    {item.user?.fullName}
                                  </span>
                                  <small className="text-muted">
                                    {item.user?.email}
                                  </small>
                                </div>
                              </td>
                              <td>
                                {item.orderItems?.map((oi, i) => (
                                  <div key={i}>
                                    {oi.ticket?.type} ({oi.quantity})
                                  </div>
                                ))}
                              </td>
                              <td className="text-center">
                                {item.orderItems?.reduce(
                                  (sum, oi) => sum + oi.quantity,
                                  0
                                )}
                              </td>
                              <td>
                                {new Date(item.visitDate).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className="text-center">
                                {getStatusBadge(item.payment?.paymentStatus)}
                              </td>
                              <td className="text-center">
                                {getVisitStatus(item.visitDate)}
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">
                                  {item.payment?.paymentMethod}
                                </span>
                              </td>
                              <td className="text-end fw-bold">
                                Rp{" "}
                                {item.payment?.totalAmount?.toLocaleString(
                                  "id-ID"
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center py-4">
                              <div className="d-flex flex-column align-items-center">
                                <Image
                                  src="/images/no-data.svg"
                                  width={120}
                                  height={120}
                                  alt="No data"
                                  style={{ opacity: 0.7 }}
                                />
                                <p className="text-muted mt-3">
                                  {searchTerm
                                    ? "Tidak ditemukan data yang sesuai dengan pencarian"
                                    : "Tidak ada data transaksi untuk periode ini"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Summary Section */}
                {filteredData.length > 0 && (
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Total Transaksi</span>
                            <span className="fw-bold fs-5">
                              {filteredData.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">
                              Total Tiket Terjual
                            </span>
                            <span className="fw-bold fs-5">
                              {calculateTotalTickets()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Total Pendapatan</span>
                            <span className="fw-bold fs-5 text-success">
                              Rp {summary.totalAll.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Breakdown */}
                {Object.keys(summary.totalByCategory).length > 0 && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-3">
                          <h6 className="fw-bold mb-3">Rincian Per Kategori</h6>
                          <div className="d-flex flex-wrap gap-3">
                            {Object.entries(summary.totalByCategory).map(
                              ([category, total]) => (
                                <div
                                  key={category}
                                  className="badge bg-info text-dark p-2"
                                >
                                  {category}: Rp {total.toLocaleString("id-ID")}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-highlight:hover {
          background-color: rgba(13, 110, 253, 0.05) !important;
          cursor: pointer;
        }
        .card-header {
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }
        .table th {
          border-top: none;
          border-bottom: 2px solid #dee2e6;
        }
        .badge {
          padding: 0.35em 0.65em;
          font-size: 0.75em;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
