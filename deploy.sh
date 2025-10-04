#!/bin/bash

# OpenPermission Bot - Google Cloud Build Deployment Script

# Configuration
PROJECT_ID="${GCP_PROJECT_ID}"
REGION="us-central1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== OpenPermission Bot Deployment ===${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if PROJECT_ID is set
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}GCP_PROJECT_ID not set. Please enter your GCP Project ID:${NC}"
    read -r PROJECT_ID
fi

echo -e "${GREEN}Using Project ID: $PROJECT_ID${NC}"

# Set the project
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo -e "${GREEN}Enabling required Google Cloud APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    run.googleapis.com \
    secretmanager.googleapis.com

# Submit build to Cloud Build
echo -e "${GREEN}Submitting build to Cloud Build...${NC}"
gcloud builds submit --config cloudbuild.yaml .

echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Go to Google Cloud Console > Cloud Build to check build status"
echo "2. Set up environment variables (DISCORD_TOKEN, CLIENT_ID, GUILD_ID)"
echo "3. Deploy the image to your preferred platform (Cloud Run, GKE, Compute Engine)"
