# Docker Command Cheat Sheet (Windows PowerShell)

Concise list of common Docker commands for daily use. All commands are PowerShell-compatible. Use backticks (`) for line continuations if needed.

---
## 1. Version & System
```powershell
docker --version       # Show Docker CLI version
docker info            # System-wide info (storage driver, containers, images)
```

## 2. Images
```powershell
docker images                  # List images
docker image ls                # Same as above
docker pull node:20-alpine     # Pull image
docker build -t app:latest .   # Build image from Dockerfile in current dir
docker build -t app:1.0.0 .    # Build with version tag
docker rmi app:1.0.0           # Remove an image
docker image prune -f          # Remove dangling images
docker save -o app.tar app:1.0.0    # Export image to tar
docker load -i app.tar              # Load image from tar
```

## 3. Containers (Lifecycle)
```powershell
docker ps                    # Running containers
docker ps -a                 # All containers (including stopped)
docker run -d -p 8080:80 --name app app:latest   # Run detached

docker stop app              # Graceful stop
docker kill app              # Force stop
docker restart app           # Restart

docker rm app                # Remove container
docker rm -f app             # Force remove (stop + remove)
docker container prune -f    # Remove all stopped containers
```

## 4. Run Variants
```powershell
docker run -it --name app-dev app:latest sh   # Interactive shell

docker run -d --rm -p 3000:3000 app:latest    # Auto-remove on stop

docker run -e PORT=3000 -p 3000:3000 app:latest    # Environment variable

docker run -v ${PWD}:/app -w /app app:latest       # Bind mount working dir
```

## 5. Logs & Output
```powershell
docker logs app                    # Container logs
docker logs -f app                 # Follow logs
docker logs --tail 100 app         # Last 100 lines
```

## 6. Exec (Inside Running Container)
```powershell
docker exec -it app sh             # Interactive shell (Linux base)
docker exec -it app powershell     # If Windows container

docker exec app node -v            # Run a single command
```

## 7. Inspect & Metadata
```powershell
docker inspect app                 # Full JSON metadata
docker inspect --format '{{.State.Status}}' app   # Status only
docker stats                       # Live CPU/mem usage

docker top app                     # Processes inside container
```

## 8. Copy Files To/From Container
```powershell
docker cp app:/app/logs ./logs_backup      # From container to host
docker cp ./config.json app:/app/config.json   # From host to container
```

## 9. Tag & Push (Registry)
```powershell
docker tag app:latest myuser/app:latest   # Add repository tag
docker login                              # Authenticate

docker push myuser/app:latest             # Push to Docker Hub
docker pull myuser/app:latest             # Pull from registry
```

## 10. Volumes (Persistent Data)
```powershell
docker volume create app_data            # Create named volume
docker run -d -v app_data:/app/data app:latest   # Use volume

docker volume ls                         # List volumes
docker volume inspect app_data           # Inspect volume

docker volume rm app_data                # Remove volume (data lost)
docker volume prune -f                   # Remove all unused volumes
```

## 11. Networks
```powershell
docker network ls                        # List networks
docker network create app_net            # Create network

docker run -d --name db --network app_net postgres:16-alpine

docker run -d --name api --network app_net app:latest

docker network inspect app_net           # Inspect network

docker network rm app_net                # Remove network
docker network prune -f                  # Remove unused networks
```

## 12. Prune / Cleanup (CAUTION)
```powershell
docker system df                # Disk usage summary
docker system prune             # Interactive prune

docker system prune -f          # Non-interactive

docker system prune -a          # Remove ALL unused images (not just dangling)
```

## 13. Compose (If docker-compose installed)
```powershell
docker compose version                # Check version
docker compose up -d                  # Start services (from docker-compose.yml)
docker compose ps                     # List services
docker compose logs -f                # Follow logs

docker compose exec api sh           # Exec into a service

docker compose down                   # Stop & remove containers/networks

docker compose down --volumes         # Also remove named volumes
```

## 14. Build Optimization Tips
```powershell
# Use explicit tags
FROM node:20-alpine
# Use multi-stage builds for smaller production images
# Copy package*.json separately for layer caching
```

## 15. Common One-Liners
```powershell
docker ps -q | ForEach-Object { docker stop $_ }          # Stop all running

docker ps -aq | ForEach-Object { docker rm -f $_ }        # Remove all containers

docker images -q | ForEach-Object { docker rmi -f $_ }    # Remove all images (danger)
```

## 16. Troubleshooting Quick Checks
```powershell
docker logs app --tail 50          # Recent error context

docker inspect app | Select-String -Pattern "IPAddress"   # Find container IP

docker events                      # Real-time event stream
```

## 17. Security / Scan (If available)
```powershell
docker scout quickview app:latest    # Basic vulnerability scan (Docker Scout)
```

## 18. Useful Filters
```powershell
docker ps --filter "status=exited"          # Only exited containers
docker images --filter "dangling=true"      # Only dangling images

docker ps --filter "name=api"               # Containers with name match
```

## 19. Formatting Examples
```powershell
docker inspect --format '{{.Config.Image}}' app      # Show image name used

docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' app   # IP address
```

## 20. Cheat Group (Minimal Essentials)
```powershell
# Build & run
docker build -t app .
docker run -d -p 8080:80 --name app app
# Logs & shell
docker logs -f app
docker exec -it app sh
# List & clean
docker ps -a
docker stop app; docker rm app
```

---
Use this as a quick-access reference. Tailor tags and names to your project. For destructive commands (prune/rmi), double-check before execution.