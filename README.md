# Kids Hub - Interactive Educational Platform

<div align="center">

![Kids Hub](https://img.shields.io/badge/Kids-Hub-3B82F6?style=flat-square)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

A modern, interactive educational platform designed for children combining music, drawing, storytelling, and quizzes in one engaging app.

[Features](#features) • [Getting Started](#getting-started) • [Architecture](#architecture) • [Contributing](#contributing)

</div>

---

## Overview

Kids Hub is a React-based web application designed to make learning fun for children through interactive activities. The app features four main modules: a virtual piano, drawing canvas, story explorer, and educational quizzes. Built with a focus on accessibility, responsiveness, and child-friendly UI/UX principles.

### Key Highlights

- **🎹 Interactive Piano** - Play musical notes with visual feedback and recording capabilities
- **🎨 Drawing Canvas** - Creative drawing tools with gallery management
- **📚 Story Explorer** - Browse and read stories organized by category
- **🎯 Quiz Module** - Educational quizzes with instant feedback and scoring
- **🌍 Multi-Language Support** - English and Amharic translations
- **🌓 Dark/Light Mode** - Eye-friendly themes optimized for children
- **📱 Fully Responsive** - Seamless experience on all devices
- **🔐 Secure Authentication** - Email/password signup with HTTP-only cookie storage

---

## Features

### 1. Piano Instrument
- Realistic grand piano interface with 3-octave keyboard
- Multiple instrument sounds (Piano, Violin, Flute, Trumpet)
- Sustain pedal support for realistic sound control
- Keyboard shortcuts for rapid playing
- Record and playback functionality
- Built-in tutorials with note sequences

### 2. Painting App
- Canvas-based drawing with customizable brush sizes
- Color palette for creative expression
- Eraser functionality for corrections
- Undo feature for mistake recovery
- Download artwork as PNG
- Cloud gallery for logged-in users

### 3. Quiz Module
- 200+ questions across multiple categories
- Instant feedback on answers
- Progress tracking and scoring
- Leaderboard system
- Category filtering for targeted learning
- Responsive design for mobile learning

### 4. Story Teller
- 50+ stories in multiple categories
- Beautiful story viewer with smooth navigation
- Progress tracker
- Category filtering
- Smooth animations and transitions

---

## Tech Stack

### Frontend
- **React 18+** - UI library
- **React Router** - Client-side routing
- **React Piano** - Piano component
- **Konva.js** - Canvas drawing library
- **Tone.js** - Web audio API
- **Soundfont Player** - Instrument sounds
- **i18n** - Multi-language support
- **CSS3** - Modern styling with animations

### Backend
- **Node.js + Express** - REST API server
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens (HTTP-only cookies)
- **CORS** - Cross-origin requests

### Data
- **JSON** - Structured data format for quizzes and stories
- **HTTP-only Cookies** - Secure token storage

### Development
- **Vite** - Build tool and dev server
- **ESLint** - Code quality
- **Git** - Version control

---

## Architecture

### Project Structure

```
kids-hub/
├── src/
│   ├── Components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx           # Login form component
│   │   │   ├── Register.jsx        # Registration form component
│   │   │   └── AuthForm.css        # Auth styling
│   │   ├── i18n/
│   │   │   ├── LanguageContext.jsx # Language state management
│   │   │   └── translations.js     # EN/AM translations
│   │   ├── utils/
│   │   │   ├── jwt.js              # Token management (HTTP cookies)
│   │   │   └── api.js              # API configuration
│   │   ├── HomePage.jsx            # Main landing page
│   │   ├── PianoInstrument.jsx     # Piano component
│   │   ├── PaintingApp.jsx         # Drawing app component
│   │   ├── StoryTeller.jsx         # Story reader component
│   │   └── QuizApp.jsx             # Quiz module component
│   ├── App.jsx                      # Main app component
│   ├── App.css                      # Global styles
│   └── index.css                    # Root styles and theme
├── public/
│   └── quizData.json                # Quiz questions database
├── back-end/
│   └── server/                      # Express API server
├── vite.config.js
└── package.json
```

### Data Flow

```
User Login
    ↓
API Request (credentials: include)
    ↓
Server Sets HTTP-only Cookie
    ↓
Browser Auto-includes Cookie in Requests
    ↓
Protected Routes Verified
    ↓
User Authenticated
```

### Component Hierarchy

```
App
├── Navbar (Navigation & Language)
├── AuthContext
│   ├── Login
│   └── Register
└── Routes
    ├── HomePage
    ├── PianoInstrument
    ├── PaintingApp
    ├── QuizApp
    └── StoryTeller
```

---

## Getting Started

### Prerequisites

- **Node.js** v16+ and npm/pnpm
- **Git** for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Messibre/kids-hub.git
   cd kids-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Create environment file** (`.env.local`)
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   - Visit `http://localhost:5173` (or configured port)

### Backend Setup

See [back-end/server/README.md](./back-end/server/README.md) for API server configuration.

---

## Usage

### For Users

1. **Sign Up** - Create account with email and password
2. **Explore Activities** - Choose from Piano, Drawing, Stories, or Quizzes
3. **Switch Language** - Toggle between English and Amharic using navbar
4. **Toggle Theme** - Switch between light and dark modes
5. **Save Progress** - Logged-in users can save artwork and quiz scores

### For Developers

#### Add New Quiz Questions

Edit `public/quizData.json`:
```json
{
  "question": "Question text?",
  "options": ["Option 1", "Option 2", "Option 3"],
  "correctAnswerIndex": 0,
  "category": "Science"
}
```

#### Add New Stories

Update story data in backend or create `storiesData.json`:
```json
{
  "title": "Story Title",
  "content": "Story content here...",
  "category": "Adventure"
}
```

#### Add Translations

Update `src/Components/i18n/translations.js`:
```js
export const translations = {
  en: { /* English strings */ },
  am: { /* Amharic strings */ }
}
```

---

## Security

### Authentication & Cookies

- **HTTP-only Cookies** - JWT tokens stored securely, inaccessible to JavaScript
- **Credentials Mode** - API requests include cookies automatically
- **CSRF Protection** - Server validates request origins
- **Password Hashing** - Bcrypt for password security (backend)
- **Token Expiry** - Automatic token refresh on activity

### Data Privacy

- **No Analytics Tracking** - GDPR compliant
- **Minimal Data Collection** - Only email and user preferences
- **Client-Side Processing** - Drawing/audio doesn't leave device until saved
- **No Third-Party Services** - All data hosted privately

---

## Mobile Responsiveness

The app is fully responsive with optimized experiences for:
- **Tablets** (768px+) - Expanded layouts
- **Phones** (480px+) - Optimized touch targets (44px minimum)
- **Desktops** (1200px+) - Full-featured view

Touch-friendly button sizes and spacing ensure accessibility for young users.

---

## Internationalization (i18n)

### Supported Languages

- **English** (en) - Default
- **Amharic** (am) - Community supported

### Adding New Language

1. Add translations to `src/Components/i18n/translations.js`
2. Update language options in navbar
3. Test across all components

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Latest 2 versions |
| Firefox | ✅ Latest 2 versions |
| Safari  | ✅ Latest 2 versions |
| Edge    | ✅ Latest 2 versions |

---

## Performance Optimizations

- **Code Splitting** - Lazy load routes
- **Image Optimization** - Responsive images with proper sizing
- **CSS-in-JS** - Minimize CSS parsing
- **Efficient Re-renders** - React optimization
- **Asset Compression** - Gzip compression on server
- **CDN Ready** - Deploy to Vercel, Netlify, or Cloudflare

---

## Known Limitations

- Drawing canvas limited to 1000x1000px for performance
- Piano sounds require internet connection (Web Audio API)
- Maximum 50 simultaneous users for real-time features
- Quiz has fixed question set (expandable with backend)

---

## Roadmap

### v2.0 (Planned)
- [ ] Multiplayer piano sessions
- [ ] AI story generation
- [ ] Teacher dashboard
- [ ] Achievement badges
- [ ] In-app payment for premium content

### v1.5 (In Progress)
- [ ] Dark/Light theme toggle
- [ ] Offline support (PWA)
- [ ] Voice-based quiz narration
- [ ] More languages (Spanish, French)

---

## Contributing

We welcome contributions! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow React best practices
- Keep components focused and reusable
- Add comments for complex logic
- Test on mobile devices
- Maintain accessibility standards

---

## License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

### MIT License Summary

- ✅ Free for commercial use
- ✅ Free to modify
- ✅ Free to distribute
- ⚠️ Must include license
- ⚠️ No warranty provided

---

## Support & Feedback

- **Report Bugs** - Open an [Issue](https://github.com/Messibre/kids-hub/issues)
- **Request Features** - Start a [Discussion](https://github.com/Messibre/kids-hub/discussions)
- **Ask Questions** - Email: [messibre21@gmail.com](mailto:messibre21@gmail.com)

---

## Deployment

### Vercel (Recommended)

1. **Frontend:**
   - Connect GitHub repository to Vercel
   - Set `VITE_API_BASE_URL` environment variable
   - Deploy automatically on push

2. **Backend:**
   - Create separate Vercel project
   - Set root directory to `back-end/server`
   - Add MongoDB URI and JWT secret

3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.vercel.app
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Docker Deployment

```bash
docker build -t kids-hub .
docker run -p 3000:3000 kids-hub
```

---

## Acknowledgments

- **React Piano Library** - For piano functionality
- **Konva.js** - For canvas drawing
- **Tone.js** - For Web Audio API support
- **Community Contributors** - For translations and feedback
- **Inspired by** - Leading educational platforms and child development research

---

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Changelog

### v1.0.0 - Current Release
- ✅ Piano instrument with 88 keys and 4 instruments
- ✅ Drawing canvas with gallery management
- ✅ 200+ quiz questions across 8 categories
- ✅ 50+ stories for young readers
- ✅ Multi-language support (EN/AM)
- ✅ Secure authentication with HTTP-only cookies
- ✅ Mobile-responsive design
- ✅ Dark/Light theme support
- ✅ Realistic piano UI with professional styling

---

<div align="center">

**Made with 💙 for kids everywhere**

[Back to Top](#kids-hub---interactive-educational-platform)

</div>

