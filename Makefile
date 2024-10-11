include .env

empty:
	echo "empty"

# docker操作
dcb:
	docker-compose build
dcu:
	docker-compose up -d
dcd:
	docker-compose down
dcdv:
	docker-compose down -v

# コンテナログイン
## DB コンテナログイン
db-sh:
	docker exec -it mysql-output-crud-db sh