import { useState } from "react";

import LeaveManagementPanel from "../components/management/LeaveManagementPanel";
import OvertimeManagementPanel from "../components/management/OvertimeManagementPanel";

function ManagementPage() {
  const [activeTab, setActiveTab] = useState("leaves");

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Yönetim</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Çalışanların izin ve fazla mesai taleplerini görüntüleyebilir, bekleyen
          talepleri onaylayabilir veya reddedebilirsiniz.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 sm:px-6">
          <nav className="flex gap-2 py-3">
            <button
              type="button"
              onClick={() => setActiveTab("leaves")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "leaves"
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              İzin Talepleri
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overtimes")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "overtimes"
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Fazla Mesai Talepleri
            </button>
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "leaves" ? <LeaveManagementPanel /> : <OvertimeManagementPanel />}
        </div>
      </section>
    </div>
  );
}

export default ManagementPage;
