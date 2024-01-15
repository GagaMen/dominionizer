FROM node:20-bookworm-slim

# Install basic development tools
RUN apt update && apt install -y sudo openssh-server git vim wget

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && apt install -y ./google-chrome-stable_current_amd64.deb

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Install additional tools for devcontainer template development
RUN npm install -g @devcontainers/cli

# Install angular cli
RUN npm install -g @angular/cli
