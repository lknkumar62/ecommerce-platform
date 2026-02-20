# Deployment Guide

## Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ecommerce-platform.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Environment Variables

Add these environment variables in Vercel Dashboard:

```
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Add your IP to the whitelist
5. Get the connection string
6. Replace `password` with your database user's password

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.com/api/auth/callback/google` (for production)

## Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys
3. Add webhook endpoint:
   - `https://your-domain.com/api/webhooks/stripe`
4. Add the webhook signing secret to environment variables

## Razorpay Setup (For Indian Payments)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys
3. Add webhook endpoint:
   - `https://your-domain.com/api/webhooks/razorpay`

## Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create an account
3. Get your cloud name, API key, and API secret

## Custom Domain (Optional)

1. Buy a domain from any registrar
2. In Vercel dashboard, go to your project settings
3. Add your custom domain
4. Update DNS records as instructed

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test product browsing and search
- [ ] Test add to cart and checkout
- [ ] Test payment flow (use test cards)
- [ ] Test admin dashboard access
- [ ] Verify email notifications
- [ ] Check all API endpoints
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test PWA functionality

## Troubleshooting

### Build Errors

1. Check Node.js version (should be 18+)
2. Clear cache: `rm -rf .next node_modules && npm install`
3. Check for TypeScript errors: `npx tsc --noEmit`

### Database Connection Issues

1. Verify MongoDB URI
2. Check IP whitelist in MongoDB Atlas
3. Test connection locally

### Authentication Issues

1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your domain
3. Verify Google OAuth credentials

### Payment Issues

1. Use test mode keys for testing
2. Verify webhook endpoints are configured
3. Check Stripe/Razorpay dashboard for errors

## Performance Optimization

1. Enable Vercel Analytics
2. Use Next.js Image component (when possible)
3. Implement caching strategies
4. Optimize database queries
5. Use CDN for static assets

## Security Checklist

- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable 2FA for all accounts
- [ ] Regular security audits

## Monitoring

1. Set up Vercel Analytics
2. Configure error tracking (Sentry recommended)
3. Monitor database performance
4. Set up uptime monitoring

## Backup Strategy

1. Regular MongoDB backups
2. Export important data periodically
3. Keep code in version control

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Create an issue in the repository