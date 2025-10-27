import React, { useState } from 'react';
import { usePortfolios } from '../hooks/usePortfolios';
import { useProjects } from '../hooks/useProjects';
import { useRisks } from '../hooks/useRisks';
import { Id } from '../../../api/convex/_generated/dataModel';

interface RiskHeatMapData {
  portfolioId: Id<'portfolios'>;
  portfolioName: string;
  projectCount: number;
  riskCount: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface DependencyNode {
  id: string;
  name: string;
  type: 'portfolio' | 'project';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  x?: number;
  y?: number;
}

interface DependencyLink {
  source: string;
  target: string;
  type: 'dependency' | 'risk-propagation';
  strength: number;
}

interface ResourceOptimization {
  portfolioId: Id<'portfolios'>;
  portfolioName: string;
  currentResourceAllocation: number;
  suggestedAllocation: number;
  optimizationReason: string;
  riskReduction: number;
}

interface RiskMitigationPlan {
  riskId: Id<'risks'>;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  currentStatus: 'identified' | 'monitored' | 'mitigated' | 'resolved';
  mitigationActions: string[];
  assignedTo?: string;
  deadline?: number;
  progress: number;
}

const PortfolioRiskManagement: React.FC = () => {
  const { portfolios, isLoading: portfoliosLoading } = usePortfolios();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { risks, isLoading: risksLoading } = useRisks();

  const [selectedPortfolio, setSelectedPortfolio] = useState<Id<'portfolios'> | null>(null);
  const [activeTab, setActiveTab] = useState<
    'heatmap' | 'dependencies' | 'resources' | 'mitigation'
  >('heatmap');

  // Calculate risk heat map data
  const calculateRiskHeatMapData = (): RiskHeatMapData[] => {
    return portfolios.map(portfolio => {
      const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
      const portfolioRisks = risks.filter(risk =>
        portfolioProjects.some(project => project._id === risk.projectId)
      );

      const criticalRisks = portfolioRisks.filter(r => r.severity === 'critical').length;
      const highRisks = portfolioRisks.filter(r => r.severity === 'high').length;
      const mediumRisks = portfolioRisks.filter(r => r.severity === 'medium').length;
      const lowRisks = portfolioRisks.filter(r => r.severity === 'low').length;

      let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (criticalRisks > 0) overallRiskLevel = 'critical';
      else if (highRisks > 2) overallRiskLevel = 'high';
      else if (highRisks > 0 || mediumRisks > 3) overallRiskLevel = 'medium';

      return {
        portfolioId: portfolio._id,
        portfolioName: portfolio.name,
        projectCount: portfolioProjects.length,
        riskCount: portfolioRisks.length,
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,
        overallRiskLevel,
      };
    });
  };

  // Generate dependency graph data
  const generateDependencyGraph = (): { nodes: DependencyNode[]; links: DependencyLink[] } => {
    const nodes: DependencyNode[] = [];
    const links: DependencyLink[] = [];

    // Add portfolio nodes
    portfolios.forEach(portfolio => {
      const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
      const portfolioRisks = risks.filter(risk =>
        portfolioProjects.some(project => project._id === risk.projectId)
      );

      const criticalRisks = portfolioRisks.filter(r => r.severity === 'critical').length;
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (criticalRisks > 0) riskLevel = 'critical';
      else if (portfolioRisks.filter(r => r.severity === 'high').length > 2) riskLevel = 'high';
      else if (
        portfolioRisks.filter(r => r.severity === 'high').length > 0 ||
        portfolioRisks.filter(r => r.severity === 'medium').length > 3
      )
        riskLevel = 'medium';

      nodes.push({
        id: portfolio._id,
        name: portfolio.name,
        type: 'portfolio',
        riskLevel,
      });
    });

    // Add project nodes and links
    projects.forEach(project => {
      if (project.portfolioId) {
        nodes.push({
          id: project._id,
          name: project.name,
          type: 'project',
          riskLevel: project.riskLevel,
        });

        links.push({
          source: project.portfolioId,
          target: project._id,
          type: 'dependency',
          strength: 1,
        });
      }
    });

    // Add risk propagation links between projects in same portfolio
    portfolios.forEach(portfolio => {
      const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);

      portfolioProjects.forEach((project, index) => {
        if (index < portfolioProjects.length - 1) {
          const nextProject = portfolioProjects[index + 1];
          if (project.riskLevel === 'high' || project.riskLevel === 'critical') {
            links.push({
              source: project._id,
              target: nextProject._id,
              type: 'risk-propagation',
              strength: project.riskLevel === 'critical' ? 0.8 : 0.5,
            });
          }
        }
      });
    });

    return { nodes, links };
  };

