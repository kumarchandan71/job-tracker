from sqlalchemy import Column, Integer, String
from database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    organization = Column(String)
    post = Column(String)
    status = Column(String)
    last_date = Column(String)