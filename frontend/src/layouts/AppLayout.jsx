import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const baseNavItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/leaves", label: "İzinlerim" },
  { to: "/overtimes", label: "Fazla Mesailerim" },
];

const managementNavItem = { to: "/management", label: "Yönetim" };

function Sidebar({ isOpen, onClose, navItems }) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Yönetim Paneli
          </p>
          <h1 className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            Personel İzin ve Fazla Mesai Takip Sistemi
          </h1>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const { user, logout, hasManagementAccess } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = hasManagementAccess
    ? [...baseNavItems, managementNavItem]
    : baseNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Menüyü aç"
                className="rounded-lg border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-50 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                </svg>
              </button>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Çıkış Yap
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
