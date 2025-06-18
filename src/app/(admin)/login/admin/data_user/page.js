"use client";

import { useState, useEffect } from "react";
import Template from "@/components/admin/Template";
import { getCookie } from "cookies-next";
import page from "@/config/page";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(page.baseUrl+"/api/admin/users/buyers", {
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
      <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light">
        <div className="container-fluid py-5">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title fw-semibold mb-0 text-white">Data User Museum Lampung</h2>
            </div>
            <div className="card-body p-4">
              <p className="text-muted mb-4">
                Melihat data user yang sudah mendaftar.
              </p>
              <div className="table-responsive">
                <table className="table mb-0" style={{ boxShadow: "none" }}>
                  <thead className="table-primary">
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
                          <td>{user.phoneNumber || "-"}</td>
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
