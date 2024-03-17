#include <stdio.h>


void foo(){
  printf("foo\n");
}
	
int foo1(){
  printf("foo1\n");
  return 3;
}

int add(int a, int b){
  printf("add\n");
  return a + b;
}

char* a(char* s){
  return s;
}


typedef int (*myfunctype)(int, int);

int main() {
  void (*ptr)() = foo;
  int (*ptr1)() = foo1;
  int (*sum)(int, int) = add;
  char* (*ptr3)(char*) = a;
  myfunctype myadd = add;
  ptr();  
  int x = ptr1();
  printf("%d\n", x);
  int s = sum(5,1);
  printf("%d\n", s);
 
  return 0;
}

