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
        mockId: 'admin-001',
        name: 'Administrator',
        email: 'admin@example.com',
        role: 'executive' as const,
        department: 'IT',
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

    // Get project officer user
    const projectOfficer = await ctx.db
      .query('users')
      .withIndex('by_email', q => q.eq('email', 'project.officer@example.com'))
      .first();

    if (!projectOfficer) {
      throw new Error('Project officer user not found after seeding.');
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
        teamMembers: [projectOfficer._id],
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
        teamMembers: [projectOfficer._id],
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
        teamMembers: [projectOfficer._id],
        healthScore: 65,
        riskLevel: 'high' as const,
        tags: ['mobile', 'app', 'customer-facing'],
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

    return {
      users: seededUsers.length,
      portfolios: seededPortfolios.length,
      projects: seededProjects.length,
      risks: seededRisks.length,
      message: 'Seed completed successfully with comprehensive mock data',
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