  // Calculate resource optimization suggestions
  const calculateResourceOptimization = (): ResourceOptimization[] => {
    return portfolios.map(portfolio => {
      const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
      const portfolioRisks = risks.filter(risk =>
        portfolioProjects.some(project => project._id === risk.projectId)
      );

      const criticalRisks = portfolioRisks.filter(r => r.severity === 'critical').length;
      const highRisks = portfolioRisks.filter(r => r.severity === 'high').length;

      const currentAllocation = portfolioProjects.reduce((sum, project) => sum + project.budget, 0);
      let suggestedAllocation = currentAllocation;
      let optimizationReason = 'Optimal allocation';
      let riskReduction = 0;

      if (criticalRisks > 0) {
        suggestedAllocation = currentAllocation * 1.2; // Increase budget for critical risks
        optimizationReason = 'Critical risks require additional resources';
        riskReduction = 0.3;
      } else if (highRisks > 2) {
        suggestedAllocation = currentAllocation * 1.1; // Moderate increase for high risks
        optimizationReason = 'Multiple high risks need attention';
        riskReduction = 0.2;
      } else if (portfolio.healthScore < 60) {
        suggestedAllocation = currentAllocation * 0.9; // Reduce allocation for low health portfolios
        optimizationReason = 'Low health score suggests resource reallocation';
        riskReduction = 0.1;
      }

      return {
        portfolioId: portfolio._id,
        portfolioName: portfolio.name,
        currentResourceAllocation: currentAllocation,
        suggestedAllocation,
        optimizationReason,
        riskReduction,
      };
    });
  };

