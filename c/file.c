#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
  FILE* out_file;
  out_file = fopen("file.txt", "a"); // a means append

  fprintf(out_file,"hello again\n");

  fclose(out_file);
  return 0;
}
