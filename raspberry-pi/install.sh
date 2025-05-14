
#!/bin/bash

# Update package lists
echo "Updating package lists..."
sudo apt-get update

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install speedtest-cli if not already installed
if ! command -v speedtest-cli &> /dev/null; then
    echo "Installing speedtest-cli..."
    sudo apt-get install -y speedtest-cli
fi

# Install other dependencies
echo "Installing other dependencies..."
sudo apt-get install -y arp-scan net-tools

# Install npm packages
echo "Installing npm dependencies..."
npm install
npm install node-fetch@2 # Version 2 works with CommonJS

# Create and set permissions for the known_devices.json file
echo "Setting up device monitoring..."
touch known_devices.json
chmod 666 known_devices.json

# Set up the server to run on boot
echo "Setting up server to run on boot..."
cat > shield-server.service << EOL
[Unit]
Description=Shield Network Server
After=network.target

[Service]
ExecStart=$(which node) $(pwd)/server.js
WorkingDirectory=$(pwd)
StandardOutput=inherit
StandardError=inherit
Restart=always
User=$USER

[Install]
WantedBy=multi-user.target
EOL

# Set up the device monitor to run on boot
cat > shield-monitor.service << EOL
[Unit]
Description=Shield Device Monitor
After=network.target shield-server.service

[Service]
ExecStart=$(which node) $(pwd)/device-monitor.js
WorkingDirectory=$(pwd)
StandardOutput=inherit
StandardError=inherit
Restart=always
User=$USER

[Install]
WantedBy=multi-user.target
EOL

sudo mv shield-server.service /etc/systemd/system/
sudo mv shield-monitor.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable shield-server
sudo systemctl enable shield-monitor
sudo systemctl start shield-server
sudo systemctl start shield-monitor

# Set up a cron job to run the device monitor every hour as a backup
(crontab -l 2>/dev/null; echo "0 * * * * /usr/bin/node $(pwd)/device-monitor.js >> $(pwd)/monitor.log 2>&1") | crontab -

echo "Shield Network Server has been installed and started!"
echo "You can check its status with: sudo systemctl status shield-server"
echo "You can check the device monitor with: sudo systemctl status shield-monitor"
echo ""
echo "Your Raspberry Pi IP address is:"
hostname -I | awk '{print $1}'
echo ""
echo "Use this IP address to connect from the Shield Network web application."
