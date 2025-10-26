# Epic 2 Dashboard Framework – Story 2.1.1: Main Dashboard Layout – Skeleton

Overview
- This document outlines a minimal skeleton plan for Story 2.1.1 (Main Dashboard Layout) to scaffold a modular, accessible dashboard using React with DaisyUI/Tailwind. The goal is to create a clean, testable foundation that can be progressively enhanced.

Skeleton Tasks
- Task 2.1.1.1: Create skeleton MainDashboardLayout component
- Task 2.1.1.2: Create DashboardHeader component
- Task 2.1.1.3: Create DashboardSidebar component (with basic role-based menu config)
- Task 2.1.1.4: Create Breadcrumb component
- Task 2.1.1.5: Create UserProfileMenu component
- Task 2.1.1.6: Create minimal unit tests for layout components
- Task 2.1.1.7: Wire layout into router/app (routing integration and simple feature flag for role-based menus)

Acceptance Notes (skeleton)
- Components render without crashing with basic props
- Sidebar renders a basic menu based on provided role
- Header includes a simple profile dropdown with ARIA attributes
- ARIA labels present for nav regions and interactive elements
- Layout adapts to a basic responsive design (Tailwind classes)

Integration Guidance
- Wire the MainDashboardLayout into App.tsx or a dashboard route
- Pass a userRole prop to drive role-based menus in the Sidebar
- Prepare a small feature flag or config to toggle between roles

Proposed File Layout
- apps/web/src/components/
  - MainDashboardLayout.tsx
  - DashboardHeader.tsx
  - DashboardSidebar.tsx
  - Breadcrumb.tsx
  - UserProfileMenu.tsx
- apps/web/src/tests/components/
  - MainDashboardLayout.test.tsx
  - DashboardSidebar.test.tsx

Notes
- This skeleton focuses on modular, testable components with accessible semantics and DAISYUI/Tailwind styling hooks.
- The implementation should prefer small, observable API surfaces (props like userRole and children).

Proposed Next Steps (for follow-up)
- Implement the skeleton files based on this plan
- Add minimal tests to validate render and role-based rendering
- Integrate with existing routing and add a simple role-switch demo
