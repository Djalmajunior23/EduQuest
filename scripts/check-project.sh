#!/bin/bash
echo "Verificando dependências Node.js..."
npm install

echo "Verificando lint..."
npm run lint || echo "Atenção: Existem erros de lint."

echo "Fazendo build..."
npm run build && echo "Build do frontend finalizado com sucesso."
