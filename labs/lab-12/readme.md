# Deploy the Workbench to an Ubuntu Box over SSH

Everything so far runs on `localhost:4200` against a container started by hand. Shipping it means
a Linux host you operate: a deploy user, Docker installed from its own repository, both images
carried over SSH with no registry in sight, a Caddy edge that owns TLS and puts the API and the
app on one origin, and a redeploy loop handed to an agent that reads a manifest rather than
remembering this conversation.

The target is a container running `sshd` on your own machine, standing in for a VM, so this lab
needs no cloud account. Every command you and the agent run against it is the command you would
run against a real host: moving to one means swapping `-p 2222 ... deploy@localhost` for
`deploy@<public-ip>` and dropping the two `KnownHosts` options.

------

Work in [`l12-secrets-vault-starter/`](./l12-secrets-vault-starter/). Everything this lab adds
goes into a new `deploy/` folder and a `.claude/agents/` folder inside the app. The finished
result is in [`l12-secrets-vault-solution/`](./l12-secrets-vault-solution/).

Host ports 2222, 8080 and 8443 must be free. Launch `claude` inside the app folder for this lab
rather than at the repository root: step 5 writes a subagent, and `.claude/agents/` loads from the
directory the session was launched in.

```bash
cd labs/lab-12/l12-secrets-vault-starter
npm install
claude
```

---

## Step 1: Build the throwaway Ubuntu target

Overview: a deployment target starts with a base image nobody has run. Standing it up first means
a failure here costs one command rather than a whole stack, and the key goes into the image at
build time because `sshd` refuses an `authorized_keys` file that a Windows bind mount makes
group-writable.

```bash
mkdir -p deploy/target-box/keys
ssh-keygen -t ed25519 -f deploy/target-box/keys/box_key -N "" -C "box-lab"
```

Recipe:

```text
Create a throwaway Ubuntu SSH target for this lab.

1. deploy/target-box/Dockerfile from ubuntu:24.04. Install openssh-server, systemd,
   systemd-sysv, sudo, iproute2, ca-certificates, curl and gnupg with
   DEBIAN_FRONTEND=noninteractive, clean the apt lists, create /run/sshd, enable the ssh
   service, COPY keys/box_key.pub to /root/.ssh/authorized_keys with 700 on the directory and
   600 on the file, and CMD ["/sbin/init"].

2. deploy/target-box/docker-compose.yml with one service named box: build ., container_name
   box-target, privileged true, tmpfs /run and /run/lock, a named volume box-docker at
   /var/lib/docker, and ports 2222:22, 8080:80 and 8443:443.

Do not add a healthcheck and do not start anything.
```

Bring it up and prove you can get in before anything else exists. `IdentitiesOnly=yes` is not
cosmetic: without it `ssh` offers every key in your agent first and the server cuts you off after
`MaxAuthTries` with a perfectly correct key in hand.

```bash
cd deploy/target-box && docker compose up -d --build && cd ../..
export BOX='ssh -p 2222 -i deploy/target-box/keys/box_key -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'
$BOX root@localhost 'whoami; . /etc/os-release && echo $PRETTY_NAME'
```

Expected Outcome:

```text
root
Ubuntu 24.04.4 LTS
```

Keep this terminal: the shell variable lives only in it. The two `KnownHosts` options are here
only because this box gets a new host key on every rebuild; never carry them to a real host.

---

## Step 2: Bootstrap the box

Overview: a deploy user without sudo, Docker Engine from Docker's own repository, and a stack
directory that user owns. All of it happens while root SSH still works, so a mistake costs a
command rather than a rebuild.

Recipe:

```text
Bootstrap the box over the SSH command in $BOX, running apt with DEBIAN_FRONTEND=noninteractive.

1. Create user deploy with --disabled-password and no sudo, and copy
   /root/.ssh/authorized_keys to /home/deploy/.ssh/authorized_keys owned deploy:deploy, 700 on
   the directory and 600 on the file.
2. apt-get update, then install ufw, fail2ban, unattended-upgrades, ca-certificates, curl
   and gnupg.
3. Install Docker Engine from the official Docker apt repository, not the get.docker.com
   script: the GPG key under /etc/apt/keyrings, the repository for this Ubuntu codename, then
   docker-ce, docker-ce-cli, containerd.io, docker-buildx-plugin and docker-compose-plugin.
   Enable and start docker.
4. Before anything runs on it, write /etc/docker/daemon.json containing
   { "storage-driver": "vfs" } and restart docker. Overlay on overlay is not supported, so a
   nested daemon fails its first container run without this.
5. Add deploy to the docker group and create /opt/secrets-vault owned by deploy:deploy.

Do not touch the SSH configuration or the firewall.
```

