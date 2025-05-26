"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Aboutnext() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>

      {/* Hero Section with Parallax */}
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center"
        id="aboutnext"
        style={{
          height: "60vh",
          backgroundImage: "url('/assets/images/museum.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
            zIndex: 1,
          }}
        ></div>

        <div className="position-relative text-white text-center z-2" style={{ zIndex: 2 }}>
          <h1 className="fw-bold display-5">Destination Info</h1>
          <div
            style={{
              width: "80px",
              height: "5px",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              margin: "10px auto",
            }}
          ></div>
        </div>
      </section>

      {/* Tentang Museum */}
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-12 text-center mb-4 mb-lg-0" data-aos="fade-right">
              <img
                src="/assets/images/museum.jpg"
                className="img-fluid rounded shadow"
                alt="Museum Lampung"
              />
            </div>
            <div className="col-lg-6 col-12" data-aos="fade-left">
              <h3 className="text-black fw-bold text-uppercase mb-4">
                Selamat Datang di Museum Ruwai Jurai
              </h3>
              <p className="text-muted">
                Museum Negeri Propinsi Lampung “Ruwa Jurai” terletak di Jln. Zainal Arifin Pagar Alam No. 64,
                Rajabasa, Bandar Lampung. Letaknya strategis, dekat Terminal Rajabasa dan gerbang Kampus UNILA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah */}
      <section className="section-padding" style={{ backgroundColor: "#F8F4E1" }}>
        <div className="container">
          <div className="row justify-content-center align-items-start">
            <div className="col-lg-6 col-12 mb-4" data-aos="fade-up">
              <h3 className="text-black">Sejarah Museum Ruwai Jurai</h3>
              <p className="text-muted">
                Museum ini mulai dibangun pada tahun 1975, dan diresmikan pada tahun 1988. Museum ini merupakan
                museum pertama dan terbesar di Provinsi Lampung.
              </p>
              <img
                src="/assets/images/history.jpg"
                className="img-fluid rounded"
                alt="Sejarah Museum"
                style={{ maxWidth: "60%" }}
              />
               <div className="mt-3">
                  <Link href="/historynext">
                    <button
                      className="btn text-white px-4 py-2 fw-bold"
                      style={{
                        background: "#714D29",
                        borderRadius: "20px",
                        transition: "0.3s",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#FFFFFF";
                        e.target.style.color = "#000000";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "#714D29";
                        e.target.style.color = "#FFFFFF";
                      }}
                    >
                      Pelajari Selengkapnya
                    </button>
                  </Link>
                </div>
            </div>

            <div className="col-lg-6 col-12" data-aos="fade-left">
              <div className="px-3 px-lg-3 border-start border-3" style={{ borderColor: "#714D29" }}>
                <h5 className="fw-bold mb-3 mt-5">Tahap Pembuatan:</h5>
                <ul className="list-unstyled text-muted">
                  {["Dimulai pada tahun 1975 sebagai proyek budaya provinsi.",
                    "Diresmikan tahun 1988 oleh Pemerintah Daerah Lampung.",
                    "Didesain untuk melestarikan sejarah & budaya Lampung.",
                  ].map((item, idx) => (
                    <li key={idx} className="mb-3 d-flex">
                      <span className="me-2 text-brown">➤</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Tambahan */}
      <section className="section-padding">
        <div className="container">
          <div className="row mb-4 align-items-center">
            <div className="col-lg-6 col-12">
              <h4 className="fw-bold text-black mb-3">
                Informasi Tentang Jam Operasional, Tata Tertib, dan Harga Tiket
              </h4>
            </div>
            <div className="col-lg-6 col-12">
              <p className="text-muted">
                Berikut adalah informasi lengkap untuk perencanaan kunjungan yang perlu anda ketahui sebelum ke
                Museum Negeri Lampung.
              </p>
            </div>
          </div>

          <ul className="nav nav-tabs mb-3 border-bottom border-2 border-black" id="infoTab" role="tablist">
            {["Jam Operasional", "Tata Tertib", "Harga Tiket"].map((label, i) => (
              <li key={i} className="nav-item" role="presentation">
                <button
                  className={`nav-link ${i === 0 ? "active" : ""}`}
                  id={`${label}-tab`}
                  data-bs-toggle="tab"
                  data-bs-target={`#${label.toLowerCase().replace(/\s/g, "")}`}
                  type="button"
                  role="tab"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="tab-content" id="infoTabContent">
            <div className="tab-pane fade show active p-3" id="jamoperasional" role="tabpanel">
              <h5 className="fw-bold">Jam Operasional:</h5>
              <p className="text-muted">
                Selasa - Kamis: 08.00 - 14.00 WIB<br />
                Jumat: 08.00 - 10.30 WIB<br />
                Sabtu - Minggu: 08.00 - 14.00 WIB<br />
                Senin & Hari Libur Nasional: TUTUP
              </p>
            </div>
            <div className="tab-pane fade p-3" id="tatatertib" role="tabpanel">
              <h5 className="fw-bold">Tata Tertib:</h5>
              <ul className="list-unstyled text-muted">
                {["Dilarang merokok", "Harap menjaga kebersihan", "Dilarang menyentuh koleksi"].map((rule, idx) => (
                  <li key={idx} className="mb-2">
                    <span className="text-brown fw-bold me-2">➤</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            <div className="tab-pane fade p-3" id="hargatiket" role="tabpanel">
              <h5 className="fw-bold">Harga Tiket:</h5>
              <ul className="list-unstyled text-muted">
                {["Dewasa: Rp 5.000/orang", "Mahasiswa: Rp 2.000/orang", "Anak-Anak: Rp 1.000/orang"].map((harga, idx) => (
                  <li key={idx} className="mb-2">
                    <span className="text-brown fw-bold me-2">➤</span>
                    {harga}
                  </li>
                ))}
              </ul>
              <Link href="/register/ticket">
                <button className="btn btn-custom fw-bold mt-3">Pesan Tiket</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .section-padding {
          padding: 60px 0;
        }
        .btn-custom {
          background-color: #;
          color: white;
          border-radius: 20px;
          padding: 10px 20px;
          transition: all 0.3s ease-in-out;
        }
        .btn-custom:hover {
          background-color: #000000 ;
          color: #000;
        }
        .nav-tabs .nav-link {
          font-weight: 500;
          color: #000000 ;
          border: none;
          background: none;
          position: relative;
        }
        .nav-tabs .nav-link.active::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 4px;
          background-color: #000000 ;
          border-radius: 2px;
        }
        .border-brown {
          border-color: #000000  !important;
        }
      `}</style>
    </>
  );
}
