BROWSERIFY = node_modules/.bin/browserify

all: dist/mapbox.directions.js

node_modules/.install: package.json
	npm install && touch node_modules/.install

dist:
	mkdir -p dist

dist/mapbox.directions.js: node_modules/.install dist $(shell $(BROWSERIFY) --list index.js)
	npm run build

clean:
	rm -rf dist/mapbox.directions.js

D3_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/selection/index.js \
	node_modules/d3/src/end.js

lib/d3.js: $(D3_FILES)
	node_modules/.bin/smash $(D3_FILES) > $@
