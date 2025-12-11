# Etapa 1 — Build da aplicação
FROM node:18 AS build

WORKDIR /app

# Copia package files e tsconfig
COPY package*.json tsconfig.json ./

# CRÍTICO: Copia o schema do Prisma ANTES do npm install
COPY prisma ./prisma

# Instala dependências (inclui Prisma CLI)
RUN npm install

# Gera o Prisma Client (ESSENCIAL)
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Compila o TypeScript
RUN npm run build

# Etapa 2 — Runtime
FROM node:18

WORKDIR /app

# Copia node_modules da etapa de build
COPY --from=build /app/node_modules ./node_modules

# Copia o código compilado
COPY --from=build /app/dist ./dist

# Copia o schema Prisma (necessário em runtime)
COPY --from=build /app/prisma ./prisma

# Copia package.json
COPY package*.json ./

EXPOSE 3001

CMD ["node", "dist/index.js"]