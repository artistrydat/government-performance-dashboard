# AI UI Generation Prompts for Government Performance Dashboard

## Executive Dashboard Prompt

```
Create a professional government dashboard interface for executive leadership with the following requirements:

**Design Style:** Professional government aesthetic, clean and authoritative, WCAG AA compliant

**Layout:** Single-page dashboard with strategic overview focus

**Key Components:**
1. **Portfolio Health Score** - Large circular indicator (0-100%) with trend arrow
2. **Top 3 Risk Projects** - Card layout with color-coded risk levels (Green/Yellow/Orange/Red)
3. **Natural Language Executive Summary** - AI-generated text summary in clean typography
4. **Strategic Health Indicators** - Three key metrics: Budget Health, Schedule Adherence, Compliance Score
5. **Quick Action Bar** - Generate Report, Schedule Review, Export Data buttons

**Color Palette:**
- Primary: #1a365d (dark blue)
- Secondary: #2d3748 (charcoal)
- Accent: #3182ce (blue)
- Success: #38a169 (green)
- Warning: #d69e2e (yellow)
- Error: #e53e3e (red)

**Typography:** Inter font family, clean hierarchy

**Responsive:** Mobile-first design that scales to desktop

**Accessibility:** WCAG AA compliant with proper contrast ratios and keyboard navigation
```

## Portfolio Manager Dashboard Prompt

```
Create a comprehensive portfolio management dashboard for government project managers with:

**Design Style:** Data-rich professional interface with interactive visualizations

**Layout:** Multi-column dashboard with sidebar navigation

**Key Components:**
1. **Interactive Risk Heat Map** - Grid of projects colored by risk level with hover details
2. **Dependency Network Graph** - Force-directed graph showing project relationships
3. **Resource Allocation Simulator** - Drag-and-drop resource management interface
4. **Compliance Index Panel** - Program-level compliance scores with drill-down
5. **AI Recommendation Panel** - Side panel with actionable suggestions and confidence scores

**Interactive Features:**
- Click project cards to expand details
- Filter by risk level, program, or compliance status
- Drag resources between projects in simulator
- Expand/collapse dependency relationships

**Color Coding:**
- Low Risk: #38a169 (green)
- Medium Risk: #d69e2e (yellow) 
- High Risk: #ed8936 (orange)
- Critical Risk: #e53e3e (red)

**Data Visualization:** Use Chart.js or similar for graphs, ensure accessibility
```

## Project Officer Dashboard Prompt

```
Create an operational project management interface for government project officers:

**Design Style:** Task-focused, practical interface with clear action items

**Layout:** Kanban-style board with task cards and status columns

**Key Components:**
1. **Project Health Board** - Kanban columns: Backlog, In Progress, Review, Completed
2. **Task Management Cards** - Color-coded by priority with assignee and due date
3. **Issue Resolution Panel** - Form for logging and tracking project issues
4. **Compliance Assistant** - Chat-like interface for PMI standards queries
5. **Daily Impact Score** - Visual indicator of daily progress and risk level

**Interactive Features:**
- Drag-and-drop task cards between columns
- Quick edit task details on click
- AI-powered compliance suggestions
- One-click issue escalation

**Status Indicators:**
- On Track: Green checkmark
- At Risk: Yellow warning
- Behind: Red alert
- Blocked: Red with stop icon

**Mobile Optimization:** Touch-friendly interface with swipe gestures
```

## AI Chat Panel Component Prompt

```
Create an AI chat interface component for government compliance assistance:

**Design Style:** Professional chat interface that integrates with dashboard

**Layout:** Collapsible side panel or bottom sheet

**Key Components:**
1. **Chat History** - Scrollable message history with user and AI messages
2. **Message Input** - Text area with compliance-specific quick actions
3. **Quick Action Buttons** - Common queries: "Check PMI standard", "Risk assessment", "Compliance help"
4. **Confidence Indicators** - Visual indicators for AI response confidence
5. **Citation Links** - Links to relevant PMI standards and documentation

**Message Types:**
- User messages: Right-aligned, blue background
- AI responses: Left-aligned, light gray background
- System messages: Centered, informational style

**Features:**
- Auto-expand when new messages arrive
- Typing indicators for AI responses
- Message timestamps
- Export conversation option

**Accessibility:** Screen reader compatible, keyboard navigation, focus management
```

## Risk Heat Map Component Prompt

```
Create an interactive risk heat map visualization for government projects:

**Design Style:** Professional data visualization with clear risk communication

**Layout:** Grid-based heat map with project cards

**Visual Elements:**
- **Color Gradient:** Green (0-25%) → Yellow (26-50%) → Orange (51-75%) → Red (76-100%)
- **Project Cards:** Each card shows project name, risk score, and key metrics
- **Hover Effects:** Detailed risk breakdown on hover
- **Filter Controls:** Filter by program, risk level, compliance status

**Data Display:**
- Risk Score: Large percentage number
- Trend Indicator: Up/down arrow with change amount
- Key Metrics: Budget variance, schedule variance, compliance score
- AI Prediction: Confidence level for risk assessment

**Interactive Features:**
- Click to expand project details
- Filter by multiple criteria
- Export heat map as image
- Print-friendly version

**Responsive Behavior:**
- Desktop: Full grid layout
- Tablet: 2-column grid  
- Mobile: Single column with horizontal scroll
```

## Compliance Monitoring Dashboard Prompt

```
Create a PMI standards compliance monitoring dashboard:

**Design Style:** Regulatory-focused interface with clear compliance status

**Layout:** Tabbed interface with overview and detailed views

**Key Sections:**
1. **Compliance Overview** - Overall compliance score with program breakdown
2. **Standards Library** - Browseable PMI standards with search and filter
3. **Audit Report Generator** - Form to generate compliance audit reports
4. **Gap Analysis** - Visual representation of compliance gaps by standard
5. **Remediation Tracking** - Action items for compliance improvements

**Visual Elements:**
- Compliance Score: Large circular progress indicator
- Standards Status: Color-coded compliance levels per standard
- Gap Analysis: Bar chart showing compliance gaps
- Timeline: Compliance improvement timeline

**Interactive Features:**
- Click standards to view detailed requirements
- Generate custom audit reports
- Track remediation progress
- Export compliance documentation

**Color Coding:**
- Fully Compliant: #38a169 (green)
- Partially Compliant: #d69e2e (yellow)
- Non-Compliant: #e53e3e (red)
- Not Assessed: #a0aec0 (gray)
```

## Implementation Notes

### Technology Stack
- **Frontend Framework:** React with TypeScript
- **Styling:** DaisyUI with custom government design system
- **Charts:** Chart.js or Recharts for data visualization
- **State Management:** Zustand for simple state, TanStack Query for data
- **Build Tool:** Vite for fast development and building

### Accessibility Requirements
- WCAG AA compliance throughout
- Keyboard navigation for all interactive elements
- Screen reader compatibility with proper ARIA labels
- Color contrast ratios of 4.5:1 for normal text
- Focus indicators for all interactive elements

### Performance Considerations
- Lazy loading for complex visualizations
- Optimized image assets and icon sprites
- Efficient data fetching with caching
- Sub-3 second load time target

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers
```

These prompts provide comprehensive specifications for AI UI generation tools to create the actual interface implementations for the Government Performance Management Dashboard.
