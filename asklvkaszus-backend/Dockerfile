FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /asklvkaszus/backend

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

ENV TZ="Europe/Warsaw"

ENV GUNICORN_WORKERS=1
ENV GUNICORN_THREADS=4
ENV GUNICORN_TIMEOUT=60

EXPOSE 3030

CMD ["sh", "start.sh"]