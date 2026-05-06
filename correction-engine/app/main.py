from fastapi import FastAPI
from app.routes.correction import router as correction_router

app = FastAPI(title="EduQuest Correction Engine")

@app.get("/")
def health():
    return {"status": "ok", "service": "Correction Engine"}

app.include_router(correction_router, prefix="/api/correction")
