# Docker Data & Volumes Guide

A clean, readable guide you can drop directly into your Docker example
project.

------------------------------------------------------------------------

## Images vs Containers

### **Images**

-   Read-only.
-   Once built, they **cannot change**.
-   To update, you **must rebuild** the image.

### **Containers**

-   Add a thin **read-write layer** on top of the image.
-   Can modify files/folders without changing the underlying image.

However, two major issues appear when working with containers:

1.  **Data does not persist**\
    If the container is removed, all data written inside it disappears.

2.  **Host changes are not reflected**\
    If you update files on your host machine, the container won't see
    those changes unless you rebuild and restart it.

Docker solves these problems with **Volumes** and **Bind Mounts**.

------------------------------------------------------------------------

## Volumes

Volumes are folders managed **by Docker**, stored on your host.\
They map to a folder **inside the container** and allow persistent
storage.

### **Types of Volumes**

#### Anonymous Volumes

-   Created with:

    ``` bash
    -v /path/in/container
    ```

-   Removed automatically **only** if the container is started using
    `--rm`.

#### Named Volumes

-   Created with:

    ``` bash
    -v volume-name:/path/in/container
    ```

-   **Not removed automatically** → persists until manually deleted.

-   Great for databases, logs, or uploaded files.

### Why Use Volumes?

-   Data survives container deletion.
-   Data is stored on the host, not inside the ephemeral container
    layer.
-   Useful for persistent application data.

> **Note:** Docker manages volume locations---you shouldn't edit them
> directly.\
> If you need direct file access, use a **Bind Mount** instead.

------------------------------------------------------------------------

## Bind Mounts

Bind Mounts let you connect **a specific host folder** to a container
folder.

Example:

``` bash
-v /absolute/path/on/host:/path/in/container
```

### Why Use Bind Mounts?

-   Perfect for development environments.
-   Lets you edit source code on the host and see changes immediately
    inside the container.

### When *Not* to Use Them

-   Not intended for production.
-   Not ideal for long-term data persistence (use Named Volumes
    instead).

------------------------------------------------------------------------

## Key Docker Commands

### **Volumes**

``` bash
docker run -v /path/in/container IMAGE          # Anonymous Volume
docker run -v name:/path/in/container IMAGE     # Named Volume
docker volume ls                                # List all volumes
docker volume create VOL_NAME                   # Manually create a volume
docker volume rm VOL_NAME                       # Remove a volume
docker volume prune                              # Remove all unused volumes
```

### **Bind Mounts**

``` bash
docker run -v /host/path:/container/path IMAGE
```

------------------------------------------------------------------------

## When to Use What?

  -----------------------------------------------------------------------
  Use Case                                Choose
  --------------------------------------- -------------------------------
  Persist database/files even after       **Named Volume**
  container deletion                      

  Share code between host and container   **Bind Mount**
  during development                      

  Temporary storage inside container      **Anonymous Volume**

  Need to inspect files manually          **Bind Mount**
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Summary

-   **Volumes** = for persistent, Docker-managed storage.\
-   **Bind Mounts** = for local development and real-time file syncing.\
-   **Images are immutable**, **containers are disposable**, and
    **volumes are persistent**.

------------------------------------------------------------------------