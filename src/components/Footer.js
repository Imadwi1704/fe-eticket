import Link from "next/link";
import Script from "next/script";

const Footer = () => {
  return (
    <footer 
      className="text-white py-5 position-relative" 
      style={{ 
        backgroundColor: "#714D29",
        backgroundImage: "linear-gradient(to bottom right, #714D29 0%, #5a3b20 100%)"
      }}
    >
      {/* Efek tekstur subtle */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ 
          backgroundImage: "url('/assets/images/texture.png')",
          opacity: 0.05,
          pointerEvents: "none"
        }}
      ></div>

      <div className="container" style={{ maxWidth: "960px", position: "relative" }}>
        <div className="row g-4 align-items-start">
          {/* Kolom Alamat */}
          <div className="col-md-4 position-relative ">
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              Alamat
            </h5>
            <p className="mb-6 text-white" style={{ fontSize: "14px", lineHeight: "1.8" }}>
              Jl. ZA. Pagar Alam No.64,
              Gedong Meneng, Kec. Rajabasa,
              Kota Bandar Lampung,
              Lampung 35141
            </p>

            {/* Social Media */}
            <div className="d-flex gap-3">
              {['facebook', 'twitter', 'instagram'].map((social, index) => (
                <a 
                  key={index}
                  href={`https://${social}.com`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                  style={{ transition: 'transform 0.3s' }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
                >
                  <i className={`bi bi-${social} fs-5`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Garis Vertikal */}
          <div className="col-md-1 d-none d-md-flex justify-content-center">
            <div
              style={{
                width: "1px",
                height: "100%",
                background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              }}
            ></div>
          </div>

          {/* Menu + Logo */}
          <div className="col-md-7 d-flex flex-column justify-content-between" style={{ minHeight: "160px" }}>
            <ul
              className="list-unstyled mb-3 d-flex flex-wrap gap-4"
              style={{ fontSize: "14px" }}
            >
              {["Beranda", "Destinasi Info", "Sejarah", "Koleksi", "Gallery", "Contact"].map(
                (item, index) => (
                  <li key={index} className="position-relative">
                    <Link
                      href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                      className="text-white text-decoration-none hover-link"
                      style={{ 
                        transition: "color 0.3s",
                        paddingBottom: "2px"
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* Logo dengan efek hover */}
            <div className="d-flex justify-content-end mt-auto">
              <div style={{ transition: 'transform 0.3s' }} className="hover-lift">
                <img
                  src="/assets/images/lampung-logo.png"
                  alt="Lampung Logo"
                  style={{ 
                    width: "140px", 
                    filter: "brightness(0) invert(1)",
                    opacity: 0.9
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright dengan efek garis atas */}
        <div
          className="text-center text white mt-4 pt-4"
          style={{
            fontSize: "14px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <p className="mb-0 text-white">
            © {new Date().getFullYear()} PKL D3 Manajemen Informatika<br />
            <span className="opacity-75" style={{ fontSize: "12px" }}>
              Politeknik Negeri Lampung
            </span>
          </p>
        </div>
      </div>

      {/* Script eksternal */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
      <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
      <Script src="/assets/js/custom.js" strategy="lazyOnload" />

      <style jsx>{`
        .hover-link {
          position: relative;
        }
        
        .hover-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: 0;
          left: 0;
          background-color: #FFD700;
          transition: width 0.3s ease-out;
        }
        
        .hover-link:hover::after {
          width: 100%;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;