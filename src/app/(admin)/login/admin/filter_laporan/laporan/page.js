"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Template from "@/components/admin/Template";
import { FiDownload, FiFilter, FiSearch, FiCalendar } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const searchParams = useSearchParams();

  // Get parameters from URL
  const ticket = searchParams.get("ticket");
  const bulan = searchParams.get("bulan");
  const tahun = searchParams.get("tahun");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!bulan || !tahun) return;
        setLoading(true);
        
        const res = await fetch(`/api/some-data?ticket=${ticket}&bulan=${bulan}&tahun=${tahun}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        
        const result = await res.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bulan, tahun]);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(item => 
        item.nama_pengunjung.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kode_pemesanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tiket_dipilih.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <span className="badge bg-success rounded-pill d-flex align-items-center">
            <FaCheckCircle className="me-1" /> Lunas
          </span>
        );
      case "pending":
        return (
          <span className="badge bg-warning text-dark rounded-pill d-flex align-items-center">
            <FaClock className="me-1" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="badge bg-danger rounded-pill d-flex align-items-center">
            <FaTimesCircle className="me-1" /> Gagal
          </span>
        );
      default:
        return <span className="badge bg-secondary rounded-pill">{status}</span>;
    }
  };

  const getVisitStatus = (visitDate) => {
    const today = new Date();
    const visit = new Date(visitDate);
    
    if (visit > today) {
      return (
        <span className="badge bg-info rounded-pill">
          Akan Berkunjung
        </span>
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

  return (
    <>
      <Template />
      <div className="container-fluid py-4" style={{ minHeight: "100vh" }}>
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="card-title fw-semibold mb-0 text-white">
                    Laporan Transaksi Tiket Museum Lampung
                  </h2>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-white text-primary fs-6 me-3">
                      <FiCalendar className="me-1" />
                      {bulan}/{tahun}
                    </span>
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
                      <button className="btn btn-outline-secondary" type="button">
                        <FiFilter className="me-1" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <a
                      href={`/login/admin/pemesanan/cetak_pdf?bulan=${bulan}&tahun=${tahun}`}
                      className="btn btn-success"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiDownload className="me-2" />
                      Cetak Laporan
                    </a>
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
                          <th className="fw-semibold">Tanggal</th>
                          <th className="fw-semibold text-center">Pembayaran</th>
                          <th className="fw-semibold text-center">Kunjungan</th>
                          <th className="fw-semibold">Metode</th>
                          <th className="fw-semibold text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length > 0 ? (
                          filteredData.map((item, index) => (
                            <tr key={index} className="hover-highlight">
                              <td>{index + 1}</td>
                              <td className="fw-semibold text-primary">
                                {item.kode_pemesanan}
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <span className="fw-medium">{item.nama_pengunjung}</span>
                                  <small className="text-muted">{item.email}</small>
                                </div>
                              </td>
                              <td>{item.tiket_dipilih}</td>
                              <td className="text-center">{item.banyak_tiket}</td>
                              <td>
                                {new Date(item.tanggal_berkunjung).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="text-center">
                                {getStatusBadge(item.status_pembayaran)}
                              </td>
                              <td className="text-center">
                                {getVisitStatus(item.tanggal_berkunjung)}
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">
                                  {item.metode_pembayaran}
                                </span>
                              </td>
                              <td className="text-end fw-bold">
                                Rp {item.total_pembelian.toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center py-4">
                              <div className="d-flex flex-column align-items-center">
                                <img
                                  src="/empty-state.svg"
                                  alt="No data"
                                  style={{ width: "120px", opacity: 0.7 }}
                                />
                                <p className="text-muted mt-3">
                                  {searchTerm 
                                    ? "Tidak ditemukan data yang sesuai dengan pencarian"
                                    : "Tidak ada data transaksi untuk bulan ini"}
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
                            <span className="text-muted">Total Tiket Terjual</span>
                            <span className="fw-bold fs-5">
                              {filteredData.reduce((sum, item) => sum + item.banyak_tiket, 0)}
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
                              Rp {filteredData
                                .reduce((sum, item) => sum + item.total_pembelian, 0)
                                .toLocaleString("id-ID")}
                            </span>
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