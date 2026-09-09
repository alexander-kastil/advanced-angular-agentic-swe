FROM ubuntu:24.04

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        openssh-server systemd systemd-sysv sudo iproute2 ca-certificates curl gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /run/sshd && systemctl enable ssh

COPY keys/box_key.pub /root/.ssh/authorized_keys
RUN chmod 700 /root/.ssh && chmod 600 /root/.ssh/authorized_keys

CMD ["/sbin/init"]
