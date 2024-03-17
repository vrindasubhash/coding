#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main(int argc, char **argv) {
  int status = 0;
  int ret = 3;
  ret = fork();
 
  printf("pid: %d, fork return value: %d\n", getpid(), ret);

  if (ret == 0){ 
     printf("pid: %d, going to sleep\n", getpid());
     sleep(5);
     printf("pid: %d, done sleeping\n", getpid());
     exit(5);  
  }
  else {
     printf("pid: %d, waiting\n", getpid());
     wait(&status);
     printf("pid: %d, done waiting\n", getpid());
     int exit_status = WEXITSTATUS(status);
     printf("pid: %d, exited with status: %d\n", getpid(), exit_status);
  }
  return 0;
}
