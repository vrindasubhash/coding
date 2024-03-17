#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void read_from_stdin() {
  char buffer[200];
  scanf("%199[^\n]", buffer);
  printf("pid: %d, read this '%s'\n", getpid(), buffer);
}

int main(int argc, char **argv) {
  int pipefd[2];
  int status = 0;
  int ret = 0;

  pipe(pipefd);

  ret = fork();
 
  printf("pid: %d, fork return value: %d\n", getpid(), ret);
  
  if (ret == 0) {
     close(pipefd[1]); // Close the write end of the pipe
     dup2(pipefd[0], STDIN_FILENO); // Redirect stdin to the read end of the pipe
     close(pipefd[0]); // Close the original read end of the pipe, not needed anymore
     read_from_stdin();

     return 0;  
  }
  else {
     close(pipefd[0]); // Close the read end of the pipe
     write(pipefd[1], "Hello, world\n", 13); // write to the child processes STDIN
     close(pipefd[1]); // Close the write end, causing the child to see EOF

     wait(&status);
     int exit_status = WEXITSTATUS(status);
     printf("pid: %d, exited with status: %d\n", getpid(), exit_status);
  }
  return 0;
}
