import Link from "next/link";
import Script from "next/script";

const Footer = () => {
  return (
    <>
      <footer
        className="site-footer text-white py-5"
        style={{ backgroundColor: "#714D29" }}
      >
        <div className="container">
          <div className="row align-items-start">
            {/* Kolom Alamat */}
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 className="fw-bold text-white mb-3">Alamat:</h5>
              <p className="text-white mb-0" style={{ fontSize: "14px", lineHeight: "1.8" }}>
                Jl. ZA. Pagar Alam No.64,<br />
                Gedong Meneng, Kec. Rajabasa,<br />
                Kota Bandar Lampung,<br />
                Lampung 35141
              </p>
            </div>

            {/* Garis Vertikal */}
            <div className="col-md-1 d-none d-md-flex justify-content-center">
              <div style={{ width: "2px", height: "100%", backgroundColor: "#fff" }}></div>
            </div>

            {/* Kolom Menu + Logo */}
            <div className="col-md-7">
              <ul className="list-unstyled mb-3" style={{ fontSize: "14px", lineHeight: "2" }}>
                {["Beranda", "Destinasi Info", "Sejarah", "Koleksi", "Gallery", "Contact"].map(
                  (item, index) => (
                    <li key={index}>
                      <Link
                        href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                        className="text-white text-decoration-none"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>

              {/* Logo di bawah menu */}
              <img
                src="/assets/images/lampung-logo.png"
                alt="Lampung Logo"
                style={{ width: "160px", opacity: 0.9 }}
              />
            </div>
          </div>

          {/* Copyright */}
          <div
            className="text-center mt-4 pt-3"
            style={{ fontSize: "14px", borderTop: "1px solid rgba(255,255,255,0.3)" }}
          >
            <p className="mb-0 text-white">Copyright © PKL D3 MANAJEMEN INFORMATIKA</p>
          </div>
        </div>

        {/* Script */}
        <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/bootstrap.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/jquery.sticky.js" strategy="lazyOnload" />
        <Script src="/assets/js/click-scroll.js" strategy="lazyOnload" />
        <Script src="/assets/js/custom.js" strategy="lazyOnload" />
      </footer>
    </>
  );
};

export default Footer;
