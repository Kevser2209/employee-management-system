import { useState } from "react";
import { Link } from "react-router-dom";

import LeaveFormModal from "../leaves/LeaveFormModal";
import OvertimeFormModal from "../overtimes/OvertimeFormModal";
import * as leaveService from "../../services/leaveService";
import * as overtimeService from "../../services/overtimeService";
import { getApiErrorMessage } from "../../utils/apiError";

function DashboardQuickActions({ hasManagementAccess, onCreated }) {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [isSubmittingOvertime, setIsSubmittingOvertime] = useState(false);
  const [leaveSubmitError, setLeaveSubmitError] = useState("");
  const [overtimeSubmitError, setOvertimeSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateLeave = async (payload) => {
    setIsSubmittingLeave(true);
    setLeaveSubmitError("");

    try {
      await leaveService.createLeave(payload);
      setIsLeaveModalOpen(false);
      setSuccessMessage("İzin talebiniz başarıyla oluşturuldu.");
      await onCreated();
      return true;
    } catch (err) {
      setLeaveSubmitError(getApiErrorMessage(err, "İzin talebi oluşturulamadı."));
      return false;
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const handleCreateOvertime = async (payload) => {
    setIsSubmittingOvertime(true);
    setOvertimeSubmitError("");

    try {
      await overtimeService.createOvertime(payload);
      setIsOvertimeModalOpen(false);
      setSuccessMessage("Fazla mesai talebiniz başarıyla oluşturuldu.");
      await onCreated();
      return true;
    } catch (err) {
      setOvertimeSubmitError(getApiErrorMessage(err, "Fazla mesai talebi oluşturulamadı."));
      return false;
    } finally {
      setIsSubmittingOvertime(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Hızlı İşlemler</h3>
      <p className="mt-1 text-sm text-slate-600">
        Sık kullanılan işlemlere buradan hızlıca erişebilirsiniz.
      </p>

      {successMessage ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setLeaveSubmitError("");
            setSuccessMessage("");
            setIsLeaveModalOpen(true);
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Yeni İzin Talebi
        </button>
        <button
          type="button"
          onClick={() => {
            setOvertimeSubmitError("");
            setSuccessMessage("");
            setIsOvertimeModalOpen(true);
          }}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Yeni Fazla Mesai Kaydı
        </button>
        {hasManagementAccess ? (
          <Link
            to="/management"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Yönetim Paneline Git
          </Link>
        ) : null}
      </div>

      <LeaveFormModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleCreateLeave}
        isSubmitting={isSubmittingLeave}
        submitError={leaveSubmitError}
      />

      <OvertimeFormModal
        isOpen={isOvertimeModalOpen}
        onClose={() => setIsOvertimeModalOpen(false)}
        onSubmit={handleCreateOvertime}
        isSubmitting={isSubmittingOvertime}
        submitError={overtimeSubmitError}
      />
    </section>
  );
}

export default DashboardQuickActions;
