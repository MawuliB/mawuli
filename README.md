# Mawuli - Personal Portfolio

[![Angular](https://img.shields.io/badge/Angular-17.3.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Private-lightgrey.svg)](LICENSE)

> 🚧 **Status**: Active Development - Major improvements coming soon!

A modern, interactive personal portfolio website built with Angular 17 showcasing professional experience, education, projects, and technical skills.

## 📋 Project Overview

This is a standalone Angular application featuring a single-page architecture with routing capabilities. The portfolio includes a custom cursor implementation and carousel component for an enhanced user experience.

**Generated with**: [Angular CLI](https://github.com/angular/angular-cli) version 17.3.6  
**Branch**: `production` (deployed to https://mawuli.thinks.work)  
**Status**: actively maintained — see [REVIEW.md](REVIEW.md) for the current audit + improvement plan

## ✨ Current Features

### Implemented Components

- ✅ **Home** - Landing page with introduction
- ✅ **Header** - Navigation bar with keyboard and button controls
- ✅ **Footer** - Site footer with links
- ✅ **Carousel** - Interactive image/content slider
- ✅ **Skills** - Technical skills showcase
- ✅ **Experience** - Professional experience timeline
- ✅ **Education** - Educational background
- ✅ **Projects** - Portfolio of work
- ✅ **Contact** - Contact information and form

### Technical Stack

- **Framework**: Angular 17.3.0 (Standalone Components)
- **Language**: TypeScript 5.4.2
- **Styling**: CSS3
- **Routing**: Angular Router with lazy loading support
- **State Management**: RxJS 7.8.0
- **Testing**: Jasmine 5.1.0 + Karma 6.4.0

### Key Features

- 🎯 Standalone component architecture (no NgModules)
- 🎨 Custom cursor interaction
- 🧭 Client-side routing with 6 main sections
- 📱 Modern Angular 17 features
- 🎪 Interactive carousel component

## 📊 Current Status

### ✅ Completed

- [x] Basic project structure setup
- [x] All core components created (7 components)
- [x] Routing configuration
- [x] Navigation implementation (keyboard + buttons)
- [x] Custom cursor functionality
- [x] Skills section
- [x] Footer component
- [x] Home page upgrade

### 🔧 Known Issues

1. **TypeScript Configuration Warning**: `moduleResolution: node` is deprecated (needs update to `bundler` or `node16`)
2. **Unused Import**: `RouterOutlet` imported but not used in `app.component.ts` template
3. **Testing**: Unit tests need implementation
4. **Responsive Design**: Mobile optimization pending

### 📈 Progress

- **Components**: 9/9 (100%)
- **Routing**: ✅ Complete
- **Testing Coverage**: ⏳ Pending
- **Responsive Design**: ⏳ In Progress
- **Documentation**: 📝 Basic

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Angular CLI 17.3.6

### Installation

```bash
# Clone the repository
git clone https://github.com/MawuliB/mawuli.git

# Navigate to project directory
cd mawuli

# Install dependencies
npm install
```

### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload on file changes.

### Build

```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm test
# or
ng test
```

Executes unit tests via [Karma](https://karma-runner.github.io).

### Additional Commands

```bash
# Watch mode for development
npm run watch

# Generate new component
ng generate component component-name
```

## 📁 Project Structure

```
mawuli/
├── src/
│   ├── app/
│   │   ├── carousel/          # Carousel component
│   │   ├── contact/           # Contact page
│   │   ├── education/         # Education section
│   │   ├── experience/        # Experience timeline
│   │   ├── footer/            # Footer component
│   │   ├── header/            # Header/Navigation
│   │   ├── home/              # Home/Landing page
│   │   ├── projects/          # Projects showcase
│   │   ├── skills/            # Skills display
│   │   ├── app.component.*    # Root component
│   │   ├── app.config.ts      # App configuration
│   │   └── app.routes.ts      # Route definitions
│   ├── assets/                # Static assets
│   │   ├── mine.png
│   │   └── xbone.png
│   ├── index.html             # Main HTML
│   ├── main.ts                # Application entry
│   └── styles.css             # Global styles
├── angular.json               # Angular configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
```

## 🔮 Upcoming Changes

> 🎯 **Major Refactoring Planned**

We're planning significant improvements to enhance the application's performance, maintainability, and user experience:

### Planned Improvements

- 🎨 Complete UI/UX redesign
- 📱 Full responsive design implementation
- ⚡ Performance optimization
- 🧪 Comprehensive test coverage
- 🔧 Fix TypeScript configuration warnings
- 📚 Enhanced documentation
- ♿ Accessibility improvements (WCAG compliance)
- 🌐 SEO optimization
- 🎭 Animation enhancements
- 📊 Analytics integration

### Technical Debt

- Update `moduleResolution` in tsconfig.json
- Remove unused imports
- Implement lazy loading for routes
- Add error handling
- Add loading states
- Optimize bundle size

## 🛠️ Technology Details

### Dependencies

- `@angular/animations`: ^17.3.0
- `@angular/common`: ^17.3.0
- `@angular/compiler`: ^17.3.0
- `@angular/core`: ^17.3.0
- `@angular/forms`: ^17.3.0
- `@angular/platform-browser`: ^17.3.0
- `@angular/router`: ^17.3.0

### Recent Updates

- **2025-10-23**: Navigation outline removed for cleaner UI
- **Earlier**: Added keyboard navigation and button controls
- **Earlier**: Skills section implemented
- **Earlier**: Footer component added
- **Earlier**: Initial project setup

## 📝 Git History

```
68bf9e0 - remove outline from nav buttons
60f7ffa - add nav(keyboard plus buttons) and upgrade home page
304abb3 - add skills
a19911a - footer
0c70a03 - Initial
e2d50bd - initial commit
```

## 🤝 Contributing

This is a personal portfolio project. Contributions, issues, and feature requests are welcome for learning purposes!

## 📄 License

This project is private and proprietary.

## 👤 Author

**Mawuli Badassou**

## 📞 Contact

Visit the contact page in the application or check out the Contact component for more information.

---

## 🔗 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Overview](https://angular.io/cli)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)

---

**Note**: This README is a high-level overview. The living audit and improvement plan live in [REVIEW.md](REVIEW.md). Routine update runbook is [UPDATE.md](UPDATE.md). The **playground** (experiments, dummy flows, private pages) lives in its own sibling repo at [github.com/MawuliB/playground](https://github.com/MawuliB/playground).
