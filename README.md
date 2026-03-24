# B2B EdTech Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)
![License](https://img.shields.io/badge/license-ISC-green)

A professional B2B EdTech platform similar to Simplilearn, built with Next.js 14, Tailwind CSS, and MongoDB. This platform enables businesses to browse courses, submit enquiries, and manage leads effectively.

## 🌟 Live Demo

Run locally on any available port:
```bash
PORT=3456 npm run dev
```
Then visit `http://localhost:3456`

## 📸 Screenshots

### Landing Page
Professional course showcase with responsive design

### Course Details
Comprehensive course information with enrollment options

### Admin Dashboard
Lead management with search and filter capabilities

## Features

- 🎓 **Course Showcase**: Responsive landing page displaying tutorial modules
- 📝 **Pre-populated Lead System**: Auto-filled course enquiry forms
- 💾 **Lead Capture**: MongoDB integration for storing leads
- 📧 **Email Notifications**: Automated alerts to sales team via Nodemailer
- 👥 **Admin Panel**: Manage and track leads
- 🎯 **Vendor Panel**: Upload and manage course modules
- 🎨 **Professional UI**: Clean corporate design with Tailwind CSS

## 🎯 Key Highlights

- ✅ **Auto-filled Lead Forms**: Course name pre-populated on enquiry
- ✅ **Real-time Email Notifications**: Instant alerts to sales team
- ✅ **Responsive Design**: Works on all devices
- ✅ **SEO Optimized**: Server-side rendering with Next.js
- ✅ **Production Ready**: Scalable architecture

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete architecture, diagrams, and technical decisions
- **[GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)** - ⭐ **Start here!** Google Sheets & Analytics setup guide
- **[DEPLOYMENT_UPDATED.md](DEPLOYMENT_UPDATED.md)** - Vercel deployment with Google Sheets integration
- **[.env.example](.env.example)** - Environment configuration template

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Data Storage**: Google Sheets API
- **Analytics**: Google Analytics 4
- **Email**: Nodemailer (Gmail)
- **Language**: JavaScript/React

## Project Structure

```
b2b-edtech-platform/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin panel for lead management
│   │   ├── vendor/             # Vendor panel for course uploads
│   │   ├── api/
│   │   │   └── leads/          # API routes for lead operations
│   │   ├── globals.css         # Global styles with Tailwind
│   │   ├── layout.js           # Root layout
│   │   └── page.js             # Landing page
│   ├── components/
│   │   ├── CourseCard.js       # Course display component
│   │   └── LeadForm.js         # Lead capture form
│   ├── lib/
│   │   ├── mongodb.js          # MongoDB connection
│   │   └── email.js            # Email service
│   └── models/
│       ├── Lead.js             # Lead model
│       └── Course.js           # Course model
├── .env.example                # Environment variables template
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```

## Setup Instructions

### 1. Clone the Repository

```bash
cd b2b-edtech-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Google Services

**⚠️ Important**: Before running the app, you must set up Google Sheets and Analytics.

Follow the detailed guide: **[GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)**

Quick summary:
1. Create a Google Sheet with proper headers
2. Set up Google Cloud Service Account
3. Create Google Analytics 4 property
4. Generate Gmail App Password
5. Configure environment variables

### 4. Configure Environment Variables

Create a `.env.local` file in the `b2b-edtech-platform` directory:

```env
# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mygenaiwork4u@gmail.com
EMAIL_PASS=your-16-char-app-password
SALES_TEAM_EMAIL=mygenaiwork4u@gmail.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for detailed setup instructions.**

### 5. Run the Development Server

**Default Port (3000):**
```bash
npm run dev
```

**Custom Port (if 3000 is busy):**
```bash
PORT=3456 npm run dev
```

Then open your browser:
- Default: [http://localhost:3000](http://localhost:3000)
- Custom: [http://localhost:3456](http://localhost:3456)

## Usage

### Main Pages

- **Home Page** (`/`): Landing page with course showcase
- **Course Details** (`/courses/[id]`): Detailed course information
- **Admin Panel** (`/admin`): View and manage leads
- **Vendor Panel** (`/vendor`): Upload new course modules

### Lead Flow

1. User browses courses on the home page
2. Clicks "Enquire Now" on a course card
3. Lead form opens with pre-filled course name
4. User fills in their details and submits
5. Lead is saved to MongoDB
6. Email notification is sent to sales team
7. Admin can view the lead in the admin panel

## API Endpoints

### POST /api/leads
Create a new lead

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "phone": "+91 98765 43210",
  "company": "ABC Corp",
  "courseName": "Full Stack Web Development",
  "message": "Optional message"
}
```

### GET /api/leads
Get all leads (for admin panel)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "leads": [...]
}
```

## Customization

### Adding New Courses

Edit `src/app/page.js` and modify the `sampleCourses` array:

```javascript
const sampleCourses = [
  {
    id: 1,
    title: 'Your Course Title',
    description: 'Course description',
    duration: '12 weeks',
    level: 'Intermediate',
    price: 49999,
    category: 'Category',
    instructor: 'Instructor Name',
    rating: 4.8,
    studentsEnrolled: 2500,
  },
  // Add more courses...
];
```

### Customizing Colors

Edit `tailwind.config.js` to change the primary color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize these values
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
      },
    },
  },
}
```

## 🚀 Production Deployment

### Deploy to Vercel (Recommended)

**Prerequisites:**
1. ✅ Complete [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) first
2. ✅ Have all environment variables ready
3. ✅ Push code to GitHub

**Quick Deploy:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables
4. Deploy!

**📖 Complete Guide:** See **[DEPLOYMENT_UPDATED.md](DEPLOYMENT_UPDATED.md)** for:
- Step-by-step Vercel deployment
- Environment variables configuration
- Google Sheets integration setup
- Troubleshooting common issues
- Performance optimization tips

### Local Production Build

```bash
npm run build
npm start
```

## 🚀 Quick Start for Contributors

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/yourusername/b2b-edtech-platform.git
   cd b2b-edtech-platform
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment:** Copy `.env.example` to `.env.local` and configure
5. **Run development server:**
   ```bash
   PORT=3456 npm run dev
   ```

## 📖 Additional Resources

- **Google Setup**: See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for:
  - Complete Google Sheets setup (with screenshots workflow)
  - Service Account creation
  - Google Analytics configuration
  - Gmail App Password setup
  - Testing and troubleshooting

- **Deployment Guide**: See [DEPLOYMENT_UPDATED.md](DEPLOYMENT_UPDATED.md) for:
  - Complete Vercel deployment walkthrough
  - Google Sheets integration on Vercel
  - Environment variables guide
  - Troubleshooting common issues
  - Performance optimization tips
  - Data management and backups

- **Architecture Documentation**: See [ARCHITECTURE.md](ARCHITECTURE.md) for:
  - System architecture diagrams
  - Technology stack rationale
  - Database schemas (now using Google Sheets)
  - API documentation
  - Future roadmap (Phases 2-4)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Security

- Never commit `.env.local` or sensitive credentials
- Use environment variables for all configuration
- Keep dependencies updated
- Follow security best practices

## 📝 License

ISC

## 👥 Team

- **Project Lead**: [Your Name]
- **Contributors**: See GitHub contributors page

## 📧 Support

For questions or issues:
- **Email**: support@edtech.com
- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Issues**: GitHub Issues page

## 🙏 Acknowledgments

Built with modern web technologies:
- Next.js team for the amazing framework
- Vercel for deployment platform
- MongoDB for the database
- Tailwind CSS for the design system

---

**Made with ❤️ for B2B EdTech**