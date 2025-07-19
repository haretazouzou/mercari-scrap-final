from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["mercari_db"]
collection = db["products"]

def insert_products(products):
    for product in products:
        if collection.find_one({"url": product["url"]}):
            continue
        collection.insert_one(product)
