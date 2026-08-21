"""convert leave status column to LeaveStatus enum

Revision ID: d7e8f9a0b1c2
Revises: c6d7e8f9a0b1
Create Date: 2026-08-21 20:35:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "d7e8f9a0b1c2"
down_revision: Union[str, None] = "c6d7e8f9a0b1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

leave_status_enum = postgresql.ENUM(
    "pending",
    "approved",
    "rejected",
    "cancelled",
    name="leave_status_enum",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    leave_status_enum.create(bind, checkfirst=True)

    op.alter_column("leaves", "status", server_default=None)

    op.alter_column(
        "leaves",
        "status",
        existing_type=sa.String(length=20),
        type_=leave_status_enum,
        existing_nullable=False,
        postgresql_using="status::leave_status_enum",
    )

    op.alter_column(
        "leaves",
        "status",
        server_default=sa.text("'pending'::leave_status_enum"),
    )


def downgrade() -> None:
    op.alter_column("leaves", "status", server_default=None)

    op.alter_column(
        "leaves",
        "status",
        existing_type=leave_status_enum,
        type_=sa.String(length=20),
        existing_nullable=False,
        postgresql_using="status::text",
    )

    op.alter_column(
        "leaves",
        "status",
        server_default=sa.text("'pending'"),
    )

    bind = op.get_bind()
    leave_status_enum.drop(bind, checkfirst=True)
