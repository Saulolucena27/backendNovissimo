# Etapa 1 — Build da aplicação
FROM node:18 AS build

WORKDIR /app

# Copia configs
COPY package*.json tsconfig.json ./

# Instala dependências
RUN npm install

# Copia o código
COPY . .

# Compila o TypeScript
RUN npm run build

# Etapa 2 — Runtime
FROM node:18

WORKDIR /app

# Copia somente dist + node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 3001

CMD ["node", "dist/index.js"]
