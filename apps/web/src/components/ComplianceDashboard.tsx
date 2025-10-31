import { useQuery } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import { KPICard } from './visualization/KPICard';
import { LineChart } from './visualization/LineChart';
import { BarChart } from './visualization/BarChart';
import { PieChart } from './visualization/PieChart';
import { ProgressBar } from './visualization/ProgressBar';

function ComplianceDashboard() {
  // Fetch compliance data
  const complianceStats = useQuery(api.complianceDashboard.getComplianceStatistics);
  const portfolioCompliance = useQuery(api.complianceDashboard.getPortfolioCompliance);
  const complianceTrends = useQuery(api.complianceDashboard.getComplianceTrends);
  const standardsAdherence = useQuery(api.complianceDashboard.getStandardsAdherence);
  const nonComplianceHeatmap = useQuery(api.complianceDashboard.getNonComplianceHeatmap);

  if (
    !complianceStats ||
    !portfolioCompliance ||
    !complianceTrends ||
    !standardsAdherence ||
    !nonComplianceHeatmap
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

  // Mock project data for demonstration
  const projectData = portfolioCompliance.flatMap(
    (p: any) =>
      p.projects?.map((project: any) => ({
        projectName: project.name || 'Unknown Project',
        portfolioName: p.portfolioName,
        complianceScore: project.complianceScore || 0,
        lastEvaluation: project.lastEvaluation
          ? new Date(project.lastEvaluation).toLocaleDateString()
          : 'Never',
        status: project.status || 'Unknown',
      })) || []
  );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Dashboard</h1>
          <p className="text-gray-600">
            Monitor PMI standards compliance across portfolios and projects
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

        {/* Project-Level Drill Down */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Project Compliance Details</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Portfolio</th>
                    <th>Compliance Score</th>
                    <th>Last Evaluation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.map((project: any, index: number) => (
                    <tr key={index}>
                      <td className="font-medium">{project.projectName}</td>
                      <td>{project.portfolioName}</td>
                      <td>
                        <ProgressBar
                          value={project.complianceScore}
                          max={100}
                          showPercentage={true}
                          size="sm"
                        />
                      </td>
                      <td>{project.lastEvaluation}</td>
                      <td>
                        <span
                          className={`badge ${
                            project.complianceScore >= 80
                              ? 'badge-success'
                              : project.complianceScore >= 60
                                ? 'badge-warning'
                                : 'badge-error'
                          }`}
                        >
                          {project.complianceScore >= 80
                            ? 'Compliant'
                            : project.complianceScore >= 60
                              ? 'Partial'
                              : 'Non-Compliant'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Real-time Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-sm">Overall Compliance</h3>
              <ProgressBar
                value={complianceStats.overallCompliance}
                max={100}
                showPercentage={true}
                size="lg"
              />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-sm">Compliant Projects</h3>
              <ProgressBar
                value={complianceStats.compliantProjects}
                max={complianceStats.totalProjects}
                showPercentage={true}
                size="lg"
                color="success"
              />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-sm">Non-Compliant Projects</h3>
              <ProgressBar
                value={complianceStats.nonCompliantProjects}
                max={complianceStats.totalProjects}
                showPercentage={true}
                size="lg"
                color="error"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplianceDashboard;
