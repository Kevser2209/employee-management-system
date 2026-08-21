import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

function ProtectedAppLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}

export default ProtectedAppLayout;
