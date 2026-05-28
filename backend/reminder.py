from apscheduler.schedulers.background import BackgroundScheduler

from telegram import Bot

from database import SessionLocal
import models

import os
from dotenv import load_dotenv

from datetime import datetime
import asyncio

load_dotenv()


# =========================
# TELEGRAM CONFIG
# =========================

TOKEN = os.getenv("BOT_TOKEN")

CHAT_ID = os.getenv("CHAT_ID")


# =========================
# MEMORY FOR SENT REMINDERS
# =========================

sent_reminders = set()


# =========================
# SEND TELEGRAM MESSAGE
# =========================

async def send_telegram_message(message):

    bot = Bot(token=TOKEN)

    await bot.send_message(
        chat_id=CHAT_ID,
        text=message
    )


# =========================
# CHECK DEADLINES
# =========================

def check_deadlines():

    db = SessionLocal()

    try:

        jobs = db.query(models.Job).all()

        for job in jobs:

            try:

                # Skip empty dates
                if not job.last_date:
                    continue

                # Convert string date into datetime
                last_date = datetime.strptime(
                    job.last_date,
                    "%Y-%m-%d"
                )

                today = datetime.now()

                days_left = (last_date - today).days


                # Reminder days
                if days_left in [30, 15, 7, 3, 2, 1, 0]:

                    # Unique reminder key
                    reminder_key = f"{job.id}-{days_left}"


                    # Prevent duplicate reminders
                    if reminder_key not in sent_reminders:

                        sent_reminders.add(reminder_key)


                        # Reminder message logic
                        if days_left == 0:

                            reminder_text = "⚠ Last date is TODAY!"

                        elif days_left == 1:

                            reminder_text = "⚠ Only 1 day left!"

                        else:

                            reminder_text = f"⚠ Only {days_left} days left!"


                        # Final Telegram Message
                        message = f"""

📢 Job Deadline Reminder

Organization: {job.organization}

Post: {job.post}

Status: {job.status}

{reminder_text}

"""


                        asyncio.run(
                            send_telegram_message(message)
                        )

            except Exception as e:

                print("Reminder Error:", e)

    finally:

        db.close()


# =========================
# SCHEDULER
# =========================

scheduler = BackgroundScheduler()

scheduler.add_job(
    check_deadlines,
    "interval",
    minutes=1
)

scheduler.start()