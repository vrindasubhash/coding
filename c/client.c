#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <arpa/inet.h>
#include <unistd.h>



int main() {
  int sock = 0;
  struct sockaddr_in serv_addr; 
  char *hello = "Hello from client";
  char buffer[1024] = {0};
  
  if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
    printf("\n Socket creation error\n");
    return -1;
  }

  serv_addr.sin_family = AF_INET; // what is this
  serv_addr.sin_port = htons(8080);
 
  // convert IPv4 and IPv6 addresses from text to binary form ??
  if(inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr) <= 0) {
    printf("\nInvalid address/ Address not supported \n");
    return -1;
  }

  if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
    printf("connection failed\n");
    return -1;
  }

  send(sock, hello, strlen(hello), 0);
  printf("Hello message sent\n");
  int valread = read(sock, buffer, 1024);
  printf("Server: %s\n", buffer);
  
  close(sock);
 
  return 0;
}
