FROM node:slim AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy source code and build the React app
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run script to inject environment variable (due to build time injection limitation of CRA)
COPY scripts/docker-entrypoint.sh /usr/bin/docker-entrypoint.sh
COPY public/runtime-env.js.template /usr/share/nginx/html/runtime-env.js.template
RUN chmod +x /usr/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
