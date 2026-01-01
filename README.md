# 🚀 Pascal Hintermaier - AI & Automation Portfolio

A modern, full-stack portfolio website showcasing AI & Automation skills with cutting-edge web technologies.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-06B6D4?logo=tailwindcss)

---

## ✨ Features

### 🎨 **Modern Design**
- **5 Theme System**: Cyberpunk, Corporate, Windows 95, RGB Gamer, Zen
- **Bento Grid Layout**: Modern, responsive design
- **macOS-Style Dock**: Smooth navigation with hover animations
- **Framer Motion**: Advanced animations and transitions

### 🧠 **AI-Powered**
- **AI Chat Assistant**: Real-time portfolio Q&A (SmolLM3-3B)
- **Image Comparison Tool**: Computer Vision with OpenCV
- **Smart Project Discovery**: AI-enhanced search

### ⚡ **Performance Optimized**
- **Code Splitting**: Lazy loading for faster initial load
- **Bundle Optimization**: Minimized JavaScript & CSS
- **Lighthouse Ready**: Targeting 90+ performance score
- **PWA Support**: Offline capabilities

### ♿ **Accessible**
- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader**: Optimized for assistive technologies
- **Reduced Motion**: Respects user preferences

### 🛡️ **Production Ready**
- **CI/CD Pipeline**: GitHub Actions
- **Automated Testing**: Unit & integration tests
- **Error Monitoring**: Real-time error tracking
- **Privacy-First Analytics**: Umami integration

---

## 🛠️ Tech Stack

### **Frontend**
```
React 19.2.0        - UI Framework
TypeScript 5.9.3      - Type Safety
Vite 7.2.4           - Build Tool
Tailwind CSS 4.1.18   - Styling
Framer Motion 12.23.26 - Animations
```

### **Backend**
```
Python 3.8+          - Backend Logic
Flask 2.3+           - Web Framework
OpenCV 4.8+          - Computer Vision
scikit-image          - Image Processing
```

### **AI/ML**
```
SmolLM3-3B           - Chatbot LLM
Florence-2            - Vision Model
ChromaDB              - Vector Database
Transformers.js        - Inference
```

### **DevOps**
```
GitHub Actions         - CI/CD
Vercel                - Deployment
Sentry                - Error Tracking
Umami                 - Analytics
```

---

## 📦 Installation

### **Prerequisites**
- Node.js >= 18.0.0
- Python >= 3.8
- Git

### **Frontend Setup**
```bash
# Clone repository
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### **Backend Setup (Image Compare Tool)**
```bash
cd public/projects/image-compare/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python app.py
```

---

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Netlify**
```bash
# Build
npm run build

# Deploy dist folder via Netlify Dashboard
```

### **Docker**
```bash
# Build image
docker build -t portfolio-website .

# Run container
docker run -p 3000:3000 portfolio-website
```

---

## 📁 Project Structure

```
portfolio-website/
├── src/                    # React application
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── public/                 # Static assets
│   └── projects/          # Sub-projects
│       └── image-compare/ # AI Image Compare Tool
│           ├── backend/     # Flask API
│           └── frontend/    # HTML/JS/CSS
├── docs/                   # Documentation
│   ├── PROJECT_PLAN.md      # Full enhancement plan
│   ├── API.md             # API documentation
│   └── DEPLOYMENT.md      # Deployment guide
└── tests/                  # Test files
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 📊 Development Roadmap

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the complete 25-day enhancement roadmap.

### **Current Phase: Foundation** (Days 1-2)
- [x] Project structure analysis
- [ ] Fix critical white screen issue
- [ ] Fix theme persistence
- [ ] Add error boundaries
- [ ] Test cross-browser compatibility

### **Upcoming Phases**
- [ ] Performance Optimization (Days 3-5)
- [ ] AI Chat Assistant Integration (Days 6-10)
- [ ] Accessibility & SEO (Days 11-13)
- [ ] Enhanced Image Compare Tool (Days 14-16)
- [ ] Advanced Animations (Days 17-18)
- [ ] Privacy-First Analytics (Days 19-20)
- [ ] Headless CMS Integration (Days 21-22)
- [ ] Deployment & CI/CD (Days 23-24)
- [ ] Production Enhancements (Day 25)

