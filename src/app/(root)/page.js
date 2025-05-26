"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@components/Footer";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { motion } from "framer-motion";
import { FiZoomIn } from "react-icons/fi";


export default function RootLayout() {
  const [venues, setVenues] = useState([]);
  const [review, setReview] = useState([]);
  const containerRef = useRef(null);
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300, // scroll ke kiri 300px
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300, // scroll ke kanan 300px
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch venue data tanpa token
        const venueRes = await fetch("http://localhost:5001/api/venue", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (venueRes.ok) {
          const venueData = await venueRes.json();
          setVenues(venueData);
        }

        // Fetch review data tanpa token
        const reviewRes = await fetch("http://localhost:5001/api/reviews", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          const enrichedReviews = reviewData.data?.reviews?.map((review) => ({
            ...review,
            name: review.user?.fullName || "Anonymous",

          })) || [];
          setReview(enrichedReviews);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };

    fetchData();
  }, []);
 return (
    <>
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="hero-section" style={{ 
          height: '100vh', 
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="video-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(113,77,41,0.3) 0%, rgba(0,0,0,0.6) 100%)',
            zIndex: 2
          }}></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
            style={{
              position: 'relative',
              zIndex: 3,
              color: 'white',
              padding: '0 5%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <h1 className="display-3 fw-bold mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
              Museum Lampung<br />
              <span className="text-brown">Ruwai Jurai</span>
            </h1>
            <p className="lead mb-5 text-white" style={{ 
              fontSize: '1.5rem',
              maxWidth: '600px',
              textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
            }}>
              Menjaga Warisan Sejarah dan Budaya Lampung untuk Generasi Mendatang
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/aboutnext"
              className="btn btn-lg btn-warning d-inline-flex align-items-center"
              style={{
                borderRadius: '30px',
                padding: '1rem 2rem',
                fontWeight: 600,
                width: 'fit-content'
              }}
            >
              Jelajahi Museum
              <FiArrowRight className="ms-2" size={20} />
            </motion.a>
          </motion.div>

          {/* Video Background */}
          <iframe
  src="https://www.youtube.com/embed/gR8kj6ti-s4?start=180&autoplay=1&mute=1&loop=1&playlist=gR8kj6ti-s4&controls=0&modestbranding=1&rel=0"
  title="YouTube video player"
  allow="autoplay; encrypted-media"
  allowFullScreen
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: '-1',
    filter: 'grayscale(50%)'
  }}
/>
        </section>

        {/* About Section */}
        <section className="section-padding bg-light" id="about">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="image-wrapper position-relative">
                    <img
                      src="/assets/images/museum.jpg"
                      className="img-fluid rounded-3 shadow-lg"
                      alt="Museum Lampung"
                      style={{
                        transform: 'rotate(3deg)',
                        border: '3px solid white'
                      }}
                    />
                    <div className="decorative-box" style={{
                      position: 'absolute',
                      bottom: '-20px',
                      right: '-20px',
                      width: '60%',
                      height: '60%',
                      background: '#714D29',
                      zIndex: -1,
                      borderRadius: '15px'
                    }}></div>
                  </div>
                </motion.div>
              </div>

              <div className="col-lg-6">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="display-5 fw-bold mb-4 text-borwn">
                    Selamat Datang di <span className="text-dark">Museum Ruwai Jurai</span>
                  </h2>
                  <p className="lead mb-4" style={{ lineHeight: 1.7 }}>
                    Sebagai pusat preservasi budaya Lampung, kami menyimpan lebih dari 15.000 artefak bersejarah 
                    yang menceritakan perjalanan panjang masyarakat Lampung dari masa ke masa.
                  </p>
                  <div className="mt-3">
                  <Link href="/aboutnext">
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
                </motion.div>
              </div>
            </div>
          </div>
        </section>
         <section className="section-padding bg-light" id="history">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              
              {/* Kolom Teks */}
              <div className="col-lg-6 col-12 mb-4 mb-lg-0">
                <h3 className="text-black">Sejarah Museum Ruwai Jurai</h3>
                <p className="text-black">
                  Lampung memiliki museum yang mengabadikan perjalanan sejarah di provinsi paling selatan dari Pulau Sumatera ini. Nama museum itu adalah Museum Negeri Propinsi Lampung “Ruwa Jurai”. Museum yang terletak di Jln. Zainal Arifin Pagar Alam No. 64, Rajabasa, Bandar Lampung, ini letaknya begitu strategis. Hanya berjarak beberapa ratus meter dari Terminal Bus Rajabasa dan dekat dengan gerbang Kampus UNILA.
                </p>
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

              {/* Kolom Gambar Vertikal */}
              <div className="col-lg-3 col-6 d-flex flex-column align-items-center gap-3">
                <img
                  src="/assets/images/history.jpg"
                  className="img-fluid rounded shadow-sm"
                  alt="Museum Lampung 1"
                  style={{ maxHeight: "250px", objectFit: "cover", width: "100%" }}
                />
                <img
                  src="/assets/images/our1.jpg"
                  className="img-fluid rounded shadow-sm"
                  alt="Museum Lampung 2"
                  style={{ maxHeight: "250px", objectFit: "cover", width: "100%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Venues Section */}
        <section className="section-padding" id="venues" style={{ backgroundColor: "rgba(205, 183, 140, 0.16)" }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="section-header mb-5 text-center">
                <h2 className="display-5 fw-bold mb-3">Koleksi Unggulan</h2>
                <p className="lead text-muted">Temukan koleksi terbaik kami yang telah dipamerkan</p>
              </div>

              <div className="position-relative">
               {/* Custom Scrollbar */}
<div
  className="scroll-container d-flex gap-3 overflow-auto py-2"
  ref={containerRef}
  style={{
    scrollBehavior: "smooth",
    scrollbarWidth: "thin",
    scrollbarColor: "#ccc transparent",
  }}
>
  {venues.map((venue) => (
    <motion.div
      key={venue.id}
      className="venue-card"
      whileHover={{ scale: 1.02 }}
      style={{
        minWidth: "220px",
        flex: "0 0 auto",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        padding: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div className="artists-image-wrap mb-2 text-center">
        {venue.photo ? (
          <img
            src={`http://localhost:5001/uploads/${venue.photo}?t=${Date.now()}`}
            alt={venue.name}
            className="img-fluid"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            crossOrigin="anonymous"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/images/No-image.png";
            }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center bg-light rounded"
            style={{
              height: "180px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <FiImage className="text-muted" size={36} />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>{venue.name}</p>
        <Link href={`/venues?id=${venue.id}`}>
          <button
            className="btn text-white px-2 py-1 fw-semibold"
            style={{
              background: "#714D29",
              borderRadius: "12px",
              fontSize: "0.75rem",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.color = "#000000";
              e.currentTarget.style.border = "1px solid #714D29";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#714D29";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.border = "none";
            }}
          >
            Baca Selengkapnya
          </button>
        </Link>
      </div>
    </motion.div>
  ))}
</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Review Section */}
       <section className="section-padding" id="review">
  <div className="container">
    {/* Judul Testimoni */}
    <div className="row">
      <div className="col-12 text-center mb-4">
        <h2
          className="text-black fw-bold position-relative d-inline-block pb-2"
          style={{
            letterSpacing: "1px",
            fontSize: "2rem",
          }}
        >
          Ulasan Pengunjung
        </h2>
      </div>
    </div>

    <div className="position-relative">
      {/* Tombol panah kiri */}
      <button
        onClick={scrollLeft}
        className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
        style={{
          borderRadius: "50%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 10,
          width: "48px",
          height: "48px",
          backgroundColor: "rgba(255,255,255,0.8)",
          transition: "background-color 0.3s ease, transform 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#714D29";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.8)";
          e.currentTarget.style.color = "#000";
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-label="Scroll Left"
      >
        <FiChevronLeft size={28} />
      </button>

      {/* Container scroll horizontal */}
      <div
        ref={containerRef}
        className="d-flex overflow-auto"
        style={{
          gap: "1.5rem",
          scrollSnapType: "x mandatory",
          padding: "1rem 60px", 
          scrollBehavior: "smooth",
        }}
      >
        {review.length > 0 ? (
          review.map((item, index) => (
            <div
              key={index}
              className="shadow bg-white rounded-4 p-4"
              style={{
                minWidth: "320px",
                maxWidth: "320px",
                flex: "0 0 auto",
                whiteSpace: "normal",
                wordBreak: "break-word",
                scrollSnapAlign: "start",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <h5
                className="fw-bold mb-3"
                style={{ fontSize: "1.1rem", color: "#333" }}
              >
                {item.user?.fullName || "Pengunjung"}
              </h5>
              <p
                className="mb-3"
                style={{
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: "1.4",
                  minHeight: "80px",
                }}
              >
                {item.comment}
              </p>
              <div
                className="text-warning"
                style={{ fontSize: "1.25rem", letterSpacing: "0.1rem" }}
                aria-label={`Rating: ${item.score} dari 5`}
              >
                {Array.from({ length: item.score }, (_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100">
            <p className="text-muted" style={{ fontStyle: "italic" }}>
              Belum ada review yang tersedia.
            </p>
          </div>
        )}
      </div>

      {/* Tombol panah kanan */}
      <button
        onClick={scrollRight}
        className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
        style={{
          borderRadius: "50%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 10,
          width: "48px",
          height: "48px",
          backgroundColor: "rgba(255,255,255,0.8)",
          transition: "background-color 0.3s ease, transform 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#714D29";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.8)";
          e.currentTarget.style.color = "#000";
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-label="Scroll Right"
      >
        <FiChevronRight size={28} />
      </button>
    </div>
  </div>
</section>

        {/* Gallery Section */}
        <section className="section-padding bg-light" id="ourgallery">
          <div className="container-fluid">
            <div className="row g-0">
              {["our1.jpg", "our2.jpeg", "our3.jpg", "our4.jpg"].map((image, index) => (
                <div key={index} className="col-lg-3 col-md-6 gallery-item">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="image-container"
                  >
                    <img
                      src={`/assets/images/${image}`}
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <button className="view-button">
                        <FiZoomIn size={24} />
                      </button>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <style jsx global>{`
        :root {
          --primary-color: #714D29;
          --secondary-color: #f8f9fa;
        }

        .hero-section {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }

        .venue-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .review-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(113,77,41,0.8);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .scroll-container {
          display: flex;
          gap: 2rem;
          padding: 2rem 0;
          overflow-x: auto;
          scroll-behavior: smooth;
        }

        .scroll-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .scroll-arrow:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-50%) scale(1.1);
        }
          .text-brown {
          }
      `}</style>
    </>
  );
}
