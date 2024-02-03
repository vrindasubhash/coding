#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    // redirect stdout to a file by > (same as 1>)
    // redirect stderr to a file by 2> (file handle 2 is stderr)
    // ./a.out > a
    // cat a 
    // or 
    // ./a.out 2> a
    // cat a 
    printf("hello stdout\n");
    fprintf(stderr,"hello stderr\n");
    fprintf(stdout,"hello again stdout\n");
    return 0;
}
