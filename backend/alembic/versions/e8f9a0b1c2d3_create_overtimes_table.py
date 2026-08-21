"""create overtimes table

Revision ID: e8f9a0b1c2d3
Revises: d7e8f9a0b1c2
Create Date: 2026-08-21 20:50:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "e8f9a0b1c2d3"
down_revision: Union[str, None] = "d7e8f9a0b1c2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

overtime_status_enum = postgresql.ENUM(
    "pending",
    "approved",
    "rejected",
    name="overtime_status_enum",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    overtime_status_enum.create(bind, checkfirst=True)

    op.create_table(
        "overtimes",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("hours", sa.Float(), nullable=False),
        sa.Column("description", sa.String(length=500), nullable=True),
        sa.Column(
            "status",
            overtime_status_enum,
            server_default=sa.text("'pending'::overtime_status_enum"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_overtimes_user_id"), "overtimes", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_overtimes_user_id"), table_name="overtimes")
    op.drop_table("overtimes")

    bind = op.get_bind()
    overtime_status_enum.drop(bind, checkfirst=True)
