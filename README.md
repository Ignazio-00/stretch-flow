# StretchFlow - Daily Micro-Stretching PWA

A Progressive Web App that helps users integrate 30-second to 2-minute stretching exercises into their daily routines through contextual, habit-anchored micro-workouts.

## ✨ Features

- **🏃‍♂️ Quick Start**: Instantly begin stretching with pre-configured sessions
- **⏱️ Micro-Workouts**: 30-second to 2-minute exercises perfect for busy schedules
- **📱 Progressive Web App**: Install on any device, works offline
- **📊 Progress Tracking**: Monitor streaks, total sessions, and time spent stretching
- **🎯 Habit Anchoring**: Context-aware sessions (desk breaks, pre-meetings, etc.)
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations
- **🌙 Dark Mode**: Automatic theme switching based on system preferences
- **♿ Accessible**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **PWA**: next-pwa
- **Package Manager**: Bun.sh
- **Code Quality**: Biome (linting & formatting)
- **Data Persistence**: Local Storage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Modern web browser

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd stretch-flow
   ```

2. Install dependencies with Bun:

   ```bash
   bun install
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build the application
bun run build

# Start the production server
bun run start
```

## 📱 PWA Installation

StretchFlow can be installed as a Progressive Web App on any device:

1. **Desktop**: Look for the install icon in your browser's address bar
2. **Mobile**: Use "Add to Home Screen" from your browser's menu
3. **Manual**: Navigate to the app and follow browser-specific installation prompts

## 🎯 Exercise Categories

- **Neck**: Side stretches, forward stretches
- **Shoulders**: Rolls, cross-body stretches
- **Back**: Cat-cow stretches, spinal twists
- **Wrists**: Circles, prayer stretches
- **Hips**: Flexor stretches, figure-four stretches
- **Full-body**: Energizer sequences

## 🎮 Quick Sessions

- **Desk Break** (2 min): Perfect for work breaks
- **Pre-Meeting** (90s): Energize before meetings
- **Afternoon Boost** (3 min): Beat the afternoon slump
- **Quick Stretch** (30-60s): Random exercises for instant relief

## 📊 Progress Tracking

- **Current Streak**: Track consecutive days of stretching
- **Total Sessions**: Count of completed sessions
- **Total Time**: Minutes spent stretching
- **Weekly Goals**: Customizable session targets
- **Achievements**: Unlock badges for milestones

## 🛠️ Development Scripts

```bash
# Development
bun run dev              # Start development server
bun run type-check       # Check TypeScript types

# Code Quality
bun run lint             # Run Biome linting
bun run lint:fix         # Fix linting issues
bun run format           # Format code
bun run check            # Check code quality
bun run check:fix        # Fix code quality issues

# Production
bun run build            # Build for production
bun run start            # Start production server
```

## 🗂️ Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── session/         # Exercise session page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and data
├── store/               # Zustand stores
└── types/               # TypeScript type definitions
```

## 🎨 Design System

StretchFlow uses a custom design system built with Tailwind CSS:

- **Colors**: Blue and purple gradients with semantic color usage
- **Typography**: Inter font family with consistent sizing
- **Components**: Reusable component classes for cards, buttons, and badges
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 📱 Browser Support

StretchFlow supports all modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Build by [Ignazio Balistreri](https://github.com/Ignazio-00)

---

**Start your stretching journey today! 🧘‍♀️**
