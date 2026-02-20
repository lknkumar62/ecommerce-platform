# E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js 14, MongoDB, and Tailwind CSS.

## Features

### Customer Features
- **Home Page**: Hero section, featured products, categories, testimonials, blog preview
- **Shop Page**: Product listing with filters, search, sorting, and pagination
- **Product Detail**: Image gallery, reviews, specifications, add to cart
- **Cart & Checkout**: Full cart management, multiple payment options (Stripe, Razorpay, COD)
- **User Account**: Order history, profile management
- **Blog**: SEO-friendly blog system with categories and tags
- **Contact**: Contact form with email notifications

### Admin Features
- **Dashboard**: Analytics with charts, recent orders, low stock alerts
- **Product Management**: CRUD operations, image upload, inventory management
- **Order Management**: View orders, update status, tracking
- **Category Management**: Create and manage product categories
- **Blog Management**: Create and manage blog posts
- **User Management**: View and manage users
- **Testimonials**: Manage customer testimonials
- **Settings**: Site configuration, SEO settings

### Technical Features
- **Authentication**: NextAuth with Google OAuth and email/password
- **Security**: Rate limiting, CSRF protection, secure headers
- **SEO**: Meta tags, sitemap, robots.txt, structured data
- **PWA**: Progressive Web App support
- **Responsive**: Mobile-first design
- **Dark Mode**: Theme switching support

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Payment**: Stripe, Razorpay
- **Image Storage**: Cloudinary
- **Email**: Nodemailer
- **Charts**: Recharts
- **UI Components**: Radix UI, shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Stripe account (for payments)
- Razorpay account (for Indian payments)
- Google OAuth credentials
- Cloudinary account (for images)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-platform
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables file:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your credentials.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS
- Digital Ocean

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── admin/          # Admin dashboard
│   │   ├── auth/           # Authentication pages
│   │   ├── shop/           # Shop page
│   │   ├── product/        # Product detail page
│   │   ├── cart/           # Cart page
│   │   ├── checkout/       # Checkout page
│   │   ├── blog/           # Blog pages
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # UI components
│   │   ├── layout/        # Layout components
│   │   ├── sections/      # Page sections
│   │   └── product-card.tsx
│   ├── context/           # React context
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   ├── models/            # MongoDB models
│   ├── types/             # TypeScript types
│   └── middleware.ts      # Next.js middleware
├── public/                # Static files
├── .env.example           # Environment variables template
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind config
└── package.json
```

## API Routes

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order (Admin)

### Blog
- `GET /api/blog` - Get all posts
- `POST /api/blog` - Create post (Admin)
- `GET /api/blog/[slug]` - Get single post
- `PUT /api/blog/[slug]` - Update post (Admin)
- `DELETE /api/blog/[slug]` - Delete post (Admin)

### Payment
- `POST /api/payment/stripe` - Create Stripe payment
- `PUT /api/payment/stripe` - Confirm Stripe payment
- `POST /api/payment/razorpay` - Create Razorpay order
- `PUT /api/payment/razorpay` - Verify Razorpay payment

### Admin
- `GET /api/admin/dashboard` - Get dashboard analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@shophub.com or join our Slack channel.