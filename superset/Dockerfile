FROM apache/superset:4.0.2

USER root

RUN apt-get update && apt-get install -y zip && apt-get clean

RUN pip install mysqlclient

ENV ADMIN_USERNAME $ADMIN_USERNAME
ENV ADMIN_EMAIL $ADMIN_EMAIL
ENV ADMIN_PASSWORD $ADMIN_PASSWORD

COPY ./superset-init.sh /app/superset-init.sh

COPY superset_config.py /app/
ENV SUPERSET_CONFIG_PATH /app/superset_config.py

USER superset
ENTRYPOINT [ "/app/superset-init.sh" ]