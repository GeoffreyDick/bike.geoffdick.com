ARG VARIANT="20"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

ENV BUN_INSTALL=/bun
RUN sudo mkdir -p ${BUN_INSTALL} \
    && curl -fsSL https://bun.sh/install | bash

ENV PATH=${BUN_INSTALL}/bin:${PATH}
