FROM node:20-bookworm-slim

ENV NODE_ENV=production \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH="/opt/venv/bin:${PATH}"

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        ffmpeg \
        python3.11 \
        python3.11-venv \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN python3.11 -m venv /opt/venv \
    && pip install --upgrade pip setuptools wheel \
    && pip install -r requirements.txt

COPY package.json ./
COPY server.js ./
COPY prototypes ./prototypes

EXPOSE 3000

CMD ["npm", "start"]
