"use client"

import { useEffect } from "react";
import { setCookie } from "cookies-next";
import {jwtDecode} from "jwt-decode";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
    const searchParams = useSearchParams()
  const token = searchParams.get('token')

  console.log(token,"token")

  useEffect(() => {
    if (token) {
      setCookie("token", token, { maxAge: 60 * 60 * 24, path: "/" });

      const decoded = jwtDecode(token);
      const role = decoded.role ? decoded.role.toUpperCase() : "";

      setCookie("role", role, { maxAge: 60 * 60 * 24, path: "/" });

      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [token, router]);

  return <p className="text-center mt-20">Memproses login dengan Google...</p>;
}