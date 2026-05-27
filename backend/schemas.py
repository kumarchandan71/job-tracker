from pydantic import BaseModel

class JobCreate(BaseModel):
    organization: str
    post: str
    status: str
    last_date: str
    apply_link: str