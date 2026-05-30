import asyncio
from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CallbackQueryHandler
from vega.backend.config import settings
from vega.backend.utils.logger import logger

class Notifier:
    def __init__(self):
        self.token = settings.TELEGRAM_BOT_TOKEN
        self.chat_id = settings.TELEGRAM_CHAT_ID
        self.bot = Bot(token=self.token) if self.token else None
        self.resp = asyncio.Queue()

    async def start_bot(self):
        if not self.token: return
        try:
            app = ApplicationBuilder().token(self.token).build()
            app.add_handler(CallbackQueryHandler(self._handle))
            await app.initialize()
            await app.start()
            await app.updater.start_polling()
            logger.info("Telegram bot started")
        except Exception as e:
            logger.error(f"Bot start failed: {e}")

    async def _handle(self, update, context):
        await update.callback_query.answer()
        await self.resp.put(update.callback_query.data)

    async def send(self, msg):
        if self.bot and self.chat_id: await self.bot.send_message(self.chat_id, msg)

    async def wait_for_response(self, timeout=600):
        kb = [[InlineKeyboardButton("Equities", callback_data="1"), InlineKeyboardButton("F&O", callback_data="2")]]
        if self.bot and self.chat_id: await self.bot.send_message(self.chat_id, "Market Mode?", reply_markup=InlineKeyboardMarkup(kb))
        try: return await asyncio.wait_for(self.resp.get(), timeout)
        except: return "1"
notifier = Notifier()
