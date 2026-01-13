# Deploying Admin Portal to Railway

## Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended - easy linking)
3. Create a new project

## Step 2: Deploy from GitHub
1. In Railway dashboard, click "New Project" → "Deploy from GitHub repo"
2. Select your `hrg-site` repository
3. Railway will auto-detect the Procfile and deploy

## Step 3: Set Environment Variables in Railway
In Railway project settings, add:

```
ENVIRONMENT=production
ADMIN_PASSWORD=<your-secure-password>
FLASK_SECRET_KEY=<your-random-secret-key>
ALLOWED_ORIGIN=https://admin.howardresourcegroup.com
```

Generate secrets:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Step 4: Get Railway URL
Railway will give you a public URL like:
```
https://hrg-site-prod.railway.app
```

## Step 5: Configure Cloudflare DNS

1. Go to Cloudflare dashboard → your domain
2. Add a CNAME record:
   - **Name**: `admin`
   - **Target**: `<your-railway-url>.railway.app`
   - **Proxy status**: Proxied
3. Wait 5-10 minutes for DNS to propagate

Now `admin.howardresourcegroup.com` will route to your Railway deployment!

## Step 6: Change Default Password

After deployment, log in at `admin.howardresourcegroup.com/admin/login` with:
- Username: `admin`
- Password: `changeme123` (default)

Then change in Railway environment variables for next deployment.

## Troubleshooting

- **Can't access admin?** Check Cloudflare DNS propagation (use `nslookup admin.howardresourcegroup.com`)
- **File uploads not working?** Railway uses ephemeral storage—consider migrating to S3/Cloudinary later
- **Products not saving?** Ensure `content/products/` directory exists in Railway

## Local Development

Continue using:
```bash
python admin_server.py
```
Access at `http://localhost:5000/admin/login`
