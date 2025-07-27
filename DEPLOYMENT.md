# Deployment Guide

This guide covers secure deployment of the LLM Chat application with your DeepSeek API key.

## Quick Start with Docker

### Option 1: Using the Build Script (Recommended)

1. **Prepare your API key**:

   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env with your actual API keys
   nano .env  # or use your preferred editor
   ```

2. **Build the secure image**:

   ```bash
   # Make the script executable (if not already done)
   chmod +x docker-build.sh
   
   # Build and validate environment file
   ./docker-build.sh --env-file .env
   ```

3. **Run the container**:

   ```bash
   docker run -d \
     --name llm-chat \
     -p 3000:3000 \
     --env-file .env \
     llm-chat:latest
   ```

### Option 2: Using Docker Compose

1. **Set up environment**:

   ```bash
   # Copy and edit the environment file
   cp .env.example .env
   # Edit .env with your API keys
   ```

2. **Deploy with Docker Compose**:

   ```bash
   # Build and start the service
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop the service
   docker-compose down
   ```

### Option 3: Manual Docker Build

1. **Build the image**:

   ```bash
   docker build -t llm-chat:latest .
   ```

2. **Run the container**:

   ```bash
   docker run -d \
     --name llm-chat \
     -p 3000:3000 \
     -e DEEPSEEK_API_KEY="your-api-key-here" \
     llm-chat:latest
   ```

## Security Best Practices

### API Key Management

1. **Runtime-only API keys** ✅
   - API keys are NOT embedded in the Docker image
   - Keys are provided only at container runtime
   - No secrets in build logs or image layers

2. **Never commit API keys to version control**
   - Use `.env` files (already in `.gitignore`)
   - Use environment variables or secrets management

3. **For production deployments**:

   ```bash
   # Use Docker secrets or Kubernetes secrets
   # Consider using CI/CD pipeline variables
   # Rotate keys regularly
   ```

4. **Container security**:
   - Run as non-root user (already configured)
   - Use specific image tags, not `latest` in production
   - Regularly update base images

### Environment-Specific Configurations

#### Development

```bash
# Use .env.local for development
cp .env.example .env.local
# Edit with development API keys
npm run dev
```

#### Production

```bash
# Use production secrets management
# Example with Docker Swarm secrets:
echo "your-api-key" | docker secret create deepseek_api_key -
```

## Troubleshooting

### Common Issues

1. **API key not working**:
   - Verify the key format (starts with `sk-`)
   - Check key permissions and quotas
   - Ensure the key is properly set in environment

2. **Container won't start**:
   ```bash
   # Check logs
   docker logs llm-chat
   
   # Check if port is available
   netstat -tlnp | grep 3000
   ```

3. **Health check failing**:
   ```bash
   # Test the health endpoint
   curl http://localhost:3000/api/chat
   ```

### Verification Steps

1. **Check container status**:
   ```bash
   docker ps
   docker logs llm-chat
   ```

2. **Test the application**:
   ```bash
   # Health check
   curl http://localhost:3000/api/chat
   
   # Access the web interface
   open http://localhost:3000
   ```

3. **Monitor resource usage**:
   ```bash
   docker stats llm-chat
   ```

## Production Deployment Recommendations

### Resource Requirements
- **CPU**: 1-2 cores minimum
- **RAM**: 1GB minimum, 2GB recommended
- **Storage**: 500MB for image, plus logs
- **Network**: HTTPS recommended for production

### Scaling Considerations
- Use a reverse proxy (nginx, Traefik) for HTTPS
- Consider horizontal scaling with load balancers
- Monitor API rate limits and costs
- Implement proper logging and monitoring

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Support

If you encounter issues:
1. Check the application logs: `docker logs llm-chat`
2. Verify API key configuration
3. Ensure network connectivity to DeepSeek API
4. Check system resources and permissions

The application will be available at `http://localhost:3000` once successfully deployed.
