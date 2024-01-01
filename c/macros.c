#import <stdio.h>

#define PRINT_INT(x) printf(#x" %d\n", x)

int main() {

  int a = 10;
  int b = 25;

  printf("a %d\n", a);
  printf("b %d\n", b);

  // Equivalent using a macro
  PRINT_INT(a); // --> printf("a"" %d\n", a)
  PRINT_INT(b); // --> printf("b"" %d\n", b)
}
