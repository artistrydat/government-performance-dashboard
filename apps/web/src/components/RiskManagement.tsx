import React, { useState } from 'react';
import { useRisks } from '../hooks/useRisks';
import { useProjects } from '../hooks/useProjects';
import { Id } from '../../../api/convex/_generated/dataModel';

interface RiskFormData {
  projectId: Id<'projects'> | '';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'monitored' | 'mitigated' | 'resolved';
  probability: number;
  impact: number;
  mitigationPlan: string;
}

const RiskManagement: React.FC = () => {
  const { risks, isLoading: risksLoading, createRisk, updateRisk, deleteRisk } = useRisks();
  const { projects, isLoading: projectsLoading } = useProjects();
  const [selectedRisk, setSelectedRisk] = useState<Id<'risks'> | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  const [formData, setFormData] = useState<RiskFormData>({
    projectId: '',
    title: '',
    description: '',
    severity: 'medium',
    status: 'identified',
    probability: 50,
    impact: 50,
    mitigationPlan: '',
  });

  const resetForm = () => {
    setFormData({
      projectId: '',
      title: '',
      description: '',
      severity: 'medium',
      status: 'identified',
      probability: 50,
      impact: 50,
      mitigationPlan: '',
    });
  };

  const handleCreateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) {
      alert('Please select a project');
      return;
    }

    try {
      await createRisk({
        projectId: formData.projectId as Id<'projects'>,
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        status: formData.status,
        probability: formData.probability,
        impact: formData.impact,
        mitigationPlan: formData.mitigationPlan,
      });
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      alert('Failed to create risk. Please try again.');
    }
  };

  const handleUpdateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRisk) return;

    try {
      await updateRisk({
        riskId: selectedRisk,
        projectId: formData.projectId as Id<'projects'>,
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        status: formData.status,
        probability: formData.probability,
        impact: formData.impact,
        mitigationPlan: formData.mitigationPlan,
      });
      setShowEditModal(false);
      resetForm();
      setSelectedRisk(null);
    } catch (error) {
      alert('Failed to update risk. Please try again.');
    }
  };

  const handleDeleteRisk = async (riskId: Id<'risks'>) => {
    if (confirm('Are you sure you want to delete this risk?')) {
      try {
        await deleteRisk({ riskId });
      } catch (error) {
        alert('Failed to delete risk. Please try again.');
      }
    }
  };

  const handleEditRisk = (riskId: Id<'risks'>) => {
    const risk = risks.find((r: any) => r._id === riskId);
    if (risk) {
      setSelectedRisk(riskId);
      setFormData({
        projectId: risk.projectId,
        title: risk.title,
        description: risk.description,
        severity: risk.severity,
        status: risk.status,
        probability: risk.probability,
        impact: risk.impact,
        mitigationPlan: risk.mitigationPlan || '',
      });
      setShowEditModal(true);
    }
  };

  const handleEscalateRisk = (riskId: Id<'risks'>) => {
    const risk = risks.find((r: any) => r._id === riskId);
    if (risk && (risk.severity === 'high' || risk.severity === 'critical')) {
      alert(`Risk "${risk.title}" has been escalated to portfolio management for review.`);
      // In a real implementation, this would trigger notifications and workflow updates
    } else {
      alert('Only high or critical risks can be escalated.');
    }
  };

  const calculateRiskScore = (probability: number, impact: number): number => {
    return (probability * impact) / 100;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
        return 'bg-blue-500 text-white';
      case 'monitored':
        return 'bg-purple-500 text-white';
      case 'mitigated':
        return 'bg-green-500 text-white';
      case 'resolved':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Filter risks based on selected filters
  const filteredRisks = risks.filter((risk: any) => {
    if (filterSeverity !== 'all' && risk.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && risk.status !== filterStatus) return false;
    if (filterProject !== 'all' && risk.projectId !== filterProject) return false;
    return true;
  });

  if (risksLoading || projectsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span
          className="loading loading-spinner loading-lg"
          role="status"
          aria-label="Loading"
        ></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Risk Management</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          Create New Risk
        </button>
      </div>

      {/* Filters */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="severity-filter" className="label">
              <span className="label-text">Filter by Severity</span>
            </label>
            <select
              id="severity-filter"
              className="select select-bordered w-full"
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label htmlFor="status-filter" className="label">
              <span className="label-text">Filter by Status</span>
            </label>
            <select
              id="status-filter"
              className="select select-bordered w-full"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="identified">Identified</option>
              <option value="monitored">Monitored</option>
              <option value="mitigated">Mitigated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label htmlFor="project-filter" className="label">
              <span className="label-text">Filter by Project</span>
            </label>
            <select
              id="project-filter"
              className="select select-bordered w-full"
              value={filterProject}
              onChange={e => setFilterProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map((project: any) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Risk Statistics */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Risks</div>
          <div className="stat-value">{risks.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">High Priority</div>
          <div className="stat-value text-warning">
            {risks.filter((r: any) => r.severity === 'high' || r.severity === 'critical').length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Active Risks</div>
          <div className="stat-value text-info">
            {risks.filter((r: any) => r.status !== 'resolved').length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">
            {risks.filter((r: any) => r.status === 'resolved').length}
          </div>
        </div>
      </div>

      {/* Risk List */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Probability</th>
              <th>Impact</th>
              <th>Risk Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRisks.map((risk: any) => {
              const project = projects.find((p: any) => p._id === risk.projectId);
              const riskScore = calculateRiskScore(risk.probability, risk.impact);

              return (
                <tr key={risk._id}>
                  <td>
                    <div className="font-bold">{risk.title}</div>
                    <div className="text-sm opacity-70">{risk.description}</div>
                  </td>
                  <td>{project?.name || 'Unknown Project'}</td>
                  <td>
                    <span className={`badge ${getSeverityColor(risk.severity)}`}>
                      {risk.severity.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(risk.status)}`}>
                      {risk.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{risk.probability}%</td>
                  <td>{risk.impact}%</td>
                  <td>
                    <div className="font-bold">{riskScore.toFixed(1)}</div>
                    <progress
                      className="progress progress-primary w-20"
                      value={riskScore}
                      max="100"
                    ></progress>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEditRisk(risk._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEscalateRisk(risk._id)}
                        disabled={risk.severity !== 'high' && risk.severity !== 'critical'}
                      >
                        Escalate
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDeleteRisk(risk._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredRisks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg">No risks found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Create Risk Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Risk</h3>
            <form onSubmit={handleCreateRisk}>
              <div className="form-control">
                <label htmlFor="create-project" className="label">
                  <span className="label-text">Project</span>
                </label>
                <select
                  id="create-project"
                  className="select select-bordered"
                  value={formData.projectId}
                  onChange={e =>
                    setFormData({ ...formData, projectId: e.target.value as Id<'projects'> })
                  }
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project: any) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label htmlFor="create-title" className="label">
                  <span className="label-text">Risk Title</span>
                </label>
                <input
                  id="create-title"
                  type="text"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="create-description" className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  id="create-description"
                  className="textarea textarea-bordered"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Severity</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.severity}
                    onChange={e => setFormData({ ...formData, severity: e.target.value as any })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="identified">Identified</option>
                    <option value="monitored">Monitored</option>
                    <option value="mitigated">Mitigated</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Probability ({formData.probability}%)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={e =>
                      setFormData({ ...formData, probability: parseInt(e.target.value) })
                    }
                    className="range range-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Impact ({formData.impact}%)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.impact}
                    onChange={e => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                    className="range range-secondary"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mitigation Plan</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={formData.mitigationPlan}
                  onChange={e => setFormData({ ...formData, mitigationPlan: e.target.value })}
                  placeholder="Describe the mitigation plan for this risk..."
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Create New Risk
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Risk Modal */}
      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Risk</h3>
            <form onSubmit={handleUpdateRisk}>
              <div className="form-control">
                <label htmlFor="create-project" className="label">
                  <span className="label-text">Project</span>
                </label>
                <select
                  id="create-project"
                  className="select select-bordered"
                  value={formData.projectId}
                  onChange={e =>
                    setFormData({ ...formData, projectId: e.target.value as Id<'projects'> })
                  }
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project: any) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label htmlFor="create-title" className="label">
                  <span className="label-text">Risk Title</span>
                </label>
                <input
                  id="create-title"
                  type="text"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="create-description" className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  id="create-description"
                  className="textarea textarea-bordered"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Severity</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.severity}
                    onChange={e => setFormData({ ...formData, severity: e.target.value as any })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="identified">Identified</option>
                    <option value="monitored">Monitored</option>
                    <option value="mitigated">Mitigated</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Probability ({formData.probability}%)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={e =>
                      setFormData({ ...formData, probability: parseInt(e.target.value) })
                    }
                    className="range range-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Impact ({formData.impact}%)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.impact}
                    onChange={e => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                    className="range range-secondary"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mitigation Plan</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={formData.mitigationPlan}
                  onChange={e => setFormData({ ...formData, mitigationPlan: e.target.value })}
                  placeholder="Describe the mitigation plan for this risk..."
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Update Risk
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                    setSelectedRisk(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskManagement;
