FROM python:3.13-alpine3.22

ENV PYTHONUNBUFFERED=1

WORKDIR /asklvkaszus/backend

# The application runs as an unprivileged user instead of root.
RUN addgroup -S -g 10001 asklvkaszus \
    && adduser -S -D -H -u 10001 -G asklvkaszus asklvkaszus \
    && chown asklvkaszus:asklvkaszus /asklvkaszus/backend

COPY --chown=asklvkaszus:asklvkaszus . .

RUN pip install --no-cache-dir -r requirements.txt

USER asklvkaszus

ENV TZ="Europe/Warsaw"

ENV GUNICORN_WORKERS=1
ENV GUNICORN_THREADS=4
ENV GUNICORN_TIMEOUT=60

EXPOSE 3030

CMD ["sh", "start.sh"]