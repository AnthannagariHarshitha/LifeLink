import { useEffect, useState } from 'react';
import { GraduationCap, Heart, Wallet, TrendingUp, Calendar, Target } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase } from '../lib/supabase';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { navigateTo } = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    courses: 0,
    studyHours: 0,
    healthGoals: 0,
    monthlyBudget: 0,
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .maybeSingle();
    setProfile(data);
  };

  const loadStats = async () => {
    const [courses, sessions, goals, budgets] = await Promise.all([
      supabase.from('study_plans').select('*', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('study_sessions').select('duration_minutes').eq('user_id', user?.id),
      supabase.from('health_goals').select('*', { count: 'exact' }).eq('user_id', user?.id).eq('status', 'active'),
      supabase.from('budgets').select('monthly_limit').eq('user_id', user?.id),
    ]);

    const totalStudyHours = sessions.data?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
    const totalBudget = budgets.data?.reduce((sum, b) => sum + Number(b.monthly_limit), 0) || 0;

    setStats({
      courses: courses.count || 0,
      studyHours: Math.round(totalStudyHours / 60),
      healthGoals: goals.count || 0,
      monthlyBudget: totalBudget,
    });
  };

  const modules = [
    {
      name: 'Education',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      stat: `${stats.courses} Courses`,
      description: 'Manage your study plans and track academic progress',
      page: 'education' as const,
    },
    {
      name: 'Health & Wellness',
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'from-rose-50 to-pink-50',
      stat: `${stats.healthGoals} Active Goals`,
      description: 'Track your physical and mental wellbeing',
      page: 'health' as const,
    },
    {
      name: 'Finance',
      icon: Wallet,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      stat: `$${stats.monthlyBudget.toFixed(0)} Budget`,
      description: 'Manage your expenses and financial goals',
      page: 'finance' as const,
    },
  ];

  return (
    <DashboardLayout currentModule="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {profile?.full_name || 'Student'}!
          </h1>
          <p className="text-lg text-slate-600">
            Here's your overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stats.courses}</p>
            <p className="text-sm text-slate-600">Active Courses</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stats.studyHours}h</p>
            <p className="text-sm text-slate-600">Study Time</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stats.healthGoals}</p>
            <p className="text-sm text-slate-600">Health Goals</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">${stats.monthlyBudget.toFixed(0)}</p>
            <p className="text-sm text-slate-600">Monthly Budget</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.name}
                onClick={() => navigateTo(module.page)}
                className="group text-left bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-transparent overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${module.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{module.name}</h3>
                  <p className="text-lg font-semibold text-slate-700 mb-2">{module.stat}</p>
                  <p className="text-slate-600">{module.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Quick Tip</h2>
          <p className="text-blue-50 text-lg">
            Set specific goals for each area of your life. Regular tracking helps you stay on top of your academics, health, and finances!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};
