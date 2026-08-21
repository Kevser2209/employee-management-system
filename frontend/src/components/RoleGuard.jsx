import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function RoleGuard({ children }) {
  const { hasManagementAccess, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-600">
        Yetki bilgisi kontrol ediliyor...
      </div>
    );
  }

  if (!hasManagementAccess) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Bu alana erişim yetkiniz bulunmuyor.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Yönetim paneli yalnızca manager ve hr rollerine açıktır. Gerçek
          yetkilendirme backend RBAC tarafından sağlanır.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Dashboard&apos;a Dön
        </Link>
      </section>
    );
  }

  return children;
}

export default RoleGuard;
