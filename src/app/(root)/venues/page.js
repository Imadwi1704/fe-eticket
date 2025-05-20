"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Script from "next/script";
import { getCookie } from "cookies-next";
import { FiImage } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function VenuesPage() {
  const searchParam = useSearchParams();
  const id = searchParam.get("id");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(id || null);
  const token = getCookie("token");

  const handleSelectedVenue = venues.find((item) => item.id === Number(selectedVenue));

  useEffect(() => {
    AOS.init({ duration: 1000 });
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

  return (
    <>
      <div style={{ backgroundColor: "#F8F4E1", minHeight: "100vh" }}>
        {/* Hero Section */}
        <section
          className="hero-section position-relative"
          id="aboutnext"
          style={{ paddingTop: "50px" }}
        >
          <img
            src="/assets/images/museum.jpg"
            alt="Museum"
            className="w-100 img-fluid"
            style={{ height: "auto", objectFit: "cover" }}
          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1 }}
          ></div>
          <div
            className="position-absolute top-50 start-50 translate-middle text-center"
            style={{ zIndex: 2 }}
          >
            <h2 className="text-white fw-bold d-inline-block pb-2" data-aos="zoom-in">
              Koleksi Museum Lampung
              <span
                className="d-block mx-auto mt-2"
                style={{
                  width: "80px",
                  height: "5px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                }}
              ></span>
            </h2>
          </div>
        </section>

        <div className="container my-5">
          {/* Detail Venue */}
          {handleSelectedVenue && (
            <div className="row mb-5" data-aos="fade-up">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  {handleSelectedVenue.photo ? (
                    <img
                      src={`http://localhost:5001/uploads/${handleSelectedVenue.photo}?t=${new Date().getTime()}`}
                      alt={handleSelectedVenue.name}
                      className="card-img-top object-cover"
                      style={{ height: "300px", objectFit: "cover" }}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Found";
                      }}
                    />
                  ) : (
                    <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                      <FiImage className="text-gray-400 h-8 w-8" />
                    </div>
                  )}
                  <div className="card-body">
                    <h4 className="card-title fw-bold">{handleSelectedVenue.name}</h4>
                    <p className="text-muted">
                      <strong>Tahun:</strong> {handleSelectedVenue.year}
                    </p>
                    <p className="card-text">{handleSelectedVenue.description}</p>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setSelectedVenue(null)}
                    >
                      Tutup Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Venue Cards */}
<div
  className="d-flex overflow-auto pb-3 px-2"
  style={{
    gap: "1rem",
    scrollSnapType: "x mandatory",
    marginTop: selectedVenue ? "40px" : "0",
  }}
>
  {venues.length > 0 ? (
    venues.map((venue, index) => (
      <div
        key={venue.id}
        className="card border-0 shadow-sm rounded-4 bg-white hover-shadow transition-all"
        onClick={() => setSelectedVenue(venue.id)}
        style={{
          minWidth: "270px",
          flex: "0 0 auto",
          cursor: "pointer",
          scrollSnapAlign: "start",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        data-aos="zoom-in-up"
        data-aos-delay={index * 100}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.10)";
        }}
      >
        <div className="overflow-hidden rounded-top-4 position-relative">
          {venue.photo ? (
            <img
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
              src={`http://localhost:5001/uploads/${venue.photo}?t=${new Date().getTime()}`}
              alt={venue.name}
              className="img-fluid"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/270x200?text=No+Image";
              }}
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center bg-light"
              style={{ width: "100%", height: "200px" }}
            >
              <FiImage className="text-muted" size={40} />
            </div>
          )}
          <div
            className="position-absolute top-0 end-0 m-2 px-2 py-1 bg-dark text-white rounded"
            style={{ fontSize: "12px", opacity: 0.85 }}
          >
            {venue.year}
          </div>
        </div>

        <div className="card-body px-3 py-2">
          <h5 className="card-title fw-semibold text-dark mb-2">{venue.name}</h5>
          <p className="text-muted small mb-2">{venue.description?.slice(0, 80)}...</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill">
              Koleksi
            </span>
            <small className="text-muted">Klik untuk detail</small>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center w-100 text-muted">Belum ada data venue.</p>
  )}
</div>

        </div>
      </div>

      <Footer />

      {/* Scripts */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />
    </>
  );
}