Check the claims against the host rather than the transcript:

```bash
$BOX root@localhost 'id deploy; stat -c "%a %U:%G %n" /home/deploy/.ssh/authorized_keys; docker compose version; docker info --format "{{.Driver}}"; systemctl is-enabled docker; id -nG deploy; ls -ld /opt/secrets-vault'
```

Expected Outcome: seven answers whose shape is fixed even though the version numbers are not:

```text
uid=1001(deploy) ... groups=1001(deploy),997(docker)
600 deploy:deploy /home/deploy/.ssh/authorized_keys
Docker Compose version v5.5.1
vfs
enabled
deploy users docker
drwxr-xr-x 2 deploy deploy ... /opt/secrets-vault
```

`vfs` is a laptop-only concession. A real VM keeps its default `overlay2`; never carry that
`daemon.json` to one.

---

## Step 3: Ship both images without a registry

Overview: the workbench is an SSR Node app and the vault is the given API container. Both have to
reach the box, and before a registry exists the only transport is the SSH connection you already
proved.

Recipe:

```text
Write a Dockerfile in the app folder with two stages: a node:22-alpine build stage running
npm ci and npm run build, and a node:22-alpine final stage copying only
dist/l12-secrets-vault and package.json, with NODE_ENV production, PORT 4000, EXPOSE 4000, a
HEALTHCHECK wgetting /login, and CMD node dist/l12-secrets-vault/server/server.mjs. Comment the
COPY whose reason is not obvious. Add a .dockerignore covering node_modules, dist, .angular,
test-results, playwright-report and e2e.

Then change the API_BASE factory in src/app/shared/api-base.ts so the server branch reads
process.env['VAULT_API_ORIGIN'] and falls back to http://localhost:5093, and pass
trustProxyHeaders: true to the AngularNodeAppEngine constructor in src/server.ts, because Caddy
terminates TLS and forwards. Add vault.box.test and vault.box.test:8443 to the allowedHosts in
angular.json.
```

```bash
docker build -t secrets-workbench:v1 .
export DEPLOY='ssh -p 2222 -i deploy/target-box/keys/box_key -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no deploy@localhost'
docker save secrets-workbench:v1 | gzip -1 | $DEPLOY 'docker load'
docker save secrets-vault-mcp:local | gzip -1 | $DEPLOY 'docker load'
$DEPLOY 'docker images --format "{{.Repository}}:{{.Tag}}"'
```

Expected Outcome: both images land and the box lists them:

```text
Loaded image: secrets-workbench:v1
Loaded image: secrets-vault-mcp:local
```

The tag you shipped and the tag the compose file names must be identical. Ship `:v1` and write
`:latest` in step 4 and Compose treats it as an image it does not have, tries to pull from Docker
Hub, and fails on a repository that does not exist.

---

## Step 4: Put a Caddy edge in front of both

Overview: one origin removes CORS, removes the preflight on every call, and removes the API
hostname from the bundle. It is also what lets the server-side render reach the API by service
name instead of by a public address.

Recipe:

```text
Write deploy/docker-compose.yml with three services on one network named edge.

vault-api runs secrets-vault-mcp:local with Auth__Enabled true and
Cors__AllowedOrigins__0 https://vault.box.test, exposes 5093 and has a curl healthcheck on
/health. workbench runs secrets-workbench:v1 with PORT 4000 and
VAULT_API_ORIGIN http://vault-api:5093, exposes 4000 and has a wget healthcheck on /login.
caddy runs caddy:2-alpine, publishes 80 and 443, mounts ./Caddyfile read only plus named volumes
caddy_data at /data and caddy_config at /config. Only caddy publishes ports.

Write deploy/Caddyfile for vault.box.test with tls internal, zstd and gzip encoding, and three
handle blocks: /api/* and /health reverse proxied to vault-api:5093, everything else to
workbench:4000. Comment the tls line saying a real host drops it.

Then copy both files to /opt/secrets-vault on the box with scp and run docker compose up -d there.
```

