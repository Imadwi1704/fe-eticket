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

    // Efek paralaks untuk hero section
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
    <div className="bg-light">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="hero-section position-relative d-flex align-items-center justify-content-center"
        id="aboutnext"
        style={{
          height: "65vh",
          backgroundImage: "url('/assets/images/museum.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          transition: "background-position 0.3s ease-out",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(rgb(0 0 0 / 70%), rgb(0 0 0 / 40%))",
            zIndex: 1,
          }}
        ></div>

        <div
          className="position-relative text-white text-center z-2 p-3"
          style={{ zIndex: 2 }}
        >
          <h1 className="fw-bold display-4 mb-3" data-aos="fade-down">
            Sejarah Museum Lampung
          </h1>
          <div
            className="mb-4"
            style={{
              width: "100px",
              height: "5px",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              margin: "0 auto",
            }}
            data-aos="fade-down"
            data-aos-delay="200"
          ></div>
        </div>
        {/* Gelombang Dekoratif */}
        <div
          className="position-absolute bottom-0 start-0 w-100"
          style={{ zIndex: 3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path
              fill="#f8f9fa"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Sejarah */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="row g-5 justify-content-center">
            <div className="col-lg-8" data-aos="fade-right">
              <div className="card border-0 shadow-lg overflow-hidden">
                <div className="position-relative">
                  <Image
                    src="/assets/images/history.jpg"
                    alt="Museum Lampung"
                    width={800}
                    height={450}
                    className="img-fluid"
                    style={{
                      objectFit: "cover",
                      height: "450px",
                      width: "100%",
                    }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-4"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(13, 110, 253, 0.8), transparent)",
                    }}
                  >
                    <h3 className="text-white mb-0">
                      Museum Negeri Provinsi Lampung &ldquo;Ruwa Jurai&ldquo;
                    </h3>
                  </div>
                </div>

                <div className="card-body p-4 p-lg-5">
                  <div className="lead text-muted mb-4">
                    <p data-aos="fade-up">
                      Museum Lampung atau Museum Negeri Provinsi Lampung
                      &ldquo;Ruwa Jurai&ldquo; mulai dibangun pada tahun 1975,
                      dan diresmikan pada tanggal 24 September 1988. Museum ini
                      merupakan museum pertama dan terbesar di Provinsi Lampung,
                      menyimpan warisan budaya dan sejarah yang tak ternilai
                      harganya.
                    </p>

                    <div
                      className="bg-primary bg-opacity-10 p-4 rounded-3 my-5"
                      data-aos="fade-up"
                    >
                      <h4 className="mb-3 fw-bold text-dark">
                        Filosofi Nama &ldquo;Ruwa Jurai&ldquo;
                      </h4>
                      <p className="mb-0">
                        &ldquo;Ruwa Jurai&ldquo; berasal dari bahasa Lampung
                        yang berarti &ldquo;Dua Aliran&ldquo;. Nama ini
                        mencerminkan dua kelompok masyarakat adat utama di
                        Lampung, yaitu Saibatin (Peminggir) dan Pepadun (Adat
                        Pedalaman), yang hidup rukun dalam keberagaman budaya.
                      </p>
                    </div>

                    <h4
                      className="mt-5 mb-3 fw-bold text-dark"
                      data-aos="fade-up"
                    >
                      Koleksi Unggulan
                    </h4>
                    <p data-aos="fade-up">
                      Museum ini menyimpan sekitar 4.735 koleksi yang terbagi
                      dalam 10 kategori:
                    </p>
                    <div className="row g-3 mt-2" data-aos="fade-up">
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
                        <div className="col-md-4" key={idx}>
                          <div className="bg-white p-3 rounded shadow-sm d-flex align-items-center border-start border-4 border-primary">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "28px", height: "28px" }}
                            >
                              <span className="small fw-bold">{idx + 1}</span>
                            </div>
                            <span className="ms-2">{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4
                      className="mt-5 mb-3 fw-bold text-dark"
                      data-aos="fade-up"
                    >
                      Budaya & Tradisi
                    </h4>
                    <p data-aos="fade-up">
                      Museum menampilkan pernak-pernik aksesori dari dua
                      kelompok adat dominan:
                    </p>
                    <div className="row g-4 mt-3">
                      <div className="col-md-6" data-aos="zoom-in">
                        <div className="h-100 bg-white p-4 rounded-4 shadow border-top border-4 border-primary">
                          <h5 className="text-center fw-bold text-primary mb-3">
                            Saibatin
                          </h5>
                          <p className="text-muted text-center">(Peminggir)</p>
                          <ul className="list-unstyled">
                            {[
                              "Ritual kelahiran (Cakak Pepadun)",
                              "Asah gigi (Ngerus Begu)",
                              "Pernikahan (Ngejalang)",
                              "Pakaian adat: Tapis, Siger, Bulu Serti",
                            ].map((item, idx) => (
                              <li key={idx} className="mb-2 d-flex">
                                <FiChevronRight className="text-primary me-2 mt-1" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div
                        className="col-md-6"
                        data-aos="zoom-in"
                        data-aos-delay="200"
                      >
                        <div className="h-100 bg-white p-4 rounded-4 shadow border-top border-4 border-primary">
                          <h5 className="text-center fw-bold text-primary mb-3">
                            Pepadun
                          </h5>
                          <p className="text-muted text-center">
                            (Adat Pedalaman)
                          </p>
                          <ul className="list-unstyled">
                            {[
                              "Ritual kematian (Ngelamak)",
                              "Pengangkatan adipati (Cakak Pepadun)",
                              "Pesta adat (Begawi)",
                              "Pakaian adat: Tapis, Siger, Gelang Kano",
                            ].map((item, idx) => (
                              <li key={idx} className="mb-2 d-flex">
                                <FiChevronRight className="text-primary me-2 mt-1" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div
                      className="mt-5 p-4 rounded-3"
                      style={{
                        background: "linear-gradient(135deg, #0D6EFD, #0dcaf0)",
                      }}
                      data-aos="fade-up"
                    >
                      <div className="row align-items-center">
                        <div className="col-md-8 text-white">
                          <h4 className="fw-bold mb-3 text-white">
                            Kunjungi Museum Lampung
                          </h4>
                          <p className="mb-0 text-white">
                            Jelajahi kekayaan budaya dan sejarah Lampung dengan
                            mengunjungi Museum Negeri &ldquo;Ruwa Jurai&ldquo;.
                            Dapatkan pengalaman edukatif yang tak terlupakan.
                          </p>
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                          <button className="btn btn-light rounded-pill px-4 py-2 fw-bold">
                            Pesan Tiket <FiChevronRight className="ms-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="sticky-top"
                style={{
                  top: "100px",
                  zIndex: 990,
                }}
              >
                <div className="card border-0 shadow-lg" data-aos="fade-left">
                  <div className="card-header bg-primary text-white fw-bold py-3">
                    <div className="d-flex align-items-center">
                      <span>Timeline Sejarah</span>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="timeline-container p-3">
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
                          className="timeline-item"
                          data-aos="fade-up"
                          data-aos-delay={idx * 100}
                        >
                          {/* Timeline dot */}
                          <div className="timeline-dot">
                            <div className="dot-circle bg-primary"></div>
                            {idx < array.length - 1 && (
                              <div className="dot-line bg-primary"></div>
                            )}
                          </div>

                          {/* Timeline content */}
                          <div className="timeline-content shadow-sm rounded-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="fw-bold mb-0 text-primary">
                                {item.year}
                              </h6>
                              <span className="badge bg-primary bg-opacity-10 text-primary">
                                Sejarah
                              </span>
                            </div>
                            <h6 className="fw-bold mb-1">{item.event}</h6>
                            <p className="text-muted small mb-0">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="card border-0 shadow-lg mt-4"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  <div className="card-header bg-primary text-white fw-bold py-3">
                    <div className="d-flex align-items-center">
                      <span>Peta Lokasi</span>
                    </div>
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
                    <div className="p-3">
                      <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center">
                        <FiMapPin className="me-2" /> Dapatkan Petunjuk Arah
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

      <style jsx global>{`
        .navbar {
          z-index: 1000 !important;
        }

        .timeline {
          list-style: none;
          padding: 0;
        }
        .timeline-item {
          position: relative;
          padding-left: 40px;
        }
        .timeline-badge {
          position: absolute;
          left: 0;
          top: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0d6efd;
          z-index: 1;
        }
        .timeline-content {
          background: white;
          border-radius: 8px;
          position: relative;
          margin-left: 30px;
          transition: transform 0.3s ease;
        }
        .timeline-content:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .timeline-content::before {
          content: "";
          position: absolute;
          left: -15px;
          top: 15px;
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 15px solid white;
        }

        .hero-section {
          overflow: hidden;
        }

        .section-padding {
          padding: 5rem 0;
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 50vh;
          }

          .section-padding {
            padding: 3rem 0;
          }
        }
      `}</style>
    </div>
  );
}
