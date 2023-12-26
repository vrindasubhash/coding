#import <stdio.h>

#include "ptr.h"

int main() {
  int arr[5] = { 10, 20, 30, 40, 50 };

  printf("Size of arr[5]: %lu\n", sizeof(arr)); // 20 : 5 * sizeof(int)
  printf("Number of items in arr: %lu\n", sizeof(arr)/sizeof(arr[0])); // 5 : 20/sizeof(int)
  f1(arr);
  f2(arr);
  f2(&arr[0]); // Same as f2(arr)

  int* pInt = &arr[0];
  printf("Size of int* pInt: %lu\n", sizeof(pInt)); // size of a pointer (either 8 or 4)
  printf("Number of items in pInt: %lu\n", sizeof(pInt)/sizeof(pInt[0])); // size of pointer / sizeof(int)
  f1(pInt);

  return 0;
}

void f1(int arr[]) {
  printf("Size of arr[]: %lu\n", sizeof(arr)); // sizeof(pointer) : Either 8 or 4
  printf("Number of items in arr[]: %lu\n", sizeof(arr)/sizeof(arr[0])); // size of pointer / sizeof(int)
}

void f2(int* pInt) {
  printf("Size of pInt: %lu\n", sizeof(pInt)); // sizeof(pointer) : Either 8 or 4
  printf("Number of items in pInt: %lu\n", sizeof(pInt)/sizeof(pInt[0])); // size of pointer / sizeof(int)
}

