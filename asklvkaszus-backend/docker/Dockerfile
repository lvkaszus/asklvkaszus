FROM python:3.11.4

WORKDIR /asklvkaszus/backend

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENV MAIN_ACCESS_URL=""
ENV ADMIN_ACCESS_URL=""
ENV AUTH_KEY="changeme"
ENV MYSQL_HOST="localhost"
ENV MYSQL_PORT="3306"
ENV MYSQL_USER="asklvkaszus"
ENV MYSQL_PASSWORD="changeme"
ENV MYSQL_DATABASE="asklvkaszus"
ENV REDIS_URL="redis://localhost:6379"

EXPOSE 3030

RUN touch /asklvkaszus/backend/access.log && \
    touch /asklvkaszus/backend/error.log

CMD ["gunicorn", "-c", "gunicorn_config.py", "asklvkaszus-backend:app"]