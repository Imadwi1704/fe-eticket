"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Script from "next/script";
import { motion } from "framer-motion";
import {
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { useSearchParams, useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";
import page from "@/config/page";

const categories = [
  { id: 1, name: "Geologika" },
  { id: 2, name: "Historika" },
  { id: 3, name: "Keramologika" },
  { id: 4, name: "Arkeologika" },
  { id: 5, name: "Biologika" },
  { id: 6, name: "Numismatika" },
  { id: 7, name: "Seni Rupa" },
  { id: 8, name: "Etnografika" },
  { id: 9, name: "Fiologika" },
  { id: 10, name: "Teknologika" },
];

export default function VenuesPage() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const id = searchParam.get("id");
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(page.baseUrl + "/api/venue");
        const result = await res.json();
        if (res.ok) {
          setVenues(result);
          setFilteredVenues(result);
        } else {
          console.error(
            "Gagal mengambil data:",
            result?.message || "Tidak diketahui"
          );
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = venues;

    if (selectedCategory) {
      results = results.filter(
        (venue) =>
          venue.category &&
          venue.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      results = results.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVenues(results);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, venues]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVenues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center overflow-hidden"
        id="aboutnext"
        style={{
          height: "50vh",
          backgroundImage: "url('/assets/images/histori.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div className="overlay position-absolute top-0 start-0 w-100 h-100"></div>
        <motion.div
          className="position-relative text-white text-center z-2"
          style={{ zIndex: 2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="fw-bold display-4 mb-0"> Koleksi Museum Lampung</h1>
          <p className="lead text-white">
            Temukan berbagai koleksi berharga yang menceritakan sejarah dan budaya Lampung.
          </p>
        </motion.div>
      </section>

      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FiSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Cari koleksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className={`btn btn-sm rounded-pill ${
              !selectedCategory ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            Semua Kategori
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`btn btn-sm rounded-pill ${
                selectedCategory === category.name
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Memuat data koleksi...</p>
          </div>
        ) : (
          <div className="row g-4">
            {currentItems.length > 0 ? (
              currentItems.map((venue) => (
                <div
                  key={venue.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <Link
                    href={`/venues/detail?id=${venue.id}`}
                    className="text-decoration-none"
                  >
                    <div className="card h-100 shadow-sm">
                      <div
                        className="position-relative"
                        style={{ height: "180px" }}
                      >
                        {venue.photo ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${venue.photo}`}
                            alt={venue.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                            <FiImage size={40} className="text-muted" />
                          </div>
                        )}
                      </div>
                      <div className="card-body">
                        <h5 className="card-title text-dark mb-2">
                          {venue.name}
                        </h5>
                        <p className="card-text text-muted small">
                          {venue.description?.length > 80
                            ? `${venue.description.substring(0, 80)}...`
                            : venue.description || "Tidak ada deskripsi"}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-secondary">
                            {venue.category || "Umum"}
                          </span>
                          <span className="text-primary small">
                            Detail <FiChevronRight />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <FiImage size={48} className="text-muted mb-3" />
                <h5>Tidak ada koleksi ditemukan</h5>
                <p className="text-muted">
                  Silakan periksa kembali pencarian atau kategori.
                </p>
              </div>
            )}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={prevPage}>
                  &laquo;
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button className="page-link" onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button className="page-link" onClick={nextPage}>
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      <Footer />
      <style>
        {`
          .card {
            transition: transform 0.2s;
          }
             .overlay {
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
          z-index: 1;
        }
          .card:hover {
            transform: translateY(-5px);
          }
          .pagination .page-link {
            color: #007bff;
          }
          .pagination .page-item.active .page-link {
            background-color: #007bff;
            border-color: #007bff;
          }
            .form-control:focus {
          border-color: #0d6efd;
          color: #000 !important;
        }
        `}
      </style>
    </div>
  );
}
