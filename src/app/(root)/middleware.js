import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Untuk memverifikasi token JWT

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname;

  const protectedPaths = ["/profile", "/orders", "/tickets"];
  const adminPaths = ["/admin", "/admin/dashboard", "/admin/users"];

  if (!token && (protectedPaths.includes(currentPath) || adminPaths.includes(currentPath))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role;

      // Cek jika akses ke admin tapi bukan admin
      if (adminPaths.includes(currentPath) && role !== "admin") {
        return NextResponse.redirect(new URL("/not-authorized", request.url));
      }

      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
