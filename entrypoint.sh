#!/bin/bash

# Collect static files
echo "Start and installing the backend server dependencies"
cd ./server/
docker-compose up -d
docker-compose up --build
