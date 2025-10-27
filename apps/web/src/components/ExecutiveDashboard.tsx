import React from 'react';
import { usePortfolios } from '../hooks/usePortfolios';
import { useProjects } from '../hooks/useProjects';
import { useRisks } from '../hooks/useRisks';

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  icon?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  trendValue,
  color = 'primary',
  icon,
}) => {
  const colorClasses = {
    primary: 'bg-primary text-primary-content',
    success: 'bg-success text-success-content',
    warning: 'bg-warning text-warning-content',
    error: 'bg-error text-error-content',
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    neutral: '➡️',
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-base-content/70">{title}</h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && trendValue && (
              <div className="flex items-center mt-1 text-sm">
                <span className="mr-1">{trendIcons[trend]}</span>
                <span
                  className={
                    trend === 'up'
                      ? 'text-success'
                      : trend === 'down'
                        ? 'text-error'
                        : 'text-base-content/70'
                  }
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}
            >
              <span className="text-xl">{icon}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Portfolio Health Score Component
interface PortfolioHealthScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const PortfolioHealthScore: React.FC<PortfolioHealthScoreProps> = ({ score, size = 'md' }) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className="text-center">
      <div className={`font-bold ${sizeClasses[size]} ${getHealthColor(score)}`}>{score}</div>
      <div className="text-sm text-base-content/70 mt-1">{getHealthLabel(score)} Health</div>
    </div>
  );
};

// Natural Language Summary Component
const NaturalLanguageSummary: React.FC = () => {
  const { portfolios, isLoading: portfoliosLoading } = usePortfolios();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { risks, isLoading: risksLoading } = useRisks();

  if (portfoliosLoading || projectsLoading || risksLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-5/6"></div>
        </div>
      </div>
    );
  }

  const totalPortfolios = portfolios.length;
  const totalProjects = projects.length;
  const totalRisks = risks.length;
  const criticalRisks = risks.filter(risk => risk.severity === 'critical').length;
  const averageHealthScore =
    portfolios.length > 0
      ? portfolios.reduce((sum, portfolio) => sum + portfolio.healthScore, 0) / portfolios.length
      : 0;

  const getSummaryText = () => {
    if (totalPortfolios === 0) {
      return 'No portfolios available. Create your first portfolio to get started.';
    }

    const healthStatus =
      averageHealthScore >= 80
        ? 'excellent'
        : averageHealthScore >= 60
          ? 'good'
          : averageHealthScore >= 40
            ? 'fair'
            : 'concerning';

    let summary = `Overall portfolio health is ${healthStatus} with an average score of ${averageHealthScore.toFixed(1)}. `;
    summary += `You have ${totalPortfolios} portfolios managing ${totalProjects} projects. `;

    if (criticalRisks > 0) {
      summary += `⚠️ Attention needed: ${criticalRisks} critical risks require immediate review.`;
    } else if (totalRisks > 0) {
      summary += `There are ${totalRisks} identified risks across all projects.`;
    } else {
      summary += `No significant risks identified at this time.`;
    }

    return summary;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Executive Summary</h3>
        <p className="text-base-content/80 leading-relaxed">{getSummaryText()}</p>
      </div>
    </div>
  );
};

