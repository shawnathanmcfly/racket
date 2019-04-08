pc:
	gcc test.c -lSDL2main -lSDL2 -lSDL2_mixer -o racket -lm
em:
	emcc racket.c -O3 -s USE_SDL=2 -s USE_SDL_MIXER=2 -s WASM=3 -s ASSERTIONS=1 -s BINARYEN_TRAP_MODE="clamp" --preload-file images --use-preload-plugins
