from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class CorrectionRequest(BaseModel):
    aluno_id: str
    atividade_id: str
    tipo: str
    linguagem: str | None = None
    resposta: str
    criterios: list[str] = []

@router.post("/evaluate")
def evaluate(payload: CorrectionRequest):
    # Mock de correção
    return {
        "nota": 8.5,
        "feedback_geral": "Boa solução. Há pontos de melhoria na organização e clareza.",
        "feedback_linha_a_linha": [],
        "competencias_detectadas": ["Sugerir Logistica", "Pensamento Computacional"],
        "sugestoes_estudo": ["Revisar loops", "Modularização"]
    }
