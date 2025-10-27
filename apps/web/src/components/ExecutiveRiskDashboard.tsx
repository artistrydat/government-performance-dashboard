import React from 'react';
import { usePortfolios } from '../hooks/usePortfolios';
import { useProjects } from '../hooks/useProjects';
import { useRisks } from '../hooks/useRisks';

// Risk Heat Map Component
interface RiskHeatMapProps {
  portfolios: any[];
  projects: any[];
  risks: any[];
}

const RiskHeatMap: React.FC<RiskHeatMapProps> = ({ portfolios, projects, risks }) => {
  const getPortfolioRiskLevel = (portfolioId: string) => {
    const portfolioProjects = projects.filter(p => p.portfolioId === portfolioId);
    const portfolioRisks = risks.filter(risk =>
      portfolioProjects.some(project => project._id === risk.projectId)
    );

    if (portfolioRisks.length === 0) return 'low';

    const criticalRisks = portfolioRisks.filter(r => r.severity === 'critical').length;
    const highRisks = portfolioRisks.filter(r => r.severity === 'high').length;

    if (criticalRisks > 0) return 'critical';
    if (highRisks > 0) return 'high';
    if (portfolioRisks.length > 5) return 'medium';
    return 'low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-400 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'critical':
        return 'Critical';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'No Data';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Portfolio Risk Heat Map</h3>
        <p className="text-base-content/70 mb-4">
          Visual overview of risk levels across all portfolios
        </p>

        {portfolios.length === 0 ? (
          <p className="text-base-content/70">No portfolios available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map(portfolio => {
              const riskLevel = getPortfolioRiskLevel(portfolio._id);
              const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
              const portfolioRisks = risks.filter(risk =>
                portfolioProjects.some(project => project._id === risk.projectId)
              );

              return (
                <div key={portfolio._id} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{portfolio.name}</h4>
                        <p className="text-sm text-base-content/70">
                          {portfolioProjects.length} projects, {portfolioRisks.length} risks
                        </p>
                      </div>
                      <div className={`badge badge-lg ${getRiskColor(riskLevel)}`}>
                        {getRiskLabel(riskLevel)}
                      </div>
                    </div>

                    {/* Risk breakdown */}
                    <div className="mt-3 space-y-1">
                      {portfolioRisks.length > 0 && (
                        <>
                          <div className="flex justify-between text-xs">
                            <span>Critical:</span>
                            <span className="text-red-600 font-semibold">
                              {portfolioRisks.filter(r => r.severity === 'critical').length}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>High:</span>
                            <span className="text-orange-500 font-semibold">
                              {portfolioRisks.filter(r => r.severity === 'high').length}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Medium:</span>
                            <span className="text-yellow-500 font-semibold">
                              {portfolioRisks.filter(r => r.severity === 'medium').length}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Low:</span>
                            <span className="text-green-500 font-semibold">
                              {portfolioRisks.filter(r => r.severity === 'low').length}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Critical Risk Indicators Component
interface CriticalRiskIndicatorsProps {
  risks: any[];
}

const CriticalRiskIndicators: React.FC<CriticalRiskIndicatorsProps> = ({ risks }) => {
  const criticalRisks = risks.filter(r => r.severity === 'critical');
  const highRisks = risks.filter(r => r.severity === 'high');

  const getEscalationStatus = (risk: any) => {
    if (risk.status === 'identified') return 'Needs Escalation';
    if (risk.status === 'monitored') return 'Under Review';
    if (risk.status === 'mitigated') return 'Mitigation in Progress';
    if (risk.status === 'resolved') return 'Resolved';
    return 'Unknown';
  };

  const getEscalationColor = (status: string) => {
    switch (status) {
      case 'Needs Escalation':
        return 'badge-error';
      case 'Under Review':
        return 'badge-warning';
      case 'Mitigation in Progress':
        return 'badge-info';
      case 'Resolved':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Critical Risk Indicators</h3>
        <p className="text-base-content/70 mb-4">
          High-priority risks requiring executive attention
        </p>

        {criticalRisks.length === 0 && highRisks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-base-content/70">No critical or high-priority risks identified.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Critical Risks */}
            {criticalRisks.length > 0 && (
              <div>
                <h4 className="font-semibold text-error mb-3">
                  🚨 Critical Risks ({criticalRisks.length})
                </h4>
                <div className="space-y-3">
                  {criticalRisks.map(risk => (
                    <div key={risk._id} className="alert alert-error">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-bold">{risk.title}</h5>
                            <p className="text-sm opacity-90">{risk.description}</p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`badge ${getEscalationColor(getEscalationStatus(risk))}`}
                            >
                              {getEscalationStatus(risk)}
                            </div>
                            <div className="text-xs mt-1">
                              P: {risk.probability}% | I: {risk.impact}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High Risks */}
            {highRisks.length > 0 && (
              <div>
                <h4 className="font-semibold text-warning mb-3">
                  ⚠️ High Risks ({highRisks.length})
                </h4>
                <div className="space-y-3">
                  {highRisks.map(risk => (
                    <div key={risk._id} className="alert alert-warning">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-bold">{risk.title}</h5>
                            <p className="text-sm opacity-90">{risk.description}</p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`badge ${getEscalationColor(getEscalationStatus(risk))}`}
                            >
                              {getEscalationStatus(risk)}
                            </div>
                            <div className="text-xs mt-1">
                              P: {risk.probability}% | I: {risk.impact}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Risk Trend Analysis Component
interface RiskTrendAnalysisProps {
  risks: any[];
}

const RiskTrendAnalysis: React.FC<RiskTrendAnalysisProps> = ({ risks }) => {
  // Calculate risk trends (simplified - in real app would use historical data)
  const getRiskTrends = () => {
    const totalRisks = risks.length;
    const criticalRisks = risks.filter(r => r.severity === 'critical').length;
    const highRisks = risks.filter(r => r.severity === 'high').length;
    const unresolvedRisks = risks.filter(r => r.status !== 'resolved').length;

    // Calculate average risk score
    const averageRiskScore =
      risks.length > 0
        ? risks.reduce((sum, risk) => sum + (risk.probability * risk.impact) / 100, 0) /
          risks.length
        : 0;

    return {
      totalRisks,
      criticalRisks,
      highRisks,
      unresolvedRisks,
      averageRiskScore: Math.round(averageRiskScore * 100) / 100,
      trend: totalRisks > 10 ? 'increasing' : totalRisks > 5 ? 'stable' : 'decreasing',
    };
  };

  const trends = getRiskTrends();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '📈';
      case 'decreasing':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-error';
      case 'decreasing':
        return 'text-success';
      default:
        return 'text-warning';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Risk Trend Analysis</h3>
        <p className="text-base-content/70 mb-4">Overview of risk patterns and trends over time</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{trends.totalRisks}</div>
            <div className="text-sm text-base-content/70">Total Risks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">{trends.criticalRisks}</div>
            <div className="text-sm text-base-content/70">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{trends.highRisks}</div>
            <div className="text-sm text-base-content/70">High</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{trends.unresolvedRisks}</div>
            <div className="text-sm text-base-content/70">Unresolved</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Overall Risk Trend:</span>
            <span className={`font-semibold ${getTrendColor(trends.trend)}`}>
              {getTrendIcon(trends.trend)} {trends.trend.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Average Risk Score:</span>
            <span className="font-semibold">{trends.averageRiskScore.toFixed(1)}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Risk Concentration:</span>
            <span className="font-semibold">
              {trends.criticalRisks + trends.highRisks > 0 ? 'High' : 'Low'}
            </span>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <h4 className="font-semibold mb-2">Executive Insights</h4>
          <ul className="text-sm space-y-1">
            {trends.criticalRisks > 0 && (
              <li>• {trends.criticalRisks} critical risks require immediate executive attention</li>
            )}
            {trends.highRisks > 3 && (
              <li>• High number of high-priority risks suggests systemic issues</li>
            )}
            {trends.averageRiskScore > 50 && (
              <li>• Overall risk exposure is elevated - consider portfolio-level mitigation</li>
            )}
            {trends.totalRisks === 0 && (
              <li>
                • No significant risks identified - maintain current risk monitoring practices
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Executive Risk Summary Component
interface ExecutiveRiskSummaryProps {
  portfolios: any[];
  projects: any[];
  risks: any[];
}

const ExecutiveRiskSummary: React.FC<ExecutiveRiskSummaryProps> = ({
  portfolios,
  projects,
  risks,
}) => {
  const getExecutiveSummary = () => {
    const totalRisks = risks.length;
    const criticalRisks = risks.filter(r => r.severity === 'critical').length;
    const highRisks = risks.filter(r => r.severity === 'high').length;
    const unresolvedRisks = risks.filter(r => r.status !== 'resolved').length;

    // Calculate portfolio risk distribution
    const portfolioRiskLevels = portfolios.map(portfolio => {
      const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
      const portfolioRisks = risks.filter(risk =>
        portfolioProjects.some(project => project._id === risk.projectId)
      );
      return {
        name: portfolio.name,
        riskCount: portfolioRisks.length,
        criticalRisks: portfolioRisks.filter(r => r.severity === 'critical').length,
      };
    });

    const highestRiskPortfolio = portfolioRiskLevels.reduce(
      (max, portfolio) => (portfolio.riskCount > max.riskCount ? portfolio : max),
      { name: '', riskCount: 0, criticalRisks: 0 }
    );

    let summary = '';

    if (criticalRisks > 0) {
      summary = `🚨 CRITICAL ALERT: ${criticalRisks} critical risks require immediate executive intervention. `;
      summary += `Portfolio "${highestRiskPortfolio.name}" has the highest concentration with ${highestRiskPortfolio.riskCount} total risks. `;
    } else if (highRisks > 0) {
      summary = `⚠️ ELEVATED RISK: ${highRisks} high-priority risks need management attention. `;
      summary += `Overall risk exposure is manageable but requires monitoring. `;
    } else if (totalRisks > 0) {
      summary = `✅ STABLE: ${totalRisks} identified risks are at acceptable levels. `;
      summary += `Continue standard risk management practices. `;
    } else {
      summary = `🎯 OPTIMAL: No significant risks identified across all portfolios. `;
      summary += `Maintain current risk monitoring protocols. `;
    }

    summary += `${unresolvedRisks} risks remain unresolved and require follow-up.`;

    return summary;
  };

  const getActionableRecommendations = () => {
    const criticalRisks = risks.filter(r => r.severity === 'critical').length;
    const highRisks = risks.filter(r => r.severity === 'high').length;

    const recommendations = [];

    if (criticalRisks > 0) {
      recommendations.push('Schedule immediate executive review of critical risks');
      recommendations.push('Allocate additional resources for risk mitigation');
      recommendations.push('Consider portfolio rebalancing to reduce concentration');
    }

    if (highRisks > 3) {
      recommendations.push('Implement enhanced risk monitoring protocols');
      recommendations.push('Review project selection criteria for risk exposure');
      recommendations.push('Establish cross-portfolio risk mitigation teams');
    }

    if (criticalRisks === 0 && highRisks === 0) {
      recommendations.push('Continue current risk management practices');
      recommendations.push('Maintain regular executive risk reviews');
      recommendations.push('Focus on proactive risk identification');
    }

    return recommendations;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Executive Risk Summary</h3>
        <p className="text-base-content/70 mb-4">
          Strategic overview and actionable recommendations
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-base-200 rounded-lg">
            <h4 className="font-semibold mb-2">Summary</h4>
            <p className="text-sm leading-relaxed">{getExecutiveSummary()}</p>
          </div>

          <div className="p-4 bg-base-200 rounded-lg">
            <h4 className="font-semibold mb-2">Actionable Recommendations</h4>
            <ul className="text-sm space-y-1">
              {getActionableRecommendations().map((recommendation, index) => (
                <li key={index}>• {recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Executive Risk Dashboard Component
const ExecutiveRiskDashboard: React.FC = () => {
  const { portfolios, isLoading: portfoliosLoading } = usePortfolios();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { risks, isLoading: risksLoading } = useRisks();

  if (portfoliosLoading || projectsLoading || risksLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Executive Risk Dashboard</h1>
        <div className="grid grid-cols-1 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-4 w-3/4" data-testid="skeleton"></div>
                <div className="skeleton h-4 w-full mt-2" data-testid="skeleton"></div>
                <div className="skeleton h-4 w-5/6 mt-2" data-testid="skeleton"></div>
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
        <h1 className="text-3xl font-bold mb-2">Executive Risk Dashboard</h1>
        <p className="text-base-content/70">
          Comprehensive risk overview for executive decision making
        </p>
      </div>

      <div className="space-y-6">
        {/* Executive Risk Summary */}
        <ExecutiveRiskSummary portfolios={portfolios} projects={projects} risks={risks} />

        {/* Portfolio Risk Heat Map */}
        <RiskHeatMap portfolios={portfolios} projects={projects} risks={risks} />

        {/* Critical Risk Indicators */}
        <CriticalRiskIndicators risks={risks} />

        {/* Risk Trend Analysis */}
        <RiskTrendAnalysis risks={risks} />
      </div>
    </div>
  );
};

export default ExecutiveRiskDashboard;
