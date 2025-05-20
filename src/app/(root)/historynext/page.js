"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Historynext() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
      offset: 100,
    });
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero-section position-relative"
        id="aboutnext"
        style={{ paddingTop: "100px", height: "60vh" }}
      >
        <Image
          src="/assets/images/museum.jpg"
          alt="Museum Lampung"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="z-0"
        />

        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        ></div>

        <div
          className="position-absolute top-50 start-50 translate-middle text-center z-2"
          data-aos="zoom-in"
        >
          <h2 className="text-white fw-bold display-4 mb-4">
            Sejarah Museum Lampung
            <span className="d-block mx-auto mt-3" style={{
              width: "120px",
              height: "4px",
              backgroundColor: "#FFD700",
              borderRadius: "20px",
            }}></span>
          </h2>
        </div>
      </section>

      {/* Sejarah */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="row g-5 justify-content-center">
            <div className="col-lg-8" data-aos="fade-right">
              <div className="card shadow-lg border-0 overflow-hidden">
                <Image
                  src="/assets/images/history.jpg"
                  alt="Museum Lampung"
                  width={800}
                  height={450}
                  className="img-fluid rounded-top"
                  style={{ objectFit: "cover", height: "400px" }}
                />
                <div className="card-body p-4 p-lg-5">
                  <h3 className="text-center mb-4 text-dark fw-bold">
                    Museum Negeri Provinsi Lampung "Ruwa Jurai"
                  </h3>
                  <div className="lead text-muted mb-4">
                    <p data-aos="fade-up">
                      Museum Lampung atau Museum Negeri Provinsi Lampung "Ruwa Jurai" 
                      mulai dibangun pada tahun 1975, dan diresmikan pada tahun 1988. 
                      Museum ini merupakan museum pertama dan terbesar di Provinsi Lampung.
                    </p>
                    
                    <h4 className="mt-5 mb-3 fw-bold text-dark" data-aos="fade-up">
                      Koleksi Unggulan
                    </h4>
                    <p data-aos="fade-up">
                      Menyimpan sekitar 4.735 koleksi yang terbagi dalam 10 kategori:
                    </p>
                    <div className="row g-3 mt-2" data-aos="fade-up">
                      {['Geologika', 'Biologika', 'Etnografika', 'Historika', 
                        'Numismatika', 'Filologika', 'Keramologika', 
                        'Seni Rupa', 'Teknografika'].map((item, idx) => (
                        <div className="col-md-4" key={idx}>
                          <div className="bg-white p-3 rounded shadow-sm">
                            <span className="text-primary me-2">•</span>
                            {item}
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 className="mt-5 mb-3 fw-bold text-dark" data-aos="fade-up">
                      Budaya & Tradisi
                    </h4>
                    <p data-aos="fade-up">
                      Menampilkan pernak-pernik aksesori dari dua kelompok adat dominan:
                    </p>
                    <div className="row g-4 mt-3">
                      <div className="col-md-6" data-aos="zoom-in">
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h5 className="text-center text-gold fw-bold">Saibatin</h5>
                          <p className="text-muted text-center">(Peminggir)</p>
                          <ul className="list-unstyled">
                            {['Ritual kelahiran', 'Asah gigi', 'Pernikahan'].map((item, idx) => (
                              <li key={idx} className="mb-2">
                                <i className="fas fa-chevron-right text-primary me-2"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-6" data-aos="zoom-in" data-aos-delay="200">
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h5 className="text-center text-gold fw-bold">Pepadun</h5>
                          <p className="text-muted text-center">(Adat Pedalaman)</p>
                          <ul className="list-unstyled">
                            {['Ritual kematian', 'Pengangkatan adipati', 'Pesta adat'].map((item, idx) => (
                              <li key={idx} className="mb-2">
                                <i className="fas fa-chevron-right text-primary me-2"></i>
                                {item}
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

            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: "100px" }}>
                <div className="card border-0 shadow-lg" data-aos="fade-left">
                  <div className="card-header bg-brown text-white fw-bold">
                    <i className="fas bg-brown fa-history me-2"></i>
                    Timeline Sejarah
                  </div>
                  <div className="card-body">
                    <ul className="timeline">
                      {[
                        { year: '1975', event: 'Pembangunan Dimulai' },
                        { year: '1988', event: 'Peresmian Museum' },
                        { year: '1990', event: 'Penambahan Koleksi' },
                        { year: '2005', event: 'Renovasi Gedung Utama' },
                        { year: '2011', event: 'Digitalisasi Koleksi' },
                      ].map((item, idx) => (
                        <li 
                          key={idx} 
                          className="timeline-item mb-4"
                          data-aos="fade-up"
                          data-aos-delay={idx * 100}
                        >
                          <div className="timeline-badge bg-gold"></div>
                          <div className="timeline-content p-3 shadow-sm">
                            <h6 className="fw-bold mb-1">{item.year}</h6>
                            <p className="text-muted mb-0">{item.event}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <style jsx global>{`
        .text-gold { color: #00000; }
        .bg-gold { background-color: #00000; }
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
          background: #74502D;
        }
        .timeline-content {
          background: white;
          border-radius: 8px;
          position: relative;
          margin-left: 30px;
        }
        .timeline-content::before {
          content: '';
          position: absolute;
          left: -15px;
          top: 10px;
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 15px solid white;
        }
          .bg-brown{
          background: #74502D
          }
      `}</style>
    </>
  );
}