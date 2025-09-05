# MatchMate - AI-Powered Hackathon Teammate Matching

MatchMate is a modern web application that helps hackathon participants find their perfect teammates using intelligent matching algorithms. Built with React, TypeScript, and Tailwind CSS.

## Features

- **AI-Powered Matching**: Advanced algorithm that matches based on skills, roles, and interests
- **Smart Compatibility Scoring**: 0-100% compatibility scores with detailed explanations  
- **Interactive Profile Building**: Token-based skill input, role chips, and interest selection
- **Real-time Results**: Instant matching with loading states and smooth animations
- **Local Persistence**: Save profiles, matches, and favorites using localStorage
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode Support**: System preference detection with manual toggle
- **Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: lucide-react  
- **Routing**: React Router
- **State Management**: React hooks + localStorage

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## How It Works

### 1. Profile Creation (`/match`)
- Select your hackathon
- Fill in personal details and contact info
- Choose your roles (Frontend, Backend, ML/AI, etc.)
- Add technical skills with autocomplete suggestions
- Select project interests and availability
- Write a brief description

### 2. AI Matching Algorithm
The matching system uses weighted scoring:
- **Skills Overlap (60%)**: Shared technical skills
- **Role Compatibility (25%)**: Both overlapping and complementary roles  
- **Interest Alignment (15%)**: Common project domains and causes

### 3. Results Display (`/results`)
- Match cards with compatibility scores
- Detailed reasoning for each match
- Contact information with copy-to-clipboard
- Favorite/save functionality
- Filtering and sorting options
- Refinement tools

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── HeaderNav.tsx   # Navigation header
│   ├── Footer.tsx      # App footer
│   ├── FormField.tsx   # Form field wrapper
│   ├── TokenInput.tsx  # Skills input with chips
│   ├── RoleChips.tsx   # Role selection chips
│   ├── InterestChips.tsx # Interest selection chips
│   ├── ScoreBar.tsx    # Match score progress bar
│   ├── MatchCard.tsx   # Individual match display
│   └── EmptyState.tsx  # No results state
├── routes/             # Page components  
│   ├── Landing.tsx     # Homepage
│   ├── MatchForm.tsx   # Profile creation form
│   └── Results.tsx     # Match results display
├── lib/                # Utilities and services
│   ├── api.ts          # Mock API and matching logic
│   ├── storage.ts      # localStorage utilities
│   └── utils.ts        # General utilities
├── mocks/              # Mock data
│   └── seed.ts         # Sample user profiles
├── hooks/              # Custom React hooks
│   └── use-toast.ts    # Toast notifications
└── main.tsx            # App entry point
```

## Mock Data

The app includes realistic mock data for three hackathons:
- **SCE 2025**: 7 diverse participant profiles
- **HackDavis**: 6 participant profiles  
- **HackHarvard**: 7 participant profiles

Each profile includes varied:
- Roles (Frontend, Backend, ML/AI, Mobile, Design, Product, Hardware)
- Skills (React, Python, Figma, PyTorch, etc.)
- Interests (Health, Fintech, Climate, Social Good, etc.)
- Availability and contact information

## Key Components

### TokenInput
Advanced skill input with:
- Autocomplete suggestions
- Keyboard navigation (Enter to add, Backspace to remove)
- Visual chip display with removal buttons
- Accessibility support

### MatchCard
Comprehensive match display featuring:
- User avatar and basic info
- Animated progress bar for match score
- Role and skill badges
- Match reasoning chips
- Contact copying with toast feedback
- Favorite toggle with persistence

### ScoreBar
Visual match compatibility with:
- Color-coded progress bar (green 80%+, yellow 60%+, orange below)
- Smooth animations
- Accessible labels

## Accessibility Features

- **Keyboard Navigation**: Full app navigable with keyboard only
- **Focus Management**: Visible focus rings and logical tab order
- **Screen Reader Support**: ARIA labels, roles, and descriptions
- **Color Contrast**: WCAG compliant color combinations
- **Semantic HTML**: Proper heading hierarchy and landmark regions

## Local Storage

Data persistence includes:
- `mm.lastProfile`: Most recent profile data
- `mm.latestMatches`: Current match results  
- `mm.savedMatches`: Array of favorited match IDs

## Performance

- **Code Splitting**: Route-based lazy loading
- **Optimized Rendering**: Memoized components and calculations
- **Efficient Updates**: Minimal re-renders with proper dependency arrays
- **Bundle Optimization**: Tree shaking and dead code elimination

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.