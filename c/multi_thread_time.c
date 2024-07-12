#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <time.h>

#define NUM_THREADS 5

void *perform_task(void *threadid) {
    long tid = (long)threadid;
    // Simulate a CPU-bound task
    double result = 0.0;
    for (long i = 0; i < 1000000000; i++) {
        result += i * tid;
    }
    printf("Task %ld completed with result %.2f\n", tid, result);
    pthread_exit(NULL);
}

int main() {
    pthread_t threads[NUM_THREADS];
    clock_t start, end;
    double cpu_time_used;
    
    start = clock();
    for (long t = 0; t < NUM_THREADS; t++) {
        int rc = pthread_create(&threads[t], NULL, perform_task, (void *)t);
        if (rc) {
            printf("Error: unable to create thread, %d\n", rc);
            exit(-1);
        }
    }
    
    // Wait for all threads to complete
    for (long t = 0; t < NUM_THREADS; t++) {
        pthread_join(threads[t], NULL);
    }
    end = clock();
    
    cpu_time_used = ((double) (end - start)) / CLOCKS_PER_SEC;
    printf("Multithreaded execution time: %.2f seconds\n", cpu_time_used);
    
    return 0;
}

