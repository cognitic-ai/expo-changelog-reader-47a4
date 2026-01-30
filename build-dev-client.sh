#!/bin/bash
set -e

echo "=============================================="
echo "Building Expo Blog Development Client"
echo "=============================================="
echo ""
echo "Project: @bacon/expo-blog"
echo "Platform: iOS"
echo "Profile: development"
echo "Includes: Widget target"
echo ""
echo "This build will:"
echo "  1. Build a development client with expo-dev-client"
echo "  2. Include the homescreen widget"
echo "  3. Submit to TestFlight automatically"
echo ""
echo "Starting build..."
echo ""

bunx eas-cli build --platform ios --profile development --auto-submit

echo ""
echo "=============================================="
echo "Build submitted successfully!"
echo "=============================================="
echo ""
echo "Monitor build progress:"
echo "https://expo.dev/accounts/bacon/projects/expo-blog/builds"
echo ""
echo "Once complete, the build will appear in TestFlight"
echo "at: https://appstoreconnect.apple.com"
echo ""
