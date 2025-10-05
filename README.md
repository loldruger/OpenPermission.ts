# OpenPermission.ts - Discord Self-Service Role Bot

A Discord bot that allows users to self-manage their availability status by adding or removing a configured role.

## Features

- `/open` - Mark yourself as available (adds configured role)
- `/close` - Mark yourself as unavailable (removes configured role)

Simple, self-service role management - no admin intervention needed!

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure `.env` file with your bot credentials:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
OPEN_ROLE_ID=your_role_id_here  # Role ID for /open and /close commands
```

**Getting the Role ID:**
1. Enable "Developer Mode" in Discord Settings → Advanced
2. Right-click the role in Server Settings → Roles
3. Click "Copy ID"

## Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" to create a new application
3. Go to "Bot" tab and create a bot
4. Copy the TOKEN → Add to `.env` as `DISCORD_TOKEN`
5. Go to "OAuth2" → "General" and copy `CLIENT_ID` → Add to `.env`
6. Go to "OAuth2" → "URL Generator":
   - Scopes: Select `bot` and `applications.commands`
   - Bot Permissions: Select `Manage Roles`
   - Use the generated URL to invite the bot to your server

7. Get Server ID:
   - Enable "Developer Mode" in Discord Settings → Advanced
   - Right-click your server → "Copy ID" → Add to `.env` as `GUILD_ID`

## Running the Bot

### Development Mode
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Docker Deployment

### Local Docker

Build and run with Docker:
```bash
docker build -t openpermission-bot .
docker run -d --env-file .env --name openpermission-bot openpermission-bot
```

Or use Docker Compose:
```bash
docker-compose up -d
```

### Google Cloud Build & Deploy

#### Prerequisites
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Create a GCP project
3. Enable billing for your project
4. Authenticate: `gcloud auth login`

#### Deploy to Cloud Run (Updated - Now Supported!)

**The bot now includes an HTTP server for Cloud Run compatibility.**

**Option 1: Using Secret Manager (Recommended for Production)**

Most secure - stores credentials in Google Secret Manager:

```bash
export GCP_PROJECT_ID="your-project-id"
./deploy-secret-manager.sh
```

The script will:
- Enable Secret Manager API
- Create encrypted secrets for all credentials
- Grant Cloud Run access to secrets
- Build and deploy with secret references

**To update secrets later:**
```bash
./update-secrets.sh
```

See [SECRET_MANAGER_GUIDE.md](SECRET_MANAGER_GUIDE.md) for details.

**Option 2: Using Environment Variables**

Simpler but less secure:

```bash
export GCP_PROJECT_ID="your-project-id"
./deploy-cloud-run.sh
```

The script will:
- Enable required APIs
- Prompt for Discord credentials (Token, Client ID, Guild ID)
- Build Docker image with Cloud Build
- Deploy to Cloud Run with persistent instance (min-instances=1)

**Note:** You'll need to set `OPEN_ROLE_ID` after deployment:
```bash
gcloud run services update openpermission-bot \
  --region=us-central1 \
  --update-env-vars OPEN_ROLE_ID=your_role_id
```

**Cost**: ~$15-20/month (always-on instance)

**Important**: The bot runs with `min-instances=1` to maintain the Discord WebSocket connection. This means the instance is always running.

**To view logs:**
```bash
gcloud run services logs tail openpermission-bot --region=us-central1
```

**To update environment variables:**
```bash
# With Secret Manager (recommended)
./update-secrets.sh

# With environment variables
gcloud run services update openpermission-bot \
  --region=us-central1 \
  --set-env-vars DISCORD_TOKEN=new_token,CLIENT_ID=new_id,GUILD_ID=new_guild,OPEN_ROLE_ID=new_role
```

**To delete the service:**
```bash
gcloud run services delete openpermission-bot --region=us-central1
```

#### Alternative: Deploy to Compute Engine

For lower cost (~$5-10/month or free tier):

```bash
export GCP_PROJECT_ID="your-project-id"
./deploy-compute-engine.sh
```

## Usage

1. `/open` - Add the configured role to yourself (mark as available)
2. `/close` - Remove the configured role from yourself (mark as unavailable)

**Example Use Cases:**
- Set `OPEN_ROLE_ID` to a role like "Available", "Open for DM", or "Active"
- Users can toggle this role on/off themselves
- No admin intervention required - fully self-service

## Required Permissions

- Bot: "Manage Roles" permission required
- Bot's role must be higher than the configured OPEN_ROLE_ID in the role hierarchy

## Important Notes

- The bot's role must be positioned higher than the OPEN_ROLE_ID role
- **Cloud Run**: Bot includes HTTP server on port 8080 for health checks
- **Always-on**: Uses min-instances=1 to keep Discord connection alive
- **Health Check**: Visit the service URL to see bot status
- **Self-Service**: All users can use /open and /close without admin permissions

## File Structure

```
.
├── src/
│   ├── index.ts              # Main bot file
│   ├── commands.ts           # Slash command definitions
│   └── handlers/
│       └── openCloseHandler.ts # /open and /close logic
├── Dockerfile                # Docker container configuration
├── cloudbuild.yaml          # Google Cloud Build configuration
├── deploy-secret-manager.sh # Deploy with Secret Manager
├── deploy-cloud-run.sh      # Deploy with environment variables
└── package.json             # Node.js dependencies
```

## Troubleshooting

### Bot not responding
- Check if bot is online in Discord
- Verify slash commands are registered
- Check bot permissions in server

### Permission errors
- Ensure bot role is higher than target role
- Verify "Manage Roles" permission is granted

### Cloud Deployment Issues

#### Bot works but commands not responding
- Wait a few minutes for slash commands to register
- Try re-inviting the bot with the correct OAuth2 scopes
- Check logs for registration errors

#### "Container failed to start and listen on port" (Fixed!)
The bot now includes an HTTP server that listens on PORT environment variable (default 8080).
You can visit the service URL to see the bot status.

#### High costs on Cloud Run
- Cloud Run charges for CPU time when the instance is running
- Consider using Compute Engine e2-micro (free tier eligible) for lower costs
- Or run on your own server/Raspberry Pi for $0

## License

MIT
