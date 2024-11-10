# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install libc6-compat for SWC binary dependencies
RUN apk add --no-cache libc6-compat

# Copy package.json, package-lock.json, and tsconfig.json
COPY package.json package-lock.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application with TypeScript
RUN npm run build

# Stage 2: Serve the application using a lightweight environment
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/tsconfig.json ./

# Install only production dependencies
RUN npm install --production

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]


# commands
# docker build -t jokes-frontend-nextjs .
# docker run -d --env-file .env -p 3000:3000 jokes-frontend-nextjs

# docker ps -a
# Stop the Running Containers: docker stop deabf4792901
# Remove the Stopped Container: docker rm deabf4792901