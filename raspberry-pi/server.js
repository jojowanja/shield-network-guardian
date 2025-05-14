const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/network-stats' });

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Store connected clients
const clients = new Set();

// Endpoint to report suspicious devices
app.post('/suspicious-device', (req, res) => {
  try {
    const { deviceInfo, threatScore } = req.body;
    
    if (!deviceInfo || !deviceInfo.mac) {
      return res.status(400).json({ error: 'Missing device information' });
    }
    
    console.log(`Suspicious device detected: ${JSON.stringify(deviceInfo)}, Threat Score: ${threatScore}`);
    
    // Broadcast to all connected clients
    clients.forEach(client => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(JSON.stringify({
          type: 'suspicious_device',
          deviceInfo,
          threatScore,
          timestamp: new Date().toISOString()
        }));
      }
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing suspicious device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to run a network speed test
function runSpeedTest() {
  return new Promise((resolve, reject) => {
    exec('speedtest-cli --json', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing speedtest-cli: ${error}`);
        return reject(error);
      }
      try {
        const result = JSON.parse(stdout);
        return resolve({
          downloadSpeed: result.download / 1000000, // Convert to Mbps
          uploadSpeed: result.upload / 1000000,     // Convert to Mbps
          ping: result.ping,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error('Error parsing speedtest results:', e);
        reject(e);
      }
    });
  });
}

// Function to get current network latency
function getLatency() {
  return new Promise((resolve, reject) => {
    exec('ping -c 4 8.8.8.8', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ping: ${error}`);
        return resolve({ latency: 100 }); // Default value on error
      }
      try {
        // Extract average ping time using regex
        const match = stdout.match(/rtt min\/avg\/max\/mdev = \d+\.\d+\/(\d+\.\d+)\/\d+\.\d+\/\d+\.\d+ ms/);
        const latency = match ? parseFloat(match[1]) : 100;
        return resolve({ latency });
      } catch (e) {
        console.error('Error parsing ping results:', e);
        resolve({ latency: 100 });
      }
    });
  });
}

// Function to scan for devices on network
function scanNetworkDevices() {
  return new Promise((resolve, reject) => {
    exec('arp -a', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error scanning network: ${error}`);
        return reject(error);
      }
      
      try {
        const lines = stdout.split('\n');
        const devices = lines
          .filter(line => line.trim().length > 0)
          .map(line => {
            // Parse arp output format which varies by OS
            const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
            const macMatch = line.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
            const hostnameMatch = line.match(/\(([^)]+)\)/);
            
            return {
              ip: ipMatch ? ipMatch[0] : 'unknown',
              mac: macMatch ? macMatch[0] : 'unknown',
              hostname: hostnameMatch ? hostnameMatch[1] : '',
              lastSeen: new Date().toISOString()
            };
          })
          .filter(device => device.ip !== 'unknown' && device.mac !== 'unknown');
        
        return resolve(devices);
      } catch (e) {
        console.error('Error parsing device scan results:', e);
        reject(e);
      }
    });
  });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);
  
  // Send initial latency
  getLatency().then(data => {
    ws.send(JSON.stringify(data));
  });
  
  // Handle messages from client
  ws.on('message', async (message) => {
    const msg = message.toString();
    console.log(`Received message: ${msg}`);
    
    // Handle speed test request
    if (msg === 'speedtest') {
      try {
        const speedTestData = await runSpeedTest();
        ws.send(JSON.stringify(speedTestData));
      } catch (error) {
        console.error('Speed test failed:', error);
        ws.send(JSON.stringify({ error: 'Speed test failed' }));
      }
    }
    
    // Handle device scan request
    if (msg === 'scandevices') {
      try {
        const devices = await scanNetworkDevices();
        ws.send(JSON.stringify({ type: 'device_scan', devices }));
      } catch (error) {
        console.error('Device scan failed:', error);
        ws.send(JSON.stringify({ error: 'Device scan failed' }));
      }
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Periodically check and send latency
setInterval(async () => {
  if (clients.size > 0) {
    const latencyData = await getLatency();
    
    clients.forEach(client => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(JSON.stringify(latencyData));
      }
    });
  }
}, 5000); // Every 5 seconds

// Periodically scan for new devices (every 5 minutes)
setInterval(async () => {
  if (clients.size > 0) {
    try {
      const devices = await scanNetworkDevices();
      clients.forEach(client => {
        if (client.readyState === 1) { // 1 = OPEN
          client.send(JSON.stringify({ type: 'device_scan', devices }));
        }
      });
    } catch (err) {
      console.error('Periodic device scan failed:', err);
    }
  }
}, 300000); // Every 5 minutes

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
