"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import lampungLogo from "@/public/lampung-logo.png"; // pastikan file ini ada di /public

export default function DetailPage() {
   const [selectedDate, setSelectedDate] = useState("");
    const [selectedTicket, setSelectedTicket] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [ticket, setTicket] = useState([]);
    const token = getCookie("token");
  
    useEffect(() => {
      if (!token) return;
  
      const fetchData = async () => {
        try {
          const res = await fetch("http://localhost:5001/api/ticket", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
  
          const result = await res.json();
          if (res.ok) {
            setTicket(result);
          } else {
            console.error("Gagal mengambil data:", result?.message || "Tidak diketahui");
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat fetch:", error);
        }
      };
  
      fetchData();
    }, [token]);
  
    const handleSelectTicket = (Ticket) => {
      const existing = selectedTicket.find((item) => item.id === Ticket.id);
      let updated;
      if (existing) {
        updated = selectedTicket.map((item) =>
          item.id === Ticket.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        updated = [...selectedTicket, { ...Ticket, qty: 1 }];
      }
      setSelectedTicket(updated);
      updateTotal(updated);
    };
  
    const updateTotal = (list) => {
      const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);
      setTotalPrice(total);
    };
  
  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center py-10 bg-[#fdf8e4] min-h-screen">
        <div className="bg-[#fef9dc] rounded-xl shadow-md p-6 relative w-[90%] max-w-lg">
          {/* Header */}
          <div className="absolute top-3 right-3 bg-white text-sm px-3 py-1 rounded-full font-bold text-[#bd7b00] shadow">
            ERUWAIJURAI
          </div>

          {/* Detail */}
          <div className="text-gray-800 space-y-2">
            <p><strong>Kode Pemesanan:</strong> #ORD123456</p>
            <p><strong>Date:</strong></p>

            {selectedTicket.map((item) => (
              <p key={item.id}>
                <strong>{item.type}:</strong> {item.qty} x Rp {item.price.toLocaleString("id-ID")}
              </p>
            ))}

            <p><strong>Metode Pembayaran:</strong> Transfer Bank</p>

            <p className="font-bold text-lg mt-3">
              Total Pembayaran: Rp {totalPrice.toLocaleString("id-ID")}
            </p>

            {/* Tombol */}
            <div className="mt-4">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2"
                onClick={() => alert("Tiket berhasil diunduh!")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9v4.6h15V9.9h-2V13H2.5V9.9h-2zM8 1.5v8.6l2.9-2.9 1.1 1.1L8 13 3 8.3l1.1-1.1L7 10.1V1.5H8z"/>
                </svg>
                Download Tiket
              </button>
            </div>
          </div>

          {/* Logo */}
          <div className="absolute bottom-4 right-4 opacity-30 w-32">
            <Image src={lampungLogo} alt="Logo Lampung" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
