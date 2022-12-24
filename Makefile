REMOTE=melodyn@84.201.152.223
DIR_BACKEND=/home/melodyn/diploma/backend
PM2=/usr/bin/pm2

setup: install-dependencies mongo-run run
install-dependencies:
	npm ci

# app
run: mongo-run
	npm run dev
prod:
	chmod +x ./bin/index.js && npm run start
pm2-prod:
	$(PM2) start pm2.config.cjs --wait-ready
pm2-stop:
	$(PM2) stop pm2.config.cjs

# dev
lint:
	npm run lint
mongo-run:
	docker run --rm -p 27017:27017 -d --name mongo mongo:latest || true
mongo-stop:
	docker stop mongo

release: build deploy
build:
	rsync -a --exclude node_modules --exclude api-tests --exclude .git --exclude .idea . ./build
	cd build && NODE_ENV=production npm ci
deploy:
	ssh $(REMOTE) 'cd $(DIR_BACKEND) && make pm2-stop'
	rsync -avz --progress -e 'ssh' ./build/ $(REMOTE):$(DIR_BACKEND)
	ssh $(REMOTE) 'cd $(DIR_BACKEND) && make pm2-prod'
remote:
	ssh $(REMOTE)
