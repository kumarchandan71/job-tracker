from fastapi import FastAPI
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
import models

import reminder

from fastapi.middleware.cors import CORSMiddleware

from schemas import JobCreate


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://job-tracker-iota-mauve.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
#Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


# Home Route
@app.get("/", tags=["Home"])
def home():

    return {
        "message": "Job Tracker Backend Running"
    }


# Add Job
@app.post("/add-job", tags=["Jobs"])
def add_job(job: JobCreate):

    db: Session = SessionLocal()

    new_job = models.Job(
        organization=job.organization,
        post=job.post,
        status=job.status,
        last_date=job.last_date,
        apply_link=job.apply_link,
        notes=job.notes,
        is_pinned=job.is_pinned,
        priority=job.priority
    )

    db.add(new_job)

    db.commit()

    db.refresh(new_job)

    db.close()

    return {
        "message": "Job Added Successfully"
    }


# Get All Jobs
@app.get("/jobs", tags=["Jobs"])
def get_jobs():

    db: Session = SessionLocal()

    jobs = db.query(models.Job).all()

    result = []

    for job in jobs:

        result.append({
            "id": job.id,
            "organization": job.organization,
            "post": job.post,
            "status": job.status,
            "last_date": job.last_date,
            "apply_link": job.apply_link,
            "notes": job.notes,
            "is_pinned": job.is_pinned,
            "priority": job.priority
        })

    db.close()

    return result


# Delete Job
@app.delete("/delete-job/{job_id}", tags=["Jobs"])
def delete_job(job_id: int):

    db: Session = SessionLocal()

    job = db.query(models.Job).filter(
        models.Job.id == job_id
    ).first()

    if not job:

        db.close()

        return {
            "message": "Job Not Found"
        }

    db.delete(job)

    db.commit()

    db.close()

    return {
        "message": "Job Deleted"
    }


# Update Job
@app.put("/update-job/{job_id}", tags=["Jobs"])
def update_job(job_id: int, job: JobCreate):

    db: Session = SessionLocal()

    existing_job = db.query(models.Job).filter(
        models.Job.id == job_id
    ).first()

    if not existing_job:

        db.close()

        return {
            "message": "Job Not Found"
        }

    existing_job.organization = job.organization
    existing_job.post = job.post
    existing_job.status = job.status
    existing_job.last_date = job.last_date
    existing_job.apply_link = job.apply_link
    existing_job.notes = job.notes
    
    existing_job.is_pinned = job.is_pinned
    existing_job.priority = job.priority
    

    db.commit()

    db.close()

    return {
        "message": "Job Updated"
    }