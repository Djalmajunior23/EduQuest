#!/bin/bash
echo "== CHECANDO SAÚDE DOS SERVIÇOS =="

curl -sI -o /dev/null -w "Backend (API) HTTP Status: %{http_code}\n" http://localhost:3000/api/health
curl -sI -o /dev/null -w "Frontend HTTP Status: %{http_code}\n" http://localhost:3000/health
