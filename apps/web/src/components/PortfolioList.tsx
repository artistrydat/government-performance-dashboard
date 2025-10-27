import React, { useState } from 'react';
import { usePortfolios } from '../hooks/usePortfolios';
import { useAuth } from '../lib/auth';
import { Id } from '../../../api/convex/_generated/dataModel';

interface PortfolioFormData {
  name: string;
  description: string;
  healthScore: number;
}

const PortfolioList: React.FC = () => {
  const { user } = useAuth();
  const { portfolios, isLoading, createPortfolio, updatePortfolio, deletePortfolio } =
    usePortfolios();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Id<'portfolios'> | null>(null);
  const [formData, setFormData] = useState<PortfolioFormData>({
    name: '',
    description: '',
    healthScore: 75, // Default health score
  });

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPortfolio({
        ...formData,
        ownerId: user?.id as Id<'users'>,
      });
      setFormData({ name: '', description: '', healthScore: 75 });
      setShowCreateForm(false);
    } catch (error) {
      alert('Failed to create portfolio. Please try again.');
    }
  };

  const handleUpdatePortfolio = async (portfolioId: Id<'portfolios'>) => {
    try {
      await updatePortfolio({
        portfolioId,
        ...formData,
        ownerId: user?.id as Id<'users'>,
      });
      setEditingPortfolio(null);
      setFormData({ name: '', description: '', healthScore: 75 });
    } catch (error) {
      alert('Failed to update portfolio. Please try again.');
    }
  };

  const handleDeletePortfolio = async (portfolioId: Id<'portfolios'>) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        await deletePortfolio({ portfolioId });
      } catch (error) {
        alert('Failed to delete portfolio. Please make sure it has no projects assigned.');
      }
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getHealthScoreBadge = (score: number) => {
    if (score >= 80) return 'badge-success';
    if (score >= 60) return 'badge-warning';
    return 'badge-error';
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'At Risk';
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-32">
          <div
            className="loading loading-spinner loading-lg text-primary"
            role="status"
            aria-label="Loading portfolios"
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-base-content/70 mt-2">Manage and monitor project portfolios</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
          Create Portfolio
        </button>
      </div>

      {/* Create Portfolio Form */}
      {showCreateForm && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Create New Portfolio</h2>
            <form onSubmit={handleCreatePortfolio}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label htmlFor="portfolio-name" className="label">
                    <span className="label-text">Portfolio Name</span>
                  </label>
                  <input
                    id="portfolio-name"
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="health-score" className="label">
                    <span className="label-text">Initial Health Score</span>
                  </label>
                  <input
                    id="health-score"
                    type="number"
                    min="0"
                    max="100"
                    className="input input-bordered"
                    value={formData.healthScore}
                    onChange={e =>
                      setFormData({ ...formData, healthScore: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label htmlFor="portfolio-description" className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    id="portfolio-description"
                    className="textarea textarea-bordered h-24"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portfolios List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map(portfolio => (
          <div key={portfolio._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {editingPortfolio === portfolio._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <textarea
                    className="textarea textarea-bordered textarea-sm w-full h-20"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdatePortfolio(portfolio._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditingPortfolio(null);
                        setFormData({ name: '', description: '', healthScore: 75 });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <h2 className="card-title">{portfolio.name}</h2>
                    <div className={`badge ${getHealthScoreBadge(portfolio.healthScore)} gap-1`}>
                      {portfolio.healthScore}%
                    </div>
                  </div>
                  <p className="text-sm text-base-content/70">{portfolio.description}</p>
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className={getHealthScoreColor(portfolio.healthScore)}>
                        {getHealthScoreText(portfolio.healthScore)}
                      </span>
                      <span className="text-base-content/70">
                        Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setEditingPortfolio(portfolio._id);
                        setFormData({
                          name: portfolio.name,
                          description: portfolio.description,
                          healthScore: portfolio.healthScore,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeletePortfolio(portfolio._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {portfolios.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <div className="text-base-content/50 text-lg">
            No portfolios found. Create your first portfolio to get started.
          </div>
          <button className="btn btn-primary mt-4" onClick={() => setShowCreateForm(true)}>
            Create First Portfolio
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioList;
