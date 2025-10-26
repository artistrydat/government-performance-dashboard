# Testing Convex Functions - Complete Guide

This guide explains how to test the Project Data Model implementation using the actual Convex deployment.

## Deployment Information

- **Deployment URL**: `https://dependable-cat-853.convex.cloud`
- **HTTP Actions URL**: `https://dependable-cat-853.convex.site`
- **Dev Deployment Key**: `dev:dependable-cat-853|eyJ2MiI6IjlmMmE4N2IyODlhYjQ0MTlhYWZlMDM3NGZmZDFkYmRiIn0=`

## Testing Approaches

### 1. Unit Testing (Already Implemented)

We have comprehensive unit tests that validate:
- Data model structures
- Validation rules
- TypeScript interfaces
- Business logic

**Run unit tests:**
```bash
cd apps/api
npm test
```

### 2. Integration Testing with Convex Deployment

To test with the actual Convex deployment:

#### Setup Environment
```bash
# Set the deployment URL
export CONVEX_DEPLOYMENT=https://dependable-cat-853.convex.cloud

# Or create .env.local file with:
CONVEX_DEPLOYMENT=https://dependable-cat-853.convex.cloud
```

#### Test Using Convex CLI
```bash
cd apps/api

# Deploy and test functions
npx convex deploy

# Run specific functions for testing
npx convex run projects:list
npx convex run projects:getStatistics
```

#### Manual Testing via HTTP API

You can test functions directly using HTTP requests:

**List Projects:**
```bash
curl -X POST "https://dependable-cat-853.convex.site/api/projects/list" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Create Project:**
```bash
curl -X POST "https://dependable-cat-853.convex.site/api/projects/create" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Test project via API",
    "status": "active",
    "budget": 1000000,
    "timeline": {
      "startDate": 1737830400000,
      "endDate": 1740518400000,
      "milestones": [
        {
          "name": "Initial Planning",
          "date": 1738444800000,
          "status": "planned"
        }
      ]
    },
    "healthScore": 85,
    "riskLevel": "medium",
    "tags": ["test", "api"]
  }'
```

**Get Project Statistics:**
```bash
curl -X POST "https://dependable-cat-853.convex.site/api/projects/getStatistics" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 3. Testing Validation Rules

Test that validation rules work correctly:

**Test Invalid Budget (should fail):**
```bash
curl -X POST "https://dependable-cat-853.convex.site/api/projects/create" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Budget Project",
    "description": "Project with negative budget",
    "status": "active",
    "budget": -1000,
    "timeline": {
      "startDate": 1737830400000,
      "endDate": 1740518400000,
      "milestones": []
    },
    "healthScore": 85,
    "riskLevel": "medium",
    "tags": ["test"]
  }'
```

**Test Invalid Health Score (should fail):**
```bash
curl -X POST "https://dependable-cat-853.convex.site/api/projects/create" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Health Score Project",
    "description": "Project with invalid health score",
    "status": "active",
    "budget": 1000000,
    "timeline": {
      "startDate": 1737830400000,
      "endDate": 1740518400000,
      "milestones": []
    },
    "healthScore": 150,
    "riskLevel": "medium",
    "tags": ["test"]
  }'
```

**Test Invalid Timeline (should fail):**
```bash
curl -X POST "https://dependable-cat-853.convex.site/api/projects/create" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Timeline Project",
    "description": "Project with invalid timeline dates",
    "status": "active",
    "budget": 1000000,
    "timeline": {
      "startDate": 1740518400000,
      "endDate": 1737830400000,
      "milestones": []
    },
    "healthScore": 85,
    "riskLevel": "medium",
    "tags": ["test"]
  }'
```

### 4. Available Test Functions

The following Convex functions are available for testing:

#### Project Functions
- `projects:create` - Create a new project
- `projects:get` - Get project by ID
- `projects:list` - List all projects
- `projects:listByStatus` - List projects by status
- `projects:listByPortfolio` - List projects by portfolio
- `projects:update` - Update project
- `projects:remove` - Delete project
- `projects:getStatistics` - Get project statistics

### 5. Testing Scenarios

#### Scenario 1: Create and Retrieve Project
1. Create a project using `projects:create`
2. Get the project ID from response
3. Retrieve the project using `projects:get`
4. Verify data matches

#### Scenario 2: Update Project
1. Create a project
2. Update project details using `projects:update`
3. Retrieve and verify changes

#### Scenario 3: List Projects by Status
1. Create multiple projects with different statuses
2. Use `projects:listByStatus` to filter
3. Verify correct filtering

#### Scenario 4: Project Statistics
1. Create multiple projects
2. Call `projects:getStatistics`
3. Verify statistics are calculated correctly

### 6. Expected Results

#### Successful Operations
- Create: Returns project ID
- Get: Returns project data
- List: Returns array of projects
- Update: Returns project ID
- Delete: Returns project ID
- Statistics: Returns statistics object

#### Validation Errors
- Budget must be positive number
- Health score must be between 0-100
- Start date must be before end date
- Required fields must be provided

### 7. Testing Tools

#### Convex Dashboard
Access the dashboard to monitor function executions:
```bash
npx convex dashboard
```

#### Convex Dev Environment
For local development and testing:
```bash
npx convex dev
```

### 8. Sample Test Data

Here's sample data for testing:

```json
{
  "name": "Government Infrastructure Project",
  "description": "Modernization of government IT infrastructure",
  "status": "active",
  "budget": 2500000,
  "timeline": {
    "startDate": 1737830400000,
    "endDate": 1751337600000,
    "milestones": [
      {
        "name": "Requirements Gathering",
        "date": 1738444800000,
        "status": "completed"
      },
      {
        "name": "Development Phase",
        "date": 1743129600000,
        "status": "in-progress"
      },
      {
        "name": "Testing Phase",
        "date": 1748640000000,
        "status": "planned"
      }
    ]
  },
  "healthScore": 78,
  "riskLevel": "medium",
  "tags": ["infrastructure", "government", "modernization"]
}
```

## Next Steps

1. **Deploy the schema**: `npx convex deploy`
2. **Test functions**: Use the HTTP API examples above
3. **Monitor execution**: Use Convex dashboard
4. **Verify validation**: Test error scenarios
5. **Test performance**: Create multiple projects and test queries

The Project Data Model is now ready for comprehensive testing with the actual Convex deployment.
