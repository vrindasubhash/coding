#include <stdio.h>
#include <stdlib.h>

#define NUM_THREADS 5

void print_hello(long tid) {
  printf("Hello from thread #%ld!\n", tid);
}

int main() {
  long t;
  
  for (t = 0; t < NUM_THREADS; t++) {
    printf("executing task #%ld\n", t);
    print_hello(t);
  }
  
  printf("Main: program completed. Exiting.\n");
  return 0; 
}
