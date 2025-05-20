"use client";
import { useState, useEffect, useRef} from "react";
import Link from "next/link";
import Footer from "@components/Footer";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
      <div>
        <section
          className="hero-section"
          id="home"
          style={{ paddingTop: "100px", position: "relative", height: "100vh", overflow: "hidden" }}
        >
          {/* Video Background */}
          <div
            className="video-wrap"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          >
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

        <section className="section-padding" id="about">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 text-center mb-4">
                <h2 className="text-black fw-bold position-relative d-inline-block pb-2">
                  Destination Info
                </h2>
                <p className="text-black mt-2">
                  Berikut adalah beberapa informasi penting tentang Museum Lampung yang perlu Anda ketahui sebelum mengunjunginya.
                </p>
              </div>
              <div className="row align-items-center">
                <div className="col-lg-6 col-12 d-flex justify-content-center mb-4 mb-lg-0">
                  <img
                    src="/assets/images/museum.jpg"
                    className="about-image img-fluid rounded shadow"
                    alt="Museum Lampung"
                    style={{ maxWidth: "85%", height: "auto", borderRadius: "12px" }}
                  />
                </div>

                <div className="col-lg-5 col-12">
                  <h3 className="text-black fw-bold">Museum Ruwai Jurai</h3>
                  <p className="text-black">
                    Lampung memiliki museum yang mengabadikan perjalanan sejarah di provinsi paling selatan dari Pulau Sumatera ini. Nama museum itu adalah Museum Negeri Propinsi Lampung “Ruwa Jurai”. Museum yang terletak di Jln. Zainal Arifin Pagar Alam No. 64, Rajabasa, Bandar Lampung, ini letaknya begitu strategis. Hanya berjarak beberapa ratus meter dari Terminal Bus Rajabasa dan dekat dengan gerbang Kampus UNILA.
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
              </div>
            </div>
          </div>
        </section>

       <section className="section-padding" id="history">
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


        <section className="artists-section section-padding"
        id="venues"
        style={{ backgroundColor: "rgba(205, 183, 140, 0.16)" }}
        >
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-12">
              <h2 className="mb-3 fw-bold">Koleksi Museum</h2>
              <p className="text-black mt-2">
                Jelajahi Koleksi yang ada di Museum Lampung
              </p>
            </div>
          </div>
          <div
  className="d-flex overflow-auto pb-3 custom-scrollbar"
  style={{
    gap: "1rem",
    scrollSnapType: "x mandatory",
  }}
>
  <style jsx global>{`
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #714D29 #f1f1f1;
  }

  .custom-scrollbar::-webkit-scrollbar {
    height: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #714D29;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #5c3f20;
  }
`}</style>

  {venues.map((venue) => (
    <div
      key={venue.id}
      className="artists-thumb bg-white p-3 rounded-6 shadow-sm"
      style={{
        minWidth: "300px",
        flex: "0 0 auto",
        scrollSnapAlign: "start",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
      }}
    >
      {/* Gambar */}
      <div className="artists-image-wrap mb-2 text-center">
        {venue.photo ? (
          <img
            src={`http://localhost:5001/uploads/${venue.photo}?t=${Date.now()}`}
            alt={venue.name}
            className="img-fluid rounded"
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
            style={{ height: "180px", border: "1px solid #ccc" }}
          >
            <FiImage className="text-muted" size={36} />
          </div>
        )}
      </div>

      {/* Nama dan tombol */}
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
    </div>
  ))}
</div>

            </div>

        </section>
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
          padding: "1rem 60px", // kasih padding besar supaya tombol panah tidak nutup isi
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
        <section className="section-padding" id="ourgallery">
  <div className="container">
    {/* Judul Our Gallery */}
    <div className="row">
      <div className="col-12 text-center mb-4">
        <h2 className="text-black fw-bold position-relative d-inline-block pb-2">
          Our Gallery
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
       



        <Footer />
      </div>
    </>
  );
}
