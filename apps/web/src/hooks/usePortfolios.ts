import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import { Id } from '../../../api/convex/_generated/dataModel';

export function usePortfolios() {
  const portfolios = useQuery(api.portfolios.list);
  const createPortfolio = useMutation(api.portfolios.create);
  const updatePortfolio = useMutation(api.portfolios.update);
  const deletePortfolio = useMutation(api.portfolios.remove);

  return {
    portfolios: portfolios || [],
    isLoading: portfolios === undefined,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
}

export function usePortfolio(id: Id<'portfolios'> | null) {
  const portfolio = useQuery(api.portfolios.get, id ? { portfolioId: id } : 'skip');
  const updatePortfolio = useMutation(api.portfolios.update);
  const deletePortfolio = useMutation(api.portfolios.remove);

  return {
    portfolio: portfolio || null,
    isLoading: portfolio === undefined,
    updatePortfolio,
    deletePortfolio,
  };
}

export function usePortfolioStatistics(portfolioId: Id<'portfolios'> | null) {
  const statistics = useQuery(api.portfolios.getStatistics, portfolioId ? { portfolioId } : 'skip');

  return {
    statistics: statistics || null,
    isLoading: statistics === undefined,
  };
}
