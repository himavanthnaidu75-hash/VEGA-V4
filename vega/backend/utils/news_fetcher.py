import feedparser
from vega.backend.utils.logger import logger

class NewsFetcher:
    def get_news(self):
        try:
            url = "https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms"
            feed = feedparser.parse(url)
            news = []
            for entry in feed.entries[:10]:
                sentiment = "BULLISH" if any(x in entry.title.upper() for x in ["UP", "GAIN", "RALLY", "BUY", "HIGH"]) else "BEARISH" if any(x in entry.title.upper() for x in ["DOWN", "FALL", "SLUMP", "SELL", "LOW"]) else "NEUTRAL"
                news.append({"title": entry.title, "sentiment": sentiment})
            return news
        except Exception as e:
            logger.error(f"News fetch error: {e}")
            return [{"title": "Market session active", "sentiment": "NEUTRAL"}]

news_fetcher = NewsFetcher()
