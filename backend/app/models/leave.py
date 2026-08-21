"""Leave (izin) veritabanı modeli."""

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import LeaveStatus, LeaveType

if TYPE_CHECKING:
    from app.models.user import User


class Leave(Base):
    """Kullanıcı izin talebini temsil eden model."""

    __tablename__ = "leaves"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    leave_type: Mapped[LeaveType] = mapped_column(
        Enum(
            LeaveType,
            name="leave_type_enum",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
    )
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[LeaveStatus] = mapped_column(
        Enum(
            LeaveStatus,
            name="leave_status_enum",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=LeaveStatus.PENDING,
        server_default=text("'pending'"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="leaves")
