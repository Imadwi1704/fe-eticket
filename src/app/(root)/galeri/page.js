"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Footer from "@/components/Footer";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import page from "@/config/page";
import Image from "next/image";

export default function Gallery() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: "all", name: "Semua Kategori" },
    { id: "GALLERY", name: "Galeri" },
    { id: "FACILITY", name: "Fasilitas" },
    { id: "EVENT", name: "Event" },
  ];

  // Handle category change with URL update
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    // Update URL without page reload
    router.push(`/galeri/?category=${categoryId}`, undefined, {
      shallow: true,
    });
  };

  // Read URL params on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const categoryParam = queryParams.get("category");

      if (categoryParam && categories.some((c) => c.id === categoryParam)) {
        setSelectedCategory(categoryParam);
      }
    }
  }, []);

  const filteredItems = items.filter((item) => {
    const matchCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  const fetchGalleries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(page.baseUrl + "/api/gallery");

      if (!response.ok) {
        throw new Error("Gagal memuat galeri");
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching galleries:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center"
        style={{
          height: "50vh",
          backgroundImage: "url('/assets/images/our2.jpeg')",
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

        <div
          className="position-relative text-white text-center z-2 p-3"
          style={{ zIndex: 2 }}
        >
          <h1 className="fw-bold display-4 mb-3">Galeri Museum Lampung</h1>
          <p
            className="lead mb-4 mx-auto text-white"
            style={{ maxWidth: "600px" }}
          >
            Jelajahi koleksi, fasilitas, dan event Museum Negeri Lampung
          </p>
        </div>
      </section>

      {/* Konten Utama */}
      <section className="section-padding bg-light">
        <div className="container">
          {/* Toolbar Pencarian dan Filter */}
          <div className="row mb-5">
            <div className="col-md-8 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FiSearch size={20} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Cari koleksi..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-md-4 d-flex justify-content-md-end">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${
                    viewMode === "grid" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <FiGrid className="me-1" /> Grid
                </button>
                <button
                  type="button"
                  className={`btn ${
                    viewMode === "list" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <FiList className="me-1" /> List
                </button>
              </div>
            </div>
          </div>

          {/* Kategori */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`btn btn-sm ${
                      selectedCategory === category.id
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hasil Pencarian */}
          <div className="row">
            <div className="col-12 mb-3">
              <p className="text-muted">
                Menampilkan {filteredItems.length} dari {items.length} item
                {selectedCategory !== "all"
                  ? ` dalam kategori "${
                      categories.find((c) => c.id === selectedCategory)?.name
                    }"`
                  : ""}
                {searchTerm ? ` dengan kata kunci "${searchTerm}"` : ""}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Memuat data...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && items.length === 0 && (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                  <FiSearch size={48} className="text-danger" />
                </div>
                <h4 className="fw-bold mb-3">Gagal Memuat Data</h4>
                <p className="text-muted mb-4">
                  Terjadi kesalahan saat memuat data galeri.
                </p>
                <button className="btn btn-primary" onClick={fetchGalleries}>
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Grid View */}
          {!isLoading && items.length > 0 && viewMode === "grid" && (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredItems.map((item) => (
                <div className="col" key={item.id}>
                  <div className="card h-100 border-0 shadow-sm overflow-hidden">
                    <div
                      className="card-img-top"
                      style={{
                        height: "250px",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {item.imageUrl ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.imageUrl}`}
                          alt={item.title || "Gambar"}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMmU0ZTQiLz48dGV4dCB4PSIyMCIgeT0iNTUiIGZvbnQtc2l6ZT0iMTBweCIgZmlsbD0iIzc3NyI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg==";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "100%",
                            width: "100%",
                            backgroundColor: "#e2e4e4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#777",
                          }}
                        >
                          Gambar tidak tersedia
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {!isLoading && items.length > 0 && viewMode === "list" && (
            <div className="row">
              <div className="col-12">
                <div className="list-group">
                  {filteredItems.map((item) => (
                    <div
                      className="list-group-item list-group-item-action p-3"
                      key={item.id}
                    >
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <div
                            style={{
                              height: "120px",
                              width: "100%",
                              position: "relative",
                            }}
                          >
                            {item.imageUrl ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.imageUrl}`}
                                alt={item.title || "Gambar"}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMmU0ZTQiLz48dGV4dCB4PSIyMCIgeT0iNTUiIGZvbnQtc2l6ZT0iMTBweCIgZmlsbD0iIzc3NyI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg==";
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  backgroundColor: "#e2e4e4",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#777",
                                }}
                              >
                                Gambar tidak tersedia
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="d-flex flex-column">
                            <span className="badge bg-primary mb-1 align-self-start">
                              {categories.find((c) => c.id === item.category)
                                ?.name || "Tidak Berkategori"}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-2 text-md-end mt-3 mt-md-0">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => router.push(`/gallery/${item.id}`)}
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && items.length > 0 && filteredItems.length === 0 && (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                  <FiSearch size={48} className="text-primary" />
                </div>
                <h4 className="fw-bold mb-3">Tidak Ada Hasil</h4>
                <p className="text-muted mb-4">
                  Tidak ditemukan item yang sesuai dengan pencarian Anda.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  Tampilkan Semua Item
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Script Tambahan */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />

      <style jsx global>{`
        .hero-section {
          overflow: hidden;
        }

        .section-padding {
          padding: 5rem 0;
        }

        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }

        .list-group-item {
          transition: background-color 0.2s ease;
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 40vh;
          }

          .section-padding {
            padding: 3rem 0;
          }
        }
      `}</style>
    </div>
  );
}
