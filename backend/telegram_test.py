from telegram import Bot
import asyncio

TOKEN = "8943655906:AAEE1cmLwcmdg071hL-oYTiAZI8D7aFoemU"

CHAT_ID = "899793030"


async def send_message():

    bot = Bot(token=TOKEN)

    await bot.send_message(
        chat_id=CHAT_ID,
        text="🔥 AI Job Tracker Notification Working!"
    )


asyncio.run(send_message())