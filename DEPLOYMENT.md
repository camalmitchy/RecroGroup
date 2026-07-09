# RecroGroup Deployment Guide - DigitalOcean

## Option 1: App Platform (Recommended for Beginners)

### Prerequisites
- GitHub account
- DigitalOcean account
- Your code pushed to GitHub

### Steps

#### 1. Create PostgreSQL Database
1. Log into DigitalOcean
2. Go to **Databases** → **Create Database**
3. Choose:
   - **Engine**: PostgreSQL 16
   - **Plan**: Basic ($15/month recommended)
   - **Region**: Choose closest to your users (e.g., New York, London)
   - **Database Name**: recrogroup-db
4. Click **Create Database**
5. Wait 2-3 minutes for provisioning
6. Copy the **Connection String** (it looks like: `postgresql://user:pass@host:port/db`)

#### 2. Deploy to App Platform
1. Go to **Apps** → **Create App**
2. Connect GitHub:
   - Click **GitHub**
   - Authorize DigitalOcean
   - Select your repository
   - Choose branch: `main` or `master`
3. Configure Build:
   - **Name**: recrogroup
   - **Region**: Same as database
   - **Branch**: main
   - **Autodeploy**: ✅ Enabled
4. Environment Variables (click **Edit** → **Add Environment Variable**):
   ```
   DATABASE_URL = <paste your database connection string>
   BETTER_AUTH_SECRET = <generate 32 random characters>
   BETTER_AUTH_URL = https://recrogroup-xxxxx.ondigitalocean.app
   NODE_ENV = production
   ```
   
   To generate BETTER_AUTH_SECRET, run in terminal:
   ```bash
   openssl rand -base64 32
   ```

5. Configure Resources:
   - **Instance Size**: Basic ($12/month)
   - **Instance Count**: 1
6. Click **Next** → **Create Resources**

#### 3. Run Database Migrations
After deployment:
1. Go to your app in DigitalOcean
2. Click **Console** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

#### 4. Add Custom Domain (Optional)
1. In your app, go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain: `recrogroup.co.ke`
4. Add the DNS records shown to your domain registrar
5. Wait for SSL certificate (automatic, 5-10 minutes)

### Costs (App Platform)
- **App**: $12/month (Basic)
- **Database**: $15/month (Basic)
- **Total**: ~$27/month

---

## Option 2: Droplet with Docker (Advanced)

### Prerequisites
- DigitalOcean account
- Basic command line knowledge

### Steps

#### 1. Create Droplet
1. Go to **Droplets** → **Create Droplet**
2. Choose:
   - **Image**: Ubuntu 24.04 LTS
   - **Plan**: Basic ($12/month - 2GB RAM)
   - **Region**: Closest to your users
   - **Authentication**: SSH Key (recommended) or Password
   - **Hostname**: recrogroup-server
3. Click **Create Droplet**
4. Copy the IP address

#### 2. Connect to Droplet
```bash
ssh root@YOUR_DROPLET_IP
```

#### 3. Install Docker
```bash
# Update packages
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

#### 4. Setup Application
```bash
# Create app directory
mkdir -p /var/www/recrogroup
cd /var/www/recrogroup

# Clone your repository
git clone https://github.com/YOUR_USERNAME/RecroGroup.git .

# Create .env file
nano .env
```

Add these environment variables:
```env
DATABASE_URL=postgresql://recrogroup:YOUR_PASSWORD@db:5432/recrogroup
BETTER_AUTH_SECRET=your-32-char-secret-here
BETTER_AUTH_URL=http://YOUR_DROPLET_IP:3000
NODE_ENV=production
DB_PASSWORD=your-secure-database-password
```

Save and exit (Ctrl+X, Y, Enter)

#### 5. Build and Run
```bash
# Build the application
docker-compose build

# Start services
docker-compose up -d

# Check if running
docker-compose ps

# View logs
docker-compose logs -f app
```

#### 6. Run Database Migrations
```bash
docker-compose exec app npx prisma migrate deploy
```

#### 7. Setup Nginx Reverse Proxy
```bash
# Install Nginx
apt install nginx -y

# Create Nginx config
nano /etc/nginx/sites-available/recrogroup
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/recrogroup /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 8. Setup SSL with Let's Encrypt (For Custom Domain)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is automatic
```

#### 9. Setup Firewall
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### Costs (Droplet)
- **Droplet**: $12/month (2GB RAM)
- **Backups**: $2.40/month (optional)
- **Total**: ~$12-15/month

---

## Post-Deployment Checklist

- [ ] Database is running and connected
- [ ] All environment variables are set
- [ ] Database migrations completed
- [ ] Application is accessible
- [ ] SSL certificate installed (if using custom domain)
- [ ] Test all pages and features
- [ ] Setup monitoring (DigitalOcean Monitoring)
- [ ] Configure backups
- [ ] Update DNS records (if using custom domain)

---

## Updating Your Application

### App Platform
1. Push changes to GitHub
2. App Platform auto-deploys (if enabled)
3. Or manually click **Deploy** in the dashboard

### Droplet
```bash
cd /var/www/recrogroup
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
```

---

## Troubleshooting

### App Platform
- **Check Logs**: Go to app → **Runtime Logs**
- **Build Fails**: Check **Build Logs**
- **Database Connection**: Verify DATABASE_URL in environment variables

### Droplet
```bash
# Check if containers are running
docker-compose ps

# View application logs
docker-compose logs app

# View database logs
docker-compose logs db

# Restart services
docker-compose restart

# Check Nginx logs
tail -f /var/log/nginx/error.log
```

---

## Monitoring & Maintenance

1. **Enable DigitalOcean Monitoring** (free):
   - CPU usage
   - Memory usage
   - Disk usage
   - Bandwidth

2. **Setup Alerts**:
   - Go to Monitoring → Create Alert
   - Set thresholds for CPU, memory, disk

3. **Database Backups**:
   - App Platform DB: Automatic daily backups
   - Droplet: Enable weekly backups (+20% cost)

4. **Application Updates**:
   - App Platform: Auto-deploys from GitHub
   - Droplet: Manual updates via git pull

---

## Cost Comparison

| Feature | App Platform | Droplet |
|---------|-------------|---------|
| App Hosting | $12/month | $12/month |
| Database | $15/month | Included |
| SSL | Free | Free |
| Auto-scaling | Yes | No |
| Auto-backups | Yes | Optional ($2.40/mo) |
| **Total** | **$27/month** | **$12-15/month** |

**Recommendation**: Start with **App Platform** for simplicity. Switch to Droplet later if you need more control or want to save costs.
