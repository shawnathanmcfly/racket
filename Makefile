#CC=gcc
#CFALGS=
#LDFLAGS=-lSDL2 -lSDL2_ttf


#EM_CC=emcc
#EM_CFLAGS=-s WASM=1 -O3
#EM_LDFALGS=-s USE_SDL=2 -s USE_SDL_IMAGE=2 -s SDL2_IMAGE_FORMATS='["png"]' -s USE_SDL_TTF=2

#C:\Users\REEEEEEEEE\Desktop\code\racket\public>emcc -O3 -s USE_SDL=2 -s WASM=1 -s BINARYEN_TRAP_MODE="clamp" -s ASSERTIONS=1 racket.c

gcc test.c -IC:\ming_dev\include\SDL2 -LC:\ming_dev\lib -w -Wl,-subsystem,windows -lmingw32 -lSDL2main -lSDL2 -o racket
all:
	emcc -O3 -s USE_SDL=2 -s WASM=1 -s -s "BINARYEN_TRAP_MODE="clamp" ASSERTIONS=1 racket.c