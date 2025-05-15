 "use client"
 import Navbar from "@/components/Navbar";
 import Footer from "@/components/Footer";
 
 export default function DetailPage() {
   return (
     <>
       <Navbar />
                    <div>
                      <p>
                        <strong>Tanggal Berkunjung:</strong> {selectedDate}
                      </p>
                      <p>
                        <strong>Rincian Pemesanan:</strong>
                      </p>
                      <ul>
                        {selectedTicket.map((item) => (
                          <li key={item.id}>
                            {item.type} = Rp{" "}
                            {item.price.toLocaleString("id-ID")} x {item.qty}
                          </li>
                        ))}
                      </ul>
                      <p className="fw-bold">
                        Total: Rp {totalPrice.toLocaleString("id-ID")}
                      </p>
                      <p>Yakin ingin memesan tiket ini?</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => alert("Tiket berhasil dipesan!")}
                      >
                        Konfirmasi
                      </button>
                    </div>

                      <Footer />
    </>
   )};