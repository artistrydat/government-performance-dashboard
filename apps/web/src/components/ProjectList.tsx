import React, { useState } from 'react';
import { useProjects, useProject } from '../hooks/useProjects';
import { usePortfolios } from '../hooks/usePortfolios';
import { useUsers } from '../hooks/useUsers';
import { Id } from '../../../api/convex/_generated/dataModel';

interface ProjectFormData {
  name: string;
  description: string;
  status: 'planned' | 'active' | 'at-risk' | 'delayed' | 'completed';
  budget: number;
  timeline: {
    startDate: number;
    endDate: number;
    milestones: Array<{
      name: string;
      date: number;
      status: string;
    }>;
  };
  portfolioId?: Id<'portfolios'>;
  ownerId?: Id<'users'>;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

const ProjectList: React.FC = () => {
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { portfolios } = usePortfolios();
  const { users } = useUsers();
  const [selectedProject, setSelectedProject] = useState<Id<'projects'> | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'planned',
    budget: 0,
    timeline: {
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      milestones: [],
    },
    portfolioId: undefined,
    ownerId: undefined,
    healthScore: 100,
    riskLevel: 'low',
    tags: [],
  });
  const [newMilestone, setNewMilestone] = useState({ name: '', date: Date.now() });
  const [newTag, setNewTag] = useState('');

  const { project: selectedProjectData } = useProject(selectedProject);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        status: 'planned',
        budget: 0,
        timeline: {
          startDate: Date.now(),
          endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
          milestones: [],
        },
        portfolioId: undefined,
        ownerId: undefined,
        healthScore: 100,
        riskLevel: 'low',
        tags: [],
      });
    } catch (error) {
      // Error handling for create project
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await updateProject({ projectId: selectedProject, ...formData });
      setShowEditForm(false);
      setSelectedProject(null);
    } catch (error) {
      // Error handling for update project
    }
  };

  const handleDeleteProject = async (projectId: Id<'projects'>) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject({ projectId });
      } catch (error) {
        // Error handling for delete project
      }
    }
  };

  const handleEditProject = (projectId: Id<'projects'>) => {
    const project = projects.find(p => p._id === projectId);
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        budget: project.budget,
        timeline: project.timeline,
        portfolioId: project.portfolioId,
        ownerId: project.ownerId,
        healthScore: project.healthScore,
        riskLevel: project.riskLevel,
        tags: project.tags,
      });
      setSelectedProject(projectId);
      setShowEditForm(true);
    }
  };

  const addMilestone = () => {
    if (newMilestone.name.trim()) {
      setFormData(prev => ({
        ...prev,
        timeline: {
          ...prev.timeline,
          milestones: [...prev.timeline.milestones, { ...newMilestone, status: 'pending' }],
        },
      }));
      setNewMilestone({ name: '', date: Date.now() });
    }
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: prev.timeline.milestones.filter((_, i) => i !== index),
      },
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'badge-info';
      case 'active':
        return 'badge-success';
      case 'at-risk':
        return 'badge-warning';
      case 'delayed':
        return 'badge-error';
      case 'completed':
        return 'badge-neutral';
      default:
        return 'badge-ghost';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'badge-success';
      case 'medium':
        return 'badge-warning';
      case 'high':
        return 'badge-warning badge-warning';
      case 'critical':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-32">
          <div className="loading loading-spinner loading-lg text-primary" role="status">
            <span className="sr-only">Loading projects...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-base-content/70 mt-2">Manage individual projects and track progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
          Create New Project
        </button>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-2">
                <h2 className="card-title text-lg">{project.name}</h2>
                <div className="flex gap-1">
                  <span className={`badge ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`badge ${getRiskColor(project.riskLevel)}`}>
                    {project.riskLevel}
                  </span>
                </div>
              </div>

              <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Health Score:</span>
                  <span className={`font-semibold ${getHealthColor(project.healthScore)}`}>
                    {project.healthScore}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Budget:</span>
                  <span className="font-semibold">${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Timeline:</span>
                  <span className="font-semibold">
                    {new Date(project.timeline.startDate).toLocaleDateString()} -{' '}
                    {new Date(project.timeline.endDate).toLocaleDateString()}
                  </span>
                </div>
                {project.portfolioId && (
                  <div className="flex justify-between text-sm">
                    <span>Portfolio:</span>
                    <span className="font-semibold">
                      {portfolios.find(p => p._id === project.portfolioId)?.name || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="badge badge-outline badge-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="card-actions justify-between">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setSelectedProject(project._id)}
                >
                  View Details
                </button>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditProject(project._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-base-content/50 text-lg">No projects found</div>
          <p className="text-base-content/30 mt-2">Create your first project to get started</p>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label htmlFor="project-name" className="label">
                    <span className="label-text">Project Name</span>
                  </label>
                  <input
                    id="project-name"
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="project-status" className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    id="project-status"
                    className="select select-bordered"
                    value={formData.status}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, status: e.target.value as any }))
                    }
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="at-risk">At Risk</option>
                    <option value="delayed">Delayed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-control md:col-span-2">
                  <label htmlFor="project-description" className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    id="project-description"
                    className="textarea textarea-bordered h-24"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="project-budget" className="label">
                    <span className="label-text">Budget ($)</span>
                  </label>
                  <input
                    id="project-budget"
                    type="number"
                    className="input input-bordered"
                    value={formData.budget}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))
                    }
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="project-health-score" className="label">
                    <span className="label-text">Health Score (%)</span>
                  </label>
                  <input
                    id="project-health-score"
                    type="number"
                    className="input input-bordered"
                    value={formData.healthScore}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, healthScore: Number(e.target.value) }))
                    }
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Risk Level</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.riskLevel}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, riskLevel: e.target.value as any }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Portfolio</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.portfolioId || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        portfolioId: (e.target.value as Id<'portfolios'>) || undefined,
                      }))
                    }
                  >
                    <option value="">No Portfolio</option>
                    {portfolios.map(portfolio => (
                      <option key={portfolio._id} value={portfolio._id}>
                        {portfolio.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Owner</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.ownerId || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        ownerId: (e.target.value as Id<'users'>) || undefined,
                      }))
                    }
                  >
                    <option value="">No Owner</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Timeline</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      className="input input-bordered"
                      value={new Date(formData.timeline.startDate).toISOString().split('T')[0]}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          timeline: {
                            ...prev.timeline,
                            startDate: new Date(e.target.value).getTime(),
                          },
                        }))
                      }
                      required
                    />
                    <input
                      type="date"
                      className="input input-bordered"
                      value={new Date(formData.timeline.endDate).toISOString().split('T')[0]}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          timeline: {
                            ...prev.timeline,
                            endDate: new Date(e.target.value).getTime(),
                          },
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Milestones</span>
                  </label>
                  <div className="space-y-2">
                    {formData.timeline.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1"
                          value={milestone.name}
                          readOnly
                        />
                        <span className="text-sm text-base-content/70">
                          {new Date(milestone.date).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-error"
                          onClick={() => removeMilestone(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        placeholder="Milestone name"
                        value={newMilestone.name}
                        onChange={e => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <input
                        type="date"
                        className="input input-bordered"
                        value={new Date(newMilestone.date).toISOString().split('T')[0]}
                        onChange={e =>
                          setNewMilestone(prev => ({
                            ...prev,
                            date: new Date(e.target.value).getTime(),
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={addMilestone}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Tags</span>
                  </label>
                  <div className="space-y-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1"
                          value={tag}
                          readOnly
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-error"
                          onClick={() => removeTag(tag)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        placeholder="Add tag"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                      />
                      <button type="button" className="btn btn-sm btn-primary" onClick={addTag}>
                        Add Tag
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditForm && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Edit Project</h3>
            <form onSubmit={handleUpdateProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Project Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.status}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, status: e.target.value as any }))
                    }
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="at-risk">At Risk</option>
                    <option value="delayed">Delayed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="project-budget" className="label">
                    <span className="label-text">Budget ($)</span>
                  </label>
                  <input
                    id="project-budget"
                    type="number"
                    className="input input-bordered"
                    value={formData.budget}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))
                    }
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="project-health-score" className="label">
                    <span className="label-text">Health Score (%)</span>
                  </label>
                  <input
                    id="project-health-score"
                    type="number"
                    className="input input-bordered"
                    value={formData.healthScore}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, healthScore: Number(e.target.value) }))
                    }
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="project-risk-level" className="label">
                    <span className="label-text">Risk Level</span>
                  </label>
                  <select
                    id="project-risk-level"
                    className="select select-bordered"
                    value={formData.riskLevel}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, riskLevel: e.target.value as any }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-control">
                  <label htmlFor="project-portfolio" className="label">
                    <span className="label-text">Portfolio</span>
                  </label>
                  <select
                    id="project-portfolio"
                    className="select select-bordered"
                    value={formData.portfolioId || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        portfolioId: (e.target.value as Id<'portfolios'>) || undefined,
                      }))
                    }
                  >
                    <option value="">No Portfolio</option>
                    {portfolios.map(portfolio => (
                      <option key={portfolio._id} value={portfolio._id}>
                        {portfolio.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label htmlFor="project-owner" className="label">
                    <span className="label-text">Owner</span>
                  </label>
                  <select
                    id="project-owner"
                    className="select select-bordered"
                    value={formData.ownerId || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        ownerId: (e.target.value as Id<'users'>) || undefined,
                      }))
                    }
                  >
                    <option value="">No Owner</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Timeline</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      id="project-start-date"
                      type="date"
                      className="input input-bordered"
                      value={new Date(formData.timeline.startDate).toISOString().split('T')[0]}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          timeline: {
                            ...prev.timeline,
                            startDate: new Date(e.target.value).getTime(),
                          },
                        }))
                      }
                      required
                    />
                    <input
                      id="project-end-date"
                      type="date"
                      className="input input-bordered"
                      value={new Date(formData.timeline.endDate).toISOString().split('T')[0]}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          timeline: {
                            ...prev.timeline,
                            endDate: new Date(e.target.value).getTime(),
                          },
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Milestones</span>
                  </label>
                  <div className="space-y-2">
                    {formData.timeline.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1">{milestone.name}</span>
                        <span className="text-sm text-base-content/70">
                          {new Date(milestone.date).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-error"
                          onClick={() => removeMilestone(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        placeholder="Milestone name"
                        value={newMilestone.name}
                        onChange={e => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <input
                        type="date"
                        className="input input-bordered"
                        value={new Date(newMilestone.date).toISOString().split('T')[0]}
                        onChange={e =>
                          setNewMilestone(prev => ({
                            ...prev,
                            date: new Date(e.target.value).getTime(),
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={addMilestone}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Tags</span>
                  </label>
                  <div className="space-y-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1"
                          value={tag}
                          readOnly
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-error"
                          onClick={() => removeTag(tag)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        placeholder="Add tag"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                      />
                      <button type="button" className="btn btn-sm btn-primary" onClick={addTag}>
                        Add Tag
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Update Project
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedProject(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProjectData && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Project Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg">{selectedProjectData.name}</h4>
                  <p className="text-base-content/70">{selectedProjectData.description}</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <span className={`badge ${getStatusColor(selectedProjectData.status)}`}>
                    {selectedProjectData.status}
                  </span>
                  <span className={`badge ${getRiskColor(selectedProjectData.riskLevel)}`}>
                    {selectedProjectData.riskLevel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span className="font-semibold">
                      ${selectedProjectData.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Score:</span>
                    <span
                      className={`font-semibold ${getHealthColor(selectedProjectData.healthScore)}`}
                    >
                      {selectedProjectData.healthScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeline:</span>
                    <span className="font-semibold">
                      {new Date(selectedProjectData.timeline.startDate).toLocaleDateString()} -{' '}
                      {new Date(selectedProjectData.timeline.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedProjectData.portfolioId && (
                    <div className="flex justify-between">
                      <span>Portfolio:</span>
                      <span className="font-semibold">
                        {portfolios.find(p => p._id === selectedProjectData.portfolioId)?.name ||
                          'Unknown'}
                      </span>
                    </div>
                  )}
                  {selectedProjectData.ownerId && (
                    <div className="flex justify-between">
                      <span>Owner:</span>
                      <span className="font-semibold">
                        {users.find(u => u._id === selectedProjectData.ownerId)?.name || 'Unknown'}
                      </span>
                    </div>
                  )}
                </div>

                {selectedProjectData.timeline.milestones.length > 0 && (
                  <div>
                    <h5 className="font-semibold mb-2">Milestones</h5>
                    <div className="space-y-2">
                      {selectedProjectData.timeline.milestones.map((milestone, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{milestone.name}</span>
                          <span className="text-sm text-base-content/70">
                            {new Date(milestone.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedProjectData.tags.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProjectData.tags.map(tag => (
                      <span key={tag} className="badge badge-outline">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => handleEditProject(selectedProjectData._id)}
              >
                Edit Project
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