// Strategic Health Indicators Component
const StrategicHealthIndicators: React.FC = () => {
  const { isLoading: portfoliosLoading } = usePortfolios();
  const { projects, isLoading: projectsLoading } = useProjects();

  if (portfoliosLoading || projectsLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Strategic Health Indicators</h3>
          <div className="space-y-2">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-4 w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const atRiskProjects = projects.filter(p => p.status === 'at-risk').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const completionRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;

  const indicators = [
    {
      label: 'Budget Utilization',
      value: `$${(totalBudget / 1000000).toFixed(1)}M`,
      status: totalBudget > 5000000 ? 'high' : totalBudget > 1000000 ? 'medium' : 'low',
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      status: activeProjects > 10 ? 'high' : activeProjects > 5 ? 'medium' : 'low',
    },
    {
      label: 'At-Risk Projects',
      value: atRiskProjects,
      status: atRiskProjects > 3 ? 'high' : atRiskProjects > 1 ? 'medium' : 'low',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      status: completionRate > 80 ? 'high' : completionRate > 60 ? 'medium' : 'low',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-base-content/70';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Strategic Health Indicators</h3>
        <div className="grid grid-cols-2 gap-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold">{indicator.value}</div>
              <div className="text-sm text-base-content/70">{indicator.label}</div>
              <div className={`text-xs mt-1 ${getStatusColor(indicator.status)}`}>
                {indicator.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Executive Dashboard Component
const ExecutiveDashboard: React.FC = () => {
  const { portfolios, isLoading: portfoliosLoading } = usePortfolios();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { risks, isLoading: risksLoading } = useRisks();

  // Get overall statistics
  const totalPortfolios = portfolios.length;
  const totalProjects = projects.length;
  const totalRisks = risks.length;
  const criticalRisks = risks.filter(risk => risk.severity === 'critical').length;
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const averageHealthScore =
    portfolios.length > 0
      ? portfolios.reduce((sum, portfolio) => sum + portfolio.healthScore, 0) / portfolios.length
      : 0;

  if (portfoliosLoading || projectsLoading || risksLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Executive Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-4 w-3/4" data-testid="skeleton"></div>
                <div className="skeleton h-8 w-1/2 mt-2" data-testid="skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Executive Dashboard</h1>
        <p className="text-base-content/70">
          High-level portfolio overview for strategic decision making
        </p>
      </div>

      {/* Portfolio Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Overall Portfolio Health</h3>
              <PortfolioHealthScore score={averageHealthScore} size="lg" />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <KPICard title="Total Portfolios" value={totalPortfolios} icon="📊" color="primary" />
            <KPICard title="Total Projects" value={totalProjects} icon="📋" color="success" />
            <KPICard
              title="Total Budget"
              value={`$${(totalBudget / 1000000).toFixed(1)}M`}
              icon="💰"
              color="warning"
            />
            <KPICard
              title="Total Risks"
              value={totalRisks}
              icon="⚠️"
              color={totalRisks > 0 ? 'warning' : 'success'}
            />
            <KPICard
              title="Critical Risks"
              value={criticalRisks}
              icon="🚨"
              color={criticalRisks > 0 ? 'error' : 'success'}
            />
            <KPICard
              title="Avg Health Score"
              value={averageHealthScore.toFixed(1)}
              icon="❤️"
              color={
                averageHealthScore >= 80
                  ? 'success'
                  : averageHealthScore >= 60
                    ? 'warning'
                    : 'error'
              }
            />
          </div>
        </div>
      </div>

      {/* Natural Language Summary */}
      <div className="mb-6">
        <NaturalLanguageSummary />
      </div>

      {/* Strategic Health Indicators */}
      <div className="mb-6">
        <StrategicHealthIndicators />
      </div>

      {/* Portfolio List */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Portfolio Overview</h3>
          {portfolios.length === 0 ? (
            <p className="text-base-content/70">No portfolios created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Portfolio Name</th>
                    <th>Health Score</th>
                    <th>Projects</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map(portfolio => {
                    const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
                    return (
                      <tr key={portfolio._id}>
                        <td className="font-medium">{portfolio.name}</td>
                        <td>
                          <PortfolioHealthScore score={portfolio.healthScore} size="sm" />
                        </td>
                        <td>{portfolioProjects.length}</td>
                        <td>
                          <span
                            className={`badge ${
                              portfolio.healthScore >= 80
                                ? 'badge-success'
                                : portfolio.healthScore >= 60
                                  ? 'badge-warning'
                                  : 'badge-error'
                            }`}
                          >
                            {portfolio.healthScore >= 80
                              ? 'Healthy'
                              : portfolio.healthScore >= 60
                                ? 'Moderate'
                                : 'At Risk'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
