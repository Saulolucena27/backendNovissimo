# Etapa 1 — Build da aplicação
FROM node:18 AS build

WORKDIR /app

# Copia package files e tsconfig
COPY package*.json tsconfig.json ./

# Copia o schema do Prisma ANTES do npm install
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

# Copia package.json
COPY package*.json ./

# Copia o schema Prisma (necessário em runtime)
COPY prisma ./prisma

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Gera Prisma Client novamente em produção
RUN npx prisma generate

# Copia o código compilado da etapa de build
COPY --from=build /app/dist ./dist

# Cria diretório de uploads
RUN mkdir -p /app/uploads

EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]