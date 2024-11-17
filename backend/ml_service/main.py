from fastapi import FastAPI

app = FastAPI()

@app.get("/testfastapi")
async def ping():
    return {"message": "FastAPI from ML service"}