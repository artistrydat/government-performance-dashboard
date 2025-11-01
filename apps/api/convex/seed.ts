import { mutation } from './_generated/server';
import { v } from 'convex/values';

// Run complete seed process
export const seedAll = mutation({
  args: {},
  handler: async ctx => {
    const now = Date.now();

    // Seed users
    const users = [
      {
        mockId: 'exec-001',
        name: 'Executive User',
        email: 'executive@example.com',
        role: 'executive' as const,
        department: 'Executive',
      },
      {
        mockId: 'pm-001',
        name: 'Portfolio Manager',
        email: 'portfolio.manager@example.com',
        role: 'portfolio_manager' as const,
        department: 'PMO',
      },
      {
        mockId: 'po-001',
        name: 'Project Officer',
        email: 'project.officer@example.com',
        role: 'project_officer' as const,
        department: 'PMO',
      },
      {
        mockId: 'po-002',
        name: 'Senior Project Officer',
        email: 'senior.po@example.com',
        role: 'project_officer' as const,
        department: 'PMO',
      },
      {
        mockId: 'po-003',
        name: 'Junior Project Officer',
        email: 'junior.po@example.com',
        role: 'project_officer' as const,
        department: 'PMO',
      },
      {
        mockId: 'pm-002',
        name: 'Senior Portfolio Manager',
        email: 'senior.pm@example.com',
        role: 'portfolio_manager' as const,
        department: 'PMO',
      },
      {
        mockId: 'admin-001',
        name: 'Administrator',
        email: 'admin@example.com',
        role: 'executive' as const,
        department: 'IT',
      },
      {
        mockId: 'audit-001',
        name: 'Compliance Auditor',
        email: 'auditor@example.com',
        role: 'executive' as const,
        department: 'Compliance',
      },
    ];

    const seededUsers = [];

    for (const userData of users) {
      // Check if user already exists by email
      let user = await ctx.db
        .query('users')
        .withIndex('by_email', q => q.eq('email', userData.email))
        .first();

      if (!user) {
        const userId = await ctx.db.insert('users', {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          createdAt: now,
          updatedAt: now,
        });
        user = await ctx.db.get(userId);
      }

      if (user) {
        seededUsers.push({
          mockId: userData.mockId,
          convexId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      }
    }

    // Get the portfolio manager user
    const portfolioManager = await ctx.db
      .query('users')
      .withIndex('by_email', q => q.eq('email', 'portfolio.manager@example.com'))
      .first();

    if (!portfolioManager) {
      throw new Error('Portfolio manager user not found after seeding.');
    }

    // Get senior portfolio manager user
    const seniorPortfolioManager = await ctx.db
      .query('users')
      .withIndex('by_email', q => q.eq('email', 'senior.pm@example.com'))
      .first();

    if (!seniorPortfolioManager) {
      throw new Error('Senior portfolio manager user not found after seeding.');
    }

    // Seed portfolios
    const portfolios = [
      {
        name: 'Digital Transformation',
        description: 'Modernization of legacy systems and digital initiatives',
        ownerId: portfolioManager._id,
        healthScore: 85,
        totalBudget: 5000000,
        allocatedBudget: 3500000,
        resourceAllocation: {
          teamMembers: 15,
          budgetUtilization: 70,
          projectCount: 8,
        },
      },
      {
        name: 'Infrastructure Upgrade',
        description: 'Hardware and network infrastructure improvements',
        ownerId: portfolioManager._id,
        healthScore: 72,
        totalBudget: 3000000,
        allocatedBudget: 2200000,
        resourceAllocation: {
          teamMembers: 8,
          budgetUtilization: 73,
          projectCount: 5,
        },
      },
      {
        name: 'Compliance & Security',
        description: 'Regulatory compliance and cybersecurity initiatives',
        ownerId: portfolioManager._id,
        healthScore: 91,
        totalBudget: 2000000,
        allocatedBudget: 1800000,
        resourceAllocation: {
          teamMembers: 12,
          budgetUtilization: 90,
          projectCount: 6,
        },
      },
      {
        name: 'Customer Experience',
        description: 'Customer-facing applications and service improvements',
        ownerId: seniorPortfolioManager._id,
        healthScore: 88,
        totalBudget: 2500000,
        allocatedBudget: 1900000,
        resourceAllocation: {
          teamMembers: 10,
          budgetUtilization: 76,
          projectCount: 4,
        },
      },
      {
        name: 'Data Analytics',
        description: 'Business intelligence and data-driven decision making',
        ownerId: seniorPortfolioManager._id,
        healthScore: 79,
        totalBudget: 1800000,
        allocatedBudget: 1400000,
        resourceAllocation: {
          teamMembers: 7,
          budgetUtilization: 78,
          projectCount: 3,
        },
      },
    ];

    const seededPortfolios = [];

    for (const portfolioData of portfolios) {
      const portfolioId = await ctx.db.insert('portfolios', {
        ...portfolioData,
        createdAt: now,
        updatedAt: now,
      });

      const portfolio = await ctx.db.get(portfolioId);
      if (portfolio) {
        seededPortfolios.push(portfolio);
      }
    }

    // Get project officer users
    const projectOfficer = await ctx.db
      .query('users')
      .withIndex('by_email', q => q.eq('email', 'project.officer@example.com'))
      .first();

    const seniorProjectOfficer = await ctx.db
      .query('users')
      .withIndex('by_email', q => q.eq('email', 'senior.po@example.com'))
      .first();

    const juniorProjectOfficer = await ctx.db
      .query('users')
      .withIndex('by_email', q => q.eq('email', 'junior.po@example.com'))
      .first();

    if (!projectOfficer || !seniorProjectOfficer || !juniorProjectOfficer) {
      throw new Error('Project officer users not found after seeding.');
    }

    // Seed projects
    const projects = [
      {
        name: 'CRM System Implementation',
        description: 'Implement new customer relationship management system',
        status: 'active' as const,
        budget: 1500000,
        spentBudget: 850000,
        timeline: {
          startDate: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
          endDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
          milestones: [
            {
              name: 'Requirements Gathering',
              date: Date.now() - 60 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'System Design',
              date: Date.now() - 30 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'Development Phase 1',
              date: Date.now() + 15 * 24 * 60 * 60 * 1000,
              status: 'in-progress',
            },
          ],
        },
        portfolioId: seededPortfolios[0]._id,
        ownerId: projectOfficer._id,
        teamMembers: [projectOfficer._id, juniorProjectOfficer._id],
        healthScore: 78,
        riskLevel: 'medium' as const,
        tags: ['digital', 'crm', 'customer-service'],
      },
      {
        name: 'Network Security Upgrade',
        description: 'Upgrade network security infrastructure and protocols',
        status: 'active' as const,
        budget: 800000,
        spentBudget: 450000,
        timeline: {
          startDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
          endDate: Date.now() + 45 * 24 * 60 * 60 * 1000,
          milestones: [
            {
              name: 'Security Assessment',
              date: Date.now() - 30 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'Hardware Procurement',
              date: Date.now() + 15 * 24 * 60 * 60 * 1000,
              status: 'in-progress',
            },
          ],
        },
        portfolioId: seededPortfolios[2]._id,
        ownerId: projectOfficer._id,
        teamMembers: [projectOfficer._id, seniorProjectOfficer._id],
        healthScore: 85,
        riskLevel: 'low' as const,
        tags: ['security', 'infrastructure', 'compliance'],
      },
      {
        name: 'Mobile App Development',
        description: 'Develop mobile application for customer self-service',
        status: 'at-risk' as const,
        budget: 1200000,
        spentBudget: 950000,
        timeline: {
          startDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
          endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
          milestones: [
            {
              name: 'UI/UX Design',
              date: Date.now() - 90 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'Backend Development',
              date: Date.now() - 45 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'Testing Phase',
              date: Date.now() + 15 * 24 * 60 * 60 * 1000,
              status: 'at-risk',
            },
          ],
        },
        portfolioId: seededPortfolios[0]._id,
        ownerId: projectOfficer._id,
        teamMembers: [projectOfficer._id, juniorProjectOfficer._id],
        healthScore: 65,
        riskLevel: 'high' as const,
        tags: ['mobile', 'app', 'customer-facing'],
      },
      {
        name: 'Customer Portal Redesign',
        description: 'Redesign customer self-service portal with modern UX',
        status: 'active' as const,
        budget: 750000,
        spentBudget: 320000,
        timeline: {
          startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
          endDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
          milestones: [
            {
              name: 'UX Research',
              date: Date.now() - 15 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'Wireframe Design',
              date: Date.now() + 30 * 24 * 60 * 60 * 1000,
              status: 'in-progress',
            },
          ],
        },
        portfolioId: seededPortfolios[3]._id,
        ownerId: seniorProjectOfficer._id,
        teamMembers: [seniorProjectOfficer._id, juniorProjectOfficer._id],
        healthScore: 82,
        riskLevel: 'medium' as const,
        tags: ['customer-experience', 'ui-ux', 'portal'],
      },
      {
        name: 'Data Warehouse Implementation',
        description: 'Build centralized data warehouse for business intelligence',
        status: 'active' as const,
        budget: 2000000,
        spentBudget: 1200000,
        timeline: {
          startDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
          endDate: Date.now() + 120 * 24 * 60 * 60 * 1000,
          milestones: [
            {
              name: 'Data Architecture',
              date: Date.now() - 120 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'ETL Development',
              date: Date.now() - 60 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'Data Migration',
              date: Date.now() + 30 * 24 * 60 * 60 * 1000,
              status: 'in-progress',
            },
          ],
        },
        portfolioId: seededPortfolios[4]._id,
        ownerId: seniorProjectOfficer._id,
        teamMembers: [seniorProjectOfficer._id, projectOfficer._id],
        healthScore: 76,
        riskLevel: 'medium' as const,
        tags: ['data-analytics', 'warehouse', 'bi'],
      },
      {
        name: 'GDPR Compliance Audit',
        description: 'Conduct comprehensive GDPR compliance audit and remediation',
        status: 'completed' as const,
        budget: 500000,
        spentBudget: 480000,
        timeline: {
          startDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
          endDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
          milestones: [
            {
              name: 'Initial Assessment',
              date: Date.now() - 300 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'Remediation Phase',
              date: Date.now() - 180 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
            {
              name: 'Final Certification',
              date: Date.now() - 60 * 24 * 60 * 60 * 1000,
              status: 'completed',
            },
          ],
        },
        portfolioId: seededPortfolios[2]._id,
        ownerId: projectOfficer._id,
        teamMembers: [projectOfficer._id, juniorProjectOfficer._id],
        healthScore: 95,
        riskLevel: 'low' as const,
        tags: ['compliance', 'gdpr', 'audit', 'security'],
      },
    ];

    const seededProjects = [];

    for (const projectData of projects) {
      const projectId = await ctx.db.insert('projects', {
        ...projectData,
        createdAt: now,
        updatedAt: now,
      });

      const project = await ctx.db.get(projectId);
      if (project) {
        seededProjects.push(project);
      }
    }

    // Seed risks for comprehensive dashboard data
    const risks = [
      // Critical risks for Mobile App Development project
      {
        projectId: seededProjects[2]._id, // Mobile App Development (at-risk project)
        title: 'Third-party API Integration Delays',
        description:
          'External payment gateway API integration is experiencing significant delays due to vendor issues, impacting the mobile app launch timeline.',
        severity: 'critical' as const,
        status: 'identified' as const,
        probability: 85,
        impact: 90,
        mitigationPlan:
          'Engage with vendor escalation team, explore alternative payment providers, and adjust project timeline accordingly.',
      },
      {
        projectId: seededProjects[2]._id,
        title: 'Security Vulnerability in Authentication',
        description:
          'Security audit revealed potential vulnerabilities in the mobile app authentication flow that could expose user data.',
        severity: 'critical' as const,
        status: 'monitored' as const,
        probability: 70,
        impact: 95,
        mitigationPlan:
          'Implement additional security layers, conduct penetration testing, and schedule security patch deployment.',
      },

      // High risks for CRM System Implementation
      {
        projectId: seededProjects[0]._id, // CRM System Implementation
        title: 'Data Migration Complexity',
        description:
          'Legacy CRM data migration is more complex than anticipated, requiring additional resources and timeline extension.',
        severity: 'high' as const,
        status: 'identified' as const,
        probability: 75,
        impact: 80,
        mitigationPlan:
          'Allocate additional data migration specialists, implement phased migration approach, and update project timeline.',
      },
      {
        projectId: seededProjects[0]._id,
        title: 'User Training Resistance',
        description:
          'Sales team showing resistance to new CRM system adoption, potentially impacting ROI and user adoption metrics.',
        severity: 'high' as const,
        status: 'mitigated' as const,
        probability: 60,
        impact: 70,
        mitigationPlan:
          'Enhanced training program with hands-on workshops, executive sponsorship, and change management communication.',
      },

      // Medium risks for Network Security Upgrade
      {
        projectId: seededProjects[1]._id, // Network Security Upgrade
        title: 'Hardware Supply Chain Delays',
        description:
          'Network security hardware procurement facing delays due to global supply chain issues.',
        severity: 'medium' as const,
        status: 'monitored' as const,
        probability: 65,
        impact: 50,
        mitigationPlan:
          'Identify alternative suppliers, implement temporary security measures, and adjust procurement timeline.',
      },
      {
        projectId: seededProjects[1]._id,
        title: 'Staff Training Requirements',
        description:
          'Additional training required for IT staff to manage new security infrastructure effectively.',
        severity: 'medium' as const,
        status: 'resolved' as const,
        probability: 40,
        impact: 45,
        mitigationPlan:
          'Completed comprehensive training program with vendor support and internal knowledge transfer.',
      },

      // Additional risks for portfolio coverage
      {
        projectId: seededProjects[0]._id,
        title: 'Integration Testing Delays',
        description:
          'Integration testing with existing systems taking longer than planned due to compatibility issues.',
        severity: 'medium' as const,
        status: 'identified' as const,
        probability: 55,
        impact: 60,
        mitigationPlan:
          'Increase testing resources, implement automated testing scripts, and extend testing timeline.',
      },
      {
        projectId: seededProjects[2]._id,
        title: 'App Store Review Process',
        description:
          'Potential delays in Apple App Store and Google Play Store review processes for mobile app submission.',
        severity: 'medium' as const,
        status: 'monitored' as const,
        probability: 50,
        impact: 65,
        mitigationPlan:
          'Prepare comprehensive submission documentation, conduct pre-submission testing, and allocate buffer time.',
      },
      {
        projectId: seededProjects[1]._id,
        title: 'Network Downtime During Implementation',
        description:
          'Potential network service interruptions during security infrastructure upgrades.',
        severity: 'low' as const,
        status: 'mitigated' as const,
        probability: 30,
        impact: 40,
        mitigationPlan:
          'Schedule upgrades during off-peak hours, implement phased rollout, and communicate maintenance windows.',
      },
      {
        projectId: seededProjects[0]._id,
        title: 'Custom Feature Scope Creep',
        description:
          'Additional custom feature requests from sales team impacting original project scope.',
        severity: 'low' as const,
        status: 'resolved' as const,
        probability: 25,
        impact: 35,
        mitigationPlan:
          'Implemented change control process and deferred non-critical features to future releases.',
      },
    ];

    const seededRisks = [];

    for (const riskData of risks) {
      const riskId = await ctx.db.insert('risks', {
        ...riskData,
        createdAt: now,
        updatedAt: now,
      });

      const risk = await ctx.db.get(riskId);
      if (risk) {
        seededRisks.push(risk);
      }
    }

    // Seed PMI Standards for Epic 3
    const pmiStandards = [
      {
        name: 'Project Charter Development',
        description: 'Formal authorization of the project and the project manager',
        category: 'project' as const,
        level: 'foundational' as const,
        weight: 0.15,
        version: '1.0',
        isActive: true,
      },
      {
        name: 'Stakeholder Engagement',
        description: 'Identification and engagement of project stakeholders',
        category: 'project' as const,
        level: 'foundational' as const,
        weight: 0.12,
        version: '1.0',
        isActive: true,
      },
      {
        name: 'Scope Management',
        description: 'Defining and controlling what is and is not included in the project',
        category: 'project' as const,
        level: 'intermediate' as const,
        weight: 0.18,
        version: '1.0',
        isActive: true,
      },
      {
        name: 'Risk Management Planning',
        description:
          'Systematic approach to identifying, analyzing, and responding to project risks',
        category: 'project' as const,
        level: 'intermediate' as const,
        weight: 0.2,
        version: '1.0',
        isActive: true,
      },
      {
        name: 'Portfolio Governance',
        description: 'Strategic alignment and oversight of project portfolios',
        category: 'portfolio' as const,
        level: 'advanced' as const,
        weight: 0.25,
        version: '1.0',
        isActive: true,
      },
      {
        name: 'Program Management Framework',
        description: 'Coordination and management of related projects',
        category: 'program' as const,
        level: 'advanced' as const,
        weight: 0.1,
        version: '1.0',
        isActive: true,
      },
    ];

    const seededStandards = [];

    for (const standardData of pmiStandards) {
      const standardId = await ctx.db.insert('pmiStandards', {
        ...standardData,
        createdAt: now,
        updatedAt: now,
      });

      const standard = await ctx.db.get(standardId);
      if (standard) {
        seededStandards.push(standard);
      }
    }

    // Seed PMI Standard Criteria
    const pmiCriteria = [
      // Project Charter Criteria
      {
        standardId: seededStandards[0]._id,
        name: 'Business Case Documentation',
        description: 'Documented business justification for the project',
        requirement: 'Project must have a documented business case with ROI analysis',
        evidenceType: 'document' as const,
        evidenceDescription: 'Business case document with executive approval',
        scoringMethod: 'binary' as const,
        maxScore: 10,
        isMandatory: true,
        order: 1,
      },
      {
        standardId: seededStandards[0]._id,
        name: 'Stakeholder Analysis',
        description: 'Initial stakeholder identification and analysis',
        requirement: 'Stakeholder register with power/interest analysis',
        evidenceType: 'document' as const,
        evidenceDescription: 'Stakeholder register document',
        scoringMethod: 'partial' as const,
        maxScore: 8,
        isMandatory: true,
        order: 2,
      },

      // Stakeholder Engagement Criteria
      {
        standardId: seededStandards[1]._id,
        name: 'Communication Plan',
        description: 'Structured approach to stakeholder communication',
        requirement: 'Documented communication management plan',
        evidenceType: 'document' as const,
        evidenceDescription: 'Communication plan document',
        scoringMethod: 'binary' as const,
        maxScore: 10,
        isMandatory: true,
        order: 1,
      },
      {
        standardId: seededStandards[1]._id,
        name: 'Engagement Metrics',
        description: 'Measurement of stakeholder engagement effectiveness',
        requirement: 'Regular stakeholder satisfaction surveys',
        evidenceType: 'text' as const,
        evidenceDescription: 'Survey results and analysis reports',
        scoringMethod: 'scale' as const,
        maxScore: 12,
        isMandatory: false,
        order: 2,
      },

      // Scope Management Criteria
      {
        standardId: seededStandards[2]._id,
        name: 'Requirements Documentation',
        description: 'Complete and validated requirements',
        requirement: 'Requirements traceability matrix',
        evidenceType: 'document' as const,
        evidenceDescription: 'Requirements documentation',
        scoringMethod: 'partial' as const,
        maxScore: 15,
        isMandatory: true,
        order: 1,
      },
      {
        standardId: seededStandards[2]._id,
        name: 'Change Control Process',
        description: 'Formal change management procedures',
        requirement: 'Documented change control process',
        evidenceType: 'document' as const,
        evidenceDescription: 'Change control procedure document',
        scoringMethod: 'binary' as const,
        maxScore: 10,
        isMandatory: true,
        order: 2,
      },

      // Risk Management Criteria
      {
        standardId: seededStandards[3]._id,
        name: 'Risk Register',
        description: 'Comprehensive risk identification and tracking',
        requirement: 'Active risk register with mitigation plans',
        evidenceType: 'document' as const,
        evidenceDescription: 'Risk register document',
        scoringMethod: 'partial' as const,
        maxScore: 20,
        isMandatory: true,
        order: 1,
      },
      {
        standardId: seededStandards[3]._id,
        name: 'Risk Response Planning',
        description: 'Proactive risk response strategies',
        requirement: 'Documented risk response strategies',
        evidenceType: 'document' as const,
        evidenceDescription: 'Risk response plan',
        scoringMethod: 'scale' as const,
        maxScore: 15,
        isMandatory: true,
        order: 2,
      },
    ];

    const seededCriteria = [];

    for (const criteriaData of pmiCriteria) {
      const criteriaId = await ctx.db.insert('pmiStandardCriteria', {
        ...criteriaData,
        createdAt: now,
        updatedAt: now,
      });

      const criteria = await ctx.db.get(criteriaId);
      if (criteria) {
        seededCriteria.push(criteria);
      }
    }

    // Get compliance auditor user
    const complianceAuditor = await ctx.db
      .query('users')
      .withIndex('by_email', q => q.eq('email', 'auditor@example.com'))
      .first();

    if (!complianceAuditor) {
      throw new Error('Compliance auditor user not found after seeding.');
    }

    // Seed comprehensive compliance evaluations for testing Epic 3
    const complianceEvaluations = [
      // CRM System Implementation evaluations
      {
        projectId: seededProjects[0]._id, // CRM System Implementation
        standardId: seededStandards[0]._id, // Project Charter
        overallScore: 85,
        evaluatorId: portfolioManager._id,
        notes: 'Strong business case, minor gaps in stakeholder analysis',
      },
      {
        projectId: seededProjects[0]._id,
        standardId: seededStandards[1]._id, // Stakeholder Engagement
        overallScore: 72,
        evaluatorId: portfolioManager._id,
        notes: 'Communication plan in place, but engagement metrics lacking',
      },
      {
        projectId: seededProjects[0]._id,
        standardId: seededStandards[2]._id, // Scope Management
        overallScore: 88,
        evaluatorId: portfolioManager._id,
        notes: 'Well-defined requirements, change control process established',
      },
      {
        projectId: seededProjects[0]._id,
        standardId: seededStandards[3]._id, // Risk Management
        overallScore: 78,
        evaluatorId: portfolioManager._id,
        notes: 'Good risk identification, needs improved response planning',
      },

      // Network Security Upgrade evaluations
      {
        projectId: seededProjects[1]._id, // Network Security Upgrade
        standardId: seededStandards[0]._id, // Project Charter
        overallScore: 95,
        evaluatorId: complianceAuditor._id,
        notes: 'Excellent project charter with clear business justification',
      },
      {
        projectId: seededProjects[1]._id,
        standardId: seededStandards[2]._id, // Scope Management
        overallScore: 92,
        evaluatorId: complianceAuditor._id,
        notes: 'Excellent scope documentation and change control',
      },
      {
        projectId: seededProjects[1]._id,
        standardId: seededStandards[3]._id, // Risk Management
        overallScore: 89,
        evaluatorId: complianceAuditor._id,
        notes: 'Comprehensive risk management with effective mitigation',
      },
      {
        projectId: seededProjects[1]._id,
        standardId: seededStandards[4]._id, // Portfolio Governance
        overallScore: 91,
        evaluatorId: complianceAuditor._id,
        notes: 'Strong alignment with portfolio strategy and governance',
      },

      // Mobile App Development evaluations
      {
        projectId: seededProjects[2]._id, // Mobile App Development
        standardId: seededStandards[0]._id, // Project Charter
        overallScore: 65,
        evaluatorId: portfolioManager._id,
        notes: 'Business case needs stronger ROI justification',
      },
      {
        projectId: seededProjects[2]._id,
        standardId: seededStandards[1]._id, // Stakeholder Engagement
        overallScore: 58,
        evaluatorId: portfolioManager._id,
        notes: 'Limited stakeholder engagement and communication planning',
      },
      {
        projectId: seededProjects[2]._id,
        standardId: seededStandards[2]._id, // Scope Management
        overallScore: 70,
        evaluatorId: portfolioManager._id,
        notes: 'Scope creep issues, change control process not consistently followed',
      },
      {
        projectId: seededProjects[2]._id,
        standardId: seededStandards[3]._id, // Risk Management
        overallScore: 45,
        evaluatorId: portfolioManager._id,
        notes: 'Critical risks identified late, inadequate response planning',
      },

      // Customer Portal Redesign evaluations
      {
        projectId: seededProjects[3]._id, // Customer Portal Redesign
        standardId: seededStandards[0]._id, // Project Charter
        overallScore: 82,
        evaluatorId: seniorPortfolioManager._id,
        notes: 'Solid business case with clear user value proposition',
      },
      {
        projectId: seededProjects[3]._id,
        standardId: seededStandards[1]._id, // Stakeholder Engagement
        overallScore: 85,
        evaluatorId: seniorPortfolioManager._id,
        notes: 'Strong customer engagement and feedback mechanisms',
      },
      {
        projectId: seededProjects[3]._id,
        standardId: seededStandards[2]._id, // Scope Management
        overallScore: 78,
        evaluatorId: seniorPortfolioManager._id,
        notes: 'Good scope definition, some ambiguity in requirements',
      },

      // Data Warehouse Implementation evaluations
      {
        projectId: seededProjects[4]._id, // Data Warehouse Implementation
        standardId: seededStandards[0]._id, // Project Charter
        overallScore: 88,
        evaluatorId: seniorPortfolioManager._id,
        notes: 'Strong strategic alignment with data-driven objectives',
      },
      {
        projectId: seededProjects[4]._id,
        standardId: seededStandards[2]._id, // Scope Management
        overallScore: 75,
        evaluatorId: seniorPortfolioManager._id,
        notes: 'Complex scope, managing well given technical complexity',
      },
      {
        projectId: seededProjects[4]._id,
        standardId: seededStandards[3]._id, // Risk Management
        overallScore: 80,
        evaluatorId: seniorPortfolioManager._id,
        notes: 'Good risk identification in data migration and quality',
      },
      {
        projectId: seededProjects[4]._id,
        standardId: seededStandards[4]._id, // Portfolio Governance
        overallScore: 85,
        evaluatorId: seniorPortfolioManager._id,
        notes: 'Excellent portfolio alignment and governance adherence',
      },

      // GDPR Compliance Audit evaluations (completed project)
      {
        projectId: seededProjects[5]._id, // GDPR Compliance Audit
        standardId: seededStandards[0]._id, // Project Charter
        overallScore: 98,
        evaluatorId: complianceAuditor._id,
        notes: 'Perfect project charter with regulatory compliance focus',
      },
      {
        projectId: seededProjects[5]._id,
        standardId: seededStandards[1]._id, // Stakeholder Engagement
        overallScore: 95,
        evaluatorId: complianceAuditor._id,
        notes: 'Excellent stakeholder communication and legal team engagement',
      },
      {
        projectId: seededProjects[5]._id,
        standardId: seededStandards[2]._id, // Scope Management
        overallScore: 96,
        evaluatorId: complianceAuditor._id,
        notes: 'Perfect scope management for regulatory requirements',
      },
      {
        projectId: seededProjects[5]._id,
        standardId: seededStandards[3]._id, // Risk Management
        overallScore: 97,
        evaluatorId: complianceAuditor._id,
        notes: 'Comprehensive risk management for compliance risks',
      },
      {
        projectId: seededProjects[5]._id,
        standardId: seededStandards[4]._id, // Portfolio Governance
        overallScore: 99,
        evaluatorId: complianceAuditor._id,
        notes: 'Perfect alignment with compliance portfolio strategy',
      },
    ];

    const seededEvaluations = [];

    for (const evalData of complianceEvaluations) {
      const evalId = await ctx.db.insert('complianceEvaluations', {
        ...evalData,
        evaluatedAt: now,
        createdAt: now,
      });

      const evaluation = await ctx.db.get(evalId);
      if (evaluation) {
        seededEvaluations.push(evaluation);
      }
    }

    return {
      users: seededUsers.length,
      portfolios: seededPortfolios.length,
      projects: seededProjects.length,
      risks: seededRisks.length,
      pmiStandards: seededStandards.length,
      pmiCriteria: seededCriteria.length,
      complianceEvaluations: seededEvaluations.length,
      message: 'Seed completed successfully with comprehensive mock data including PMI standards',
      userMap: seededUsers.map(u => ({ mockId: u.mockId, convexId: u.convexId.toString() })),
      riskBreakdown: {
        critical: seededRisks.filter(r => r.severity === 'critical').length,
        high: seededRisks.filter(r => r.severity === 'high').length,
        medium: seededRisks.filter(r => r.severity === 'medium').length,
        low: seededRisks.filter(r => r.severity === 'low').length,
      },
    };
  },
});

// Get user by mock ID
export const getUserByMockId = mutation({
  args: { mockId: v.string() },
  handler: async (ctx, args) => {
    // Map mock IDs to actual user data
    const mockUserMap: Record<string, { email: string }> = {
      'exec-001': { email: 'executive@example.com' },
      'pm-001': { email: 'portfolio.manager@example.com' },
      'po-001': { email: 'project.officer@example.com' },
      'admin-001': { email: 'admin@example.com' },
    };

    const mockUser = mockUserMap[args.mockId];
    if (!mockUser) {
      throw new Error(`User with mock ID ${args.mockId} not found`);
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', q => q.eq('email', mockUser.email))
      .first();

    if (!user) {
      throw new Error(`User with email ${mockUser.email} not found. Please run seedAll first.`);
    }

    return user;
  },
});
