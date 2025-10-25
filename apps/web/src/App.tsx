function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Government Performance Dashboard</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-primary">Login</button>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="hero bg-base-100 rounded-lg shadow-xl">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Welcome</h1>
              <p className="py-6">
                AI-powered dashboard for government project performance monitoring
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Project Management</h2>
              <p>Monitor and manage government projects</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Risk Assessment</h2>
              <p>AI-powered risk prediction and analysis</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Compliance Tracking</h2>
              <p>PMI standards compliance monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
