# Dockerfile

# 1. Base Image: Use an official Node.js LTS version on Alpine Linux for smaller size
FROM node:23-alpine AS base

# Set working directory
WORKDIR /app

# Install necessary dependencies for Prisma (needed for schema generation/migration later if done in container)
# and potentially other native modules. Adjust if needed.
RUN apk add --no-cache openssl

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# --------------------------------------------------------------------
# Development Stage
# --------------------------------------------------------------------
FROM base AS development

# Set NODE_ENV to development
ENV NODE_ENV=development

# Install all dependencies (including devDependencies)
# Using npm ci is generally faster and safer for CI/CD, but npm install works fine for dev
RUN npm install

# Copy the rest of the application code
# Note: We will use volumes in docker-compose to mount the code for hot-reloading,
# but copying it here helps with caching layers if dependencies don't change.
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Default command to run the development server
CMD ["npm", "run", "dev"]

# --------------------------------------------------------------------
# Optional: Production Build Stage (Good practice to define, even if not used for local dev compose)
# We'll use this structure later for production deployments.
# --------------------------------------------------------------------
# FROM base AS builder
#
# ENV NODE_ENV production
#
# # Install *only* production dependencies
# RUN npm ci --only=production
#
# # Copy the rest of the application code
# COPY . .
#
# # Build the Next.js application
# RUN npm run build
#
# # --------------------------------------------------------------------
# # Production Runner Stage
# # --------------------------------------------------------------------
# FROM base AS production
#
# ENV NODE_ENV production
#
# # Create a non-root user for security
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
#
# # Copy built artifacts from the builder stage
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/public ./public
#
# USER nextjs
#
# EXPOSE 3000
#
# # Command to run the production server
# CMD ["npm", "start"]