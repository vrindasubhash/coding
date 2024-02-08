#include <stdio.h>

#define abc int

#ifdef abc
abc x = 25; //abc defined
#else
int x = 24; //abc not defined
#endif



int main() {
    printf("%d\n", x);
    return 0;
}

