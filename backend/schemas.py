from pydantic import BaseModel
from typing import Optional


class JobCreate(BaseModel):

    organization: Optional[str] = ""
    post: Optional[str] = ""
    status: Optional[str] = ""
    last_date: Optional[str] = ""
    apply_link: Optional[str] = ""

    notes: Optional[str] = ""

    is_pinned: Optional[bool] = False

    priority: Optional[str] = "Medium"