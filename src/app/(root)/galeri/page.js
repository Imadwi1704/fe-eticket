/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Footer from "@/components/Footer";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";



export default function Gallery() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const token = getCookie("token");

  const categories = [
    { id: "all", name: "Semua Kategori" },
    { id: "gallery", name: "Galeri" },
    { id: "facility", name: "Fasilitas" },
    { id: "event", name: "Event" },
  ];

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchTerm, items]);

  const filterItems = () => {
    let result = [...items];
    
    if (selectedCategory !== "all") {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredItems(result);
  };

 const fetchGalleries = async () => {
  try {
    setIsLoading(true);

    const token = getCookie("token"); // atau localStorage.getItem("token")
    const response = await fetch("http://localhost:5001/api/gallery", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section
        className="hero-section position-relative d-flex align-items-center justify-content-center"
        style={{
          height: "50vh",
          backgroundImage: "url('/assets/images/museum-gallery.jpg')",
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
          <h1 className="fw-bold display-4 mb-3">Galeri Museum Lampung</h1>
          <p className="lead mb-4 mx-auto text-white" style={{maxWidth: "600px"}}>
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
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid className="me-1" /> Grid
                </button>
                <button
                  type="button"
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('list')}
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
                    className={`btn btn-sm ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
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
                {selectedCategory !== 'all' ? ` dalam kategori "${categories.find(c => c.id === selectedCategory)?.name}"` : ''}
                {searchTerm ? ` dengan kata kunci "${searchTerm}"` : ''}
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
                <button 
                  className="btn btn-primary"
                  onClick={fetchGalleries}
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Grid View */}
          {!isLoading && items.length > 0 && viewMode === 'grid' && (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredItems.map((item) => (
                <div className="col" key={item.id}>
                  <div className="card h-100 border-0 shadow-sm overflow-hidden">
                    <div 
                      className="card-img-top" 
                      style={{
                        height: '200px',
                        backgroundImage: `url('${item.imageUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    ></div>
                    <div className="card-body">
                      <span className="badge bg-primary mb-2">
                        {categories.find(c => c.id === item.category)?.name}
                      </span>
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text text-muted">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {!isLoading && items.length > 0 && viewMode === 'list' && (
            <div className="row">
              <div className="col-12">
                <div className="list-group">
                  {filteredItems.map((item) => (
                    <div className="list-group-item list-group-item-action p-3" key={item.id}>
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <div 
                            className="rounded" 
                            style={{
                              width: '100%',
                              height: '120px',
                              backgroundImage: `url('${item.imageUrl}')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          ></div>
                        </div>
                        <div className="col-md-8">
                          <div className="d-flex flex-column">
                            <span className="badge bg-primary mb-1 align-self-start">
                              {categories.find(c => c.id === item.category)?.name}
                            </span>
                            <h5 className="mb-1">{item.title}</h5>
                            <p className="mb-0 text-muted">{item.description}</p>
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
                    setSearchTerm('');
                    setSelectedCategory('all');
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
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
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