"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@components/Footer";
import { getCookie } from 'cookies-next';
 
export default function VenueAdminPage() {
  const [venues, setVenues] = useState([]);
  const [review, setReview] = useState ([]);
  const token = getCookie("token");

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch venue data
        const venueRes = await fetch("http://localhost:5001/api/venue", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          },
        });

        if (venueRes.ok) {
          const venueData = await venueRes.json();
          setVenues(venueData);
        }

        // Fetch review data
        const reviewRes = await fetch("http://localhost:5001/api/reviews", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          },
        });

        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          const enrichedReviews = reviewData.data?.reviews?.map((review) => ({
            ...review,
            name: review.user?.fullName || 'Anonymous',
          })) || [];
          setReview(enrichedReviews);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };

    fetchData();
  }, [token]); 
  
  
  return (
    <>
      
<div>
<section
  className="hero-section"
  id="home"
  style={{ paddingTop: "100px", position: "relative", height: "100vh", overflow: "hidden" }}
>
  {/* Video Background */}
  <div className="video-wrap" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
    <iframe
      src="https://www.youtube.com/embed/gR8kj6ti-s4?autoplay=1&mute=1&loop=1&playlist=gR8kj6ti-s4"
      title="YouTube video player"
      allow="autoplay; encrypted-media"
      allowFullScreen
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
    ></iframe>

    {/* Overlay hitam transparan */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 2,
      }}
    />
  </div>

  {/* Teks di atas video */}
  <div
    className="position-absolute top-0 start-0 w-100 h-100"
    style={{ zIndex: 3, display: "flex", alignItems: "center", paddingLeft: "5%" }}
  >
    <div>
      <h2 className="fw-bold text-white mb-2">Museum Lampung</h2>
      <h2 className="fw-bold text-white mb-2">Ruwai Jurai</h2>
      <h2 className="fw-bold text-white mb-2">Mengabadikan Sejarah</h2>
      <h2 className="fw-bold text-white mb-4">Budaya Lampung</h2>
      <a
        href="/aboutnext"
        className="btn btn-light fw-bold py-2 px-4 text-black"
        style={{ borderRadius: "20px" }}
      >
        Jelajahi Sekarang
      </a>
    </div>
  </div>
</section>
        <section className="section-padding" id="about" style={{ backgroundColor: 'rgba(205, 183, 140, 0.16)' }}>
          <div className="container">
            <div className="row justify-content-center">
              {/* Judul "About" */}
              <div className="col-12 text-center mb-4">
                <h2 className="text-black fw-bold position-relative d-inline-block pb-2">
                  Destination Info
                  <span 
                    style={{
                      display: "block",
                      width: "80px",
                      height: "5px",
                      backgroundColor: "#714D29",
                      margin: "8px auto 0",
                      borderRadius: "20px"
                    }}
                  ></span>
                </h2>
                <p className="text-black mt-2">
                  Berikut adalah beberapa informasi penting tentang Museum Lampung yang perlu Anda ketahui sebelum mengunjunginya.
                </p>
              </div>

              {/* Kontainer Gambar dan Teks */}
              <div className="row align-items-center">
                {/* Kolom Gambar */}
                <div className="col-lg-6 col-12 d-flex justify-content-center mb-4 mb-lg-0">
                  <img
                    src="/assets/images/museum.jpg"
                    className="about-image img-fluid rounded shadow"
                    alt="Museum Lampung"
                    style={{ maxWidth: '85%', height: 'auto', borderRadius: "12px" }}
                  />
                </div>

                {/* Kolom Teks */}
                <div className="col-lg-5 col-12">
                  <h3 className="text-black fw-bold">Museum Ruwai Jurai</h3>
                  <p className="text-black">
                    Lampung memiliki museum yang mengabadikan perjalanan sejarah di provinsi paling selatan dari Pulau Sumatera ini. Nama museum itu adalah Museum Negeri Propinsi Lampung “Ruwa Jurai”. Museum yang terletak di Jln. Zainal Arifin Pagar Alam No. 64, Rajabasa, Bandar Lampung, ini letaknya begitu strategis. Hanya berjarak beberapa ratus meter dari Terminal Bus Rajabasa dan dekat dengan gerbang Kampus UNILA.
                  </p>
                  {/* Tombol Pelajari Selengkapnya */}
                  <div className="mt-3">
                    <Link href="/aboutnext">
                      <button 
                        className="btn btn-light text-white px-4 py-2"
                        style={{
                          background: "#714D29",
                          color: "rgb(255, 255, 255)",
                          borderRadius: "20px",
                          transition: "0.3s",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#FFFFFF";
                          e.target.style.color = "#000000"; 
                        }}                        
                        onMouseOut={(e) => e.target.style.background = "#714D29"}
                      >
                        Pelajari Selengkapnya
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding" id="history">
          <div className="container">
            <div className="row justify-content-center">
              {/* Judul "History" */}
              <div className="col-12 text-center mb-4">
                <h2 className="mb-4 d-inline-block position-relative" style={{ fontWeight: "bold" }}>
                  Sejarah
                  <span 
                    style={{
                      display: "block",
                      width: "50px", 
                      height: "5px",  
                      backgroundColor: "#714D29",
                      margin: "8px auto 0",
                      borderRadius: "20px" 
                    }}
                  ></span>
                </h2>
              </div>

              {/* Kontainer untuk teks & gambar */}
              <div className="row align-items-center">
                {/* Kolom untuk Teks */}
                <div className="col-lg-7 col-10 order-lg-1">
                  <h3 className="text-black mt-4">Museum Ruwai Jurai</h3>
                  <p className="text-black">
                    Lampung memiliki museum yang mengabadikan perjalanan sejarah di provinsi paling selatan dari Pulau Sumatera ini. 
                    Nama museum itu adalah Museum Negeri Propinsi Lampung “Ruwa Jurai”. Museum yang terletak di Jln. Zainal Arifin Pagar Alam No. 64, 
                    Rajabasa, Bandar Lampung, ini letaknya begitu strategis. Hanya berjarak beberapa ratus meter dari Terminal Bus Rajabasa 
                    dan dekat dengan gerbang Kampus UNILA.
                  </p>
                  
                  {/* Tombol Pelajari Selengkapnya */}
                  <div className="mt-3">
                    <Link href="/historynext">
                      <button 
                        className="btn text-white px-4 py-2"
                        style={{
                          appearance: "50",
                          background: "#714D29",
                          borderRadius: "20px",
                          transition: "0.3s",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#FFFFFF";
                          e.target.style.color = "#000000"; 
                        }}                        
                        onMouseOut={(e) => e.target.style.background = "#714D29"}
                      >
                        Pelajari Selengkapnya
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Kolom untuk Gambar (di sebelah kanan) */}
                <div className="col-lg-4 col-8 order-lg-2 d-flex justify-content-center">
                  <img
                    src="/assets/images/history.jpg"
                    className="about-image img-fluid rounded"
                    alt="Museum Lampung"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
      className="artists-section section-padding"
      id="venues"
      style={{ backgroundColor: "rgba(205, 183, 140, 0.16)" }}
    >
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-12 text-center">
            <h2 className="mb-4">
              Koleksi
              <span
                style={{
                  display: "block",
                  width: "50px",
                  height: "5px",
                  backgroundColor: "#714D29",
                  margin: "8px auto 0",
                  borderRadius: "20px",
                }}
              ></span>
            </h2>
          </div>
        </div>

        {/* Scrollable Venue List */}
        <div
          className="d-flex overflow-auto pb-3"
          style={{ gap: "1rem", scrollSnapType: "x mandatory" }}
        >
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="artists-thumb"
              style={{
                minWidth: "250px",
                flex: "0 0 auto",
                scrollSnapAlign: "start",
              }}
            >
              <div className="artists-image-wrap">
              {venue.photo ? (
      <img
      style={{width: 300, height: 300, borderRadius: 5}}
        src={`http://localhost:5001/uploads/${venue.photo}?t=${Date.now()}`}
        alt={venue.name}
        className="w-full h-[300px] object-cover rounded-md"
        crossOrigin="anonymous"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "data:image/svg+xml;base64,....";
        }}
      />
    ) : (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
        <FiImage className="text-gray-400 h-8 w-8" />
      </div>
    )}
              </div>
              <div className="artists-hover text-center mt-3">
                <p>
                  <strong>Nama:</strong> {venue.name}
                </p>
                <p>
                  <strong>Tahun:</strong> {venue.year}
                </p>
                <Link href={`/venues?id=${venue.id}`}>
  <button
    className="btn text-white px-4 py-2 fw-bold"
    style={{
      background: "#714D29",
      borderRadius: "20px",
      transition: "0.3s",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.background = "#FFFFFF";
      e.currentTarget.style.color = "#000000";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.background = "#714D29";
      e.currentTarget.style.color = "#FFFFFF";
    }}
  >
    Baca Selengkapnya
  </button>
