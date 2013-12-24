BROWSERIFY = node_modules/.bin/browserify

all: dist/Leaflet.directions.js

node_modules/.install: package.json
	npm install && touch node_modules/.install

dist:
	mkdir -p dist

dist/Leaflet.directions.js: node_modules/.install dist src/d3.js $(shell $(BROWSERIFY) -t hbsfy --list index.js)
	$(BROWSERIFY) -t hbsfy --debug index.js > $@

clean:
	rm -rf dist/Leaflet.directions.js

D3_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/selection/index.js \
	node_modules/d3/src/end.js

src/d3.js: $(D3_FILES)
	node_modules/.bin/smash $(D3_FILES) > $@
