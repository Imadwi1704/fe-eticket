"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import lampungLogo from "/public/assets/images/lampung-logo.png";
import { getCookie } from "cookies-next";

export default function DetailPage() {
  const [selectedDate, setSelectedDate] = useState("15 Mei 2025"); // contoh default
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticket, setTicket] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
  try {
    const res = await fetch(`http://localhost:5001/api/order/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (res.ok) {
      const order = result.data;
      setSelectedDate(new Date(order.visitDate).toLocaleDateString("id-ID"));

      const mappedItems = order.orderItems.map((item) => ({
        id: item.id,
        type: item.ticket?.type || "Unknown",
        price: item.ticketPrice,
        qty: item.quantity,
      }));

      setSelectedTicket(mappedItems);
      updateTotal(mappedItems);
    } else {
      console.error("Gagal mengambil data:", result?.message || "Tidak diketahui");
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat fetch:", error);
  }
};
    fetchData();
  }, [token]);

  const updateTotal = (list) => {
    const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotalPrice(total);
  };

  return (
    <>
      <Navbar />

      <section className="section-padding" id="detail-order" style={{minHeight: "100vh" }}>
         <div className="container">
          <div className="row">
          <div className="col-lg-6 col-6 mx-auto">
          <div className="card p-4 shadow" style={{ backgroundColor: "#fef9dc", maxWidth: "800px", width: "500%", position: "center" }}>
            {/* Badge ERUWAIJURAI */}
            <div className="position-absolute top-0 end-0 bg-white text-black fw-bold px-3 py-1 rounded-pill m-2 shadow-sm ">
              ERUWAIJURAI
            </div>

            <div className="mb-3">
              <p>Kode Pemesanan:#ORD123456</p>
              <p>Tanggal Berkunjung:{selectedDate}</p>
              <p>Rincian Pemesanan:</p>
              <ul>
                {selectedTicket.map((item) => (
                  <li key={item.id}>
                    {item.type} = Rp {item.price.toLocaleString("id-ID")} x {item.qty}
                  </li>
                ))}
              </ul>
              <p>Metode Pembayaran:Transfer Bank</p>
              <p className="fw-bold">Total Pembayaran: Rp {totalPrice.toLocaleString("id-ID")}</p>
            </div>

            <button
  className="btn btn-warning text-white fw-semibold d-flex align-items-center gap-2"
  onClick={() => window.open(`http://localhost:5001/api/order/${id}/download`, "_blank")}
>

              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9v4.6h15V9.9h-2V13H2.5V9.9h-2zM8 1.5v8.6l2.9-2.9 1.1 1.1L8 13 3 8.3l1.1-1.1L7 10.1V1.5H8z"/>
              </svg>
              Download Tiket
            </button>

            {/* Logo Lampung */}
            <div className="position-absolute bottom-0 end-0 me-3 mb-2" style={{ opacity: 0.3, width: "120px" }}>
              <Image src={lampungLogo} alt="Logo Lampung" className="img-fluid" />
            </div>
          </div>
        </div>
        </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
