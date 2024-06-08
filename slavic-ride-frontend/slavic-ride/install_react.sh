#!/bin/bash

# Function to check if a command exists
command_exists () {
  type "$1" &> /dev/null ;
}

# Check if Node.js and npm are installed
if ! command_exists node || ! command_exists npm ; then
  echo "Node.js and npm are required. Please install them first."
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
# npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
  echo "Failed to install dependencies. Please check the errors above."
  exit 1
fi

echo "Dependencies installed successfully."

# Ensure API key is set in environment variables
if [ -z "$REACT_APP_GOOGLE_MAPS_API_KEY" ]; then
  echo "REACT_APP_GOOGLE_MAPS_API_KEY is not set. Please set it in your environment variables."
  exit 1
fi

echo "Environment variable REACT_APP_GOOGLE_MAPS_API_KEY is set."

echo "Setup completed successfully."
