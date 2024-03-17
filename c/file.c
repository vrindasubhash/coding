#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
  FILE *out_file, *in_file;
  out_file = fopen("file.txt", "a"); // a means append
  in_file = fopen("file.txt", "r"); // r means read

  fprintf(out_file,"hello again\n");

  fclose(out_file);
  fclose(in_file);
  return 0;
}
