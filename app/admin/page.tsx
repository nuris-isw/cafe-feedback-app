// app/admin/page.tsx
// Ini adalah halaman Dashboard Admin sementara (Server Component)

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin (Akses Publik Sementara) ☕</h1>
      <p className="text-lg text-green-600">Selamat datang! Form Login berfungsi, namun halaman ini belum memiliki proteksi sesi.</p>
      
      {/* Tautan untuk kembali ke Login (Simulasi Logout) */}
      <a href="/admin/login" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
        &larr; Kembali ke Login (Simulasi Logout)
      </a>
    </div>
  );
}