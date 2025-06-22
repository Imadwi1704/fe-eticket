"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiShare2, FiHeart, FiImage } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "@/components/Footer";
import page from "@/config/page";

export default function CollectionDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${page.baseUrl}/api/venue/${id}`);
        const data = await res.json();

        if (res.ok && data.status === "success") {
          setVenue(data.data);
          setIsFavorite(favorites.some((item) => item.id === data.data.id));
        } else {
          throw new Error(data.message || "Gagal mengambil data koleksi");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchVenue();
  }, [id, favorites]);

  useEffect(() => {
    if (venue?.photo) {
      console.log(
        "Gambar URL:",
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${venue.photo}`
      );
    }
  }, [venue]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: venue?.name || "Koleksi Museum",
          text: `Lihat koleksi ${venue?.name} di Museum Lampung`,
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin ke clipboard!");
    }
  };

  const toggleFavorite = () => {
    if (!venue) return;

    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((item) => item.id !== venue.id);
    } else {
      newFavorites = [
        ...favorites,
        {
          id: venue.id,
          name: venue.name,
          photo: venue.photo,
          category: venue.category,
        },
      ];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center bg-light">
        <div className="alert alert-danger mb-4">Koleksi tidak ditemukan</div>
        <Link href="/venues" className="btn btn-primary shadow">
          Kembali ke Galeri
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div
        className="position-relative w-100 overflow-hidden"
        style={{ height: "200px" }}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${venue.photo}`}
          alt={venue.name}
          fill
          priority
          className="object-fit-cover"
          style={{
            objectFit: "cover",
            filter: "brightness(0.3)",
            zIndex: 1,
          }}
        />
        <div
          className="position-absolute top-50 start-50 translate-middle text-center text-white"
          style={{ zIndex: 2, whiteSpace: "nowrap" }}
        >
          <h1 className="display-5 fw-bold m-0">Detail Koleksi {venue.name}</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8" data-aos="fade-up">
            {/* Foto Koleksi */}
            <div className="card border-0  rounded-2 overflow-hidden">
              {venue.photo ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${venue.photo}`}
                  alt={venue.name}
                  width={1200}
                  height={600}
                  className="img-fluid w-100 object-fit-cover"
                  style={{ maxHeight: "500px" }}
                />
              ) : (
                <div
                  className="w-100 bg-white d-flex justify-content-center align-items-center"
                  style={{ height: "400px" }}
                >
                  <div className="text-center p-4">
                    <FiImage size={48} className="text-muted mb-3" />
                    <p className="text-muted">Gambar tidak tersedia</p>
                  </div>
                </div>
              )}
            </div>
            {/* Informasi Koleksi */}
            <div className="mt-4 p-1">
              <h2 className="fw-bold text-dark mb-3">{venue.name}</h2>

              <div className="mb-3 d-flex gap-3 flex-wrap">
                <span className="badge bg-gradient-primary text-white px-3 py-2">
                  {venue.category || "Umum"}
                </span>
                <span className="badge bg-secondary px-3 py-2">
                  {venue.year || "Tidak diketahui"}
                </span>
              </div>

              <p
                className="text-muted small text-justify mb-0"
                style={{ lineHeight: "1.7" }}
              >
                {venue.description || "Tidak ada deskripsi yang tersedia."}
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                onClick={() => router.back()}
                className="btn btn-outline-primary"
              >
                <FiArrowLeft className="me-2" /> Kembali
              </button>
              <div className="d-flex gap-2">
                <button
                  onClick={handleShare}
                  className="btn btn-outline-primary"
                >
                  <FiShare2 />
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`btn ${
                    isFavorite ? "btn-danger" : "btn-outline-primary"
                  }`}
                >
                  <FiHeart />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        .bg-gradient-primary {
          background: linear-gradient(45deg, #0d6efd, #6610f2);
        }
      `}</style>
    </div>
  );
}
