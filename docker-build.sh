#!/bin/bash

# Docker build script for LLM Chat App
# This script builds the Docker image without embedding API keys at build time
# API keys are provided at runtime for better security

set -e

# Default values
IMAGE_NAME="llm-chat"
TAG="latest"
ENV_FILE=""

# Function to display help
show_help() {
    cat << EOF
Usage: $0 [OPTIONS]
Options:
  -h, --help              Show this help message
  -n, --name IMAGE_NAME   Docker image name (default: llm-chat)
  -t, --tag TAG           Docker image tag (default: latest)
  --env-file FILE         Validate environment file for runtime use

Examples:
  $0                                    # Build basic image
  $0 --name my-chat --tag v1.0         # Custom name and tag
  $0 --env-file .env                   # Validate environment file

Note: API keys are now provided at runtime, not build time.
Use 'docker run --env-file .env' or set environment variables when running.
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        --env-file)
            ENV_FILE="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validate environment file if provided
if [[ -n "$ENV_FILE" ]]; then
    if [[ ! -f "$ENV_FILE" ]]; then
        echo "Error: Environment file '$ENV_FILE' not found"
        exit 1
    fi
    
    echo "Validating environment file: $ENV_FILE"
    
    # Check for required API keys
    if grep -q "DEEPSEEK_API_KEY=" "$ENV_FILE"; then
        echo "✓ DEEPSEEK_API_KEY found in environment file"
    else
        echo "⚠ Warning: DEEPSEEK_API_KEY not found in environment file"
    fi
    
    if grep -q "OPENAI_API_KEY=" "$ENV_FILE"; then
        echo "✓ OPENAI_API_KEY found in environment file"
    else
        echo "ℹ Info: OPENAI_API_KEY not found (optional)"
    fi
fi

echo "Building Docker image: ${IMAGE_NAME}:${TAG}"
echo "🔒 Security: API keys will be provided at runtime, not embedded in image"

# Build the Docker image without API keys
docker build \
    -t "${IMAGE_NAME}:${TAG}" \
    .

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🔒 Security Note: This image does not contain embedded API keys."
echo "   Provide API keys at runtime using one of these methods:"
echo ""
echo "   Method 1 - Environment file:"
echo "   docker run -d --name llm-chat -p 3000:3000 --env-file .env ${IMAGE_NAME}:${TAG}"
echo ""
echo "   Method 2 - Direct environment variables:"
echo "   docker run -d --name llm-chat -p 3000:3000 \\"
echo "     -e DEEPSEEK_API_KEY=your-key-here \\"
echo "     ${IMAGE_NAME}:${TAG}"
echo ""
echo "   Method 3 - Docker Compose:"
echo "   docker-compose up -d"
echo ""
