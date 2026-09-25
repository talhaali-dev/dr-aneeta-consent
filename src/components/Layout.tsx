import { Outlet, Link, useLocation } from 'react-router';

export function Layout() {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isStudy1 = location.pathname.includes('caregiver');
  const isStudy2 = location.pathname.includes('health-literacy');
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                J
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                  JPMC Research
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Department of Oncology
                </span>
              </div>
            </Link>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                isHome
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All Studies
            </Link>
            
            <Link
              to="/study/caregiver-burden"
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg font-medium transition-colors hidden md:inline-flex items-center gap-1.5 ${
                isStudy1
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Study 1: Caregivers
            </Link>

            <Link
              to="/study/health-literacy"
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg font-medium transition-colors hidden md:inline-flex items-center gap-1.5 ${
                isStudy2
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Study 2: Health Literacy
            </Link>

            <Link
              to="/admin"
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                isAdmin
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} Jinnah Postgraduate Medical Centre (JPMC) Karachi. Oncology Department.</p>
          <div className="flex items-center gap-4">
            <span>Research & IRB Approved</span>
            <Link to="/admin" className="hover:text-slate-800">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
