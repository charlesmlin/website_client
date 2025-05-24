###############
# Build stage #
###############
FROM node:slim AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build the React app
COPY . .
RUN npm run build

####################
# Production stage #
####################
FROM nginx:alpine

WORKDIR /app

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Prepare script to inject environment variable (due to build time injection limitation of Vite)
COPY scripts/docker-entrypoint.sh /usr/bin/
COPY public/runtime-env.js.template /usr/share/nginx/html/runtime-env.js.template
RUN chmod +x /usr/bin/docker-entrypoint.sh

# Expose port
EXPOSE 80

# Start the application
ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
