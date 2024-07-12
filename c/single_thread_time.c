#include <stdio.h>
#include <time.h>

void perform_task(int task_id) {
    // Simulate a CPU-bound task
    double result = 0.0;
    for (long i = 0; i < 1000000000; i++) {
        result += i * task_id;
    }
    printf("Task %d completed with result %.2f\n", task_id, result);
}

int main() {
    clock_t start, end;
    double cpu_time_used;
    
    start = clock();
    for (int i = 0; i < 5; i++) {
        perform_task(i);
    }
    end = clock();
    
    cpu_time_used = ((double) (end - start)) / CLOCKS_PER_SEC;
    printf("Single-threaded execution time: %.2f seconds\n", cpu_time_used);
    
    return 0;
}

