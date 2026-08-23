import { Plane, Sparkles, MapPin, Calendar, Users, DollarSign, ArrowRight, Brain, TrendingDown, Gauge } from 'lucide-react'

interface HeroProps {
  onBuildTrip: () => void
}

export default function Hero({ onBuildTrip }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aero-500/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-400/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-aero-400" />
          <span className="text-sm text-slate-300">Powered by Aero AI</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up">
          Your journey.
          <br />
          <span className="text-gradient">Planned by AI.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Aero Transit is your AI-powered travel companion. Tell us where you want to go, and we'll plan your entire trip — flights, hotels, restaurants, attractions, and day-by-day itineraries tailored to your budget.
        </p>

        <button onClick={onBuildTrip} className="btn-primary text-lg px-8 py-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Plane className="w-5 h-5" />
          Build My Trip
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <FeatureCard icon={Brain} title="Aero AI" description="Answers questions, recommends places, solves travel problems in real time." />
          <FeatureCard icon={TrendingDown} title="Smart Budget" description="Tracks spending and finds cheaper alternatives automatically." />
          <FeatureCard icon={Gauge} title="Trip Score" description="Rates your trip on price, convenience, timing, and experiences." />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-500 text-sm animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-aero-400" /> Flights & Airports</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-aero-400" /> Day-by-Day Plans</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-aero-400" /> Group Travel</span>
          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-aero-400" /> Budget Tracking</span>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: typeof Brain; title: string; description: string }) {
  return (
    <div className="glass-card p-5 text-left hover:border-aero-400/30 transition-all duration-300 hover:scale-[1.02]">
      <div className="w-10 h-10 rounded-xl bg-aero-500/15 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-aero-400" />
      </div>
      <h3 className="font-display font-semibold text-white text-base mb-1">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
