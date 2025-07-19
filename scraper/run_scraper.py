from mercari_scraper import scrape_products
from db import insert_products

def run_real_time_search(keyword: str, category: str, price_min: int, price_max: int):
    print(f"Running real-time search for: {keyword}")
    results = scrape_products(keyword, category, price_min, price_max)
    insert_products(results)
    print(f"Inserted {len(results)} items.")
    return results
