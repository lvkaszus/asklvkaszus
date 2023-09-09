FROM python:3.11.4

WORKDIR /asklvkaszus/backend

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENV MAIN_ACCESS_URL=""
ENV ADMIN_ACCESS_URL=""
ENV SENDMSG_LIMIT="10 per hour"
ENV ADMIN_LIMIT="50 per hour"
ENV AUTH_KEY="changeme"
ENV MYSQL_HOST="localhost"
ENV MYSQL_PORT="3306"
ENV MYSQL_USER="asklvkaszus"
ENV MYSQL_PASSWORD="Testing123"
ENV MYSQL_DATABASE="asklvkaszus"
ENV REDIS_HOST="localhost"
ENV REDIS_PORT="6379"
ENV REDIS_DBS_0="0"
ENV REDIS_DBS_1="1"

EXPOSE 3030

RUN touch /asklvkaszus/backend/access.log && \
    touch /asklvkaszus/backend/error.log

CMD ["gunicorn", "-c", "gunicorn_config.py", "asklvkaszus-backend:app"]