# Epic 2 Dashboard Framework – Story 2.1.1: Main Dashboard Layout – Implementation Plan

Overview
- This document translates the Skeleton for Story 2.1.1 into a concrete implementation plan to deliver a modular, accessible dashboard using React with DaisyUI/Tailwind.

Acceptance Criteria (from Epic doc)
- [ ] Main layout component with header, sidebar, and content area
- [ ] Responsive design that works on desktop, tablet, and mobile
- [ ] Sidebar navigation with role-based menu items
- [ ] Breadcrumb navigation showing current location
- [ ] User profile dropdown with logout functionality
- [ ] Accessibility compliance (WCAG AA)
- [ ] Unit tests for layout components

Technical Details (summary)
- Use DaisyUI components for styling
- Implement responsive breakpoints for different screen sizes
- Create role-based menu configuration
- ARIA labels for accessibility (nav regions, controls, etc.)

Implementation Plan (phases and tasks)
- Phase 1: Core components
  - Task 2.1.1.1: Create skeleton MainDashboardLayout.tsx (existing)
  - Task 2.1.1.2: Create DashboardHeader.tsx (existing)
  - Task 2.1.1.3: Create DashboardSidebar.tsx (existing)
  - Task 2.1.1.4: Create Breadcrumb.tsx (existing)
  - Task 2.1.1.5: Create UserProfileMenu.tsx (existing)
- Phase 2: Accessibility and responsiveness
  - Ensure ARIA roles and labels on nav, header, and profile menu
  - Add responsive classes for layout and navigation
- Phase 3: Role-based navigation
  - Extend MENU_CONFIG with all required roles and guard rails
  - Ensure routing guards align with role-based access
- Phase 4: Unit tests
  - Expand test coverage for: header rendering, sidebar role rendering, breadcrumb presence, and responsive class application
- Phase 5: Integration
  - Wire MainDashboardLayout into App.tsx or the dashboard route
  - Integrate with existing router and permissions flow
- Phase 6: Validation
  - Run lint and tests
  - Validate WCAG AA considerations with basic checks

Proposed Next Steps
- Implement Phase 1 changes (already scaffolded in codebase)
- Expand tests to cover additional scenarios (admin vs guest)
- Add real routing integration example in App.tsx
- Validate accessibility in a11y tooling where possible

Notes
- This document is intended to guide incremental implementation and future enhancements.
- All changes should follow existing project conventions and your DaisyUI/Tailwind setup.
