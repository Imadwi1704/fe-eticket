"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Script from "next/script";
import { getCookie } from "cookies-next";
import {FiImage } from "react-icons/fi";
import {useSearchParams } from "next/navigation";


export default function VenuesPage() {
  const searchParam = useSearchParams();
  const id = searchParam.get("id");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(id || null);
  const token = getCookie("token");

  const handleSelectedVenue = venues.find((item) => item.id === selectedVenue)

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
    if(id) {
      setSelectedVenue(Number(id))
    };
  }, [id])

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
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
            }}
          ></div>
          <div
            className="position-absolute top-50 start-50 translate-middle text-center"
            style={{ zIndex: 2 }}
          >
            <h2 className="text-white fw-bold d-inline-block pb-2">
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
            <div className="row mb-5">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                {handleSelectedVenue.photo ? (
                    <img
                      src={`http://localhost:5001/uploads/${handleSelectedVenue.photo}?t=${new Date().getTime()}`}
                      alt={handleSelectedVenue.name}
                      className="card-img-top object-cover"
                      style={{ height: "300px" }}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;base64,….";
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
            className="d-flex overflow-auto pb-2"
            style={{
              gap: "1rem",
              scrollSnapType: "x mandatory",
              marginTop: selectedVenue ? "40px" : "0",
            }}
          >
            {venues.length > 0 ? (
              venues.map((venue) => ( 
                <div
                  key={venue.id}
                  className="card shadow-sm border-0"
                  onClick={() => setSelectedVenue(venue.id)}
                  style={{
                    minWidth: "250px",
                    flex: "0 0 auto",
                    cursor: "pointer",
                    scrollSnapAlign: "start",
                  }}
                >
                   <div className="flex items-center justify-center bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                      {venue.photo ? (
                        <img
                          style={{ width: 250, height: 250 }}
                          src={`http://localhost:5001/uploads/${venue.photo}?t=${new Date().getTime()}`}
                          alt={venue.name}
                          className="object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml;base64,…";
                          }}
                        />
                          ) : (
                            <FiImage className="text-gray-400 h-5 w-5" />
                          )}
                      
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{venue.name}</h5>
                    <p className="text-muted mb-1">
                      <strong>Tahun:</strong> {venue.year}
                    </p>
                    <p className="card-text">{venue.description}</p>
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
