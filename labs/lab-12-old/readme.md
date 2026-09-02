# Injecting Configuration into Docker Containers

In this lab we will create a simple Angular app and containerize it using Docker. We will also inject configuration from environment variables into the container.

## Build the container

Open project `container-starter` and add the following `Dockerfile`:

```dockerfile
FROM node:16 as node
LABEL author="Alexander Kastil"
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build -- -c production

##### Stage 2 - Create the run-time-image
FROM nginx:alpine
VOLUME /var/cache/nginx
# Copy from build-image to nginx base folder
COPY --from=node /app/dist/food-app /usr/share/nginx/html
# Copy nginx config
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
```

Add the nginx config file `nginx.conf` to a config folder that you create in the root of the project. It provides URL rewriting for the Angular app:

```nginx
server {
    listen 0.0.0.0:80;
    listen [::]:80;
    default_type application/octet-stream;

    gzip                    on;
    gzip_comp_level         6;
    gzip_vary               on;
    gzip_min_length         1000;
    gzip_proxied            any;
    gzip_types              text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_buffers            16 8k;
    client_max_body_size    256M;

    root /usr/share/nginx/html;

    location / {
        try_files $uri $uri/ /index.html =404;
    }
}
```


Build the container using the following command:

```bash
docker build -t food-app .
```

Run the container using the following command:

```bash
docker run -d --rm -p 5052:80 food-app
```

Connect to the container by navigating to http://localhost:5052/

## Inject config from environment variables

Download and start an existing .NET Api as a container:

```bash
docker run -d --rm -p 5051:80 alexander-kastil/food-catalog-api:1.1.0
```

Test the api by navigating to http://localhost:5051/

To be able to inject the URL to the front-end container we will update `environment.ts`:

```typescript
declare global {
  interface Window {
    env: any;
  }
}
export const environment = {
  production: true,
  api: window['env'].API_URL,
};
```

The container environments variables that you will provide will be processed by two files located in the assets folder:

env.js:

```javascript
(function (window) {
  window["env"] = window["env"] || {};
  window["env"].API_URL = "http://localhost:3000/";
})(this);
```

env.template.js:

```javascript
(function (window) {
  window["env"] = window["env"] || {};
  window["env"].API_URL = "${ENV_API_URL}";
})(this);
```

Reference env.js file in the index.html:

```html
<head>
  <meta charset="utf-8">
  <title>Food App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ...
  <script src="assets/env.js"></script>
</head>
```

Add the following line to the end of the dockerfile. It will trigger processing of the injected environment variables:
  
```dockerfile 
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
```

Rebuild the container and run it again by providing the environment variable for ENV_API_URL:

```bash
docker run -d --rm -p 5052:80 --env ENV_API_URL="http://localhost:5051/" food-app
```
