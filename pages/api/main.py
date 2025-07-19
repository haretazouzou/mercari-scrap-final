from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from run_scraper import run_real_time_search

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev. Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/scrape")
async def scrape_endpoint(req: Request):
    data = await req.json()
    keyword = data.get("keyword", "")
    category = data.get("category", "その他")
    price_min = data.get("price_min", 1000)
    price_max = data.get("price_max", 5000)

    results = run_real_time_search(keyword, category, price_min, price_max)
    return {"status": "ok", "count": len(results), "items": results[:10]}  # return sample
