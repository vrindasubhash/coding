//#import <stdio.h>


void abc(char* s, int i){}


#define PRINT_INT(x) abc(#x" %d\n", x)

int main() {

  int a = 10;
  int b = 25;

  abc("a %d\n", a);
  abc("b %d\n", b);

  // Equivalent using a macro
  PRINT_INT(a); // --> printf("a"" %d\n", a)
  PRINT_INT(b); // --> printf("b"" %d\n", b)
}
