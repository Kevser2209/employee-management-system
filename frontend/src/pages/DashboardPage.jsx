import { useAuth } from "../context/useAuth";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
import DashboardRecentLeaves from "../components/dashboard/DashboardRecentLeaves";
import DashboardRecentOvertimes from "../components/dashboard/DashboardRecentOvertimes";
import StatCard from "../components/dashboard/StatCard";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  buildEmployeeLeaveStats,
  buildEmployeeOvertimeStats,
  getRecentItems,
} from "../utils/dashboardStats";

function DashboardPage() {
  const { user, hasManagementAccess } = useAuth();
  const {
    leaves,
    overtimes,
    pendingManagementLeaves,
    pendingManagementOvertimes,
    loading,
    errors,
    refetch,
    refetchLeaves,
    refetchOvertimes,
    refetchPendingManagementLeaves,
    refetchPendingManagementOvertimes,
  } = useDashboardData(hasManagementAccess);

  const leaveStats = buildEmployeeLeaveStats(leaves);
  const overtimeStats = buildEmployeeOvertimeStats(overtimes);
  const recentLeaves = getRecentItems(leaves, 5);
  const recentOvertimes = getRecentItems(overtimes, 5);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-slate-500">Hoş geldiniz</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          {user?.first_name} {user?.last_name}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
          İzin ve fazla mesai süreçlerinizi bu panelden takip edebilir, yeni
          talepler oluşturabilir ve güncel durum özetinizi görüntüleyebilirsiniz.
        </p>
      </section>

      <DashboardQuickActions hasManagementAccess={hasManagementAccess} onCreated={refetch} />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">İzin Özeti</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Toplam İzin Talebim"
            value={leaveStats.total}
            loading={loading}
            error={errors.leaves}
            onRetry={refetchLeaves}
          />
          <StatCard
            label="Bekleyen İzin"
            value={leaveStats.pending}
            loading={loading}
            error={errors.leaves}
            onRetry={refetchLeaves}
          />
          <StatCard
            label="Onaylanan İzin"
            value={leaveStats.approved}
            loading={loading}
            error={errors.leaves}
            onRetry={refetchLeaves}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Fazla Mesai Özeti</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Toplam Fazla Mesai Kaydım"
            value={overtimeStats.total}
            loading={loading}
            error={errors.overtimes}
            onRetry={refetchOvertimes}
          />
          <StatCard
            label="Bekleyen Fazla Mesai"
            value={overtimeStats.pending}
            loading={loading}
            error={errors.overtimes}
            onRetry={refetchOvertimes}
          />
          <StatCard
            label="Onaylanan Fazla Mesai"
            value={overtimeStats.approved}
            loading={loading}
            error={errors.overtimes}
            onRetry={refetchOvertimes}
          />
        </div>
      </section>

      {hasManagementAccess ? (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Yönetim Özeti</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Bekleyen İzin Talepleri"
              value={pendingManagementLeaves.length}
              loading={loading}
              error={errors.pendingManagementLeaves}
              onRetry={refetchPendingManagementLeaves}
            />
            <StatCard
              label="Bekleyen Fazla Mesai Talepleri"
              value={pendingManagementOvertimes.length}
              loading={loading}
              error={errors.pendingManagementOvertimes}
              onRetry={refetchPendingManagementOvertimes}
            />
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardRecentLeaves
          leaves={recentLeaves}
          loading={loading}
          error={errors.leaves}
          onRetry={refetchLeaves}
        />
        <DashboardRecentOvertimes
          overtimes={recentOvertimes}
          loading={loading}
          error={errors.overtimes}
          onRetry={refetchOvertimes}
        />
      </section>
    </div>
  );
}

export default DashboardPage;