  // Generate risk mitigation plans
  const generateRiskMitigationPlans = (): RiskMitigationPlan[] => {
    const mitigationPlans: RiskMitigationPlan[] = [];

    risks.forEach(risk => {
      if (risk.severity === 'critical' || risk.severity === 'high') {
        const project = projects.find(p => p._id === risk.projectId);
        const portfolio = project ? portfolios.find(p => p._id === project.portfolioId) : null;

        const mitigationActions = [
          'Immediate risk assessment meeting',
          'Develop contingency plan',
          'Assign dedicated risk owner',
          'Weekly progress monitoring',
        ];

        if (risk.severity === 'critical') {
          mitigationActions.push('Executive escalation required');
        }

        mitigationPlans.push({
          riskId: risk._id,
          title: risk.title,
          severity: risk.severity,
          currentStatus: risk.status,
          mitigationActions,
          assignedTo: portfolio?.name || 'Unassigned',
          deadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
          progress:
            risk.status === 'identified'
              ? 0
              : risk.status === 'monitored'
                ? 25
                : risk.status === 'mitigated'
                  ? 75
                  : 100,
        });
      }
    });

    return mitigationPlans;
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high' | 'critical') => {
    switch (level) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRiskLevelBadge = (level: 'low' | 'medium' | 'high' | 'critical') => {
    switch (level) {
      case 'critical':
        return 'badge-error';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-info';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  if (portfoliosLoading || projectsLoading || risksLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-32">
          <div
            className="loading loading-spinner loading-lg text-primary"
            role="status"
            aria-label="Loading risk management data"
          ></div>
        </div>
      </div>
    );
  }

  const riskHeatMapData = calculateRiskHeatMapData();
  const dependencyGraph = generateDependencyGraph();
  const resourceOptimizations = calculateResourceOptimization();
  const mitigationPlans = generateRiskMitigationPlans();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Risk Management</h1>
          <p className="text-base-content/70 mt-2">
            Identify and mitigate cross-project risks across portfolios
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === 'heatmap' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('heatmap')}
        >
          Risk Heat Map
        </button>
        <button
          className={`tab ${activeTab === 'dependencies' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('dependencies')}
        >
          Dependency Graph
        </button>
        <button
          className={`tab ${activeTab === 'resources' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Resource Optimization
        </button>
        <button
          className={`tab ${activeTab === 'mitigation' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('mitigation')}
        >
          Mitigation Planning
        </button>
      </div>

      {/* Risk Heat Map Tab */}
      {activeTab === 'heatmap' && (
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Portfolio Risk Heat Map</h2>
              <p className="text-base-content/70">
                Visual overview of risk levels across all portfolios
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {riskHeatMapData.map(data => (
                  <div
                    key={data.portfolioId}
                    className={`card cursor-pointer transition-all hover:scale-105 ${
                      selectedPortfolio === data.portfolioId ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() =>
                      setSelectedPortfolio(
                        selectedPortfolio === data.portfolioId ? null : data.portfolioId
                      )
                    }
                  >
                    <div
                      className={`card-body p-4 ${getRiskLevelColor(data.overallRiskLevel)} rounded-lg`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="card-title text-lg font-semibold">{data.portfolioName}</h3>
                        <div className={`badge ${getRiskLevelBadge(data.overallRiskLevel)}`}>
                          {data.overallRiskLevel.toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="font-semibold">{data.projectCount}</span> projects
                        </div>
                        <div>
                          <span className="font-semibold">{data.riskCount}</span> risks
                        </div>
                      </div>

                      <div className="flex gap-1 mt-2">
                        {data.criticalRisks > 0 && (
                          <div className="badge badge-error badge-sm">
                            {data.criticalRisks} Critical
                          </div>
                        )}
                        {data.highRisks > 0 && (
                          <div className="badge badge-warning badge-sm">{data.highRisks} High</div>
                        )}
                        {data.mediumRisks > 0 && (
                          <div className="badge badge-info badge-sm">{data.mediumRisks} Medium</div>
                        )}
                        {data.lowRisks > 0 && (
                          <div className="badge badge-success badge-sm">{data.lowRisks} Low</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Impact Analysis */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Risk Impact Analysis</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Portfolio</th>
                      <th>Projects</th>
                      <th>Total Risks</th>
                      <th>Critical</th>
                      <th>High</th>
                      <th>Impact Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskHeatMapData.map(data => {
                      const impactScore =
                        data.criticalRisks * 4 + data.highRisks * 2 + data.mediumRisks;
                      return (
                        <tr key={data.portfolioId}>
                          <td className="font-semibold">{data.portfolioName}</td>
                          <td>{data.projectCount}</td>
                          <td>{data.riskCount}</td>
                          <td>
                            <span className="badge badge-error">{data.criticalRisks}</span>
                          </td>
                          <td>
                            <span className="badge badge-warning">{data.highRisks}</span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                impactScore >= 8
                                  ? 'badge-error'
                                  : impactScore >= 4
                                    ? 'badge-warning'
                                    : 'badge-success'
                              }`}
                            >
                              {impactScore}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dependency Graph Tab */}
      {activeTab === 'dependencies' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Dependency Network Graph</h2>
            <p className="text-base-content/70">
              Visual representation of project relationships and risk propagation
            </p>

            <div className="bg-base-200 rounded-lg p-6 min-h-96 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Portfolio Nodes */}
                <div>
                  <h3 className="font-semibold mb-3">Portfolios</h3>
                  <div className="space-y-2">
                    {dependencyGraph.nodes
                      .filter(n => n.type === 'portfolio')
                      .map(node => (
                        <div
                          key={node.id}
                          className={`p-3 rounded-lg border-2 ${
                            node.riskLevel === 'critical'
                              ? 'border-red-500 bg-red-50'
                              : node.riskLevel === 'high'
                                ? 'border-orange-500 bg-orange-50'
                                : node.riskLevel === 'medium'
                                  ? 'border-yellow-500 bg-yellow-50'
                                  : 'border-green-500 bg-green-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{node.name}</span>
                            <span className={`badge ${getRiskLevelBadge(node.riskLevel)}`}>
                              {node.riskLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Project Nodes */}
                <div>
                  <h3 className="font-semibold mb-3">Projects</h3>
                  <div className="space-y-2">
                    {dependencyGraph.nodes
                      .filter(n => n.type === 'project')
                      .map(node => (
                        <div
                          key={node.id}
                          className={`p-2 rounded border ${
                            node.riskLevel === 'critical'
                              ? 'border-red-400 bg-red-25'
                              : node.riskLevel === 'high'
                                ? 'border-orange-400 bg-orange-25'
                                : node.riskLevel === 'medium'
                                  ? 'border-yellow-400 bg-yellow-25'
                                  : 'border-green-400 bg-green-25'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium truncate">{node.name}</span>
                            <span className={`badge badge-sm ${getRiskLevelBadge(node.riskLevel)}`}>
                              {node.riskLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Dependency Legend */}
              <div className="mt-6 p-4 bg-base-300 rounded-lg">
                <h4 className="font-semibold mb-2">Legend</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Portfolio → Project (Dependency)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Project → Project (Risk Propagation)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Optimization Tab */}
      {activeTab === 'resources' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Resource Optimization Suggestions</h2>
            <p className="text-base-content/70">
              AI-powered recommendations for optimal resource allocation
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Portfolio</th>
                    <th>Current Allocation</th>
                    <th>Suggested Allocation</th>
                    <th>Change</th>
                    <th>Risk Reduction</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceOptimizations.map(optimization => {
                    const change =
                      optimization.suggestedAllocation - optimization.currentResourceAllocation;
                    const changePercent = (change / optimization.currentResourceAllocation) * 100;

                    return (
                      <tr key={optimization.portfolioId}>
                        <td className="font-semibold">{optimization.portfolioName}</td>
                        <td>${optimization.currentResourceAllocation.toLocaleString()}</td>
                        <td>${optimization.suggestedAllocation.toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              change > 0
                                ? 'badge-success'
                                : change < 0
                                  ? 'badge-warning'
                                  : 'badge-neutral'
                            }`}
                          >
                            {change > 0 ? '+' : ''}
                            {changePercent.toFixed(1)}%
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-info">
                            {(optimization.riskReduction * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="text-sm">{optimization.optimizationReason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Mitigation Planning Tab */}
      {activeTab === 'mitigation' && (
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Risk Mitigation Planning</h2>
              <p className="text-base-content/70">
                Active mitigation plans for high and critical risks
              </p>

              <div className="space-y-4 mt-4">
                {mitigationPlans.map(plan => (
                  <div key={plan.riskId} className="card bg-base-200">
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="card-title text-lg">{plan.title}</h3>
                          <div className="flex gap-2 mt-1">
                            <span className={`badge ${getRiskLevelBadge(plan.severity)}`}>
                              {plan.severity.toUpperCase()}
                            </span>
                            <span className="badge badge-neutral">{plan.currentStatus}</span>
                            <span className="badge badge-outline">Assigned: {plan.assignedTo}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-base-content/70">
                            Deadline:{' '}
                            {plan.deadline
                              ? new Date(plan.deadline).toLocaleDateString()
                              : 'Not set'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <progress
                          className="progress progress-primary w-full"
                          value={plan.progress}
                          max="100"
                        ></progress>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Mitigation Actions</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {plan.mitigationActions.map((action, index) => (
                            <li key={index} className="text-sm">
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {mitigationPlans.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-base-content/50 text-lg">
                    No high or critical risks requiring mitigation plans.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioRiskManagement;
