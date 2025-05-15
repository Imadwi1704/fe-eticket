"use client";

import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Aboutnext() {
  return (
    <>

      {/* Hero Section */}
<section
  className="hero-section position-relative"
  id="aboutnext"
  style={{ paddingTop: "50px" }}
>
  {/* Gambar Background */}
  <img
    src="/assets/images/museum.jpg"
    alt="Museum"
    className="w-100 img-fluid"
    style={{ height: "auto", objectFit: "cover" }}
  />

  {/* Overlay Gelap */}
  <div
    className="position-absolute top-0 start-0 w-100 h-100"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Gelap 50%
      zIndex: 1,
    }}
  ></div>

  {/* Teks di Atas Overlay */}
  <div
    className="position-absolute top-50 start-50 translate-middle text-center"
    style={{ zIndex: 2 }} // Pastikan di atas overlay
  >
    <h2 className="text-white fw-bold d-inline-block pb-2">
      Destination Info
      <span
        className="d-block mx-auto mt-2"
        style={{
          width: "80px",
          height: "5px",
          backgroundColor: "#FFFFFF", // Bisa ubah sesuai tema
          borderRadius: "20px",
        }}
      ></span>
    </h2>
  </div>
</section>


      {/* Tentang Museum */}
      <section
        className="section-padding"
       
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-12 text-center mb-4 mb-lg-0">
              <img
                src="/assets/images/museum.jpg"
                className="img-fluid rounded shadow"
                alt="Museum Lampung"
              />
            </div>
            <div className="col-lg-6 col-12">
              <h3 className="text-black fw-bold">
                Selamat Datang di Museum Ruwai Jurai
              </h3>
              <p className="text-black">
                Lampung memiliki museum yang mengabadikan perjalanan sejarah di
                provinsi paling selatan dari Pulau Sumatera ini. Nama museum itu
                adalah Museum Negeri Propinsi Lampung “Ruwa Jurai”. Museum ini
                terletak di Jln. Zainal Arifin Pagar Alam No. 64, Rajabasa,
                Bandar Lampung. Letaknya strategis, dekat Terminal Rajabasa dan
                gerbang Kampus UNILA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah */}
      <section className="section-padding"  style={{ backgroundColor: "rgba(248, 244, 225, 1)" }}>
        <div className="container">
          <div className="row justify-content-center align-items-start">
            <div className="col-lg-6 col-12 mb-4">
              <h3 className="text-black mt-1">
                Sejarah Museum Ruwai Jurai
              </h3>
              <p className="text-black">
                Museum Lampung atau Museum Negeri Provinsi Lampung "Ruwa Jurai"
                mulai dibangun pada tahun 1975, dan diresmikan pada tahun 1988.
                Museum ini merupakan museum pertama dan terbesar di Provinsi
                Lampung.
              </p>
              <img
                src="/assets/images/history.jpg"
                className="img-fluid rounded"
                alt="Museum Lampung"
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
                      e.target.style.background = "#FFFFFF"; // putih
                      e.target.style.color = "#000000";      // hitam
                    }}
                    
                    onMouseOut={(e) => {
                      e.target.style.background = "#714D29"; // coklat tua (default)
                      e.target.style.color = "#FFFFFF";      // balik ke putih (atau sesuaikan warna awal)
                    }}
                    
                  >
                    Pelajari Selengkapnya 
                  </button>
                </Link>
              </div>
            </div>

            <div className="col-lg-6 col-12">
              <div
                className="px-3 px-lg-3 border-start border-3"
                style={{ borderColor: "rgba(116, 80, 45, 1)" }}
              >
                <h5 className="fw-bold mb-3 mt-5">Tahap Pembuatan:</h5>
                <ul className="list-unstyled">
                  {[
                    "Dimulai pada tahun 1975 sebagai proyek budaya provinsi.",
                    "Diresmikan tahun 1988 oleh Pemerintah Daerah Lampung.",
                    "Didesain untuk melestarikan sejarah & budaya Lampung.",
                  ].map((item, idx) => (
                    <li key={idx} className="mb-3 d-flex text-black">
                      <span
                        style={{
                          color: "#714D29",
                          marginRight: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        ➤
                      </span>
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
      <section
        className="section-padding"
      >
        <div className="container">
          <div className="row mb-4 align-items-center">
            <div className="col-lg-6 col-12">
              <h4 className="fw-bold text-black mb-3">
                Informasi Tentang Jam Operasional, Tata Tertib, dan Harga Tiket
              </h4>
            </div>
            <div className="col-lg-6 col-12">
              <p
                className="text-black"
                style={{ fontSize: "1rem", lineHeight: "1.6" }}
              >
                Berikut adalah informasi lengkap untuk perencanaan kunjungan
                yang perlu anda ketahui sebelum ke Museum Negeri Lampung.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-3" id="infoTab" role="tablist">
            {["Jam Operasional", "Tata Tertib", "Harga Tiket"].map(
              (label, i) => (
                <li key={i} className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${i === 0 ? "active" : ""}`}
                    id={`${label}-tab`}
                    data-bs-toggle="tab"
                    data-bs-target={`#${label.toLowerCase().replace(/\s/g, "")}`}
                    type="button"
                    role="tab"
                    aria-selected={i === 0}
                  >
                    {label}
                  </button>
                </li>
              )
            )}
          </ul>

          {/* Tab Content */}
          <div className="tab-content" id="infoTabContent">
            <div
              className="tab-pane fade show active p-4"
              id="jamoperasional"
              role="tabpanel"
            >
              <h5 className="fw-bold">Jam Operasional:</h5>
              <p className="text-black">
                Selasa - Kamis: 08.00 - 14.00 WIB
                <br />
                Jumat: 08.00 - 10.30 WIB
                <br />
                Sabtu - Minggu: 08.00 - 14.00 WIB
                <br />
                Senin & Hari Libur Nasional: TUTUP
              </p>
            </div>
            <div
              className="tab-pane fade p-4"
              id="tatatertib"
              role="tabpanel"
            >
              <h5 className="fw-bold">Tata Tertib:</h5>
              <ul className="list-unstyled">
                {[
                  "Dilarang merokok",
                  "Harap menjaga kebersihan",
                  "Dilarang menyentuh koleksi",
                ].map((rule, idx) => (
                  <li key={idx} className="mb-2">
                    <span
                      style={{
                        color: "#714D29",
                        fontWeight: "bold",
                        marginRight: "10px",
                      }}
                    >
                      ➤
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="tab-pane fade p-4"
              id="hargatiket"
              role="tabpanel"
            >
              <h5 className="fw-bold">Harga Tiket:</h5>
              <ul className="list-unstyled">
                {[
                  "Dewasa: Rp 5.000/orang",
                  "Mahasiswa: Rp 2.000/orang",
                  "Anak-Anak: Rp 1.000/orang",
                ].map((harga, idx) => (
                  <li key={idx} className="mb-2">
                    <span
                      style={{
                        color: "#714D29",
                        fontWeight: "bold",
                        marginRight: "10px",
                      }}
                    >
                      ➤
                    </span>
                    {harga}
                  </li>
                ))}
              </ul>
              <Link
                href="/loginuser/ticket"
                className="btn text-white fw-bold mt-3"
                style={{
                  backgroundColor: "#714D29",
                  borderRadius: "20px",
                  padding: "10px 20px",
                  textDecoration: "none",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#F8F4E1"; // putih
                  e.target.style.color = "#000000";      // hitam
                }}
                
                onMouseOut={(e) => {
                  e.target.style.background = "#714D29"; // coklat tua (default)
                  e.target.style.color = "#FFFFFF";      // balik ke putih (atau sesuaikan warna awal)
                }}
              >
                Pesan Tiket
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
