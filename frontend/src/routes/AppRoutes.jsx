import { Route, Routes } from "react-router-dom";

import ProtectedAppLayout from "../components/ProtectedAppLayout";
import RoleGuard from "../components/RoleGuard";
import RootRedirect from "../components/RootRedirect";
import AuthLayout from "../layouts/AuthLayout";
import DashboardPage from "../pages/DashboardPage";
import LeavesPage from "../pages/LeavesPage";
import LoginPage from "../pages/LoginPage";
import ManagementPage from "../pages/ManagementPage";
import OvertimesPage from "../pages/OvertimesPage";
import RegisterPage from "../pages/RegisterPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedAppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leaves" element={<LeavesPage />} />
        <Route path="/overtimes" element={<OvertimesPage />} />
        <Route
          path="/management"
          element={
            <RoleGuard>
              <ManagementPage />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
