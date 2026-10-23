# Install dependencies only when needed
FROM node:24-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install BASH to make our lives easier for entrypoint.sh...
RUN apk add bash

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:24-alpine AS builder

# Install BASH to make our lives easier for entrypoint.sh...
RUN apk add bash

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


RUN npm run build

# Production image, copy all the files and run next
FROM node:24-alpine AS runner

# Install BASH to make our lives easier for entrypoint.sh...
RUN apk add bash

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

############
# Permissions to write files when executing entrypoint
RUN chown -R nextjs:nodejs /app

# Handle Entrypoint
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
############

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
