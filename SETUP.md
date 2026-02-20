# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials.

### 3. Required Environment Variables

#### Database
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

Get this from MongoDB Atlas.

#### Authentication
```env
NEXTAUTH_SECRET=your-super-secret-random-string-min-32-chars
NEXTAUTH_URL=http://localhost:3000
```

Generate a random secret:
```bash
openssl rand -base64 32
```

#### Google OAuth (Optional)
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Payment (Optional for development)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

#### Email (Optional)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Admin User

1. Register a new user at `/auth/register`
2. In MongoDB Atlas, find the user and change `role` from `"user"` to `"admin"`
3. Log in again

## Database Setup

### MongoDB Atlas (Recommended)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password

### Local MongoDB (Alternative)

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ecommerce`

## First Time Setup

### 1. Create Categories

Go to Admin Panel → Categories → Add New Category

Example categories:
- Electronics
- Fashion
- Home & Living
- Sports
- Books

### 2. Add Products

Go to Admin Panel → Products → Add New Product

Required fields:
- Name
- Description
- Price
- Category
- SKU (auto-generated if empty)
- At least one image

### 3. Configure Site Settings

Go to Admin Panel → Settings

Update:
- Site name
- Contact email
- Social media links
- SEO settings

### 4. Add Testimonials (Optional)

Go to Admin Panel → Testimonials → Add New

### 5. Create Blog Posts (Optional)

Go to Admin Panel → Blog → Add New Post

## Development Workflow

### File Structure

```
src/
├── app/              # Pages and API routes
├── components/       # React components
├── context/          # React context
├── hooks/            # Custom hooks
├── lib/              # Utilities
├── models/           # MongoDB models
└── types/            # TypeScript types
```

### Adding a New Page

1. Create folder in `src/app/`
2. Add `page.tsx`
3. Add `layout.tsx` (optional)

Example:
```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>About Us</div>;
}
```

### Adding an API Route

1. Create folder in `src/app/api/`
2. Add `route.ts`

Example:
```typescript
// src/app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello!" });
}
```

### Adding a Component

1. Create file in `src/components/`
2. Export the component

Example:
```tsx
// src/components/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>;
}
```

## Testing

### Manual Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] Password reset
- [ ] Product browsing
- [ ] Product search
- [ ] Add to cart
- [ ] Update cart quantity
- [ ] Remove from cart
- [ ] Checkout process
- [ ] Payment (test mode)
- [ ] Order history
- [ ] Admin login
- [ ] Product CRUD
- [ ] Order management
- [ ] User management

### Test Cards

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future date, any 3 digits for CVC

**Razorpay Test Cards:**
- Success: `5267 3181 8797 5449`
- Any future date, any 3 digits for CVV

## Common Issues

### Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
npx tsc --noEmit
```

### Database connection failed

1. Check MONGODB_URI
2. Verify IP whitelist in MongoDB Atlas
3. Test with MongoDB Compass

### Authentication not working

1. Check NEXTAUTH_SECRET
2. Verify NEXTAUTH_URL
3. Check browser cookies

### Images not loading

1. Check Cloudinary configuration
2. Verify image URLs
3. Check CORS settings

## Production Checklist

Before deploying:

- [ ] All environment variables set
- [ ] Database indexes created
- [ ] Test data removed
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] SSL certificate ready
- [ ] Domain configured
- [ ] Backups scheduled
- [ ] Monitoring set up

## Getting Help

1. Check the [README](./README.md)
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Search existing issues
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details

## Next Steps

1. Customize the design
2. Add more payment methods
3. Integrate shipping providers
4. Add email templates
5. Set up analytics
6. Configure CDN
7. Add more features!