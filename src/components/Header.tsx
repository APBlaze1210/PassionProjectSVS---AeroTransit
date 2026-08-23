import { Plane, Sparkles, LayoutDashboard } from 'lucide-react'

interface HeaderProps {
  onLogoClick: () => void
  onDashboardClick: () => void
  hasTrip: boolean
}

export default function Header({ onLogoClick, onDashboardClick, hasTrip }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-cream-100/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={onLogoClick} className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300">
                <Plane className="w-5 h-5 text-cream-100" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none text-cream-100">Aero Transit</span>
              <span className="text-[10px] text-red-400/80 leading-none mt-0.5">AI Travel Companion</span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {hasTrip && (
              <button onClick={onDashboardClick} className="btn-ghost text-sm">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Trip Dashboard</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-medium text-red-300">Aero AI Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
