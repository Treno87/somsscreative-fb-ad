/* WSL virtioproxy 우회: bind(port=0)로 얻은 포트는 즉시 접속이 안 된다.
   포트를 명시적으로 지정하면 정상이므로, TCP/IPv4 의 자동 포트 할당만
   20000~28999 사이의 명시 포트로 바꿔치기한다. */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <errno.h>
#include <unistd.h>

static int (*real_bind)(int, const struct sockaddr *, socklen_t);

int bind(int fd, const struct sockaddr *addr, socklen_t len) {
  if (!real_bind) real_bind = dlsym(RTLD_NEXT, "bind");
  if (addr && addr->sa_family == AF_INET && len >= sizeof(struct sockaddr_in)) {
    struct sockaddr_in *in = (struct sockaddr_in *)addr;
    if (in->sin_port == 0) {
      int type = 0; socklen_t tl = sizeof(type);
      if (getsockopt(fd, SOL_SOCKET, SO_TYPE, &type, &tl) == 0 && type == SOCK_STREAM) {
        struct sockaddr_in copy = *in;
        static unsigned int next = 0;
        if (next == 0) next = (unsigned int)getpid();
        for (int i = 0; i < 3000; i++) {
          copy.sin_port = htons((unsigned short)(20000 + (next++ % 9000)));
          if (real_bind(fd, (struct sockaddr *)&copy, sizeof(copy)) == 0) return 0;
          if (errno != EADDRINUSE && errno != EACCES) break;
        }
      }
    }
  }
  return real_bind(fd, addr, len);
}
