"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Aboutnext() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Data dummy untuk koleksi unggulan
  const featuredCollections = [
    {
      id: 1,
      name: "Nekara Perunggu",
      description: "Alat musik tradisional Lampung dari zaman perunggu",
      image: "/assets/images/collection1.jpg",
    },
    {
      id: 2,
      name: "Tapis Lampung",
      description: "Kain tradisional tenun dengan motif khas Lampung",
      image: "/assets/images/collection2.jpg",
    },
    {
      id: 3,
      name: "Prasasti Bawang",
      description: "Prasasti kuno peninggalan Kerajaan Tulang Bawang",
      image: "/assets/images/collection3.jpg",
    },
    {
      id: 4,
      name: "Perhiasan Adat",
      description: "Perhiasan tradisional dari emas dan perak",
      image: "/assets/images/collection4.jpg",
    },
  ];

  return (
    <>
      {/* Hero Section with Parallax */}
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center overflow-hidden"
        id="aboutnext"
        style={{
         height: "50vh",
          backgroundImage: "url('/assets/images/our2.jpeg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div className="overlay position-absolute top-0 start-0 w-100 h-100"></div>
        <motion.div
          className="position-relative text-white text-center z-2"
          style={{ zIndex: 2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="fw-bold display-4 mb-3">Destinasi Info </h1>
        </motion.div>
       
      </section>

      {/* Tentang Museum */}
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 col-10 mb-5 mb-lg-5" data-aos="fade-right">
              <div className="image-container rounded overflow-hidden shadow-lg">
                <Image
                  src="/assets/images/museum.jpg"
                  className="img-fluid"
                  alt="Museum Lampung"
                  width={"600"}
                  height={"200"}
                />
              </div>
            </div>
            <div className="col-lg-6 col-12" data-aos="fade-left">
              <h2 className="fw-bold text-black mb-2 text-ju">
                Selamat Datang di Museum Ruwa Jurai
              </h2>
              <p className="text-dark mb-4" style={{ textAlign: "justify" }}>
                Museum Negeri Propinsi Lampung &ldquo;Ruwa Jurai&ldquo; terletak
                di Jln. Zainal Arifin Pagar Alam No. 64, Rajabasa, Bandar
                Lampung. Letaknya strategis, dekat Terminal Rajabasa dan gerbang
                Kampus UNILA.
              </p>
              <p className="text-dark" style={{ textAlign: "justify" }}>
                Museum ini merupakan pusat pelestarian budaya Lampung yang
                menampung lebih dari 15.000 koleksi bersejarah. Dengan
                arsitektur tradisional Lampung yang megah, museum ini menjadi
                ikon budaya provinsi Lampung.
              </p>

              <div className="d-flex mt-4 gap-3">
                <Link href="/venues">
                  <button
                    className="btn px-4 py-2"
                    style={{
                      background: "white",
                      borderRadius: "20px",
                      transition: "all 0.3s ease",
                      outline: "1px solid #0d6efd",
                      color: "#0d6efd",
                      border: "none",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#0d6efd";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#0d6efd";
                    }}
                  >
                    Lihat Koleksi
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section-padding py-5 bg-white">
        {/* Info Cards */}
        <div className="col-12">
          <motion.div
            className="d-flex justify-content-center flex-wrap gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* Card 1 */}
            <div
              className="rounded-4 p-4 text-center shadow-sm transition-all duration-300 hover-card"
              style={{
                backgroundColor: "#FFFFFF",
                minWidth: "220px",
                flex: "1 1 250px",
                border: "2px solid #0D6EFD",
                color: "#000000",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mx-auto rounded-circle transition-all duration-300 hover-icon"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#0D6EFD",
                }}
              >
                <i className="bi bi-collection fs-2 text-white"></i>
              </div>
              <h3 className="text-3xl fw-bold mt-3">
                15.000<span>+</span>
              </h3>
              <p className="mt-2 mb-0 text-dark">
                Koleksi bersejarah yang tersimpan di museum
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="rounded-4 p-4 text-center shadow-sm transition-all duration-300 hover-card"
              style={{
                backgroundColor: "#FFFFFF",
                minWidth: "220px",
                flex: "1 1 250px",
                border: "2px solid #0D6EFD",
                color: "#000000",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mx-auto rounded-circle transition-all duration-300 hover-icon"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#0D6EFD",
                }}
              >
                <i className="bi bi-people-fill fs-2 text-white"></i>
              </div>
              <h3 className="text-3xl fw-bold mt-3">
                120.000<span>+</span>
              </h3>
              <p className="mt-2 mb-0 text-dark">
                Pengunjung setiap tahunnya dari seluruh Indonesia
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="rounded-4 p-4 text-center shadow-sm transition-all duration-300 hover-card"
              style={{
                backgroundColor: "#FFFFFF",
                minWidth: "220px",
                flex: "1 1 250px",
                border: "2px solid #0D6EFD",
                color: "#000000",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mx-auto rounded-circle transition-all duration-300 hover-icon"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#0D6EFD",
                }}
              >
                <i className="bi bi-award fs-2 text-white"></i>
              </div>
              <h3 className="text-3xl fw-bold mt-3">
                10<span>+</span>
              </h3>
              <p className="mt-2 mb-0 text-dark">
                Penghargaan nasional atas pelestarian budaya
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sejarah */}
      <section className="section-padding bg-dark text-white position-relative">
        <div className="pattern-overlay"></div>
        <div className="container position-relative z-1">
          <div className="row g-5">
            <div className="col-lg-5 col-12" data-aos="fade-right">
              <h2 className="fw-bold mb-4 text-white">
                Sejarah Museum Ruwa Jurai
              </h2>
              <p className="mb-4 text-white">
                Museum ini mulai dibangun pada tahun 1975, dan diresmikan pada
                tahun 1988. Museum ini merupakan museum pertama dan terbesar di
                Provinsi Lampung.
              </p>
              <div className="mb-4">
                <Image
                  src="/assets/images/history.jpg"
                  className="img-fluid rounded shadow"
                  alt="Sejarah Museum"
                  width={"400"}
                  height={"200"}
                />
              </div>
            </div>

            <div className="col-lg-7 col-12" data-aos="fade-left">
              <div
                className="bg-dark-light p-4 rounded position-relative"
                style={{ minHeight: "400px" }}
              >
                <h4 className="fw-bold mb-4 text-white">Tahap Pembangunan</h4>
                <ul className="list-unstyled timeline">
                  <li className="mb-4 position-relative ps-4">
                    <div className="timeline-badge"></div>
                    <h5 className="fw-bold mb-2 text-white">
                      1975 - Perencanaan Awal
                    </h5>
                    <p className="text-white">
                      Dimulai sebagai proyek budaya provinsi dengan dukungan
                      pemerintah daerah.
                    </p>
                  </li>
                  <li className="mb-4 position-relative ps-4">
                    <div className="timeline-badge"></div>
                    <h5 className="fw-bold mb-2 text-white">
                      1985 - Pembangunan Gedung
                    </h5>
                    <p className="text-white">
                      Pembangunan gedung utama dengan arsitektur tradisional
                      Lampung.
                    </p>
                  </li>
                  <li className="mb-4 position-relative ps-4">
                    <div className="timeline-badge"></div>
                    <h5 className="fw-bold mb-2 text-white">
                      1988 - Peresmian
                    </h5>
                    <p className="text-white">
                      Diresmikan oleh Gubernur Lampung dengan nama &ldquo;Ruwa
                      Jurai&ldquo;.
                    </p>
                  </li>
                  <li className="position-relative ps-4">
                    <div className="timeline-badge"></div>
                    <h5 className="fw-bold mb-2 text-white">
                      2000-Sekarang - Pengembangan
                    </h5>
                    <p className="text-white">
                      Perluasan koleksi dan fasilitas untuk melayani masyarakat
                      lebih baik.
                    </p>
                  </li>
                </ul>

                
              </div>
              <div className="position-absolute end-0 p-3">
                  <Link href="/historynext">
                    <button className="btn btn-outline-light px-4 py-2 fw-bold rounded-pill">
                      Pelajari Selengkapnya
                    </button>
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Tambahan */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="fw-bold mb-3 text-black">Informasi Kunjungan</h2>
              <p className="text-muted mb-0">
                Informasi lengkap untuk perencanaan kunjungan Anda
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="card border-0 shadow rounded-3 overflow-hidden">
                <div className="card-body p-0">
                  <ul
                    className="nav nav-tabs nav-fill bg-light"
                    id="infoTab"
                    role="tablist"
                  >
                    {["Jam Operasional", "Tata Tertib", "Harga Tiket"].map(
                      (label, i) => (
                        <li key={i} className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              i === 0 ? "active" : ""
                            } fw-bold py-3`}
                            id={`${label}-tab`}
                            data-bs-toggle="tab"
                            data-bs-target={`#${label
                              .toLowerCase()
                              .replace(/\s/g, "")}`}
                            type="button"
                            role="tab"
                          >
                            {label}
                          </button>
                        </li>
                      )
                    )}
                  </ul>

                  <div className="tab-content p-4 p-lg-5" id="infoTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="jamoperasional"
                      role="tabpanel"
                    >
                      <div className="row align-items-center">
                        <div className="col-md-3 text-center mb-4 mb-md-0">
                          <i className="bi bi-clock fs-1 text-primary"></i>
                        </div>
                        <div className="col-md-9">
                          <h4 className="fw-bold mb-3">
                            Jam Operasional Museum
                          </h4>
                          <ul className="list-unstyled">
                            <li className="d-flex justify-content-between border-bottom py-2">
                              <span>Selasa - Kamis</span>
                              <span className="fw-bold">08.00 - 14.00 WIB</span>
                            </li>
                            <li className="d-flex justify-content-between border-bottom py-2">
                              <span>Jumat</span>
                              <span className="fw-bold">08.00 - 10.30 WIB</span>
                            </li>
                            <li className="d-flex justify-content-between border-bottom py-2">
                              <span>Sabtu - Minggu</span>
                              <span className="fw-bold">08.00 - 14.00 WIB</span>
                            </li>
                            <li className="d-flex justify-content-between py-2">
                              <span>Senin & Hari Libur Nasional</span>
                              <span className="fw-bold text-danger">TUTUP</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="tatatertib"
                      role="tabpanel"
                    >
                      <div className="row align-items-center">
                        <div className="col-md-3 text-center mb-4 mb-md-0">
                          <i className="bi bi-journal fs-1 text-primary"></i>
                        </div>
                        <div className="col-md-9">
                          <h4 className="fw-bold mb-3">Tata Tertib Museum</h4>
                          <ul className="list-unstyled">
                            {[
                              "Dilarang merokok di dalam area museum",
                              "Harap menjaga kebersihan dan ketertiban",
                              "Dilarang menyentuh koleksi museum tanpa izin",
                              "Pengunjung diharap menjaga volume suara",
                              "Dilarang membawa makanan dan minuman ke dalam ruang pamer",
                              "Anak-anak harus didampingi orang dewasa",
                            ].map((rule, idx) => (
                              <li key={idx} className="d-flex mb-2">
                                <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="hargatiket"
                      role="tabpanel"
                    >
                      <div className="row align-items-center">
                        <div className="col-md-3 text-center mb-4 mb-md-0">
                          <i className="bi bi-ticket-perforated fs-1 text-primary"></i>
                        </div>
                        <div className="col-md-9">
                          <h4 className="fw-bold mb-3">Harga Tiket Masuk</h4>
                          <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                              <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center py-4">
                                  <h5 className="fw-bold text-primary">
                                    Dewasa
                                  </h5>
                                  <h2 className="fw-bold my-3">Rp 5.000</h2>
                                  <p className="text-muted small mb-0">
                                    Per orang
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center py-4">
                                  <h5 className="fw-bold text-primary">
                                    Pelajar/Mahasiswa
                                  </h5>
                                  <h2 className="fw-bold my-3">Rp 2.000</h2>
                                  <p className="text-muted small mb-0">
                                    Dengan menunjukkan kartu pelajar
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <Link href="/register/ticket">
                              <button className="btn btn-primary px-4 py-2 fw-bold rounded-pill">
                                Pesan Tiket Sekarang
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        :root {
          --primary: #297bbf;
          --primary-light: #e8f4ff;
          --dark: #212529;
          --light: #f8f9fa;
        }

        .hero-section {
          position: relative;
        }

        .overlay {
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
          z-index: 1;
        }

        .divider {
          width: 80px;
          height: 4px;
          background-color: #ffffff;
          border-radius: 10px;
        }

        .section-padding {
          padding: 80px;
        }

        .bg-dark-light {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .icon-box {
          width: 60px;
          height: 60px;
          background-color: var(--primary-light);
        }

        .pattern-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
          opacity: 0.1;
        }

        .timeline {
          position: relative;
        }

        .timeline::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 15px;
          width: 2px;
          background: var(--primary);
        }

        .timeline-badge {
          position: absolute;
          left: 5px;
          top: 8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          border: 4px solid var(--dark);
        }

        .collection-image {
          transition: transform 0.3s ease;
        }

        .card:hover .collection-image {
          transform: scale(1.05);
        }

        .nav-tabs .nav-link {
          color: var(--dark);
          font-weight: 500;
          border: none;
          position: relative;
        }

        .nav-tabs .nav-link.active {
          color: var(--primary);
          background: transparent;
        }

        .nav-tabs .nav-link.active::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3px;
          background-color: var(--primary);
        }

        .btn-outline-light:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .hover-card:hover {
          background-color: #0d6efd !important;
          color: #ffffff !important;
          cursor: pointer;
        }
        .hover-card:hover h3,
        .hover-card:hover p {
          color: #ffffff !important;
        }
        .hover-card:hover .hover-icon {
          background-color: #ffffff !important;
        }
        .hover-card:hover .hover-icon i {
          color: #0d6efd !important;
        }
      `}</style>
    </>
  );
}
