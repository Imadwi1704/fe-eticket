"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@components/Footer";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiImage,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { FiZoomIn } from "react-icons/fi";
import Image from "next/image";
import page from "@/config/page";

export default function RootLayout() {
  const [venues, setVenues] = useState([]);
  const [review, setReview] = useState([]);
  const [gallery, setGallery] = useState([]);
  const containerRef = useRef(null);
  const getRandomColor = () => {
    const colors = [
      "#3498db",
      "#e74c3c",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
      "#d35400",
      "#27ae60",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Fungsi untuk mengecek status buka/tutup museum
  const isMuseumOpen = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu

    // Museum tutup di hari Senin (1) dan buka Selasa-Minggu
    if (currentDay === 1) return false;

    // Jam operasional: 08:00 - 14:00
    const openingHour = 8;
    const closingHour = 14;

    // Konversi waktu ke menit untuk perbandingan lebih mudah
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const openingTimeInMinutes = openingHour * 60;
    const closingTimeInMinutes = closingHour * 60;

    return (
      currentTimeInMinutes >= openingTimeInMinutes &&
      currentTimeInMinutes < closingTimeInMinutes
    );
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch venue data
        const venueRes = await fetch(page.baseUrl + "/api/venue", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (venueRes.ok) {
          const venueData = await venueRes.json();
          setVenues(venueData);
        }

        // Fetch review data
        const reviewRes = await fetch(page.baseUrl + "/api/reviews", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          const enrichedReviews =
            reviewData.data?.reviews?.map((review) => ({
              ...review,
              name: review.user?.fullName || "Anonymous",
            })) || [];
          setReview(enrichedReviews);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const galleryRes = await fetch(page.baseUrl + "/api/gallery", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          const sortedGallery = galleryData
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
          setGallery(sortedGallery);
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      }
    };

    fetchGalleryData();
  }, []);

  return (
    <>
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section
          className="hero-section"
          style={{
            height: "90vh",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Video Background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/gR8kj6ti-s4?start=25&end=40&autoplay=1&mute=1&loop=1&playlist=gR8kj6ti-s4&controls=0&modestbranding=1&rel=0"
              title="YouTube video player"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "150%",
                objectFit: "cover",
                filter: "brightness(0.7)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
                zIndex: 2,
              }}
            ></div>
          </div>

          {/* Content Container */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
            style={{
              position: "relative",
              zIndex: 3,
              color: "white",
              padding: "0 5%",
              width: "100%",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <div style={{ flex: 1 }}>
                <h1
                  className="fw-bold text-white"
                  style={{
                    fontSize: "50px",
                    lineHeight: "1.1",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Museum Lampung Ruwa Jurai
                </h1>

                <div style={{ marginBottom: "2.5rem", maxWidth: "1000px" }}>
                  <p
                    className="lead text-white"
                    style={{
                      fontSize: "1.25rem",
                      textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
                      lineHeight: "1.6",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Melestarikan Warisan Sejarah dan Budaya Lampung sebagai
                    Cerminan Jati Diri, Demi Mewariskannya kepada Generasi
                    Mendatang dengan Penuh Kebanggaan.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <Link href="/aboutnext">
                    <button
                      className="btn"
                      style={{
                        background: "#FFFFFF",
                        color: "#000",
                        borderRadius: "50px",
                        fontSize: "1rem",
                        padding: "5px 15px",
                        transition: "0.3s",
                        fontWeight: "600",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      Jelajahi Museum
                    </button>
                  </Link>

                  <Link href="/venues">
                    <button
                      className="btn"
                      style={{
                        background: "transparent",
                        color: "#FFF",
                        borderRadius: "50px",
                        fontSize: "1rem",
                        padding: "5px 15px",
                        transition: "0.3s",
                        fontWeight: "600",
                        border: "2px solid #FFF",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.1)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Koleksi Kami
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        <section
          style={{
            width: "100%",
            height: "10vh",
            background: "rgba(13, 110, 253, 1)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                fontSize: "18px",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: isMuseumOpen() ? "#4ade80" : "#f87171",
                  animation: isMuseumOpen() ? "pulse 1.5s infinite" : "none",
                }}
              ></div>
              <span>
                {isMuseumOpen() ? "Museum Sedang Buka" : "Museum Sedang Tutup"}{" "}
                — Jam Operasional: 08:00 - 14:00
              </span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          className="section-padding bg-white"
          id="about"
          style={{ padding: "50px 0" }}
        >
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-lg-10 mb-2">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h2 className="text-black">
                    Selamat Datang di Museum Ruwa Jurai
                  </h2>
                  <p className="lead text-black" style={{ lineHeight: 1.7 }}>
                    Sebagai pusat preservasi budaya Lampung, kami menyimpan
                    lebih dari 15.000 artefak bersejarah yang menceritakan
                    perjalanan panjang masyarakat Lampung dari masa ke masa.
                  </p>
                </motion.div>
              </div>

              <div className="col-lg-10">
                <motion.div
                  className="d-flex justify-content-center flex-wrap gap-5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {/* Info Cards */}
                  {[
                    {
                      icon: "bi-collection",
                      value: "15Rb",
                      label: "Koleksi bersejarah yang tersimpan di Museum Lampung",
                    },
                    {
                      icon: "bi-people-fill",
                      value: "120Rb",
                      label: "Banyak pengunjung/tahun yang mengunjungi Museum Lampung",
                    },
                    {
                      icon: "bi-award",
                      value: "10",
                      label: "Penghargaan nasional yang diraih Museum Lampung",
                    },
                  ].map((card, index) => (
                    <div
                      key={index}
                      className="rounded-4 p-2 p-md-3 text-center shadow-sm transition-all duration-300 hover-card"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "2px solid #0D6EFD",
                        color: "#000000",
                        width: "100%", // Make it responsive
                        maxWidth: "200px", // Limit maximum size
                        margin: "1", // Center the card
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center mx-auto rounded-circle transition-all duration-300 hover-icon"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#0D6EFD",
                        }}
                      >
                        <i className={`bi ${card.icon} fs-4 text-white`}></i>
                      </div>
                      <h2 className="fs-5 fs-md-4 fw-bold mt-2 mt-md-3 mb-1">
                        {card.value}
                        <span className="text-primary">+</span>
                      </h2>
                      <p className=" text-dark mb-0">{card.label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section
          className="section-padding"
          id="history"
          style={{ padding: "20px 0" }}
        >
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div
                className="col-lg-4 col-md-5 col-12 position-relative d-flex justify-content-center mb-4 mb-lg-0"
                style={{ minHeight: "500px" }}
              >
                <div
                  className="position-absolute"
                  style={{
                    bottom: "10%",
                    zIndex: 1,
                    width: "80%",
                    transform: "rotate(-5deg)",
                  }}
                >
                  <Image
                    src="/assets/images/history.jpg"
                    width={400}
                    height={300}
                    className="img-fluid rounded shadow-lg"
                    alt="Museum Lampung 1"
                    style={{
                      width: "100%",
                      height: "auto",
                      border: "5px solid white",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>

                <div
                  className="position-absolute"
                  style={{
                    top: "10%",
                    zIndex: 2,
                    width: "80%",
                    transform: "rotate(5deg)",
                  }}
                >
                  <Image
                    src="/assets/images/our1.jpg"
                    width={400}
                    height={300}
                    className="img-fluid rounded shadow-lg"
                    alt="Museum Lampung 2"
                    style={{
                      width: "100%",
                      height: "auto",
                      border: "5px solid white",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-7 col-12">
                <h2 className="text-black mb-4">
                  Sejarah Museum
                  <span className="text-primary"> Ruwai Jurai</span>
                </h2>
                <p className="text-black mb-5 text-justify">
                  Lampung memiliki museum yang mengabadikan perjalanan sejarah
                  di provinsi paling selatan dari Pulau Sumatera ini. Nama
                  museum itu adalah Museum Negeri Propinsi Lampung Ruwa Jurai.
                  Museum yang terletak di Jln. Zainal Arifin Pagar Alam No. 64,
                  Rajabasa, Bandar Lampung, ini letaknya begitu strategis. Hanya
                  berjarak beberapa ratus meter dari Terminal Bus Rajabasa dan
                  dekat dengan gerbang Kampus UNILA.
                </p>
                <div>
                  <Link
                    href="/historynext"
                    style={{
                      display: "inline-block",
                      padding: "5px 12px",
                      backgroundColor: "#0D6EFD",
                      color: "white",
                      borderRadius: "20px",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                      fontSize: "10",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#0D6EFD";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#0D6EFD";
                      e.currentTarget.style.outlineColor = "#0D6EFD";
                      e.currentTarget.style.outlineStyle = "solid";
                      e.currentTarget.style.outlineWidth = "1px";
                    }}
                  >
                    Pelajari Selengkapnya
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Venues Section */}
        <section
          className="artists-section section-padding"
          id="venues"
          style={{ padding: "40px 0", backgroundColor: "#f0f8ff" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-3 mb-4">
                <h2 className="mb-1">Koleksi Museum Lampung</h2>
                <p className="text-black mb-0">
                  Cari Tahu Koleksi yang dipamerkan di Museum Lampung
                  &rdquo;Ruwa Jurai&ldquo;
                </p>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Link
                    href="/venues"
                    style={{
                      display: "inline-block",
                      padding: "5px 12px",
                      backgroundColor: "#0D6EFD",
                      color: "white",
                      borderRadius: "20px",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                      fontSize: "10",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#0D6EFD";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#0D6EFD";
                      e.currentTarget.style.outlineColor = "#0D6EFD";
                      e.currentTarget.style.outlineStyle = "solid";
                      e.currentTarget.style.outlineWidth = "1px";
                    }}
                  >
                    <span>Koleksi Lainnya</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="col-md-9 position-relative">
                <div
                  className="position-relative"
                  style={{ padding: "10px 0" }}
                >
                  <div
                    className="d-flex gap-2 mb-3"
                    style={{
                      position: "absolute",
                      bottom: "-40px",
                      left: "15px",
                      zIndex: 10,
                    }}
                  >
                    <button
                      className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        transition: "all 0.3s ease",
                      }}
                      onClick={scrollLeft}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        transition: "all 0.3s ease",
                      }}
                      onClick={scrollRight}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <FiChevronRight />
                    </button>
                  </div>

                  <div
                    className="scroll-container d-flex hide-scrollbar"
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
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .slice(0, 5)
                        .map((venue) => (
                          <div
                            key={venue.id}
                            className="col-8 col-sm-6 col-md-4 col-lg-3"
                            style={{
                              scrollSnapAlign: "start",
                              flex: "0 0 auto",
                              minWidth: "250px",
                            }}
                          >
                            <div className="artists-thumb custom-card h-100 shadow-sm rounded-2">
                              <div className="image-container position-relative">
                                {venue.photo ? (
                                  <Image
                                    width={300}
                                    height={300}
                                    src={`${page.baseUrl}/uploads/${
                                      venue.photo
                                    }?t=${Date.now()}`}
                                    alt={venue.name}
                                    className="main-image img-fluid"
                                    style={{
                                      width: "100%",
                                      height: "350px",
                                      objectFit: "cover",
                                    }}
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src =
                                        "/assets/images/No-image.png";
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

                              <div className="hover-content">
                                <h3>{venue.name}</h3>
                                <p className="text-dark">
                                  {venue.description.length > 100
                                    ? `${venue.description.slice(0, 100)}...`
                                    : venue.description}
                                </p>
                                <Link href={`/venues/detail?id=${venue.id}`}>
                                  <button className="read-more-btn">
                                    Baca Selengkapnya
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="col-12 text-center">
                        <p className="text-muted">
                          Belum ada data koleksi yang tersedia.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Review Section */}
        <section
          className="section-padding bg-white"
          id="review"
          style={{ padding: "60px 0" }}
        >
          <div className="container">
            <div className="row mb-2">
              <div className="col-12 text-center">
                <h2
                  className="mb-3"
                  style={{
                    color: "#2c3e50",
                    fontSize: "2rem",
                    fontWeight: "700",
                  }}
                >
                  Ulasan Pengunjung
                </h2>
                <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                  Bagaimana Kata Mereka Tentang Pengalaman di Museum Lampung
                </p>
              </div>
            </div>

            <div className="position-relative">
              <div
                ref={containerRef}
                className="d-flex overflow-auto hide-scrollbar"
                style={{
                  gap: "2rem",
                  scrollSnapType: "x mandatory",
                  padding: "1.5rem 0.5rem",
                  scrollBehavior: "smooth",
                }}
              >
                {review.length > 0 ? (
                  review.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-3 p-4 d-flex flex-column position-relative"
                      style={{
                        minWidth: "340px",
                        maxWidth: "340px",
                        flex: "0 0 auto",
                        scrollSnapAlign: "start",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        cursor: "default",
                        border: "1px solid rgba(0,0,0,0.05)",
                        height: "220px",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(0,0,0,0.08)";
                      }}
                    >
                      {/* Profile Avatar with Cartoon Style */}
                      <div className="d-flex align-items-center mb-4">
                        <div
                          className="rounded-circle overflow-hidden me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: getRandomColor(),
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            border: "3px solid white",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                          }}
                        >
                          {item.user?.profilePicture ? (
                            <Image
                              src={item.user.profilePicture}
                              alt={item.user.fullName || "Pengunjung"}
                              width={60}
                              height={60}
                              className="img-fluid"
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/default-profile.png";
                              }}
                            />
                          ) : (
                            <span>
                              {item.user?.fullName?.charAt(0)?.toUpperCase() ||
                                "P"}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4
                            className="fw-bold mb-1"
                            style={{ fontSize: "1.2rem", color: "#2c3e50" }}
                          >
                            {item.user?.fullName || "Pengunjung"}
                          </h4>
                          <p
                            className="mb-0 text-muted"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {new Date(item.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div
                        className="mb-3"
                        style={{ fontSize: "1.4rem", color: "#FFD700" }}
                        aria-label={`Rating: ${item.score} dari 5`}
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              opacity: i < item.score ? 1 : 0.3,
                              textShadow:
                                i < item.score
                                  ? "0 1px 2px rgba(0,0,0,0.2)"
                                  : "none",
                            }}
                          >
                            {i < item.score ? "★" : "☆"}
                          </span>
                        ))}
                        <span
                          className="ms-2"
                          style={{ fontSize: "0.9rem", color: "#7f8c8d" }}
                        >
                          {item.score}.0/5.0
                        </span>
                      </div>

                      {/* Review Text */}
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "0.95rem",
                            color: "#555",
                            lineHeight: "1.6",
                            display: "-webkit-box",
                            WebkitLineClamp: 6,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.comment}
                        </p>
                      </div>

                      {/* Decorative Corner */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          width: "60px",
                          height: "60px",
                          background:
                            "linear-gradient(135deg, transparent 50%, rgba(52, 152, 219, 0.1) 50%)",
                          borderTopLeftRadius: "100%",
                        }}
                      ></div>
                    </div>
                  ))
                ) : (
                  <div
                    className="text-center w-100 py-5"
                    style={{ minWidth: "100%" }}
                  >
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          fill="#adb5bd"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z" />
                        </svg>
                      </div>
                      <p
                        className="text-muted mb-2"
                        style={{ fontSize: "1.1rem" }}
                      >
                        Belum ada ulasan yang tersedia
                      </p>
                      <p
                        className="text-muted"
                        style={{ fontSize: "0.9rem", maxWidth: "400px" }}
                      >
                        Jadilah yang pertama memberikan ulasan tentang
                        pengalaman Anda di Museum Lampung
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section
          className="section-padding"
          id="ourgallery"
          style={{ padding: "40px 0" }}
        >
          <div className="container">
            <div className="row mb-4">
              <div className="col-12 text-center">
                <h2 className="mb-2" style={{ color: "#333" }}>
                  Galeri Kami
                </h2>
              </div>
            </div>
            <div className="row g-3">
              {gallery.length > 0 ? (
                gallery.map((item, index) => (
                  <div key={index} className="col-lg-3 col-md-6">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="position-relative rounded overflow-hidden shadow-sm gallery-card mx-2"
                      style={{ cursor: "pointer" }}
                    >
                      <Image
                        width={300}
                        height={300}
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.imageUrl}`}
                        alt={`Gallery ${index + 1}`}
                        className="w-100 h-100 object-fit-cover"
                        style={{ height: "100px" }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/images/No-image.png";
                        }}
                      />
                    </motion.div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p className="text-muted">
                    Belum ada gambar gallery yang tersedia.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />

        <style jsx global>{`
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.33%);
            }
          }
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          @keyframes pulse {
            0% {
              opacity: 0.6;
              transform: scale(0.9);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
            100% {
              opacity: 0.6;
              transform: scale(0.9);
            }
          }
          @keyframes borderFlow {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .hover-card:hover {
            background-color: #0d6efd !important;
            color: #ffffff !important;
            cursor: pointer;
          }

          .hover-card:hover h2,
          .hover-card:hover p,
          .hard-card:hover span {
            color: #ffffff !important;
          }

          .hover-card:hover .hover-icon {
            background-color: #ffffff !important;
          }

          .hover-card:hover .hover-icon i {
            color: #0d6efd !important;
          }

          .text-justify {
            text-align: justify;
          }

          .custom-card {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
            .text-white {
            color: white !important;
            }

          .hover-content {
            padding: 16px;
            position: absolute;
            bottom: -100%;
            width: 100%;
            height: 100%;
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
            background: #0d6efd;
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
            .overflow-hidden,
            .container-fluid {
              padding: 0 25px !important;
            }
            .hero-section {
              margin: 0 -25px !important;
            }
          }

          @media (max-width: 576px) {
            .overflow-hidden,
            .container-fluid {
              padding: 0 15px !important;
            }
            .hero-section {
              margin: 0 -15px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
