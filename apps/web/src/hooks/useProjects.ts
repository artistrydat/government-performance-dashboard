import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import { Id } from '../../../api/convex/_generated/dataModel';

export function useProjects() {
  const projects = useQuery(api.projects.list);
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const updatePortfolioAssignment = useMutation(api.projects.updatePortfolioAssignment);
  const deleteProject = useMutation(api.projects.remove);

  return {
    projects: projects || [],
    isLoading: projects === undefined,
    createProject,
    updateProject,
    updatePortfolioAssignment,
    deleteProject,
  };
}

export function useProject(id: Id<'projects'> | null) {
  const project = useQuery(api.projects.get, id ? { projectId: id } : 'skip');
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);

  return {
    project: project || null,
    isLoading: project === undefined,
    updateProject,
    deleteProject,
  };
}

export function useProjectStatistics() {
  const statistics = useQuery(api.projects.getStatistics);

  return {
    statistics: statistics || null,
    isLoading: statistics === undefined,
  };
}
