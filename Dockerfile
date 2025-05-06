# Dockerfile

# --------------------------------------------------------------------
# Stage 1: Base (Common setup)
# --------------------------------------------------------------------
FROM node:23-alpine AS base
WORKDIR /app
# Install system dependencies needed for some npm packages (e.g., Prisma, bcrypt)
# Add dumb-init for proper signal handling
RUN apk add --no-cache openssl dumb-init

# --------------------------------------------------------------------
# Stage 2: Dependencies (Install and cache ALL dependencies)
# --------------------------------------------------------------------
FROM base AS deps
# Copy only package.json and lock file to leverage Docker cache
COPY package.json package-lock.json* ./
# Install all dependencies (devDependencies are needed for `prisma generate` and `next build`)
RUN npm ci
# After npm ci, node_modules is populated here.

# --------------------------------------------------------------------
# Stage 3: Builder (Build the Next.js app and generate Prisma client)
# --------------------------------------------------------------------
FROM base AS builder
# Set NODE_ENV for build optimizations
ENV NODE_ENV=production
# Copy pre-built node_modules from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .
# Generate Prisma client using the installed dependencies
RUN npx prisma generate
# Build the Next.js application (output: 'standalone' requires this in next.config.mjs)
RUN npm run build

# --------------------------------------------------------------------
# Stage 4: Production Runner (Final lean image)
# --------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
# Create a non-root user and group for security
# Using fixed UID/GID for better reproducibility
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

# Copy only necessary artifacts from the 'builder' stage
# Using --chown to set ownership to the non-root user
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# The .next/static content should be part of .next/standalone,
# but if not, you might need to copy it explicitly:
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs
# Set working directory for the non-root user
WORKDIR /app

EXPOSE 3000

# Use dumb-init as the entrypoint to handle signals correctly
# Use JSON array format for CMD for better signal handling and to avoid shell processing
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
# server.js is part of the .next/standalone output
CMD ["node", "server.js"]

# --------------------------------------------------------------------
# Stage 5: Development (This is what your docker-compose.yml will target)
# Based on your original development stage setup
# --------------------------------------------------------------------
FROM base AS development
ENV NODE_ENV=development
# Copy package.json and lock file (these are already in 'base' or 'deps' layers if not changed)
# COPY package.json package-lock.json* ./
# If dependencies are already installed in 'deps' stage, we can copy them
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of your application code (will be overlaid by volume mount)
COPY . .
# Expose the port Next.js runs on
EXPOSE 3000
# Default command to run the development server
# Use JSON array format for CMD
CMD ["npm", "run", "dev"]