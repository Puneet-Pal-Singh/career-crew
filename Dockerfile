# Dockerfile

# --------------------------------------------------------------------
# Stage 1: Base (Common setup)
# --------------------------------------------------------------------
FROM node:23-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl dumb-init

# --------------------------------------------------------------------
# Stage 2: Dependencies (Install and cache ALL dependencies)
# --------------------------------------------------------------------
FROM base AS deps
WORKDIR /app 
COPY package.json package-lock.json* ./
RUN npm ci
# At this point, /app/node_modules exists in this 'deps' stage

# --------------------------------------------------------------------
# Stage 3: Builder (Build the Next.js app and generate Prisma client for production)
# --------------------------------------------------------------------
FROM base AS builder
WORKDIR /app 
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --------------------------------------------------------------------
# Stage 4: Production Runner (Final lean image)
# --------------------------------------------------------------------
FROM base AS runner
WORKDIR /app 
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./.prisma
# Add prisma schema if needed at runtime, though typically not for client operations
# COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma


USER nextjs
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]

# --------------------------------------------------------------------
# Stage 5: Development (This is what your docker-compose.yml will target)
# --------------------------------------------------------------------
FROM base AS development
WORKDIR /app # WORKDIR is /app
ENV NODE_ENV development

# Option 1: Copy pre-built node_modules from 'deps' stage (SHOULD WORK)
COPY --from=deps /app/node_modules ./node_modules 

# Then copy your application code, which includes prisma/schema.prisma
COPY . .

# Generate Prisma Client AFTER all source code (including schema.prisma) is copied
# This ensures the client in the image is up-to-date with the schema in the image.
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]