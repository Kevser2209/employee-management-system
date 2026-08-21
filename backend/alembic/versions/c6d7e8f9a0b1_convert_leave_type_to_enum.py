"""convert leave_type column to LeaveType enum

Revision ID: c6d7e8f9a0b1
Revises: b5c6d7e8f9a0
Create Date: 2026-07-31 18:08:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "c6d7e8f9a0b1"
down_revision: Union[str, None] = "b5c6d7e8f9a0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

leave_type_enum = postgresql.ENUM(
    "annual",
    "sick",
    "maternity",
    "paternity",
    "unpaid",
    name="leave_type_enum",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    leave_type_enum.create(bind, checkfirst=True)

    op.alter_column(
        "leaves",
        "leave_type",
        existing_type=sa.String(length=50),
        type_=leave_type_enum,
        existing_nullable=False,
        postgresql_using="leave_type::leave_type_enum",
    )


def downgrade() -> None:
    op.alter_column(
        "leaves",
        "leave_type",
        existing_type=leave_type_enum,
        type_=sa.String(length=50),
        existing_nullable=False,
        postgresql_using="leave_type::text",
    )

    bind = op.get_bind()
    leave_type_enum.drop(bind, checkfirst=True)
