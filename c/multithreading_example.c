#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define NUM_THREADS 5

void *print_hello(void *threadid) {
  long tid = (long)threadid;
  printf("Hello from thread #%ld!\n", tid);
  pthread_exit(NULL);
}

int main() {
  pthread_t threads[NUM_THREADS];
  int rc;
  long t;
  
  for (t = 0; t < NUM_THREADS; t++) {
    printf("Creating thread #%ld\n", t);
    rc = pthread_create(&threads[t], NULL, print_hello, (void *)t);

    if (rc) {
      printf("Error: unable to create thread, %d/n", rc);
      exit(-1);
    }
  }
  
  // wait for all threads to complete
  for (t = 0; t < NUM_THREADS; t++) {
    pthread_join(threads[t], NULL);
  }
  
  printf("Main: program completed. Exiting.\n");
  pthread_exit(NULL);
}
