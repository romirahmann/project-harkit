import { Link } from "@tanstack/react-router";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white px-6">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Oops! Halaman tidak ditemukan
        </h2>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Halaman yang kamu cari mungkin sudah dihapus, dipindahkan, atau tidak
          pernah ada.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
