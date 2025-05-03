
# Shield Network Raspberry Pi Server

This server collects real-time network statistics and exposes them via WebSocket for the Shield Network application.

## Prerequisites

1. Raspberry Pi with Raspberry Pi OS installed
2. Node.js installed on the Raspberry Pi
3. speedtest-cli utility installed

## Installation

### 1. Install Node.js on Raspberry Pi

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install speedtest-cli

```bash
sudo apt-get update
sudo apt-get install -y speedtest-cli
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm start
```

The server will run on port 3000 by default.

## Usage

1. Start the server on your Raspberry Pi
2. Make note of the Raspberry Pi's IP address on your network
3. In the Shield Network web application, connect to your Raspberry Pi using its IP address
4. The web application will now display real-time network statistics from your Raspberry Pi

## API Endpoints

- `GET /health`: Health check endpoint
- `WebSocket /network-stats`: WebSocket endpoint for real-time network statistics

## WebSocket Messages

### Client to Server:
- `speedtest`: Triggers a network speed test

### Server to Client:
- Regular latency updates every 5 seconds
- Speed test results when requested
