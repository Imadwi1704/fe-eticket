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
            <Link href="/aboutnext">
            <button
  className="btn text-black px-2 py-1"
  style={{
    background: "#FFFFFF",
    borderRadius: "16px", // Lebih kecil dari 20px
    fontSize: "0.75rem",   // Ukuran font lebih kecil
    padding: "4px 10px",   // Padding lebih ramping (vertikal 4px, horizontal 10px)
    transition: "0.3s",
  }}
>
  Jelajahi Selengkapnya
            </button>

          </Link>
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
        <section className="section-padding bg-white" id="about" style={{ padding: "50px 0"}}>
          <div className="container">
            <div className="row justify-content-center align-items-center">
              {/* Kolom Teks */}
              <div className="col-lg-10 mb-5">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h2 className="text-black mb-3">
                    Selamat Datang di Museum Ruwai Jurai
                  </h2>

                  <p className="lead text-black" style={{ lineHeight: 1.7 }}>
                    Sebagai pusat preservasi budaya Lampung, kami menyimpan lebih dari
                    15.000 artefak bersejarah yang menceritakan perjalanan panjang
                    masyarakat Lampung dari masa ke masa.
                  </p>
                </motion.div>
              </div>

              {/* Info Cards */}
              <div className="col-12">
                <motion.div
                  className="d-flex justify-content-center flex-wrap gap-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {/* Card 1 */}
                  <div
                    className="rounded-4 p-4 text-start shadow-sm hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: "#E8F9FD",
                      minWidth: "220px",
                      flex: "1 1 250px",
                    }}
                  >
                    <h4 className="text-3xl fw-bold text-dark">
                      15.000<span className="text-primary">+</span>
                    </h4>
                    <p className="mt-2 text-dark mb-0">
                      Koleksi bersejarah yang tersimpan di museum
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div
                    className="rounded-4 p-4 text-start shadow-sm hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: "#E8F9FD",
                      minWidth: "220px",
                      flex: "1 1 250px",
                    }}
                  >
                    <h4 className="text-3xl fw-bold text-dark">
                      120.000<span className="text-primary">+</span>
                    </h4>
                    <p className="mt-2 text-dark mb-0">
                      Pengunjung setiap tahunnya dari seluruh Indonesia
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div
                    className="rounded-4 p-4 text-start shadow-sm hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: "#E8F9FD",
                      minWidth: "220px",
                      flex: "1 1 250px",
                    }}
                  >
                    <h4 className="text-3xl fw-bold text-dark">
                      10<span className="text-primary">+</span>
                    </h4>
                    <p className="mt-2 text-dark mb-0">
                      Penghargaan nasional atas pelestarian budaya
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

         <section className="section-padding " id="history" style={{ padding: "40px 0"}}>
          <div className="container">
            <div className="row justify-content-center align-items-center">
              
              {/* Kolom Teks */}
              <div className="col-lg-6 col-12 mb-4 mb-lg-0">
                <h2 className="text-black">Sejarah Museum Ruwai Jurai</h2>
                <p className="text-black">
                  Lampung memiliki museum yang mengabadikan perjalanan sejarah di provinsi paling selatan dari Pulau Sumatera ini. Nama museum itu adalah Museum Negeri Propinsi Lampung “Ruwa Jurai”. Museum yang terletak di Jln. Zainal Arifin Pagar Alam No. 64, Rajabasa, Bandar Lampung, ini letaknya begitu strategis. Hanya berjarak beberapa ratus meter dari Terminal Bus Rajabasa dan dekat dengan gerbang Kampus UNILA.
                </p>
                <div className="mt-3">
                  <Link href="/historynext">
            <button
              className="btn text-white px-4 py-2"
              style={{
                background: "#0D6EFD",
                borderRadius: "20px",
                transition: "0.3s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#FFFFFF";
                e.target.style.color = "#000000";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#0D6EFD";
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

     <section className="artists-section section-padding" id="venues" style={{ padding: "40px 0" }}>
  <div className="container">
    <div className="row justify-content-center">
      {/* Header Koleksi */}
      <div className="col-12 mb-4">
        <h2 className="mb-1">Koleksi Museum Lampung</h2>
        <p className="text-black mb-0">
          Cari Tahu Koleksi yang dipamerkan di Museum Lampung "Ruwa Jurai"
        </p>
      </div>

      {/* Scrollable Container */}
      <div className="position-relative" style={{ padding: "10px 0" }}>
        <div
          className="d-flex hide-scrollbar"
          style={{
            overflowX: "auto",
            gap: "1.5rem",
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            padding: "10px 5px",
          }}
        >
          {venues && venues.length > 0 ? (
            venues
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // terbaru dulu
              .slice(0, 5) // ambil maksimal 5
              .map((venue) => (
                <div
                  key={venue.id}
                  className="col-9 col-sm-6 col-md-4 col-lg-3"
                  style={{
                    scrollSnapAlign: "start",
                    flex: "0 0 auto",
                    minWidth: "250px",
                  }}
                >
                  <div className="artists-thumb custom-card h-100 shadow-sm rounded-3 overflow-hidden position-relative">
                    {/* Gambar dan Nama */}
                    <div className="image-container position-relative">
                      {venue.photo ? (
                        <img
                          src={`http://localhost:5001/uploads/${venue.photo}?t=${Date.now()}`}
                          alt={venue.name}
                          className="main-image img-fluid"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/assets/images/No-image.png";
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{
                            width: "100%",
                            height: "250px",
                            border: "1px solid #ccc",
                          }}
                        >
                          <FiImage className="text-muted" size={36} />
                        </div>
                      )}
                      <div className="venue-name">{venue.name}</div>
                    </div>

                    {/* Hover Content */}
                    <div className="hover-content">
                      <p className="description fw-bold text-dark mb-2">{venue.name}</p>
                      <p className="description text-dark mb-2">
                        {venue.description.length > 100
                          ? `${venue.description.slice(0, 100)}...`
                          : venue.description}
                      </p>
                      <Link href={`/venues?id=${venue.id}`}>
                        <button className="read-more-btn">Baca Selengkapnya</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">Belum ada data koleksi yang tersedia.</p>
            </div>
          )}
        </div>

        {/* Tombol Lihat Koleksi Lainnya */}
        <div className="text-center mt-2">
          <Link href="/venues">
            <button
              className="btn"
              style={{
                backgroundColor: "#0D6EFD",
                color: "#fff",
                padding: "4px 8px",
                fontSize: "12px",
                borderRadius: "50px",
                fontWeight: "500",
                border: "2px solid transparent",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#fff";
                e.target.style.color = "#0D6EFD";
                e.target.style.border = "2px solid #0D6EFD";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#0D6EFD";
                e.target.style.color = "#fff";
                e.target.style.border = "2px solid transparent";
              }}
            >
              Lihat Koleksi Lainnya
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>



      {/* Review Section */}
<section className="section-padding" id="review" style={{ padding: "40px 0"}}>
  <div className="container">
    
    {/* Judul + Tombol Panah */}
    <div className="row mb-4">
      <div className="col-12 d-flex  gap-3">
      <div className="col-12 mb-4 text-center">
        {/* Judul */}
        <h2>Ulasan Pengunjung </h2>
        <p className="text-black">
          Bagaimana Kata Mereka setelah berkunjung di Museum Lampung
      </p>
      </div>

        
      </div>
    </div>

    {/* Konten review */}
    <div className="position-relative">
      <div
        ref={containerRef}
        className="d-flex overflow-auto"
        style={{
          gap: "1.5rem",
          scrollSnapType: "x mandatory",
          padding: "1rem 0", 
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
    </div>
  </div>
</section>


<section className="section-padding" id="ourgallery" style={{ padding: "40px 0"}}>
  <div className="container-fluid">
    <div className="row g-3">
      {["our1.jpg", "our2.jpeg", "our3.jpg", "our4.jpg"].map((image, index) => (
        <div key={index} className="col-lg-3 col-md-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="position-relative rounded overflow-hidden shadow-sm gallery-card"
            style={{ cursor: "pointer" }}
          >
            <img
              src={`/assets/images/${image}`}
              alt={`Gallery ${index + 1}`}
              loading="lazy"
              className="w-100 h-100 object-fit-cover"
              style={{ height: "300px" }}
            />
            <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 opacity-0 hover-opacity-100 transition-opacity">
              <button className="btn btn-light rounded-circle shadow">
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
          .hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE/Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
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
          .custom-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: #fff;
  transition: all 0.3s ease;
  height: 100%;
}

.image-container {
  position: relative;
  transition: transform 0.4s ease;
}

.main-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.venue-name {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  font-weight: bold;
  font-size: 1rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  transition: transform 0.4s ease;
}

.hover-content {
  padding: 16px;
  position: absolute;
  bottom: -100%;
  width: 100%;
  background: white;
  transition: bottom 0.4s ease;
  z-index: 2;
}

.custom-card:hover .image-container {
  transform: translateY(-40%);
}

.custom-card:hover .hover-content {
  bottom: 0;
}

.read-more-btn {
  background: #0D6EFD;
  color: white;
  padding: 3px 6px;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  font-size: 0.85rem;
  margin-top: 10px;
  cursor: pointer;
}
  @media (max-width: 768px) {
          .overflow-hidden {
            padding: 0 25px !important;
          }
          .container-fluid {
            padding: 0 25px !important;
          }
          .hero-section {
            margin: 0 -25px !important;
          }
        }
        
        @media (max-width: 576px) {
          .overflow-hidden {
            padding: 0 15px !important;
          }
          .container-fluid {
            padding: 0 15px !important;
          }
          .hero-section {
            margin: 0 -15px !important;
          }
        }


      `}</style>
    </>
  );
}
