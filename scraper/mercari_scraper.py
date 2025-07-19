from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from datetime import datetime
import time
import random
import re


def parse_price(price_str):
    try:
        return int(re.sub(r"[^\d]", "", price_str))
    except:
        return None


def scrape_products(keyword: str, category: str, price_min: int, price_max: int, max_pages: int = 5):
    base_url = f"https://jp.mercari.com/search?keyword={keyword}&price_min={price_min}&price_max={price_max}"
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for page_number in range(1, max_pages + 1):
            url = f"{base_url}&page_token=v{page_number}"
            print(f"Scraping: {url}")
            try:
                page.goto(url, timeout=60000)
                page.wait_for_timeout(random.uniform(2000, 4000))
            except:
                print("Timeout or redirect error")
                continue

            html = page.content()
            soup = BeautifulSoup(html, "html.parser")
            items = soup.select("li[data-testid='item-cell']")

            for item in items:
                try:
                    title = item.select_one("h3").text.strip()
                    price = parse_price(item.select_one("div[data-testid='item-price']").text)
                    image = item.select_one("img")["src"]
                    link = item.select_one("a")["href"]
                    full_link = "https://jp.mercari.com" + link

                    results.append({
                        "title": title,
                        "price": price,
                        "image": image,
                        "category": category,
                        "url": full_link,
                        "scrapedAt": datetime.utcnow()
                    })
                except Exception as e:
                    print("Parse error:", e)
                    continue

            time.sleep(random.uniform(1, 2))

        browser.close()
    return results
