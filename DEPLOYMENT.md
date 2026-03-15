# Deployment Guide - AWS Lightsail with PM2

This guide covers deploying the Sinux Boilerplate to AWS Lightsail using PM2 for process management.

## Prerequisites

- AWS Lightsail instance (Ubuntu 20.04 or later recommended)
- Node.js 18+ installed on the server
- MongoDB (can be on the same instance or MongoDB Atlas)
- AWS S3 bucket for file storage (production)
- Domain name (optional)

## 1. Server Setup

### Connect to your Lightsail instance

```bash
ssh -i /path/to/your-key.pem ubuntu@your-lightsail-ip
```

### Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 18+

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install PM2 globally

```bash
sudo npm install -g pm2
```

### Install MongoDB (if hosting locally)

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 2. Deploy Application

### Clone your repository

```bash
cd /home/ubuntu
git clone <your-repository-url> sinux-boilerplate
cd sinux-boilerplate
```

### Install dependencies

```bash
npm install
```

### Create production environment file

```bash
nano .env
```

Add your production environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sinux-boilerplate
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://yourdomain.com
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=sinux-boilerplate-bucket
```

### Build the application

```bash
npm run build
```

### Create logs directory

```bash
mkdir -p logs
```

## 3. PM2 Configuration

### Start the application with PM2

```bash
npm run start:pm2
```

Or manually:

```bash
pm2 start ecosystem.config.js --env production
```

### Save PM2 process list

```bash
pm2 save
```

### Setup PM2 to start on system boot

```bash
pm2 startup systemd
```

Follow the command output and run the suggested command (usually starts with `sudo env PATH=$PATH...`)

### Verify PM2 is running

```bash
pm2 list
pm2 logs sinux-boilerplate
pm2 monit
```

## 4. Nginx Setup (Reverse Proxy)

### Install Nginx

```bash
sudo apt install -y nginx
```

### Create Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/sinux-boilerplate
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

### Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/sinux-boilerplate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. SSL Certificate (Let's Encrypt)

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain SSL certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Auto-renewal test

```bash
sudo certbot renew --dry-run
```

## 6. AWS S3 Bucket Setup

### Create S3 bucket

```bash
aws s3 mb s3://sinux-boilerplate-bucket --region us-east-1
```

### Set bucket policy for public read access

Create a file `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sinux-boilerplate-bucket/uploads/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy --bucket sinux-boilerplate-bucket --policy file://bucket-policy.json
```

### Enable CORS on S3 bucket

Create `cors-config.json`:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-domain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Apply CORS:

```bash
aws s3api put-bucket-cors --bucket sinux-boilerplate-bucket --cors-configuration file://cors-config.json
```

## 7. Firewall Configuration

### Configure Lightsail firewall

In AWS Lightsail console, add the following rules:
- HTTP (80)
- HTTPS (443)
- Custom TCP (5000) - Optional, for direct access

### Or use UFW on Ubuntu

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 8. PM2 Management Commands

### View logs

```bash
pm2 logs sinux-boilerplate
pm2 logs sinux-boilerplate --lines 100
```

### Monitor processes

```bash
pm2 monit
```

### Restart application

```bash
npm run restart:pm2
# or
pm2 restart sinux-boilerplate
```

### Stop application

```bash
npm run stop:pm2
# or
pm2 stop sinux-boilerplate
```

### Delete from PM2

```bash
npm run delete:pm2
# or
pm2 delete sinux-boilerplate
```

### View process info

```bash
pm2 info sinux-boilerplate
```

## 9. Deployment Workflow

### For updates (recommended approach)

```bash
# SSH into server
ssh ubuntu@your-lightsail-ip

# Navigate to project
cd /home/ubuntu/sinux-boilerplate

# Pull latest changes
git pull origin main

# Install dependencies (if package.json changed)
npm install

# Build application
npm run build

# Restart PM2
npm run restart:pm2

# Check logs
pm2 logs sinux-boilerplate --lines 50
```

### Automated deployment script

Create `deploy.sh`:

```bash
#!/bin/bash
echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart PM2
pm2 restart ecosystem.config.js --env production

echo "✅ Deployment complete!"
pm2 logs sinux-boilerplate --lines 20
```

Make it executable:

```bash
chmod +x deploy.sh
```

Run deployment:

```bash
./deploy.sh
```

## 10. Monitoring & Maintenance

### Setup PM2 monitoring (optional)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Check disk space

```bash
df -h
```

### Check memory usage

```bash
free -h
pm2 monit
```

### View MongoDB status

```bash
sudo systemctl status mongod
```

### Backup MongoDB

```bash
mongodump --db sinux-boilerplate --out /home/ubuntu/backups/$(date +%Y%m%d)
```

## 11. Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs sinux-boilerplate --err

# Check if port is in use
sudo lsof -i :5000

# Check environment variables
pm2 env 0
```

### MongoDB connection issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### Nginx issues

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### S3 upload issues

- Verify AWS credentials in `.env`
- Check IAM permissions for S3 access
- Verify bucket policy and CORS configuration
- Check application logs: `pm2 logs sinux-boilerplate`

## 12. Security Best Practices

1. **Keep system updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use strong JWT secrets**
   - Generate with: `openssl rand -base64 64`

3. **Restrict MongoDB access**
   ```bash
   sudo nano /etc/mongod.conf
   # Set bindIp: 127.0.0.1
   ```

4. **Enable MongoDB authentication**
   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "strongpassword",
     roles: ["root"]
   })
   ```

5. **Regular backups**
   - Setup automated MongoDB backups
   - Backup S3 bucket with versioning enabled

6. **Monitor logs regularly**
   ```bash
   pm2 logs sinux-boilerplate
   ```

## Support

For issues or questions, check:
- Application logs: `pm2 logs sinux-boilerplate`
- System logs: `/var/log/syslog`
- MongoDB logs: `/var/log/mongodb/mongod.log`
- Nginx logs: `/var/log/nginx/error.log`
