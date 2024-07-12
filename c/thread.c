#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

#define NUM_THREADS 10
#define NUM_ITERATIONS 500

int global_variable = 0;
pthread_mutex_t mutex;

void* thread_function(void* arg) {
    for (int i = 0; i < NUM_ITERATIONS; ++i) {
        // Uncomment the following line to see the effect of using a mutex
        pthread_mutex_lock(&mutex);
        //++global_variable;
        int local = global_variable;
        // Uncomment the following line to see the effect of using a mutex
        local += 10;
        usleep(0);
        global_variable = local;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

int main() {
    pthread_t threads[NUM_THREADS];
    pthread_mutex_init(&mutex, NULL);

    // Create threads
    for (int i = 0; i < NUM_THREADS; ++i) {
        pthread_create(&threads[i], NULL, thread_function, NULL);
    }

    // Wait for threads to finish
    for (int i = 0; i < NUM_THREADS; ++i) {
        pthread_join(threads[i], NULL);
    }

    pthread_mutex_destroy(&mutex);

    int expected_value = NUM_THREADS * (NUM_ITERATIONS * 10);

    printf("Global variable value: %d, Expected value: %d\n", global_variable, expected_value);
    return 0;
}

