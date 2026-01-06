FROM oven/bun:1.3.5

# Create a non-root user
RUN useradd -m -s /bin/bash developer

# Switch to the non-root user
USER developer

# Set working directory to the user's home
WORKDIR /home/developer
