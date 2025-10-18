import { useEffect, useState } from 'react';
import { Plus, Heart, Target, TrendingUp, Activity, Moon, Droplets, Smile, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface HealthGoal {
  id: string;
  title: string;
  goal_type: string;
  description: string;
  target_value: number;
  current_value: number;
  status: string;
}

interface HealthRecord {
  id: string;
  record_date: string;
  sleep_hours: number;
  exercise_minutes: number;
  water_intake_ml: number;
  mood_rating: number;
  stress_level: number;
}

export const HealthPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [recentRecord, setRecentRecord] = useState<HealthRecord | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    goal_type: 'fitness',
    description: '',
    target_value: 0,
  });
  const [recordForm, setRecordForm] = useState({
    sleep_hours: 8,
    exercise_minutes: 30,
    water_intake_ml: 2000,
    mood_rating: 3,
    stress_level: 3,
  });

  useEffect(() => {
    loadGoals();
    loadRecentRecord();
  }, [user]);

  const loadGoals = async () => {
    const { data } = await supabase
      .from('health_goals')
      .select('*')
      .eq('user_id', user?.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setGoals(data || []);
  };

  const loadRecentRecord = async () => {
    const { data } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', user?.id)
      .order('record_date', { ascending: false })
      .limit(1)
      .maybeSingle();
    setRecentRecord(data);
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('health_goals').insert({
      ...goalForm,
      user_id: user?.id,
      current_value: 0,
      status: 'active',
    });

    if (!error) {
      setShowAddGoal(false);
      setGoalForm({ title: '', goal_type: 'fitness', description: '', target_value: 0 });
      loadGoals();
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('health_records').insert({
      ...recordForm,
      user_id: user?.id,
      record_date: new Date().toISOString().split('T')[0],
    });

    if (!error) {
      setShowAddRecord(false);
      loadRecentRecord();
    }
  };

  const deleteGoal = async (id: string) => {
    await supabase.from('health_goals').delete().eq('id', id);
    loadGoals();
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'fitness':
        return Activity;
      case 'sleep':
        return Moon;
      case 'nutrition':
        return Droplets;
      case 'mental_health':
        return Smile;
      default:
        return Target;
    }
  };

  const getGoalColor = (type: string) => {
    switch (type) {
      case 'fitness':
        return 'from-orange-500 to-red-500';
      case 'sleep':
        return 'from-violet-500 to-purple-500';
      case 'nutrition':
        return 'from-emerald-500 to-teal-500';
      case 'mental_health':
        return 'from-pink-500 to-rose-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <DashboardLayout currentModule="health">
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Health & Wellness</h1>
            <p className="text-lg text-slate-600">Track your wellbeing and achieve your health goals</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddRecord(!showAddRecord)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Log Today
            </button>
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Goal
            </button>
          </div>
        </div>

        {recentRecord && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Today's Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Moon className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{recentRecord.sleep_hours}h</p>
                <p className="text-sm text-slate-600">Sleep</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{recentRecord.exercise_minutes}min</p>
                <p className="text-sm text-slate-600">Exercise</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{recentRecord.water_intake_ml}ml</p>
                <p className="text-sm text-slate-600">Water</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Smile className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{recentRecord.mood_rating}/5</p>
                <p className="text-sm text-slate-600">Mood</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{recentRecord.stress_level}/5</p>
                <p className="text-sm text-slate-600">Stress</p>
              </div>
            </div>
          </div>
        )}

        {showAddRecord && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Log Health Data</h3>
            <form onSubmit={handleAddRecord} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sleep Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={recordForm.sleep_hours}
                    onChange={(e) => setRecordForm({ ...recordForm, sleep_hours: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Exercise Minutes
                  </label>
                  <input
                    type="number"
                    value={recordForm.exercise_minutes}
                    onChange={(e) => setRecordForm({ ...recordForm, exercise_minutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Water Intake (ml)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={recordForm.water_intake_ml}
                    onChange={(e) => setRecordForm({ ...recordForm, water_intake_ml: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mood Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={recordForm.mood_rating}
                    onChange={(e) => setRecordForm({ ...recordForm, mood_rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stress Level (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={recordForm.stress_level}
                    onChange={(e) => setRecordForm({ ...recordForm, stress_level: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Save Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRecord(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showAddGoal && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Health Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="Exercise 5 days a week"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Goal Type
                  </label>
                  <select
                    value={goalForm.goal_type}
                    onChange={(e) => setGoalForm({ ...goalForm, goal_type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  >
                    <option value="fitness">Fitness</option>
                    <option value="sleep">Sleep</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="mental_health">Mental Health</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={goalForm.description}
                    onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    rows={3}
                    placeholder="Describe your goal..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={goalForm.target_value}
                    onChange={(e) => setGoalForm({ ...goalForm, target_value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Add Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Goals</h2>
          {goals.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
              <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No health goals yet</h3>
              <p className="text-slate-600 mb-6">Set your first health goal to start tracking your wellness journey</p>
              <button
                onClick={() => setShowAddGoal(true)}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const Icon = getGoalIcon(goal.goal_type);
                const progress = (goal.current_value / goal.target_value) * 100;
                return (
                  <div
                    key={goal.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getGoalColor(goal.goal_type)} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{goal.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{goal.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-semibold text-slate-900">
                          {goal.current_value} / {goal.target_value}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${getGoalColor(goal.goal_type)}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
