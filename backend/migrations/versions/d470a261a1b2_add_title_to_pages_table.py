"""Add title to Pages table

Revision ID: d470a261a1b2
Revises: 46a1ed54703c
Create Date: 2025-03-24 11:38:42.331040

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import String


# revision identifiers, used by Alembic.
revision: str = 'd470a261a1b2'
down_revision: Union[str, None] = '46a1ed54703c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add 'title' column to 'Pages' table
    op.add_column('pages', sa.Column('title', String(), nullable=True))

def downgrade() -> None:
    """Downgrade schema."""
    # Remove 'title' column from 'Pages' table
    op.drop_column('pages', 'title')