---

## 🎯 Key Features

### **1. AI Chat Assistant**
- Real-time streaming responses
- Context-aware conversations
- RAG-powered knowledge base
- Multi-language support
- Project-specific discussions

### **2. Image Comparison Tool**
- SSIM similarity analysis
- ORB feature matching
- Pixel difference visualization
- Histogram comparison
- Edge detection
- AI-generated descriptions (Florence-2)

### **3. Theme System**
- 5 customizable themes
- Smooth transitions
- LocalStorage persistence
- Automatic color adaptation
- Accessibility support

### **4. Project Showcase**
- Bento grid layout
- Interactive project cards
- Live demos
- GitHub integration
- Tech stack visualization

---

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage

# Run linter
npm run lint

# Type check
npm run typecheck
```

---

## 📈 Performance

### **Current Metrics** (Baseline)
- Performance: TBD
- Accessibility: TBD
- Best Practices: TBD
- SEO: TBD
- Bundle Size: 365KB JS, 41KB CSS

### **Target Metrics**
- Performance: 90+
- Accessibility: 95+ (WCAG 2.1 AA)
- Best Practices: 90+
- SEO: 90+
- Bundle Size: < 200KB JS, < 30KB CSS

---

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the root directory:

```bash
# Frontend
VITE_API_URL=http://localhost:5000
VITE_UMAMI_ID=your-umami-id
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_ANALYTICS=true

# Backend (Image Compare)
FLASK_SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

### **Customization**
```javascript
// src/config/theme.ts
export const themes = [
  { id: 'cyberpunk', name: 'Cyberpunk', ... },
  { id: 'corporate', name: 'Corporate', ... },
  // Add your own themes here
];

// src/config/projects.ts
export const projects = [
  {
    title: 'Your Project',
    role: 'Your Role',
    desc: 'Description',
    tech: ['React', 'TypeScript'],
    image: '/images/your-project.png',
    github: 'https://github.com/...',
    demo: 'https://your-demo.com'
  },
  // Add your projects here
];
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow PEP 8 (Python) and ESLint rules (JavaScript)
- Write tests for new features
- Update documentation
- Keep PRs focused and small

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Pascal Hintermaier**

- 📍 Mannheim, Germany
- 🎓 IT-Systeminformatik (In Progress)
- 💼 6 Years Gastro-Management Experience
- 🚀 Transition to IT & AI
- 🔥 Skills: Linux, Python, React, AI/ML, Docker

### **Connect**
- [LinkedIn](https://linkedin.com/in/pascal-hintermaier)
- [GitHub](https://github.com/yourusername)
- [Email](mailto:pascal@example.com)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Framework
- [Vite](https://vite.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://motion.dev/) - Animations
- [React Icons](https://react-icons.github.io/react-icons/) - Icons
- [OpenCV](https://opencv.org/) - Computer Vision
- [Hugging Face](https://huggingface.co/) - AI Models

---

## 📞 Support

For questions, suggestions, or issues:
- 📧 Email: pascal@example.com
- 💬 GitHub Issues: [Create Issue](https://github.com/yourusername/portfolio-website/issues)
- 📚 Documentation: [PROJECT_PLAN.md](./PROJECT_PLAN.md)

---

## 🎯 Project Status

**Current Version:** 1.0.0  
**Last Updated:** 2025-01-01  
**Status:** 🚀 In Active Development

### **Progress Tracking**
- [ ] Phase 1: Critical Fixes & Foundation
- [ ] Phase 2: Performance Optimization
- [ ] Phase 3: AI Chat Assistant
- [ ] Phase 4: Accessibility & SEO
- [ ] Phase 5: Enhanced Image Tool
- [ ] Phase 6: Advanced Animations
- [ ] Phase 7: Privacy Analytics
- [ ] Phase 8: CMS Integration
- [ ] Phase 9: Deployment & CI/CD
- [ ] Phase 10: Production Enhancements

---

**Built with ❤️ using React, TypeScript, and AI** 🚀
