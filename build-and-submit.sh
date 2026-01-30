#!/bin/bash
set -e

echo "Starting EAS build for iOS development client..."
echo "This will prompt you for Apple credentials if needed."
echo ""

# Run the build with auto-submit
bunx eas-cli build \
  --platform ios \
  --profile development \
  --auto-submit

echo ""
echo "Build started! Check status at: https://expo.dev/accounts/bacon/projects/expo-blog/builds"
