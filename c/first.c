#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void testArrays();
int testHeap();
void testString();

int main(int argc, char *argv[]) {
  if (argc != 3) {
    printf("Provide two inputs\n");
    return 1;
  }

  for (int i=0; i<argc; ++i) {
    printf("String %d: %s\n", i, argv[i]);
  }
  
  testArrays();

  if (testHeap() != 0) {
    return -1;
  }
 
  testString();
  
  return 0;
}

void testArrays() {
  int numbers[10];

  numbers[5] = 89;
  
  for (int i=0; i<10; i++) {
    printf("%d\n", numbers[i]);
  }	
}


int testHeap() {
  int* numbers = (int*)malloc(10 * sizeof(int));
  
  if (numbers == NULL) {
    fprintf(stderr, "Memory allocation failed\n");
    return -1; 
  }

  numbers[5] = 24;  

  for (int i=0; i<10; i++) {
    printf("%d\n", numbers[i]);
  }
   
  free(numbers);
  return 0;
}


void testString() {
  int s = 10;
  char* chars = (char*)malloc(s * sizeof(char));
  chars[0] = 'w';
  chars[1] = 'a';
  chars[2] = 0;
  chars[3] = 'q'; // wont print since ends at 0
  printf("%s\n", chars);


  char str[s];
  str[0] = 'a';
  str[1] = 'z';
  str[2] = 0; 
  printf("%s\n", str);
  

  strcpy(chars, "abc");
  printf("%s\n", chars);
 
  free(chars);
}

