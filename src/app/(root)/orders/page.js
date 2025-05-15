"use client";

import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Historynext() {
  return (
    <>
      <Navbar />
      
      {/* Main Content */}
      <main className="container py-5">
        <section className="card border-0 shadow-lg">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 fw-bold text-dark mb-0">History Pemesanan</h2>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-filter"></i> Filter
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-sort-down"></i> Urutkan
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="table-responsive rounded-3 overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="bg-gradient-primary text-white">
                  <tr>
                    <th className="text-center">No</th>
                    <th>Kode Pemesanan</th>
                    <th>Tiket</th>
                    <th className="text-center">Jumlah</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Contoh Data Dummy */}
                  <tr>
                    <td className="text-center align-middle">1</td>
                    <td className="align-middle">
                      <span className="badge bg-light text-dark border">ORD123456</span>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex flex-column">
                        <span className="fw-medium">Tiket Reguler</span>
                        <small className="text-muted">Museum Negeri</small>
                      </div>
                    </td>
                    <td className="text-center align-middle">2</td>
                    <td className="align-middle">
                      <div className="d-flex flex-column">
                        <span>2025-05-01</span>
                        <small className="text-muted">10:00 WIB</small>
                      </div>
                    </td>
                    <td className="align-middle">
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill fw-medium">
                        <i className="bi bi-check-circle me-2"></i>Berhasil
                      </span>
                    </td>
                    <td className="align-middle fw-medium">Rp 100.000</td>
                    <td><a href="/detail"><i className="bi bi-eye me-2"></i></a></td>
                    <td><a href="/"><i className="bi bi-printer me-2"></i></a></td>
                  </tr>

                  {/* Contoh Data Lain */}
                  <tr>
                    <td className="text-center align-middle">2</td>
                    <td className="align-middle">
                      <span className="badge bg-light text-dark border">ORD789012</span>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex flex-column">
                        <span className="fw-medium">Tiket VIP</span>
                        <small className="text-muted">Paket Tur Lengkap</small>
                      </div>
                    </td>
                    <td className="text-center align-middle">4</td>
                    <td className="align-middle">
                      <div className="d-flex flex-column">
                        <span>2025-05-02</span>
                        <small className="text-muted">13:30 WIB</small>
                      </div>
                    </td>
                    <td className="align-middle">
                      <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill fw-medium">
                        <i className="bi bi-clock-history me-2"></i>Pending
                      </span>
                    </td>
                    <td className="align-middle fw-medium">Rp 450.000</td>
                    <td className="text-center align-middle">
                      {/* Dropdown Menu sama */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav className="d-flex justify-content-end mt-4">
              <ul className="pagination">
                <li className="page-item"><a className="page-link" href="#"><i className="bi bi-chevron-left"></i></a></li>
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item"><a className="page-link" href="#"><i className="bi bi-chevron-right"></i></a></li>
              </ul>
            </nav>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}