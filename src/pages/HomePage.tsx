import { GraduationCap, Heart, Wallet, Target, Users, Shield, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export const HomePage = () => {
  const { navigateTo } = useNavigate();

  const features = [
    {
      icon: GraduationCap,
      title: 'Smart Education Hub',
      description: 'Personalized study planning, course management, and productivity tracking to excel academically.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Track your physical and mental health, set fitness goals, and maintain a balanced lifestyle.',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Wallet,
      title: 'Financial Management',
      description: 'Manage budgets, track expenses, and build healthy financial habits for student life.',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const benefits = [
    'Unified platform for all student essentials',
    'Secure and private data management',
    'Real-time progress tracking',
    'Intelligent insights and analytics',
    'Mobile-responsive design',
    'Free for all students',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                LifeLink
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigateTo('login')}
                className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo('signup')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Trusted by students worldwide</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight">
              Your Complete Student Life Platform
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              LifeLink unifies education, health, and finance management in one seamless platform.
              Take control of your student life and achieve your goals with intelligent insights and tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigateTo('signup')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateTo('login')}
                className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-transparent overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Everything You Need in One Place
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Stop juggling multiple apps and platforms. LifeLink brings together all essential
                student tools with powerful features designed for your success.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <GraduationCap className="w-10 h-10 text-blue-400 mb-3" />
                  <h4 className="font-semibold mb-2">Study Tracker</h4>
                  <p className="text-sm text-slate-300">Monitor progress and productivity</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors mt-8">
                  <Heart className="w-10 h-10 text-rose-400 mb-3" />
                  <h4 className="font-semibold mb-2">Wellness Goals</h4>
                  <p className="text-sm text-slate-300">Track health and fitness metrics</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors -mt-4">
                  <Wallet className="w-10 h-10 text-emerald-400 mb-3" />
                  <h4 className="font-semibold mb-2">Budget Planner</h4>
                  <p className="text-sm text-slate-300">Manage finances effectively</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors mt-4">
                  <Users className="w-10 h-10 text-cyan-400 mb-3" />
                  <h4 className="font-semibold mb-2">Collaboration</h4>
                  <p className="text-sm text-slate-300">Connect with peers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900">
            Ready to Transform Your Student Life?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of students who are already succeeding with LifeLink.
            Get started today and experience the difference.
          </p>
          <button
            onClick={() => navigateTo('signup')}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-3"
          >
            Create Your Free Account
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">LifeLink</span>
            </div>
            <p className="text-center md:text-right">
              © 2025 LifeLink. Empowering students to achieve their full potential.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
