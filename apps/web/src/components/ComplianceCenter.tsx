import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import { KPICard } from './visualization/KPICard';
import { LineChart } from './visualization/LineChart';
import { BarChart } from './visualization/BarChart';
import { PieChart } from './visualization/PieChart';

// Tab definitions for the compliance center
type TabType = 'overview' | 'standards' | 'evidence' | 'reports' | 'analytics';

function ComplianceCenter() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Fetch compliance data
  const complianceStats = useQuery(api.complianceDashboard.getComplianceStatistics);
  const portfolioCompliance = useQuery(api.complianceDashboard.getPortfolioCompliance);
  const complianceTrends = useQuery(api.complianceDashboard.getComplianceTrends);
  const standardsAdherence = useQuery(api.complianceDashboard.getStandardsAdherence);
  const nonComplianceHeatmap = useQuery(api.complianceDashboard.getNonComplianceHeatmap);
  const standardsWithCriteria = useQuery(api.pmiStandards.listWithCriteria);

  if (
    !complianceStats ||
    !portfolioCompliance ||
    !complianceTrends ||
    !standardsAdherence ||
    !nonComplianceHeatmap ||
    !standardsWithCriteria
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Transform data for charts
  const lineChartData = {
    labels: complianceTrends.map((t: any) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Overall Compliance',
        data: complianceTrends.map((t: any) => t.complianceScore),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: portfolioCompliance.map((p: any) => p.portfolioName),
    datasets: [
      {
        label: 'Compliance Score',
        data: portfolioCompliance.map((p: any) => p.complianceScore),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: standardsAdherence.map((s: any) => s.standardName),
    datasets: [
      {
        label: 'Compliance Rate',
        data: standardsAdherence.map((s: any) => s.complianceRate),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Tab navigation component
  const TabNavigation = () => (
    <div className="tabs tabs-boxed bg-base-100 mb-6">
      <button
        className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        📊 Overview
      </button>
      <button
        className={`tab ${activeTab === 'standards' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('standards')}
      >
        📚 Standards Library
      </button>
      <button
        className={`tab ${activeTab === 'evidence' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('evidence')}
      >
        📋 Evidence Management
      </button>
      <button
        className={`tab ${activeTab === 'reports' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('reports')}
      >
        📄 Report Center
      </button>
      <button
        className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('analytics')}
      >
        📈 Analytics
      </button>
    </div>
  );

  // Overview Tab Content
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Overall Compliance"
          value={`${complianceStats.overallCompliance}%`}
          subtitle="Average compliance score across all projects"
          trend={{
            value: complianceStats.trendValue || 0,
            isPositive: complianceStats.trend === 'improving',
          }}
          color="primary"
        />
        <KPICard
          title="Projects Compliant"
          value={complianceStats.compliantProjects}
          subtitle={`out of ${complianceStats.totalProjects} total projects`}
          color="success"
        />
        <KPICard
          title="Non-Compliant"
          value={complianceStats.nonCompliantProjects}
          subtitle="Projects requiring attention"
          color="error"
        />
        <KPICard
          title="Standards Coverage"
          value={`${complianceStats.standardsCoverage}%`}
          subtitle="PMI standards being evaluated"
          color="info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Trends */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Compliance Trends</h2>
              <div className="h-80">
                <LineChart data={lineChartData} title="Compliance Score Over Time" />
              </div>
            </div>
          </div>
        </div>

        {/* Standards Adherence */}
        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Standards Adherence</h2>
              <div className="h-80">
                <PieChart data={pieChartData} title="Compliance by Standard" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Compliance Overview */}
        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Portfolio Compliance</h2>
              <div className="h-80">
                <BarChart data={barChartData} title="Compliance by Portfolio" />
              </div>
            </div>
          </div>
        </div>

        {/* Non-Compliance Heat Map */}
        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Non-Compliance Heat Map</h2>
              <div className="h-80">
                <div className="grid grid-cols-4 gap-2 h-full">
                  {nonComplianceHeatmap.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center p-2 rounded-lg"
                      style={{
                        backgroundColor: `rgba(239, 68, 68, ${item.intensity})`,
                        color: item.intensity > 0.5 ? 'white' : 'black',
                      }}
                    >
                      <div className="text-sm font-semibold">{item.standardName}</div>
                      <div className="text-xs">{item.nonCompliantProjects} issues</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Standards Library Tab Content
  const StandardsLibraryTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">PMI Standards Library</h2>
          <p className="text-gray-600 mb-4">
            Browse and search through all available PMI standards and their criteria
          </p>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search standards..."
              className="input input-bordered flex-1"
            />
            <select className="select select-bordered">
              <option value="">All Categories</option>
              <option value="portfolio">Portfolio</option>
              <option value="program">Program</option>
              <option value="project">Project</option>
            </select>
            <select className="select select-bordered">
              <option value="">All Levels</option>
              <option value="foundational">Foundational</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardsWithCriteria.map((standard: any) => (
              <div key={standard._id} className="card bg-base-200 shadow-sm">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title text-lg">{standard.name}</h3>
                    <div className="badge badge-primary">{standard.category}</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{standard.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Level:</span>
                      <span className="badge badge-outline">{standard.level}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Weight:</span>
                      <span>{standard.weight}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Criteria:</span>
                      <span>{standard.criteria.length}</span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-primary">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Evidence Management Tab Content
  const EvidenceManagementTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Evidence Management</h2>
          <p className="text-gray-600 mb-4">
            Upload, manage, and track compliance evidence for all projects
          </p>

          {/* Evidence Actions */}
          <div className="flex gap-4 mb-6">
            <button className="btn btn-primary">📁 Upload Evidence</button>
            <button className="btn btn-outline">🔍 Search Evidence</button>
            <button className="btn btn-outline">📊 Bulk Operations</button>
          </div>

          {/* Evidence Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Submitted</div>
              <div className="stat-value text-primary">24</div>
              <div className="stat-desc">Evidence items</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Under Review</div>
              <div className="stat-value text-warning">12</div>
              <div className="stat-desc">Pending approval</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Approved</div>
              <div className="stat-value text-success">156</div>
              <div className="stat-desc">Valid evidence</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Rejected</div>
              <div className="stat-value text-error">3</div>
              <div className="stat-desc">Requires attention</div>
            </div>
          </div>

          {/* Recent Evidence Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Standard</th>
                  <th>Evidence Type</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Digital Transformation</td>
                  <td>Project Scope Management</td>
                  <td>Document</td>
                  <td>
                    <span className="badge badge-success">Approved</span>
                  </td>
                  <td>2 days ago</td>
                  <td>
                    <button className="btn btn-xs btn-outline">View</button>
                  </td>
                </tr>
                <tr>
                  <td>Infrastructure Upgrade</td>
                  <td>Risk Management</td>
                  <td>Risk Register</td>
                  <td>
                    <span className="badge badge-warning">Under Review</span>
                  </td>
                  <td>1 day ago</td>
                  <td>
                    <button className="btn btn-xs btn-outline">Review</button>
                  </td>
                </tr>
                <tr>
                  <td>Healthcare System</td>
                  <td>Quality Management</td>
                  <td>Test Results</td>
                  <td>
                    <span className="badge badge-error">Rejected</span>
                  </td>
                  <td>3 days ago</td>
                  <td>
                    <button className="btn btn-xs btn-outline">Resubmit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Report Center Tab Content
  const ReportCenterTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Report Generation Center</h2>
          <p className="text-gray-600 mb-4">
            Generate and schedule compliance reports for different stakeholders
          </p>

          {/* Report Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Executive Summary</h3>
                <p className="text-sm text-gray-600 mb-4">
                  High-level compliance overview for executives
                </p>
                <div className="card-actions">
                  <button className="btn btn-primary btn-sm">Generate PDF</button>
                  <button className="btn btn-outline btn-sm">Schedule</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Detailed Compliance</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive compliance breakdown by standard
                </p>
                <div className="card-actions">
                  <button className="btn btn-primary btn-sm">Generate PDF</button>
                  <button className="btn btn-outline btn-sm">Schedule</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Audit Report</h3>
                <p className="text-sm text-gray-600 mb-4">Audit-ready compliance documentation</p>
                <div className="card-actions">
                  <button className="btn btn-primary btn-sm">Generate PDF</button>
                  <button className="btn btn-outline btn-sm">Schedule</button>
                </div>
              </div>
            </div>
          </div>

          {/* Report History */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Type</th>
                  <th>Generated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Q4 2025 Compliance Summary</td>
                  <td>Executive Summary</td>
                  <td>2 days ago</td>
                  <td>
                    <span className="badge badge-success">Completed</span>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-outline">Download</button>
                  </td>
                </tr>
                <tr>
                  <td>Portfolio Compliance Analysis</td>
                  <td>Detailed Compliance</td>
                  <td>1 day ago</td>
                  <td>
                    <span className="badge badge-success">Completed</span>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-outline">Download</button>
                  </td>
                </tr>
                <tr>
                  <td>Annual Audit Report</td>
                  <td>Audit Report</td>
                  <td>In Progress</td>
                  <td>
                    <span className="badge badge-warning">Generating</span>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-outline" disabled>
                      Wait
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Analytics Tab Content
  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Compliance Analytics</h2>
          <p className="text-gray-600 mb-4">
            Advanced analytics and insights for compliance optimization
          </p>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Trend Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">Analyze compliance trends over time</p>
                <div className="card-actions">
                  <button className="btn btn-primary btn-sm">View Trends</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Pattern Recognition</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Identify compliance patterns across portfolios
                </p>
                <div className="card-actions">
                  <button className="btn btn-primary btn-sm">Analyze Patterns</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Predictive Modeling</h3>
                <p className="text-sm text-gray-600 mb-4">Predict future compliance risks</p>
                <div className="card-actions">
                  <button className="btn btn-primary btn-sm">Run Predictions</button>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Compliance Correlation</h3>
                <div className="h-64 bg-base-300 rounded flex items-center justify-center">
                  <p className="text-gray-500">Correlation Analysis Chart</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Risk vs Compliance</h3>
                <div className="h-64 bg-base-300 rounded flex items-center justify-center">
                  <p className="text-gray-500">Risk Correlation Chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'standards':
        return <StandardsLibraryTab />;
      case 'evidence':
        return <EvidenceManagementTab />;
      case 'reports':
        return <ReportCenterTab />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Center</h1>
          <p className="text-gray-600">
            Centralized hub for all compliance-related information and management
          </p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Active Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default ComplianceCenter;
