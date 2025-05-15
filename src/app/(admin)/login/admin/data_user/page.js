"use client";
import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/users/buyers", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setUsers(result.data);
        } else {
          console.error("Gagal mengambil data:", result?.message || "Tidak diketahui");
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <Template />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-lg-12">
          <div className="card w-100">
            <div className="card-body p-4">
              <h2 className="card-title fw-semibold text-left mb-2">Data User Pengunjung</h2>
              <p className="mb-4">
                Berfungsi untuk melihat data user pengunjung yang sudah mendaftar akun.
              </p>
              <div className="table-responsive">
                <table className="table mb-0" style={{ boxShadow: "none" }}>
                  <thead
                    className="fs-4"
                    style={{ backgroundColor: "rgba(116, 80, 45, 0.18)" }}
                  >
                    <tr>
                      <th>No</th>
                      <th>Kode Pengunjung</th>
                      <th>Nama Pengunjung</th>
                      <th>Email</th>
                      <th>Nomor Telepon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.id}</td>
                          <td>{user.fullName}</td>
                          <td>{user.email}</td>
                          <td>{user.phoneNumber || "-"}</td> {/* fallback jika tidak ada field phone */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          Tidak ada data pengguna.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
