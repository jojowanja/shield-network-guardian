
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

# Install dependencies
echo "Installing npm dependencies..."
npm install

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

sudo mv shield-server.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable shield-server
sudo systemctl start shield-server

echo "Shield Network Server has been installed and started!"
echo "You can check its status with: sudo systemctl status shield-server"
echo ""
echo "Your Raspberry Pi IP address is:"
hostname -I | awk '{print $1}'
echo ""
echo "Use this IP address to connect from the Shield Network web application."
