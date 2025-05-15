"use client";

import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Historynext() {
  return (
    <>

      <Navbar />

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
      Sejarah Museum Lampung
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


      {/* Sejarah */}
      <section className="section-padding">
        <div className="container">
          <div className="row justify-content-center align-items-start">
            <div className="col-lg-8 col-12 mb-4">
            <img
                src="/assets/images/history.jpg"
                className="img-fluid rounded"
                alt="Museum Lampung"
                style={{ maxWidth: "100%" }}
              />
              <h3 className="text-black text-center mt-4">
                Sejarah Museum Ruwai Jurai
              </h3>
              <p className="text-black text-center">
                Museum Lampung atau Museum Negeri Provinsi Lampung "Ruwa Jurai"
                mulai dibangun pada tahun 1975, dan diresmikan pada tahun 1988.
                Museum ini merupakan museum pertama dan terbesar di Provinsi
                Lampung.
              </p>
              <h3 className="text-black text-center mt-4">
                Koleksi Museum Ruwai Jurai
              </h3>
              <p className="text-black">
              Menurut data tahun 2011, Museum Lampung “Ruwa Jurai” menyimpan sekitar 4.735 buah benda koleksi. Benda-benda koleksi ini terbagi menjadi 10 jenis, yaitu koleksi geologika, biologika, etnografika, historika, numismatika/heraldika, filologika, keramologika, seni rupa, dan teknografika.

Koleksi yang paling banyak adalah etnografika yang mencapai 2.079. Koleksi etnografika ini mencakup berbagai benda buatan manusia yang proses pembuatan dan pemakaiannya menjadi ciri khas dari kebudayaan masyarakat Lampung.                
              </p>
              <p className="text-black">
              Di antara koleksi-koleksi yang ditampilkan, antara lain pernak-pernik aksesori dari dua kelompok adat yang dominan di Lampung, yaitu Saibatin (Peminggir) dan Pepadun. Kedua kelompok adat ini masing-masing memiliki kekhasan dalam hal ritual adat dan aksesori yang dikenakan.

Ritual-ritual adat dari Peminggir dan Pepadun masing-masing ditampilkan secara beralur dari ritual kelahiran, ritual asah gigi menjelang dewasa, ritual adat pernikahan, hingga ritual kematiannya. Di samping itu, berbagai benda peninggalan zaman prasejarah, zaman Hindu-Budha, zaman kedatangan Islam, masa penjajahan, dan pasca-kemerdekaan juga ditampilkan pada bagian tersendiri.
              </p>
              
            </div>

            <div className="col-lg-6 col-12">
                <h5 className="fw-bold mb-3">Tahap Pembuatan:</h5>
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
      </section>
      <Footer />
    </>
  );
}
