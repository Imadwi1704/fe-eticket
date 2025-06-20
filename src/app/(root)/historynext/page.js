"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiPhone,
  FiCalendar,
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
    <div className="bg-white">
      {/* Hero Section - Simplified */}
      <section
        ref={heroRef}
        className="hero-section position-relative d-flex align-items-center justify-content-center"
        style={{
          height: "50vh",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          background:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('/assets/images/museum.jpg') center/cover fixed",
        }}
      >
        <div
          className="container text-center text-white px-3"
          style={{ zIndex: 2 }}
        >
          <h1 className="display-4 fw-bold mb-3">
            Sejarah Museum Lampung
          </h1>
        </div>
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
                  <p className="lead text-muted mb-4 text-justify" >
                    Museum Lampung atau Museum Negeri Provinsi Lampung Ruwa
                    Jurai mulai dibangun tahun 1975, diresmikan pada 24
                    September 1988. Merupakan museum pertama dan terbesar di
                    Provinsi Lampung yang menyimpan warisan budaya dan sejarah
                    berharga.
                  </p>

                  {/* Philosophy Highlight */}
                  <div
                    className="bg-primary bg-opacity-10 p-4 rounded-3 my-4"
                    
                  >
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
                  <div >
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
                  <div className="mt-5" >
                    <h4 className="h5 fw-bold mb-3 ">Budaya & Tradisi</h4>
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

                  {/* CTA */}
                  <div
                    className="mt-5 p-3 rounded-3 bg-primary text-white"
                    
                  >
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h4 className="h5 fw-bold mb-2 text-white">
                          Kunjungi Museum Lampung
                        </h4>
                        <p className="small mb-0 text-white">
                          Jelajahi kekayaan budaya dan sejarah Lampung dengan
                          pengalaman edukatif yang tak terlupakan.
                        </p>
                      </div>
                      <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold">
                          Pesan Tiket{" "}
                          <FiChevronRight className="ms-1" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sticky" style={{ top: "5px" }}>
                {/* Timeline */}
                <div
                  className="card border-2 shadow-sm mb-4"
                  data-aos="fade-left"
                >
                  <div className="card-header bg-primary text-white py-2">
                    <h5 className="h6 mb-0 fw-bold text-white">
                      Timeline Sejarah
                    </h5>
                  </div>
                  <div className="card-body p-3">
                    <div className="timeline">
                      {[
                        {
                          year: "1975",
                          event: "Pembangunan Dimulai",
                          detail:
                            "Peletakan batu pertama oleh Gubernur Lampung",
                        },
                        {
                          year: "1988",
                          event: "Peresmian Museum",
                          detail:
                            "Diresmikan oleh Menteri Pendidikan dan Kebudayaan",
                        },
                        {
                          year: "1990",
                          event: "Penambahan Koleksi",
                          detail: "Pemerintah menambah 2.000 koleksi baru",
                        },
                        {
                          year: "2005",
                          event: "Renovasi Gedung Utama",
                          detail: "Perluasan area pameran dan fasilitas",
                        },
                        {
                          year: "2011",
                          event: "Digitalisasi Koleksi",
                          detail:
                            "Memulai proses digitalisasi arsip dan koleksi",
                        },
                        {
                          year: "2020",
                          event: "Virtual Tour",
                          detail: "Meluncurkan tur virtual selama pandemi",
                        },
                      ].map((item, idx, array) => (
                        <div
                          key={idx}
                          className="timeline-item mb-3"
                          
                          data-aos-delay={idx * 50}
                        >
                          <div className="d-flex">
                            <div className="me-3 text-center">
                              <div className="bg-primary text-white rounded-3 py-1 px-2 small fw-bold">
                                {item.year}
                              </div>
                              {idx < array.length - 1 && (
                                <div
                                  className="bg-primary bg-opacity-25 mx-auto"
                                  style={{
                                    width: "2px",
                                    height: "100%",
                                    minHeight: "20px",
                                  }}
                                ></div>
                              )}
                            </div>
                            <div className="bg-white p-2 rounded-2 shadow-sm flex-grow-1">
                              <h6 className="small fw-bold mb-1">
                                {item.event}
                              </h6>
                              <p className="small text-muted mb-0">
                                {item.detail}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div
                  className="card border-2 "
                  data-aos="fade-left"
                  data-aos-delay="100"
                >
                  <div className="card-header bg-primary text-white py-2">
                    <h5 className="h6 mb-0 fw-bold text-white">Peta Lokasi</h5>
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
                    <div className="p-2 text-center">
                      <button className="btn btn-outline-primary btn-sm w-100">
                        <FiMapPin className="me-1" size={14} /> Petunjuk Arah
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
