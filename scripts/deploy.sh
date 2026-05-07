#!/bin/bash
echo "Iniciando processo de deploy..."
# Garantir permissões de execução
chmod +x scripts/*.sh

# Fazer check de projeto
./scripts/check-project.sh

# Fechar containers existentes
docker-compose down

# Subir containers em background
docker-compose up -d --build

echo "Deploy finalizado. Use ./scripts/logs.sh para ver os logs do sistema."
