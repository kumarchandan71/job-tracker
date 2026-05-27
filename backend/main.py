from fastapi import FastAPI
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
import models

import reminder

from fastapi.middleware.cors import CORSMiddleware

from schemas import JobCreate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://job-tracker-iota-mauve.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/", tags=["Home"])
def home():
    return {"message": "Job Tracker Backend Running"}





@app.post("/add-job", tags=["Jobs"])
def add_job(job: JobCreate):

    db: Session = SessionLocal()

    new_job = models.Job(
        organization=job.organization,
        post=job.post,
        status=job.status,
        last_date=job.last_date
    )

    db.add(new_job)

    db.commit()

    return {"message": "Job Added Successfully"}


@app.get("/jobs", tags=["Jobs"])
def get_jobs():

    db: Session = SessionLocal()

    jobs = db.query(models.Job).all()

    return jobs


@app.delete("/delete-job/{job_id}")
def delete_job(job_id: int):

    db: Session = SessionLocal()

    job = db.query(models.Job).filter(models.Job.id == job_id).first()

    db.delete(job)

    db.commit()

    return {"message": "Job Deleted"}


@app.put("/update-job/{job_id}")
def update_job(job_id: int, job: JobCreate):

    db: Session = SessionLocal()

    existing_job = db.query(models.Job).filter(models.Job.id == job_id).first()

    existing_job.organization = job.organization
    existing_job.post = job.post
    existing_job.status = job.status
    existing_job.last_date = job.last_date

    db.commit()

    return {"message": "Job Updated"}