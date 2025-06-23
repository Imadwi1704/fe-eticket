"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import {
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiFlag,
  FiHome,
  FiPlusSquare,
  FiTool,
  FiDatabase,
  FiCamera,
  FiCompass,
  FiNavigation,
} from "react-icons/fi";

export default function Historynext() {
  const heroRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
      offset: 100,
    });

    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.pageYOffset;
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center overflow-hidden"
        id="aboutnext"
        style={{
          height: "50vh",
          backgroundImage: "url('/assets/images/histori.jpg')",
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
          <h1 className="fw-bold display-4 mb-0"> Sejarah Museum Lampung</h1>
          <p className="lead text-white">
            Menyelami warisan budaya dan sejarah Lampung yang kaya melalui
            koleksi dan tradisi yang beragam.
          </p>
        </motion.div>
      </section>

      {/* History Section - Clean Layout */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className=" overflow-hidden">
                {/* Museum Image */}
                <div className="position-relative">
                  <Image
                    src="/assets/images/history.jpg"
                    alt="Museum Lampung"
                    width={800}
                    height={450}
                    className="img-fluid w-100"
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="lead text-muted mb-4 text-justify">
                    Museum Lampung atau Museum Negeri Provinsi Lampung Ruwa
                    Jurai mulai dibangun tahun 1975, diresmikan pada 24
                    September 1988. Merupakan museum pertama dan terbesar di
                    Provinsi Lampung yang menyimpan warisan budaya dan sejarah
                    berharga.
                  </p>

                  {/* Philosophy Highlight */}
                  <div className="bg-primary bg-opacity-10 p-4 rounded-3 my-4">
                    <h4 className="h5 fw-bold mb-2">
                      Filosofi Nama Ruwa Jurai
                    </h4>
                    <p className="mb-0">
                      Ruwa Jurai berarti Dua Aliran dalam bahasa Lampung,
                      mencerminkan dua kelompok masyarakat adat utama: Saibatin
                      (Peminggir) dan Pepadun (Adat Pedalaman) yang hidup rukun
                      dalam keberagaman budaya.
                    </p>
                  </div>

                  {/* Collections */}
                  <div>
                    <h4 className="h5 fw-bold mt-4 mb-3">Koleksi Unggulan</h4>
                    <p>
                      Museum menyimpan sekitar 4.735 koleksi dalam 10 kategori:
                    </p>
                    <div className="row g-2 mt-2">
                      {[
                        "Geologika",
                        "Biologika",
                        "Etnografika",
                        "Historika",
                        "Numismatika",
                        "Filologika",
                        "Keramologika",
                        "Seni Rupa",
                        "Teknologika",
                        "Arkeologika",
                      ].map((item, idx) => (
                        <div className="col-6 col-md-4" key={idx}>
                          <div className="d-flex align-items-center p-2 bg-white rounded shadow-sm">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: "24px",
                                height: "24px",
                                fontSize: "0.7rem",
                              }}
                            >
                              {idx + 1}
                            </div>
                            <span className="ms-2 small">{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Culture Comparison */}
                  <div className="mt-5">
                    <h4 className="h5 fw-bold mb-3">Budaya & Tradisi</h4>
                    <div className="row g-3 bordeer-2">
                      {[
                        {
                          title: "Saibatin (Peminggir)",
                          items: [
                            "Ritual kelahiran (Cakak Pepadun)",
                            "Asah gigi (Ngerus Begu)",
                            "Pernikahan (Ngejalang)",
                            "Pakaian adat: Tapis, Siger, Bulu Serti",
                          ],
                        },
                        {
                          title: "Pepadun (Adat Pedalaman)",
                          items: [
                            "Ritual kematian (Ngelamak)",
                            "Pengangkatan adipati (Cakak Pepadun)",
                            "Pesta adat (Begawi)",
                            "Pakaian adat: Tapis, Siger, Gelang Kano",
                          ],
                        },
                      ].map((group, idx) => (
                        <div
                          className="col-md-6"
                          key={idx}
                          data-aos="zoom-in"
                          data-aos-delay={idx * 100}
                        >
                          <div className="h-100 bg-white p-3 rounded-3 shadow-sm border-start border-3 border-primary">
                            <h5 className="h6 fw-bold text-primary text-center mb-2">
                              {group.title}
                            </h5>
                            <ul className="list-unstyled small">
                              {group.items.map((item, i) => (
                                <li key={i} className="mb-2 d-flex">
                                  <FiChevronRight
                                    className="text-primary me-2 mt-1"
                                    size={14}
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sticky" style={{ top: "80px" }}>
                {/* Timeline */}
                <div
                  className="card border-0 shadow-sm mb-4 overflow-hidden"
                  data-aos="fade-left"
                >
                  <div className="card-header bg-primary text-white py-3">
                    <h5 className="h5 mb-0 fw-bold d-flex text-white align-items-center">
                      <FiClock className="me-2 text-white" size={18} />
                      Timeline Sejarah
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="timeline px-3 py-2">
                      {[
                        {
                          year: "1975",
                          event: "Pembangunan Dimulai",
                          detail:
                            "Peletakan batu pertama oleh Gubernur Lampung",
                          icon: <FiFlag size={16} />,
                        },
                        {
                          year: "1988",
                          event: "Peresmian Museum",
                          detail:
                            "Diresmikan oleh Menteri Pendidikan dan Kebudayaan",
                          icon: <FiHome size={16} />,
                        },
                        {
                          year: "1990",
                          event: "Penambahan Koleksi",
                          detail: "Pemerintah menambah 2.000 koleksi baru",
                          icon: <FiPlusSquare size={16} />,
                        },
                        {
                          year: "2005",
                          event: "Renovasi Gedung Utama",
                          detail: "Perluasan area pameran dan fasilitas",
                          icon: <FiTool size={16} />,
                        },
                        {
                          year: "2011",
                          event: "Digitalisasi Koleksi",
                          detail:
                            "Memulai proses digitalisasi arsip dan koleksi",
                          icon: <FiDatabase size={16} />,
                        },
                        {
                          year: "2020",
                          event: "Virtual Tour",
                          detail: "Meluncurkan tur virtual selama pandemi",
                          icon: <FiCamera size={16} />,
                        },
                      ].map((item, idx, array) => (
                        <div
                          key={idx}
                          className="timeline-item mb-3 position-relative"
                          data-aos-delay={idx * 50}
                        >
                          <div className="d-flex position-relative">
                            <div className="timeline-badge">
                              <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "36px", height: "36px" }}
                              >
                                {item.icon}
                              </div>
                              {idx < array.length - 1 && (
                                <div className="timeline-line bg-primary bg-opacity-25"></div>
                              )}
                            </div>
                            <div className="ms-3 flex-grow-1">
                              <div className="bg-light p-3 rounded-3 shadow-sm">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <h6 className="fw-bold mb-0 text-primary small">
                                    {item.year}
                                  </h6>
                                  <span className="badge bg-primary bg-opacity-10 text-primary small">
                                    {item.event}
                                  </span>
                                </div>
                                <p className="small text-muted mb-0">
                                  {item.detail}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visit Card */}
                <div
                  className="card bg-primary text-white border-0 shadow-sm mb-4"
                  data-aos="fade-left"
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <FiCompass
                        className="flex-shrink-0 mt-1 me-3"
                        size={24}
                      />
                      <div>
                        <h4 className="h5 fw-bold mb-2 text-white">
                          Kunjungi Museum Lampung
                        </h4>
                        <p className="small mb-3 opacity-75 text-white">
                          Jelajahi kekayaan budaya dan sejarah Lampung dengan
                          pengalaman edukatif yang tak terlupakan.
                        </p>
                        <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold d-flex align-items-center">
                          Pesan Tiket{" "}
                          <FiChevronRight className="ms-1" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div
                  className="card border-0 shadow-sm"
                  data-aos="fade-left"
                  data-aos-delay="100"
                >
                  <div className="card-header bg-primary text-white py-3">
                    <h5 className="h5 mb-0 fw-bold d-flex text-white align-items-center">
                      <FiMapPin className="me-2 text-white" size={18} />
                      Peta Lokasi
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.292852728222!2d105.23834287498384!3d-5.372234694606639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40dab5d8b8ddfb%3A0xb2235987d49dad2f!2sMuseum%20Lampung!5e0!3m2!1sid!2sid!4v1742337921781!5m2!1sid!2sid"
                        className="border-0"
                        allowFullScreen
                        loading="lazy"
                        title="Peta Lokasi Museum Lampung"
                      ></iframe>
                    </div>
                    <div className="p-3 text-center border-top">
                      <button className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center">
                        <FiNavigation className="me-2" size={14} />
                        Petunjuk Arah
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Global Styles */}
      <style jsx global>{`
        .timeline {
          position: relative;
        }
        .timeline-badge {
          position: relative;
          flex-shrink: 0;
        }
        .overlay {
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
          z-index: 1;
        }
        .timeline-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -20px;
          width: 2px;
          height: calc(100% + 10px);
        }
        .text-white {
          color: #ffffff !important;
        }

        .timeline-item:last-child .timeline-line {
          display: none;
        }
        .card-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-section {
          position: relative;
          overflow: hidden;
        }

        .card {
          transition: transform 0.2s ease;
        }

        .card:hover {
          transform: translateY(-3px);
        }

        .btn-primary {
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .timeline-item {
          transition: transform 0.2s ease;
        }

        .timeline-item:hover {
          transform: translateX(3px);
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 50vh;
          }
          .sticky-sidebar {
            top: 20px; /* atau setara tinggi navbar */
          }
        }
      `}</style>
    </div>
  );
}
