import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import { Id } from '../../../api/convex/_generated/dataModel';

export function useRisks() {
  const risks = useQuery(api.risks.list);
  const createRisk = useMutation(api.risks.create);
  const updateRisk = useMutation(api.risks.update);
  const deleteRisk = useMutation(api.risks.remove);

  return {
    risks: risks || [],
    isLoading: risks === undefined,
    createRisk,
    updateRisk,
    deleteRisk,
  };
}

export function useRisk(id: Id<'risks'> | null) {
  const risk = useQuery(api.risks.get, id ? { riskId: id } : 'skip');
  const updateRisk = useMutation(api.risks.update);
  const deleteRisk = useMutation(api.risks.remove);

  return {
    risk: risk || null,
    isLoading: risk === undefined,
    updateRisk,
    deleteRisk,
  };
}

export function useRisksByProject(projectId: Id<'projects'> | null) {
  const risks = useQuery(api.risks.listByProject, projectId ? { projectId } : 'skip');

  return {
    risks: risks || [],
    isLoading: risks === undefined,
  };
}

export function useRisksBySeverity(severity: 'low' | 'medium' | 'high' | 'critical' | null) {
  const risks = useQuery(api.risks.listBySeverity, severity ? { severity } : 'skip');

  return {
    risks: risks || [],
    isLoading: risks === undefined,
  };
}

export function useRisksByStatus(
  status: 'identified' | 'monitored' | 'mitigated' | 'resolved' | null
) {
  const risks = useQuery(api.risks.listByStatus, status ? { status } : 'skip');

  return {
    risks: risks || [],
    isLoading: risks === undefined,
  };
}

export function useProjectRiskStatistics(projectId: Id<'projects'> | null) {
  const statistics = useQuery(
    api.risks.getProjectRiskStatistics,
    projectId ? { projectId } : 'skip'
  );

  return {
    statistics: statistics || null,
    isLoading: statistics === undefined,
  };
}

export function useHighPriorityRisks() {
  const risks = useQuery(api.risks.getHighPriorityRisks);

  return {
    risks: risks || [],
    isLoading: risks === undefined,
  };
}
