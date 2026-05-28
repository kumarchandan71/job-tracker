from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    organization = Column(String)
    post = Column(String)
    status = Column(String)
    last_date = Column(String)
    apply_link = Column(String)
    is_pinned = Column(Boolean, default=False)
    priority = Column(String, default="Medium")

    notes = Column(String, nullable=True)
