# Ahorro Digital - QA Automation Project

## Project Overview

This project demonstrates QA Automation skills for the fictional product **Ahorro Digital** - a web application where users can explore savings products and simulate potential earnings from their deposits.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Testing | Playwright |
| Reports | Playwright HTML Reporter |

## Project Structure

```
ahorro-digital-qa/
├── docs/
│   ├── test-plan.md          # Test plan with objectives, scope, risks
│   └── test-cases.md         # 10+ documented test cases
├── frontend/                  # React application
├── backend/                   # Express API
├── tests/
│   ├── e2e/                  # UI tests with Playwright
│   └── api/                  # API tests
├── reports/                   # Generated test reports
└── bug-report.md             # Documented bugs with evidence
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ahorro-digital-qa.git
cd ahorro-digital-qa
```

2. **Install Backend dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Install Test dependencies**
```bash
cd ../tests
npm install
npx playwright install
```

## Running the Application

### Start Backend (Port 3001)
```bash
cd backend
npm run dev
```

### Start Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

## Running Tests

### Run all tests
```bash
cd tests
npm test
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Generate HTML Report
```bash
npm run test:report
```

## Test Coverage

| Priority | Module | Test Cases |
|----------|--------|------------|
| P0 | Onboarding (Register/Login) | 4 tests |
| P1 | Savings Simulator | 3 tests |
| P2 | Products Catalog | 3 tests |

## Documentation

- [Test Plan](./docs/test-plan.md)
- [Test Cases](./docs/test-cases.md)
- [Bug Report](./bug-report.md)

## Author

QA Automation Technical Challenge - Banco Caja Social

## License

MIT
