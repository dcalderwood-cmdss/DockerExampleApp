# Bind Mount Guide (Windows PowerShell)

Bind mounts let you edit code on your host and see changes immediately inside a running container—ideal for local development.

## 1. Prerequisites
- Docker Desktop running
- Dependencies installed locally (optional but helpful)
- `nodemon` added as a dev dependency (already in `package.json`)

Install dev dependencies if missing:
```powershell
npm install
```

## 2. Manual Run with Bind Mount
Run the container mapping your current working directory into `/app` and using `nodemon` for auto-restart:
```powershell
docker build -t feedback-node .

docker run -it --rm -p 3000:80 `
  -v ${PWD}:/app `
  -w /app `
  --name feedback-dev feedback-node `
  npm run dev
```
Explanation:
- `-v ${PWD}:/app`: Mount host project folder into container path `/app`.
- `-w /app`: Ensure working directory inside container.
- `npm run dev`: Uses `nodemon` to watch file changes.
- `--rm`: Container removed automatically when stopped.

## 3. Avoid Overwriting node_modules
Mounting the whole project can hide container-installed dependencies if you later add them only inside the image. To avoid issues:
- Keep dependencies installed on host OR
- Use an anonymous volume for `/app/node_modules` (compose example below).

## 4. Using docker-compose (Recommended)
File: `docker-compose.dev.yml`
```yaml
version: '3.9'
services:
  app:
    build: .
    container_name: feedback-app-dev
    ports:
      - "3000:80"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - PORT=80
    command: npm run dev
    restart: unless-stopped
```
Run with:
```powershell
docker compose -f docker-compose.dev.yml up --build
```
Stop:
```powershell
docker compose -f docker-compose.dev.yml down
```

## 5. Editing & Hot Reload
Change any `.js`, `.css`, or view file—`nodemon` restarts automatically.

## 6. Common Issues
| Problem | Cause | Fix |
|---------|-------|-----|
| Changes not reflected | Container not using bind mount | Re-run with `-v ${PWD}:/app` or compose volume |
| Permission denied | Host FS metadata mismatch | Try running as root (default), or remove restrictive ACLs |
| Missing dependencies | node_modules overwritten by host | Install locally (`npm install`) or use `/app/node_modules` anonymous volume |
| High CPU usage | Many watch events | Configure `nodemon.json` to ignore directories |

## 7. Optional: nodemon Configuration
Create `nodemon.json` (if needed):
```json
{
  "watch": ["."],
  "ignore": ["public", "node_modules"],
  "ext": "js,json,css,html"
}
```
Container will pick it up automatically.

## 8. Quick Commands Recap
```powershell
# Manual bind mount dev run
docker run -it --rm -p 3000:80 -v ${PWD}:/app -w /app --name feedback-dev feedback-node npm run dev

# Compose dev up (rebuild if Dockerfile changed)
docker compose -f docker-compose.dev.yml up --build

# Stop compose
docker compose -f docker-compose.dev.yml down
```

## 9. Switching Back to Production Mode
Use the regular run (no bind mount, just the built image):
```powershell
docker build -t feedback-node .
docker run -d -p 3000:80 --name feedback-app --rm feedback-node
```

---
For additional tweaks (multi-stage build, healthcheck), integrate after confirming dev flow works.