Expected Outcome: three containers, and only the edge holds a host port:

```text
secrets-caddy      Up   0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
secrets-workbench  Up (healthy)   4000/tcp
secrets-vault-api  Up (healthy)   5093/tcp
```

---

## Step 5: Prove the hostname without DNS, then hand the loop over

Overview: `curl --resolve` supplies the address a hostname would resolve to, so an edge can be
proven live before any DNS record exists. Once you have run the loop by hand you know what every
check should say, which is the right moment to delegate it.

```bash
$DEPLOY 'docker exec secrets-caddy cat /data/caddy/pki/authorities/local/root.crt' > deploy/box-local-ca.crt
CA=deploy/box-local-ca.crt
curl -s --ssl-revoke-best-effort --cacert $CA --resolve 'vault.box.test:8443:127.0.0.1' -o /dev/null -w '%{http_code}\n' https://vault.box.test:8443/login
curl -s --ssl-revoke-best-effort --cacert $CA --resolve 'vault.box.test:8443:127.0.0.1' https://vault.box.test:8443/health
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/
echo | openssl s_client -connect 127.0.0.1:8443 -servername vault.box.test 2>/dev/null | openssl x509 -noout -issuer -ext subjectAltName
```

`--ssl-revoke-best-effort` is on every `--cacert` call because the Windows `curl.exe` is built
against Schannel, which treats an unreachable revocation list as a verification failure, and
Caddy's local CA publishes none. Without it every call returns `000` with no explanation.

Recipe:

```text
Create two files.

deploy/manifest.json holds every host fact: host, sshPort, user, keyFile, stackPath, hostname,
edgeHttpsPort, caCertFile, the two image names, and a checks array naming the four assertions:
GET /login returns 200 and contains Sign in, GET /health returns Healthy, GET /api/lists returns
401 without a token, and GET /status is server rendered and contains Healthy.

.claude/agents/ssh-deploy-agent.md is a subagent with Read and Bash only. Its body says it reads
the manifest first and takes no host fact from the conversation, that the loop is build with an
explicit tag, ship with docker save piped through ssh docker load, update the tag in the stack's
compose file and compose up, then run every check from the manifest with curl --resolve. It
never edits the host's SSH or firewall configuration, and it never reports success on an HTTP
status alone.
```

Expected Outcome: TLS verifies against the box's own CA, the API refuses an unauthenticated call,
and a request with no matching hostname never reaches the app:

```text
/login              200
/health             Healthy
/api/lists          401 without a token, 200 with a token from /api/auth/login
http://127.0.0.1:8080/   308
issuer              CN=Caddy Local Authority - ECC Intermediate
SAN                 DNS:vault.box.test
```

On a real VM one line changes: delete `tls internal`, point an A record at the box, and the same
site block gets a publicly trusted certificate. Never add a hostname's site block before that
record resolves; failed validations are rate limited and the backoff outlives the fix.

---

## Step 6: Redeploy through the agent and prove the new build is live

Overview: a stack still serving the previous build answers `200` for every request. The only check
that can tell the difference asserts content, which is why the manifest names strings and not
status codes.

Recipe:

```text
Change one visible string in the app, for example the Vault status heading, then delegate to the
ssh-deploy-agent: build and ship tag v2 and redeploy the stack.

Before it ships, have it read the current live heading through the edge, and after the deploy have
it read the same heading again. Report both values, the compose output, and every check from the
manifest with its result.
```

Expected Outcome: the heading changes, which is the proof no status code could give:

```text
before  Vault status
after   Vault status v3
/login  200
```

Tear the box down when you are finished. This removes the target, both images on it and the
Caddy volumes; nothing in the app folder depends on it.

```bash
cd deploy/target-box && docker compose down -v
```

---

## Where the course leaves you

The workbench is twelve labs of Angular 22 and one harness that built it: five MCP servers, a
design system generated once and read ever since, a subagent that owns Angular work, a hook that
refuses the syntax this course does not use, specs proven by mutation, tools an agent may call and
a short list it may not, and an image running on a Linux host behind TLS on one origin.
