# Docker FAQ (Windows PowerShell)

A quick, practical Q&A for common Docker issues in this Node.js app. Commands are PowerShell-friendly.

---
## Why do I get "pull access denied for <image>"?
You don’t have a local image with that name/tag, and Docker tried to pull it from a registry.

Fix:
```powershell
# Build the image locally with the expected name/tag
docker build -t feedback-node .
# Then run it
docker run -d -p 3000:80 --name feedback-app --rm feedback-node
```
Or tag an existing image:
```powershell
docker images
docker tag <IMAGE_ID> feedback-node:latest
```

## Port already in use / port binding fails
Another process or container is using the host port.
```powershell
# See running containers
docker ps
# Stop/remove the conflicting container
docker rm -f <NAME_OR_ID>
# Or pick a different host port
docker run -d -p 8080:80 --name app --rm feedback-node
```

## Container starts then exits immediately
Your process may crash or exit. Check logs:
```powershell
docker logs --tail 200 <NAME_OR_ID>
```
If it’s a command issue, try an interactive shell:
```powershell
docker run -it --rm feedback-node sh
```

## My code changes don’t show up
Images are immutable—you must rebuild or use a bind mount.
```powershell
# Rebuild image
docker build -t feedback-node .

# Or run with live-reload (requires nodemon)
npm install --save-dev nodemon

docker run -it --rm -p 3000:80 `
  -v ${PWD}:/app `
  -w /app `
  --name feedback-dev feedback-node `
  npx nodemon server.js
```

## How do I see logs and attach to a container?
```powershell
# Follow logs
docker logs -f feedback-app
# Exec into a running container shell
docker exec -it feedback-app sh
```

## What’s the difference between EXPOSE and -p?
- `EXPOSE 80` documents the container’s internal port.
- `-p 3000:80` maps host port 3000 to container port 80 so you can reach it at http://localhost:3000.

## How do I pass environment variables?
```powershell
# Inline
docker run -d -p 3000:3000 -e PORT=3000 --name app --rm feedback-node

# From a file (create .env)
docker run -d -p 3000:3000 --env-file .env --name app --rm feedback-node
```
Read them in Node.js via `process.env.VAR`.

## How do I persist app data?
Use volumes:
```powershell
# Named volume
docker volume create app_data

docker run -d -p 3000:80 --name app --rm `
  -v app_data:/app/data `
  feedback-node
```

## Bind mounts on Windows: path tips
Use `${PWD}` to mount the current directory. For multi-line commands, use backticks:
```powershell
docker run -it --rm -p 3000:80 `
  -v ${PWD}:/app `
  -w /app `
  --name app feedback-node sh
```
If you see permission issues, try running as root in dev or adjust file ownership in the image.

## How do I clean up disk space?
```powershell
# Remove stopped containers
docker container prune -f
# Remove dangling images
docker image prune -f
# Aggressive: remove ALL unused data (CAUTION)
docker system prune -a
```

## Rebuild without using cache
```powershell
docker build --no-cache -t feedback-node .
```

## How do I tag and push to Docker Hub?
```powershell
docker login

docker tag feedback-node:latest myuser/feedback-node:latest

docker push myuser/feedback-node:latest
```
Pull later:
```powershell
docker pull myuser/feedback-node:latest
```

## HEALTHCHECK keeps failing
Make sure the app is listening and the check targets the right port/path.
Example healthcheck (in Dockerfile):
```Dockerfile
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:80/health || exit 1
```
Add a `/health` route in your app that returns 200 OK.

## docker compose vs docker-compose
Newer Docker uses the `docker compose` subcommand (space), replacing the older `docker-compose` binary.
```powershell
docker compose version
# Start services
docker compose up -d
# Stop and remove
docker compose down
```

## Container name is already in use
A stopped container with the same name still exists.
```powershell
docker rm -f feedback-app
```

## How do I find a container’s IP or status quickly?
```powershell
# Status only
docker inspect --format '{{.State.Status}}' feedback-app
# IP (for user-defined networks)
docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' feedback-app
```

## Common one-liners
```powershell
# Stop all running
docker ps -q | ForEach-Object { docker stop $_ }
# Remove all containers
docker ps -aq | ForEach-Object { docker rm -f $_ }
# Remove all images (danger)
docker images -q | ForEach-Object { docker rmi -f $_ }
```

---
Need an FAQ entry added? Open an issue or ping me and I’ll expand this file.
