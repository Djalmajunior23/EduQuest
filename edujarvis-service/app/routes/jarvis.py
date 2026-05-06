from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class JarvisRequest(BaseModel):
    user_id: str
    perfil: str
    mensagem: str
    contexto: dict | None = None

@router.post("/chat")
def chat_jarvis(payload: JarvisRequest):
    # Aqui entra a integração com Gemini/Supabase no futuro
    return {
        "resposta": f"EduJarvis recebeu: {payload.mensagem}",
        "acao_sugerida": "analisar_contexto_pedagogico"
    }
