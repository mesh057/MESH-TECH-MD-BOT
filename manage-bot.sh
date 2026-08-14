#!/bin/bash

# ==========================================
# MESH-TECH-MD-BOT Management Script (cPanel Litespeed Optimized)
# ==========================================

BOT_NAME="mesh-bot"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
    echo "Usage: ./manage-bot.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start or restart the bot with PM2"
    echo "  stop      Stop the bot"
    echo "  restart   Restart the bot"
    echo "  status    Show PM2 process status"
    echo "  logs      Tail live bot logs"
    echo "  update    Pull latest changes from git, update dependencies, and restart"
    echo "  setup     Configure PM2 startup script"
    echo ""
}

case "$1" in
    start)
        echo "Starting $BOT_NAME in $APP_DIR..."
        cd "$APP_DIR"
        pm2 start index.js --name "$BOT_NAME"
        pm2 save
        ;;
    stop)
        echo "Stopping $BOT_NAME..."
        pm2 stop "$BOT_NAME"
        ;;
    restart)
        echo "Restarting $BOT_NAME..."
        cd "$APP_DIR"
        pm2 restart "$BOT_NAME" || pm2 start index.js --name "$BOT_NAME"
        ;;
    status)
        pm2 status
        ;;
    logs)
        pm2 logs "$BOT_NAME"
        ;;
    update)
        echo "Updating $BOT_NAME from repository..."
        cd "$APP_DIR"
        pm2 stop "$BOT_NAME" 2>/dev/null || true
        git pull origin main
        npm install
        pm2 restart "$BOT_NAME" || pm2 start index.js --name "$BOT_NAME"
        pm2 save
        echo "Update complete!"
        ;;
    setup)
        echo "Configuring PM2..."
        cd "$APP_DIR"
        pm2 start index.js --name "$BOT_NAME"
        pm2 save
        ;;
    *)
        show_help
        ;;
esac
