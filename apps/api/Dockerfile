FROM node:20-alpine AS base

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

WORKDIR /app
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build everything needed for api
RUN pnpm --filter @duwitch/api exec prisma generate
RUN pnpm --filter @duwitch/api... build

# In a production setting, you'd prune devDependencies or use a multi-stage build,
# but for the CI to pass and run locally easily we can just start it here.
EXPOSE 3001
CMD [ "pnpm", "--filter", "@duwitch/api", "start" ]
