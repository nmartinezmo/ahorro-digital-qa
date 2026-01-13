# Test Cases - Ahorro Digital

## Overview

This document contains **12 test cases** covering functional, negative, and UI validation scenarios.

---

## P0 - Onboarding Module (Critical)

### TC-001: Successful User Registration

| Field | Value |
|-------|-------|
| **ID** | TC-001 |
| **Priority** | P0 |
| **Type** | Functional |
| **Module** | Registration |

**Preconditions:**
- User is on the registration page
- Email is not previously registered

**Steps:**
1. Navigate to /register
2. Enter valid name: "Juan Pérez"
3. Enter valid email: "juan@example.com"
4. Enter valid password: "Password123!"
5. Confirm password: "Password123!"
6. Click "Register" button

**Expected Result:**
- User is redirected to login page
- Success message is displayed
- User can login with new credentials

---

### TC-002: Registration with Missing Required Fields

| Field | Value |
|-------|-------|
| **ID** | TC-002 |
| **Priority** | P0 |
| **Type** | Negative |
| **Module** | Registration |

**Preconditions:**
- User is on the registration page

**Steps:**
1. Navigate to /register
2. Leave all fields empty
3. Click "Register" button

**Expected Result:**
- Form is not submitted
- Error messages appear for each required field
- Register button remains disabled OR validation errors shown

---

### TC-003: Successful Login

| Field | Value |
|-------|-------|
| **ID** | TC-003 |
| **Priority** | P0 |
| **Type** | Functional |
| **Module** | Login |

**Preconditions:**
- User account exists

**Steps:**
1. Navigate to /login
2. Enter valid email: "test@example.com"
3. Enter valid password: "Password123!"
4. Click "Login" button

**Expected Result:**
- User is redirected to dashboard/simulator
- User session is established
- Welcome message or user info displayed

---

### TC-004: Login with Invalid Credentials

| Field | Value |
|-------|-------|
| **ID** | TC-004 |
| **Priority** | P0 |
| **Type** | Negative |
| **Module** | Login |

**Preconditions:**
- User is on the login page

**Steps:**
1. Navigate to /login
2. Enter email: "wrong@example.com"
3. Enter password: "WrongPassword!"
4. Click "Login" button

**Expected Result:**
- User remains on login page
- Error message displayed: "Invalid credentials"
- No session is created

---

## P1 - Simulator Module (High)

### TC-005: Successful Savings Simulation

| Field | Value |
|-------|-------|
| **ID** | TC-005 |
| **Priority** | P1 |
| **Type** | Functional |
| **Module** | Simulator |

**Preconditions:**
- User is logged in
- User is on simulator page

**Steps:**
1. Navigate to /simulator
2. Enter deposit amount: 1,000,000
3. Select term: 12 months
4. Click "Calculate" button

**Expected Result:**
- Calculation result is displayed
- Shows: Initial amount, Interest rate, Final amount, Earnings
- Values are mathematically correct

---

### TC-006: Simulation with Zero Amount

| Field | Value |
|-------|-------|
| **ID** | TC-006 |
| **Priority** | P1 |
| **Type** | Negative |
| **Module** | Simulator |

**Preconditions:**
- User is logged in
- User is on simulator page

**Steps:**
1. Navigate to /simulator
2. Enter deposit amount: 0
3. Select term: 12 months
4. Click "Calculate" button

**Expected Result:**
- Error message: "Amount must be greater than 0"
- Calculation is not performed
- Calculate button disabled OR validation error shown

---

### TC-007: Simulation with Invalid Amount (Negative)

| Field | Value |
|-------|-------|
| **ID** | TC-007 |
| **Priority** | P1 |
| **Type** | Negative |
| **Module** | Simulator |

**Preconditions:**
- User is logged in
- User is on simulator page

**Steps:**
1. Navigate to /simulator
2. Enter deposit amount: -50000
3. Select term: 6 months
4. Click "Calculate" button

**Expected Result:**
- Error message: "Amount cannot be negative"
- Calculation is not performed

---

### TC-008: Simulation with Different Terms

| Field | Value |
|-------|-------|
| **ID** | TC-008 |
| **Priority** | P1 |
| **Type** | Functional |
| **Module** | Simulator |

**Preconditions:**
- User is logged in

**Steps:**
1. Navigate to /simulator
2. Enter deposit amount: 500,000
3. Test with terms: 3, 6, 12, 24 months
4. Verify different results for each term

**Expected Result:**
- Each term produces different earnings
- Longer terms yield higher returns
- Interest rates match product specifications

---

## P2 - Products Module (Medium)

### TC-009: View Products List

| Field | Value |
|-------|-------|
| **ID** | TC-009 |
| **Priority** | P2 |
| **Type** | Functional |
| **Module** | Products |

**Preconditions:**
- User is logged in

**Steps:**
1. Navigate to /products
2. Wait for products to load

**Expected Result:**
- Products list is displayed
- Each product shows: Name, Interest rate, Minimum amount
- At least 3 products are visible

---

### TC-010: View Product Details

| Field | Value |
|-------|-------|
| **ID** | TC-010 |
| **Priority** | P2 |
| **Type** | Functional |
| **Module** | Products |

**Preconditions:**
- User is logged in
- Products list is displayed

**Steps:**
1. Navigate to /products
2. Click on first product card
3. View product details

**Expected Result:**
- Product detail modal/page opens
- Shows: Full description, Terms, Conditions, Interest rates by term
- "Simulate" button available

---

### TC-011: Products Page - Unauthorized Access (401)

| Field | Value |
|-------|-------|
| **ID** | TC-011 |
| **Priority** | P2 |
| **Type** | Negative |
| **Module** | Products |

**Preconditions:**
- User is NOT logged in

**Steps:**
1. Try to access /products directly
2. Or call API /api/products without token

**Expected Result:**
- User is redirected to login page
- OR 401 Unauthorized error returned
- Protected content not accessible

---

### TC-012: UI Validation - Disabled Button States

| Field | Value |
|-------|-------|
| **ID** | TC-012 |
| **Priority** | P2 |
| **Type** | UI Validation |
| **Module** | General |

**Preconditions:**
- User is on registration page

**Steps:**
1. Navigate to /register
2. Observe "Register" button with empty form
3. Fill partial form data
4. Observe button state changes

**Expected Result:**
- Button is disabled when form is invalid
- Button becomes enabled when all validations pass
- Visual indication of disabled state (grayed out)

---

## Test Cases Summary

| Priority | Total | Functional | Negative | UI Validation |
|----------|-------|------------|----------|---------------|
| P0 | 4 | 2 | 2 | 0 |
| P1 | 4 | 2 | 2 | 0 |
| P2 | 4 | 2 | 1 | 1 |
| **Total** | **12** | **6** | **5** | **1** |
