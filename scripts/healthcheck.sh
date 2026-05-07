#!/bin/bash
echo "== CHECANDO SAÚDE DOS SERVIÇOS =="

curl -sI -o /dev/null -w "Frontend HTTP Staus: %{http_code}\n" http://localhost:80
curl -sI -o /dev/null -w "EduJarvis HTTP Staus: %{http_code}\n" http://localhost:8001/health
curl -sI -o /dev/null -w "Correction Engine HTTP Staus: %{http_code}\n" http://localhost:8002/health

docker-compose ps
