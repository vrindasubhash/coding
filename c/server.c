#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>


int main() {
  int server_fd, new_socket;
  struct sockaddr_in address;
  int addrlen = sizeof(address);
  char buffer[1024] = {0};
  const char *greeting = "Hello from server";

  // create socket file descriptor
  if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
    perror("socket failed");
    exit(EXIT_FAILURE);
  }
  
  // define the socket type ??
  address.sin_family = AF_INET;
  address.sin_addr.s_addr = INADDR_ANY;
  address.sin_port = htons(8080);

  // bind socket to the port (8080)
  if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
    perror("bind failed");
    exit(EXIT_FAILURE);
  }
  
  // listen for connections
  if (listen(server_fd, 3) < 0) {
    perror("listen");
    exit(EXIT_FAILURE);
  }

  // accept connections
  if ((new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0 ) {
    perror("accept");
    exit(EXIT_FAILURE);
  }

  // read message from client
  read(new_socket, buffer, 1024);
  printf("Message from client: %s\n", buffer);
  send(new_socket, greeting, strlen(greeting), 0);
  printf("Greeting sent to client\n");

  // close the socket
  close(new_socket);
  close(server_fd);

  return 0;
}
