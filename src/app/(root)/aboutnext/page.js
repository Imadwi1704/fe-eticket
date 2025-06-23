"use client";

import { useState, useEffect, Fragment } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import page from "@/config/page";

export default function Aboutnext() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
      offset: 120,
    });
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(page.baseUrl + "/api/ticket", {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Gagal untuk mengambil data tiket");
      }

      const data = await res.json();
      setTickets(data);
    } catch (error) {
      setError(error.message || "Failed to fetch ticket data");
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
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
          <h1 className="fw-bold display-4 mb-0">Destinasi Info</h1>
          <p className="lead text-white">
            Mengenal Lebih Dekat Museum Ruwa Jurai
          </p>
        </motion.div>
      </section>

      {/* Tentang Museum */}
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 col-12 mb-5 mb-lg-0" data-aos="fade-right">
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <motion.div
                    className="rounded overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src="/assets/images/museum.jpg"
                      className="img-fluid w-100"
                      alt="Museum Lampung"
                      width={200}
                      height={100}
                      priority
                      style={{ objectFit: "cover", height: "150px" }}
                    />
                  </motion.div>
                </div>
                <div className="col-md-6">
                  <motion.div
                    className="rounded overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Image
                      src="/assets/images/our2.jpeg"
                      className="img-fluid w-100"
                      alt="Interior Museum"
                      width={400}
                      height={300}
                      style={{ objectFit: "cover", height: "150px" }}
                    />
                  </motion.div>
                </div>
                <div className="col-12">
                  <motion.div
                    className="rounded overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Image
                      src="/assets/images/our3.jpg"
                      className="img-fluid w-100"
                      alt="Koleksi Museum"
                      width={600}
                      height={300}
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-12" data-aos="fade-left">
              <h2 className="fw-bold text-black mb-4">
                Selamat Datang{" "}
                <span className="text-primary">di Museum Lampung</span>
              </h2>
              <div className="mb-4">
                <p className="text-dark" style={{ textAlign: "justify" }}>
                  Museum Negeri Propinsi Lampung Ruwa Jurai terletak di Jln.
                  Zainal Arifin Pagar Alam No. 64, Rajabasa, Bandar Lampung.
                  Letaknya strategis, dekat Terminal Rajabasa dan gerbang Kampus
                  UNILA.
                </p>
                <p className="text-dark" style={{ textAlign: "justify" }}>
                  Museum ini merupakan pusat pelestarian budaya Lampung yang
                  menampung lebih dari 15.000 koleksi bersejarah. Dengan
                  arsitektur tradisional Lampung yang megah, museum ini menjadi
                  ikon budaya provinsi Lampung.
                </p>
              </div>
              <div className="d-flex mt-4 gap-3 flex-wrap">
                <Link href="/venues" passHref legacyBehavior>
                  <motion.a
                    className="btn px-4 py-2"
                    style={{
                      background: "white",
                      borderRadius: "20px",
                      outline: "1px solid #0d6efd",
                      color: "#0d6efd",
                      border: "none",
                      cursor: "pointer",
                    }}
                    whileHover={{
                      background: "#0d6efd",
                      color: "white",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Lihat Koleksi
                  </motion.a>
                </Link>
                <Link href="/register/ticket" passHref legacyBehavior>
                  <motion.a
                    className="btn px-4 py-2"
                    style={{
                      background: "#0d6efd",
                      borderRadius: "20px",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    whileHover={{
                      background: "#0b5ed7",
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Beli Tiket
                  </motion.a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section
        className="section-padding py-5"
        style={{
          backgroundImage: "url('/assets/images/our3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Info Cards */}
        <div className="col-8 mx-auto text-center mb-3 position-relative">
          <motion.div
            className="d-flex justify-content-center flex-wrap gap-4 position-relative"
            style={{ zIndex: 1 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* Card 1 */}
            <div
              className="rounded-4 p-4 text-center shadow-sm transition-all duration-300 hover-card"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                minWidth: "220px",
                flex: "1 1 250px",
                backdropFilter: "blur(10px)",
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
              <h2 className="text-white fw-bold mt-3">
                15Rb<span className="text-primary">+</span>
              </h2>
              <p className="mt-2 mb-0 text-white">
                Koleksi bersejarah yang tersimpan di museum
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="rounded-4 p-4 text-center shadow-sm transition-all duration-300 hover-card"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                minWidth: "220px",
                flex: "1 1 250px",
                backdropFilter: "blur(10px)",
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
              <h2 className="text-white fw-bold mt-3">
                120Rb<span className="text-primary">+</span>
              </h2>
              <p className="mt-2 mb-0 text-white">
                Pengunjung setiap tahunnya dari seluruh Indonesia
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="rounded-4 p-4 text-center shadow-sm transition-all duration-300 hover-card"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                minWidth: "220px",
                flex: "1 1 250px",
                backdropFilter: "blur(10px)",
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
              <h2 className="text-white fw-bold mt-3">
                10<span className="text-primary">+</span>
              </h2>
              <p className="mt-2 mb-0 text-white">
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
              <h2 className="fw-bold text-white">Sejarah Museum Lampung</h2>
              <p className="mb-4 text-white" style={{ textAlign: "justify" }}>
                Museum ini mulai dibangun pada tahun 1975, dan diresmikan pada
                tahun 1988. Museum ini merupakan museum pertama dan terbesar di
                Provinsi Lampung.
              </p>
              <div className="mb-4">
                <Image
                  src="/assets/images/history.jpg"
                  className="img-fluid rounded shadow"
                  alt="Sejarah Museum"
                  width={420}
                  height={80}
                />
              </div>
            </div>

            <div className="col-lg-7 col-12" data-aos="fade-left">
              <div
                className="bg-dark-light p-4 rounded position-relative"
                style={{ minHeight: "400px" }}
              >
                <ul className="list-unstyled timeline">
                  <li className="mb-4 position-relative ps-4">
                    <div className="timeline-badge"></div>
                    <h3 className="fw-bold mb-2 text-white">
                      1975 - Perencanaan Awal
                    </h3>
                    <p className="text-white">
                      Dimulai sebagai proyek budaya provinsi dengan dukungan
                      pemerintah daerah.
                    </p>
                  </li>
                  <li className="mb-4 position-relative ps-4">
                    <div className="timeline-badge"></div>
                    <h3 className="fw-bold mb-2 text-white">
                      1985 - Pembangunan Gedung
                    </h3>
                    <p className="text-white">
                      Pembangunan gedung utama dengan arsitektur tradisional
                      Lampung.
                    </p>
                  </li>
                  <li className="mb-4 position-relative ps-4">
                    <div className="timeline-badge"></div>
                    <h3 className="fw-bold mb-2 text-white">
                      1988 - Peresmian
                    </h3>
                    <p className="text-white">
                      Diresmikan oleh Gubernur Lampung dengan nama &ldquo;Ruwa
                      Jurai&ldquo;.
                    </p>
                  </li>
                  <li className="position-relative ps-4">
                    <div className="timeline-badge"></div>
                    <h3 className="fw-bold mb-2 text-white">
                      2000-Sekarang - Pengembangan
                    </h3>
                    <p className="text-white">
                      Perluasan koleksi dan fasilitas untuk melayani masyarakat
                      lebih baik.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Tambahan */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="fw-bold mb-2 text-black">Informasi Kunjungan</h2>
              <p className="text-muted mb-3">
                Informasi lengkap Jam Operasional dan Tata Tertib Museum
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className=" overflow-hidden">
                <div className="card-body p-0">
                  <div
                    className="nav nav-tabs nav-fill bg-light"
                    id="infoTab"
                    role="tablist"
                  >
                    {["Jam Operasional", "Tata Tertib"].map((label, i) => (
                      <button
                        key={i}
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
                        aria-controls={`${label
                          .toLowerCase()
                          .replace(/\s/g, "")}`}
                        aria-selected={i === 0}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="tab-content p-4 p-lg-5" id="infoTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="jamoperasional"
                      role="tabpanel"
                      aria-labelledby="jam-operasional-tab"
                    >
                      <div className="row align-items-center">
                        <div className="col-md-3 text-center mb-4 mb-md-0">
                          <i className="bi bi-clock fs-1 text-dark"></i>
                        </div>
                        <div className="col-md-9">
                          <h5 className="mb-3">Jam Operasional Museum</h5>
                          <ul className="list-unstyled">
                            <li className="d-flex justify-content-between border-bottom py-2">
                              <span className="text-dark">Selasa - Kamis</span>
                              <span className="text-dark">
                                08.00 - 14.00 WIB
                              </span>
                            </li>
                            <li className="d-flex justify-content-between border-bottom py-2">
                              <span className="text-dark">Jumat</span>
                              <span className="text-dark">
                                08.00 - 10.30 WIB
                              </span>
                            </li>
                            <li className="d-flex justify-content-between border-bottom py-2">
                              <span className="text-dark">Sabtu - Minggu</span>
                              <span className="text-dark">
                                08.00 - 14.00 WIB
                              </span>
                            </li>
                            <li className="d-flex justify-content-between py-2">
                              <span className="text-dark">
                                Senin & Hari Libur Nasional
                              </span>
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
                      aria-labelledby="tata-tertib-tab"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Cards Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="row mb-3">
            <div className=" mx-auto">
              <h2 className="fw-bold">Tiket Museum</h2>
              <p className="text-dark">
                Jenis tiket yang tersedia untuk pengunjung, lengkap dengan harga
                dan syarat ketentuan.
              </p>
            </div>
          </div>

          {/* Loading and error states */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Memuat data tiket...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={fetchTickets}
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {tickets.slice(0, 3).map((ticket) => (
                <div className="col-md-3 col-sm-3 mb-3" key={ticket.id}>
                  <motion.div
                    className="card h-100 border-0 position-relative overflow-hidden"
                    style={{
                      backgroundColor: "#caf2fa",
                      borderRadius: "12px",
                    }}
                  >
                    {/* Card Body */}
                    <div className="card-body py-3 px-4">
                      {/* Price */}
                      <div className="mb-3">
                        <h3
                          className="fw-bold mb-3 text-dark"
                          style={{ fontSize: "20px" }}
                        >
                          Tiket Masuk {ticket.type}
                        </h3>
                        <span
                          className="text-dark"
                          style={{ fontSize: "18px", fontWeight: "300" }}
                        >
                          Rp{ticket.price.toLocaleString("id-ID")}{" "}
                          <span className="text-dark">/orang</span>
                        </span>
                      </div>
                      <span className="text-dark fw-bold mb-2 d-block">
                        Syarat Ketentuan:
                      </span>

                      {/* Features List */}
                      <ul
                        className="list-unstyled mb-3"
                        style={{ paddingLeft: "0.5rem" }}
                      >
                        {ticket.terms.split("\n").map((term, index) => {
                          const termItems = term
                            .split(";")
                            .filter((item) => item.trim() !== "");

                          return (
                            <Fragment key={index}>
                              {termItems.map((item, itemIndex) => (
                                <li
                                  key={`${index}-${itemIndex}`}
                                  className="mb-2 d-flex align-items-start"
                                  style={{ lineHeight: "1.6" }}
                                >
                                  <i
                                    className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"
                                    style={{ fontSize: "1rem" }}
                                  ></i>
                                  <span
                                    className="text-dark"
                                    style={{
                                      fontSize: "0.95rem",
                                    }}
                                  >
                                    {item.trim()}
                                  </span>
                                </li>
                              ))}
                            </Fragment>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer bg-transparent border-0 pb-4 pt-0 text-center">
                      <Link
                        href={`/register/ticket?type=${encodeURIComponent(
                          ticket.type
                        )}`}
                        passHref
                        legacyBehavior
                      >
                        <motion.a
                          className="btn btn-primary px-1 py-1 rounded-pill "
                          style={{
                            minWidth: "180px",
                            fontSize: "1rem",
                            zIndex: 1,
                            overflow: "hidden",
                          }}
                          whileHover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="position-relative">
                            Pesan Sekarang
                          </span>
                          <motion.span
                            className="position-absolute top-0 left-0 w-100 h-100 bg-white"
                            style={{
                              opacity: 0,
                              borderRadius: "9999px",
                              zIndex: -1,
                            }}
                            whileHover={{
                              opacity: 0.1,
                              scale: 1.2,
                            }}
                          ></motion.span>
                        </motion.a>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        :root {
          --primary: #0d6efd;
          --primary-light: #e8f4ff;
          --dark: #212529;
          --light: #f8f9fa;
        }
        .text-white {
          color: #ffffff !important;
        }

        body {
          scroll-behavior: smooth;
        }

        .hero-section {
          position: relative;
        }

        .overlay {
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
          z-index: 1;
        }

        .section-padding {
          padding: 5rem 0;
        }

        @media (max-width: 768px) {
          .section-padding {
            padding: 3rem 0;
          }
        }

        .bg-dark-light {
          background-color: rgba(33, 37, 41, 0.7);
          backdrop-filter: blur(10px);
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
          padding-left: 1rem;
        }

        .timeline::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 15px;
          width: 2px;
          background: #0d6efd;
        }

        .timeline-badge {
          position: absolute;
          left: 5px;
          top: 8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0d6efd;
          border: 4px solid var(--dark);
          z-index: 1;
        }
        a:focus,
        button:focus {
          outline: none !important;
          outline-offset: 0 !important;
        }

        .nav-tabs {
          border-bottom: none;
        }

        .nav-tabs .nav-link {
          color: var(--dark);
          font-weight: 500;
          border: none;
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-tabs .nav-link:hover {
          color: var(--primary);
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
          transition: all 0.3s ease;
        }

        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 0.5rem !important;
        }

        .card-header {
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }

        /* Accessibility improvements */
        a:focus,
        button:focus {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        /* Print styles */
        @media print {
          .hero-section,
          .btn,
          .nav-tabs,
          .footer {
            display: none !important;
          }

          body {
            padding: 0;
            background: white;
            color: black;
            font-size: 12pt;
          }

          .container {
            width: 100%;
            max-width: 100%;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
