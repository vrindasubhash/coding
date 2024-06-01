#include <stdio.h>
#include <string.h>

#include <stdbool.h>

int main() {
    printf("Size of bool: %zu\n", sizeof(bool));
    return 0;
}


/*
#define abc int

#ifdef abc
abc x = 25; //abc defined
#else
int x = 24; //abc not defined
#endif

int compare(const char *line, const char *var) {
    for (int i = 0; i < strlen(var); i++) {
        if (line[i] == '\0')
            return 0;
        if (var[i] != line[i])
            return 0;
    }
    return 1;
}


int main() {
    printf("%d\n", compare("abc", "abcd"));
    return 0;
}
*/