</Link>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


        <section className="section-padding" id="ourgallery" style={{ backgroundColor: "#f8f9fa" }}>
  <div className="container">
    {/* Judul Our Gallery */}
    <div className="row">
      <div className="col-12 text-center mb-4">
        <h2 className="text-black fw-bold position-relative d-inline-block pb-2">
          Our Gallery
          <span
            style={{
              display: "block",
              width: "100px",
              height: "5px",
              backgroundColor: "#714D29",
              margin: "8px auto 0",
              borderRadius: "20px"
            }}
          ></span>
        </h2>
      </div>
    </div>

    {/* Grid Gallery */}
    <div className="row g-3">
      {["our1.jpg", "our2.jpeg", "our3.jpg", "our4.jpg"].map((image, index) => (
        <div key={index} className="col-lg-3 col-md-4 col-6">
          <div className="gallery-item position-relative overflow-hidden">
            <img
              src={`/assets/images/${image}`}
              className="img-fluid rounded shadow"
              alt={`Gallery ${index + 1}`}
              style={{ width: "100%", height: "250px", objectFit: "cover", transition: "0.3s" }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="section-padding" id="testimoni" style={{ backgroundColor: 'rgba(205, 183, 140, 0.16)' }}>
  <div className="container">
    {/* Judul Testimoni */}
    <div className="row">
      <div className="col-12 text-center mb-4">
        <h2 className="text-black fw-bold position-relative d-inline-block pb-2">
          Ulasan Pengunjung
          <span
            style={{
              display: "block",
              width: "100px",
              height: "5px",
              backgroundColor: "#714D29",
              margin: "8px auto 0",
              borderRadius: "20px"
            }}
          ></span>
        </h2>
      </div>
    </div>

    {/* Scroll Horizontal */}
    <div className="row">
      <div className="col-12">
        <div
          className="d-flex"
          style={{
            gap: '20px',
            paddingBottom: '10px',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch',
            whiteSpace: 'nowrap',
          }}
        >
          {review.length > 0 ? (
            review.map((item, index) => (
              <div
                key={index}
                className="shadow bg-white rounded p-4"
                style={{
                  minWidth: '300px',
                  maxWidth: '300px',
                  flex: '0 0 auto',
                }}
              >
                <h5 className="fw-bold mb-2">{item.user?.fullName || 'Pengunjung'}</h5>
                <p className="mb-2">{item.comment}</p>
                <div className="text-warning">
                  {Array.from({ length: item.score }, (_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>Belum ada review yang tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</section>



        <Footer />
      </div>

    </>
  );
}