import { useAuth, UserRole } from '../lib/auth';
import { useProjectStatistics } from '../hooks/useProjects';
import { useHighPriorityRisks } from '../hooks/useRisks';
import { useUserStatistics } from '../hooks/useUsers';

function Dashboard() {
  const { user, logout } = useAuth();
  const { statistics: projectStats, isLoading: projectsLoading } = useProjectStatistics();
  const { risks: highPriorityRisks, isLoading: risksLoading } = useHighPriorityRisks();
  const { statistics: userStats, isLoading: usersLoading } = useUserStatistics();

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'executive':
        return 'Executive Director';
      case 'portfolio_manager':
        return 'Portfolio Manager';
      case 'project_officer':
        return 'Project Officer';
      default:
        return role;
    }
  };

  const getDashboardContent = (role: UserRole) => {
    switch (role) {
      case 'executive':
        return {
          title: 'Executive Overview',
          description: 'High-level performance metrics and strategic insights',
          features: [
            'Portfolio health overview',
            'Strategic risk assessment',
            'Budget performance tracking',
            'Executive reporting',
          ],
        };
      case 'portfolio_manager':
        return {
          title: 'Portfolio Management',
          description: 'Manage and monitor project portfolios',
          features: [
            'Portfolio performance dashboard',
            'Resource allocation tracking',
            'Risk management overview',
            'Cross-project dependencies',
          ],
        };
      case 'project_officer':
        return {
          title: 'Project Operations',
          description: 'Daily project management and monitoring',
          features: [
            'Project status tracking',
            'Risk identification and mitigation',
            'Task management',
            'Compliance monitoring',
          ],
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to the Government Performance Dashboard',
          features: [],
        };
    }
  };

  const content = getDashboardContent(user!.role);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Government Performance Dashboard</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <div className="flex items-center gap-2">
                <span className="text-xl">{user?.avatar}</span>
                <div className="text-left">
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-xs opacity-70">{getRoleDisplayName(user!.role)}</div>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="hero bg-base-100 rounded-lg shadow-xl mb-8">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
              <p className="text-lg mb-6">{content.description}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {content.features.map((feature, index) => (
                  <span key={index} className="badge badge-primary badge-lg">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Projects</h2>
              <p>Monitor and manage government projects</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Projects</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Risk Assessment</h2>
              <p>AI-powered risk prediction and analysis</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Risks</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Compliance Tracking</h2>
              <p>PMI standards compliance monitoring</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Compliance</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Reports</h2>
              <p>Generate performance and compliance reports</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Reports</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Analytics</h2>
              <p>Advanced analytics and insights</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Analytics</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Settings</h2>
              <p>Configure system preferences</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Settings</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Projects</div>
              <div className="stat-value">
                {projectsLoading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  projectStats?.totalProjects || 0
                )}
              </div>
              <div className="stat-desc">{projectStats?.statusCounts?.active || 0} active</div>
            </div>
            <div className="stat">
              <div className="stat-title">Portfolio Health</div>
              <div className="stat-value">
                {projectsLoading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  `${Math.round(projectStats?.averageHealthScore || 0)}%`
                )}
              </div>
              <div className="stat-desc">
                {projectStats?.statusCounts?.completed || 0} completed
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">High Risks</div>
              <div className="stat-value">
                {risksLoading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  highPriorityRisks?.length || 0
                )}
              </div>
              <div className="stat-desc">
                {projectStats?.riskLevelCounts?.critical || 0} critical
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Users</div>
              <div className="stat-value">
                {usersLoading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  userStats?.totalUsers || 0
                )}
              </div>
              <div className="stat-desc">{userStats?.roleCounts?.executive || 0} executives</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
