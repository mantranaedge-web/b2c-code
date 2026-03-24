# B2B EdTech Platform - Architecture Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Why This Tech Stack?](#why-this-tech-stack)
5. [System Flow](#system-flow)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Component Structure](#component-structure)
9. [Deployment Architecture](#deployment-architecture)
10. [Next Steps & Future Phases](#next-steps--future-phases)

---

## 🎯 System Overview

The B2B EdTech Platform is a corporate training solution designed to connect businesses with professional courses. It features a sophisticated lead management system, course showcase, and role-based access for administrators and vendors.

### Key Features
- **Course Showcase**: Browse and view detailed course information
- **Lead Management**: Automated lead capture with pre-filled forms
- **Email Notifications**: Instant alerts to sales team via Nodemailer
- **Admin Panel**: Comprehensive lead tracking and management
- **Vendor Panel**: Course upload and management interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## 🏗️ Architecture Diagram

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Browser    │  │   Mobile     │  │    Tablet    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼───────────────────┼──────────────────┼────────────────┘
          │                   │                  │
          └───────────────────┴──────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   NEXT.JS APP    │
                    │   (Port 3000+)   │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  PRESENTATION  │  │  APPLICATION    │  │    API LAYER   │
│     LAYER      │  │     LAYER       │  │                │
│                │  │                 │  │  /api/leads    │
│ • Landing      │  │ • Components    │  │   - GET        │
│ • Course Cards │  │ • State Mgmt    │  │   - POST       │
│ • Lead Form    │  │ • Routing       │  │                │
│ • Admin Panel  │  │                 │  │                │
└────────────────┘  └─────────┬───────┘  └────────┬───────┘
                              │                    │
                    ┌─────────▼──────────┐         │
                    │  BUSINESS LOGIC    │◄────────┘
                    │   • Validation     │
                    │   • Email Service  │
                    └────────┬───────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│   MONGODB      │  │   NODEMAILER    │  │  FILE SYSTEM   │
│   DATABASE     │  │  EMAIL SERVICE  │  │                │
└────────────────┘  └─────────────────┘  └────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI component library
- **Tailwind CSS 3.4** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Mongoose 9.x** - MongoDB object modeling
- **Nodemailer 7.x** - Email sending service

### Database
- **MongoDB 7.x** - NoSQL database

### Development Tools
- **Node.js 20.x** - JavaScript runtime
- **npm 10.x** - Package manager

---

## 💡 Why This Tech Stack?

### 1. Next.js 14 ✅
- **SSR & SEO**: Better search engine visibility
- **App Router**: Modern routing with layouts
- **API Routes**: No separate backend needed
- **Performance**: Automatic optimization
- **Production Ready**: Used by Netflix, Twitch

### 2. Tailwind CSS ✅
- **Rapid Development**: Utility classes
- **Consistency**: Built-in design system
- **Performance**: Purges unused CSS
- **Mobile-First**: Responsive by default

### 3. MongoDB ✅
- **Flexible Schema**: Easy data evolution
- **JSON-like**: Perfect for JavaScript
- **Scalable**: Horizontal scaling
- **Cloud Ready**: MongoDB Atlas

### 4. Nodemailer ✅
- **No Vendor Lock-in**: Works with any SMTP
- **Free**: No additional costs
- **Flexible**: Rich HTML templates

---

## 🔄 System Flow

### Lead Capture Flow
```
User Browse Courses
       ↓
Click "Enquire Now"
       ↓
Form Opens (Course Pre-filled ✓)
       ↓
User Fills Details
       ↓
Submit → POST /api/leads
       ↓
    ┌──┴──┐
    ↓     ↓
 MongoDB  Email
  Save    Send
    └──┬──┘
       ↓
   Success
```

---

## 🗄️ Database Schema

### Lead Collection
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  company: String (required),
  courseName: String (required),
  message: String,
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost',
  createdAt: Date,
  updatedAt: Date
}
```

### Course Collection
```javascript
{
  title: String (required),
  description: String (required),
  duration: String (required),
  level: 'Beginner' | 'Intermediate' | 'Advanced',
  price: Number (required),
  category: String (required),
  instructor: String (required),
  rating: Number (0-5),
  studentsEnrolled: Number,
  modules: Array,
  isActive: Boolean
}
```

---

## 🔌 API Endpoints

### POST /api/leads
Create a new lead

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "phone": "+91 98765 43210",
  "company": "ABC Corp",
  "courseName": "Full Stack Development"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Lead submitted successfully",
  "lead": { "id": "...", "name": "John Doe" }
}
```

### GET /api/leads
Retrieve all leads (Admin)

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "leads": [...]
}
```

---

## 🧩 Component Structure

```
src/
├── app/
│   ├── layout.js              # Root layout
│   ├── page.js                # Landing page
│   ├── courses/[id]/page.js   # Course details
│   ├── admin/page.js          # Admin dashboard
│   ├── vendor/page.js         # Vendor panel
│   └── api/leads/route.js     # API endpoints
├── components/
│   ├── CourseCard.js          # Course card
│   └── LeadForm.js            # Lead form modal
├── lib/
│   ├── mongodb.js             # DB connection
│   └── email.js               # Email service
└── models/
    ├── Lead.js                # Lead schema
    └── Course.js              # Course schema
```

---

## 🚀 Deployment Architecture

### Development
```
Local Machine → Port 3000+ → MongoDB Local/Atlas
```

### Production (Recommended)
```
Vercel (Next.js) → MongoDB Atlas → SMTP Service
```

### Infrastructure Components
- **Frontend & API**: Vercel (auto-scaling)
- **Database**: MongoDB Atlas (managed)
- **Email**: Gmail/SendGrid SMTP
- **CDN**: Vercel Edge Network
- **SSL**: Automatic HTTPS

---

## 📈 Next Steps & Future Phases

### Phase 1: ✅ MVP (Current)
- [x] Course showcase
- [x] Lead capture system
- [x] Email notifications
- [x] Admin panel
- [x] Vendor panel
- [x] Course details pages

### Phase 2: 🔄 Enhancement (Q2 2024)
- [ ] **Authentication System**
  - User registration/login
  - JWT-based authentication
  - Role-based access control (RBAC)
  
- [ ] **Payment Integration**
  - Razorpay/Stripe integration
  - Invoice generation
  - Payment tracking

- [ ] **Course Management**
  - Dynamic course creation from database
  - Course content upload
  - Video hosting integration

### Phase 3: 🎯 Advanced Features (Q3 2024)
- [ ] **Learning Management**
  - Progress tracking
  - Quizzes and assessments
  - Certificates generation
  
- [ ] **Analytics Dashboard**
  - Lead conversion metrics
  - Course performance
  - Revenue tracking

- [ ] **Communication**
  - In-app messaging
  - Video conferencing integration
  - Discussion forums

### Phase 4: 🚀 Scale & Optimize (Q4 2024)
- [ ] **Performance**
  - Redis caching
  - Database indexing
  - CDN optimization

- [ ] **Advanced Features**
  - AI-powered course recommendations
  - Chatbot support
  - Multi-language support

- [ ] **Enterprise Features**
  - White-label solution
  - Custom branding
  - API for integrations

---

## 🔧 Technical Improvements Roadmap

### Short Term (1-3 months)
1. Add TypeScript for type safety
2. Implement unit and integration tests
3. Add error boundary components
4. Set up CI/CD pipeline
5. Add logging and monitoring

### Medium Term (3-6 months)
1. Implement server-side caching
2. Add GraphQL API layer
3. Optimize images with Next.js Image
4. Add Progressive Web App (PWA) features
5. Implement A/B testing

### Long Term (6-12 months)
1. Microservices architecture
2. Kubernetes deployment
3. Advanced analytics with ML
4. Real-time collaboration features
5. Mobile app development

---

## 📊 Success Metrics

### Current Baseline
- Page Load Time: < 3s
- API Response Time: < 500ms
- Mobile Responsive: Yes
- SEO Score: TBD

### Target Metrics
- 95% Uptime
- < 1s page load time
- 90+ Lighthouse score
- 50%+ lead conversion rate

---

## 🤝 Contributing

For team members working on this project:

1. **Branch Strategy**: feature/[feature-name]
2. **Commit Convention**: Conventional Commits
3. **Code Review**: Required before merge
4. **Testing**: Unit tests for critical paths

---

## 📞 Support & Contact

For questions or issues:
- **Technical Lead**: [Your Name]
- **Email**: support@edtech.com
- **Documentation**: This file + README.md

---

**Last Updated**: 2024-02-03
**Version**: 1.0.0
**Status**: Production Ready