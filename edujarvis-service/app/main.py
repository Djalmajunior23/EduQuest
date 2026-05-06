from fastapi import FastAPI
from app.routes.jarvis import router as jarvis_router

app = FastAPI(title="EduJarvis Service")

@app.get("/")
def health():
    return {"status": "ok", "service": "EduJarvis"}

app.include_router(jarvis_router, prefix="/api/jarvis")
