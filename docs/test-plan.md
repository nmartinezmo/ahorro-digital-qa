# Test Plan - Ahorro Digital

## 1. Introduction

### 1.1 Purpose
This test plan defines the strategy, objectives, scope, and approach for testing the **Ahorro Digital** web application. The goal is to ensure a bug-free, reliable user experience before production release.

### 1.2 Product Overview
Ahorro Digital is a web application that allows users to:
- Register and authenticate
- Explore savings products
- Simulate potential earnings based on deposit amounts and terms

## 2. Objectives

| Objective | Description |
|-----------|-------------|
| **Functional Validation** | Verify all features work according to requirements |
| **Negative Testing** | Ensure graceful error handling for invalid inputs |
| **UI/UX Validation** | Confirm proper visual feedback and user interactions |
| **API Validation** | Verify backend endpoints respond correctly |
| **Regression Prevention** | Automated tests to catch future regressions |

## 3. Scope

### 3.1 In Scope

| Module | Features |
|--------|----------|
| **Onboarding** | User registration, Login, Logout, Session management |
| **Simulator** | Amount input, Term selection, Interest calculation, Results display |
| **Products** | Products listing, Product details, Filtering |

### 3.2 Out of Scope
- Performance/Load testing
- Security penetration testing
- Mobile responsiveness testing
- Accessibility testing (WCAG)

## 4. Risk Analysis

### 4.1 Priority Matrix

| Priority | Risk Level | Module | Impact | Mitigation |
|----------|------------|--------|--------|------------|
| **P0** | Critical | Onboarding | Blocks entire user flow | Extensive automated testing |
| **P1** | High | Simulator | Core business functionality | Calculation validation tests |
| **P2** | Medium | Products | Informational content | Basic functional tests |

### 4.2 Risk Details

#### P0 - Onboarding (Critical)
- **Risk**: Users cannot register or login
- **Impact**: Complete application unusability
- **Test Focus**: 
  - Required field validation
  - Email format validation
  - Password requirements
  - Invalid credentials handling
  - Session persistence

#### P1 - Simulator (High)
- **Risk**: Incorrect interest calculations
- **Impact**: Financial misinformation, trust loss
- **Test Focus**:
  - Calculation accuracy
  - Edge cases (0 amount, negative values)
  - Term boundary conditions

#### P2 - Products (Medium)
- **Risk**: Products not displaying correctly
- **Impact**: User confusion, reduced engagement
- **Test Focus**:
  - Data rendering
  - Navigation between products

## 5. Test Strategy

### 5.1 Test Types

| Type | Description | Tool |
|------|-------------|------|
| **E2E UI Tests** | Full user flow automation | Playwright |
| **API Tests** | Backend endpoint validation | Playwright API |
| **Visual Tests** | UI element verification | Playwright assertions |

### 5.2 Test Environment

| Component | Configuration |
|-----------|---------------|
| Browser | Chromium (default), Firefox, WebKit |
| Frontend URL | http://localhost:5173 |
| Backend URL | http://localhost:3001 |
| Execution Mode | Headless with video recording |

### 5.3 Test Data

| Scenario | Data |
|----------|------|
| Valid User | test@example.com / Password123! |
| Invalid Email | invalid-email |
| Short Password | 123 |
| Valid Amount | 1000000 |
| Invalid Amount | 0, -100, abc |

## 6. Entry & Exit Criteria

### 6.1 Entry Criteria
- [ ] Application deployed and accessible
- [ ] Test environment configured
- [ ] Test data prepared
- [ ] Playwright installed and configured

### 6.2 Exit Criteria
- [ ] All P0 tests passing
- [ ] 90%+ P1 tests passing
- [ ] 80%+ P2 tests passing
- [ ] No critical bugs open
- [ ] Test report generated

## 7. Deliverables

| Deliverable | Format |
|-------------|--------|
| Test Plan | Markdown (this document) |
| Test Cases | Markdown + Playwright specs |
| Test Report | HTML (Playwright Reporter) |
| Bug Report | Markdown with evidence |
| Video Evidence | WebM recordings |

## 8. Schedule

| Phase | Duration |
|-------|----------|
| Test Planning | 1 day |
| Test Development | 2 days |
| Test Execution | 1 day |
| Bug Reporting | 1 day |
| **Total** | **5 days** |

## 9. Approval

| Role | Name | Date |
|------|------|------|
| QA Engineer | [Your Name] | [Date] |
| Reviewer | [Reviewer] | [Date] |
