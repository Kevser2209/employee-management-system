import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Personel İzin ve Fazla Mesai Takip Sistemi
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Hesabınıza erişmek için giriş yapın veya kayıt olun.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <Outlet />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/" className="font-medium text-slate-700 hover:text-slate-900">
            Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
