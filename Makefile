BROWSERIFY = node_modules/.bin/browserify

all: dist/Leaflet.directions.js

node_modules/.install: package.json
	npm install && touch node_modules/.install

dist:
	mkdir -p dist

dist/Leaflet.directions.js: node_modules/.install dist $(shell $(BROWSERIFY) -t hbsfy --list index.js)
	$(BROWSERIFY) -t hbsfy --debug index.js > $@

clean:
	rm -rf dist/*
