"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Script from "next/script";
import { getCookie } from "cookies-next";
import { FiImage, FiChevronLeft, FiChevronRight, FiInfo } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

export default function VenuesPage() {
  const searchParam = useSearchParams();
  const id = searchParam.get("id");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(id || null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15); // Show 15 items per page
  const token = getCookie("token");

  const handleSelectedVenue = venues.find((item) => item.id === Number(selectedVenue));

  useEffect(() => {
    AOS.init({ 
      duration: 1000,
      once: true,
      easing: 'ease-in-out'
    });
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/venue", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setVenues(result);
        } else {
          console.error("Gagal mengambil data:", result?.message || "Tidak diketahui");
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (id) {
      setSelectedVenue(Number(id));
    }
  }, [id]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = venues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(venues.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="">
      {/* Hero Section */}
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center"
        id="aboutnext"
        style={{
          height: "65vh",
          backgroundImage: "url('/assets/images/museum.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(rgb(0 0 0 / 70%), rgb(0 0 0 / 40%))",
            zIndex: 1,
          }}
        ></div>

        <div className="position-relative text-white text-center z-2 p-3" style={{ zIndex: 2 }}>
          <h1 className="fw-bold display-4 mb-3">Koleksi Museum Lampung</h1>
          <p className="lead mb-4 mx-auto text-white" style={{maxWidth: "600px"}}>
            Telusuri kekayaan budaya dan sejarah Lampung melalui koleksi unggulan Museum Negeri &ldquo;Ruwa Jurai&ldquo;
          </p>
        </div>
        
        {/* Gelombang Dekoratif */}
        <div className="position-absolute bottom-0 start-0 w-100" style={{zIndex: 3}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path 
              fill="#f8f9fa" 
              fillOpacity="1" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      <div className="container py-5">
        {/* Detail Venue */}
        {handleSelectedVenue && (
          <div className="row mb-5 justify-content-center" data-aos="fade-up">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="position-relative">
                  {handleSelectedVenue.photo ? (
                    <Image
                      src={`http://localhost:5001/uploads/${handleSelectedVenue.photo}?t=${new Date().getTime()}`}
                      alt={handleSelectedVenue.name}
                      className="card-img-top object-cover"
                      style={{objectFit: "cover"}}
                      width={"100"}
                      height={"400"}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Found";
                      }}
                    />
                  ) : (
                    <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 border-b">
                      <FiImage className="text-gray-400 h-16 w-16" />
                    </div>
                  )}
                  <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                  }}>
                    <h2 className="text-white mb-0">{handleSelectedVenue.name}</h2>
                    <p className="text-white mb-0">Tahun: {handleSelectedVenue.year}</p>
                  </div>
                </div>
                <div className="card-body p-4 p-lg-5">
                  <p className="card-text lead">{handleSelectedVenue.description}</p>
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-outline-primary rounded-pill px-4 py-2"
                      onClick={() => setSelectedVenue(null)}
                    >
                      Tutup Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Koleksi */}
        <div className="row justify-content-center mb-4" data-aos="fade-up">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h3 className="mb-1 text-dark">Koleksi Museum Lampung</h3>
                <p className="text-black mb-0">
                  Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, venues.length)} dari {venues.length} koleksi
                </p>
              </div>
              {venues.length > itemsPerPage && (
                <div className="d-flex align-items-center">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center p-2 me-2"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center p-2"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5 g-4">
          {currentItems.length > 0 ? (
            currentItems.map((venue, index) => (
              <div
                key={venue.id}
                className="col"
                data-aos="zoom-in-up"
                data-aos-delay={index % 5 * 100}
              >
                <div
                  className="card h-100 border-0 shadow rounded-4 bg-white"
                  onClick={() => setSelectedVenue(venue.id)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="overflow-hidden rounded-top-4 position-relative">
                    {venue.photo ? (
                      <Image
                        style={{ objectFit: "cover" }}
                        width={"200"}
                        height={"400"}
                        src={`http://localhost:5001/uploads/${venue.photo}?t=${new Date().getTime()}`}
                        alt={venue.name}
                        className="img-fluid"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x180?text=No+Image";
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center bg-light"
                        style={{ width: "100%", height: "180px" }}
                      >
                        <FiImage className="text-muted" size={32} />
                      </div>
                    )}
                    <div
                      className="position-absolute top-0 end-0 m-2 px-2 py-1 bg-primary text-white rounded-pill"
                      style={{ fontSize: "12px" }}
                    >
                      {venue.year}
                    </div>
                  </div>

                  <div className="card-body p-3">
                    <h6 className="card-title fw-bold text-dark mb-2">{venue.name}</h6>
                    <p className="text-muted mb-2" style={{
                      fontSize: "0.85rem",
                      display: "-webkit-box",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "60px"
                    }}>
                      {venue.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill" style={{ fontSize: "0.75rem" }}>
                        Koleksi
                      </span>
                      <div className="d-flex align-items-center text-primary" style={{ fontSize: "0.8rem" }}>
                        <FiInfo className="me-1" size={14} />
                        <small>Detail</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-light rounded-circle p-4 d-inline-flex mb-4">
                <FiImage size={48} className="text-muted" />
              </div>
              <h5 className="fw-bold mb-2">Belum ada data koleksi</h5>
              <p className="text-muted">Koleksi akan segera ditambahkan</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {venues.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-5">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <li
                    key={number}
                    className={`page-item ${currentPage === number ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <Footer />

      {/* Scripts */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />

      <style jsx global>{`
        .navbar {
          z-index: 1000 !important;
        }
        
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .btn-outline-primary {
          border-color: #0D6EFD;
          color: #0D6EFD;
          transition: all 0.3s ease;
        }
        
        .btn-outline-primary:hover {
          background-color: #0D6EFD;
          color: white;
        }
        
        .section-padding {
          padding: 5rem 0;
        }
        
        .page-item.active .page-link {
          background-color: #0D6EFD;
          border-color: #0D6EFD;
        }
        
        .page-link {
          color: #0D6EFD;
        }
        
        @media (max-width: 768px) {
          .hero-section {
            height: 50vh;
          }
          
          .section-padding {
            padding: 3rem 0;
          }
          
          .row-cols-md-2 > * {
            flex: 0 0 auto;
            width: 50%;
          }
        }
        
        @media (max-width: 576px) {
          .row-cols-1 > * {
            flex: 0 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}