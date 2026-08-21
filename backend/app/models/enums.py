"""Veritabanı modellerinde kullanılan enum tanımları."""

import enum


class LeaveType(str, enum.Enum):
    """İzin türlerini temsil eden enum."""

    ANNUAL = "annual"
    SICK = "sick"
    MATERNITY = "maternity"
    PATERNITY = "paternity"
    UNPAID = "unpaid"


class LeaveStatus(str, enum.Enum):
    """İzin talebi durumlarını temsil eden enum."""

    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class OvertimeStatus(str, enum.Enum):
    """Fazla mesai talebi durumlarını temsil eden enum."""

    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
