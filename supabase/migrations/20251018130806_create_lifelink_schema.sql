/*
  # LifeLink Platform Database Schema

  ## Overview
  Complete database schema for the LifeLink unified student life platform,
  supporting education, health, and financial management modules.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `student_id` (text, unique) - Student identification number
  - `university` (text) - University name
  - `major` (text) - Field of study
  - `graduation_year` (integer) - Expected graduation year
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `study_plans`
  Educational planning and course management
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `course_name` (text) - Course title
  - `course_code` (text) - Course identifier
  - `semester` (text) - Academic semester
  - `credits` (integer) - Credit hours
  - `instructor` (text) - Professor name
  - `schedule` (text) - Class schedule
  - `status` (text) - enrolled, completed, planned
  - `grade` (text) - Final grade
  - `notes` (text) - Study notes
  - `created_at` (timestamptz)

  ### 3. `study_sessions`
  Track study time and productivity
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `course_id` (uuid) - References study_plans
  - `duration_minutes` (integer) - Session length
  - `topic` (text) - What was studied
  - `productivity_rating` (integer) - 1-5 rating
  - `session_date` (date) - When studied
  - `created_at` (timestamptz)

  ### 4. `health_records`
  Health and wellness tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `record_date` (date) - Date of record
  - `weight_kg` (decimal) - Body weight
  - `height_cm` (decimal) - Height
  - `sleep_hours` (decimal) - Hours slept
  - `exercise_minutes` (integer) - Exercise duration
  - `mood_rating` (integer) - 1-5 mood scale
  - `stress_level` (integer) - 1-5 stress scale
  - `water_intake_ml` (integer) - Water consumption
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz)

  ### 5. `health_goals`
  Personal health objectives
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `goal_type` (text) - fitness, sleep, nutrition, mental_health
  - `title` (text) - Goal title
  - `description` (text) - Goal details
  - `target_value` (decimal) - Target metric
  - `current_value` (decimal) - Progress metric
  - `target_date` (date) - Goal deadline
  - `status` (text) - active, completed, abandoned
  - `created_at` (timestamptz)

  ### 6. `financial_accounts`
  Bank accounts and financial tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `account_name` (text) - Account identifier
  - `account_type` (text) - checking, savings, credit, loan
  - `balance` (decimal) - Current balance
  - `currency` (text) - Currency code (USD, EUR, etc)
  - `is_active` (boolean) - Account status
  - `created_at` (timestamptz)

  ### 7. `transactions`
  Financial transactions
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `account_id` (uuid) - References financial_accounts
  - `transaction_date` (date) - Date of transaction
  - `amount` (decimal) - Transaction amount
  - `category` (text) - food, transport, books, housing, etc
  - `description` (text) - Transaction details
  - `transaction_type` (text) - income, expense
  - `created_at` (timestamptz)

  ### 8. `budgets`
  Monthly budget planning
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `category` (text) - Budget category
  - `monthly_limit` (decimal) - Budget limit
  - `month` (text) - Month (YYYY-MM format)
  - `spent_amount` (decimal) - Current spending
  - `created_at` (timestamptz)

  ## Security

  All tables have Row Level Security (RLS) enabled with policies ensuring:
  - Users can only access their own data
  - All operations require authentication
  - Strict ownership checks on all queries

  ## Notes

  1. All monetary values use DECIMAL(10,2) for precision
  2. Timestamps use timestamptz for timezone awareness
  3. Foreign keys ensure referential integrity
  4. Indexes added for frequently queried columns
  5. Default values prevent NULL-related issues
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  student_id text UNIQUE,
  university text,
  major text,
  graduation_year integer,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_name text NOT NULL,
  course_code text,
  semester text,
  credits integer DEFAULT 0,
  instructor text,
  schedule text,
  status text DEFAULT 'planned',
  grade text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES study_plans(id) ON DELETE SET NULL,
  duration_minutes integer NOT NULL,
  topic text NOT NULL,
  productivity_rating integer CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
  session_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  record_date date NOT NULL,
  weight_kg decimal(5,2),
  height_cm decimal(5,2),
  sleep_hours decimal(4,2),
  exercise_minutes integer DEFAULT 0,
  mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 5),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 5),
  water_intake_ml integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create health_goals table
CREATE TABLE IF NOT EXISTS health_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  goal_type text NOT NULL,
  title text NOT NULL,
  description text,
  target_value decimal(10,2),
  current_value decimal(10,2) DEFAULT 0,
  target_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create financial_accounts table
CREATE TABLE IF NOT EXISTS financial_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_name text NOT NULL,
  account_type text NOT NULL,
  balance decimal(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES financial_accounts(id) ON DELETE SET NULL,
  transaction_date date NOT NULL,
  amount decimal(10,2) NOT NULL,
  category text NOT NULL,
  description text,
  transaction_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  monthly_limit decimal(10,2) NOT NULL,
  month text NOT NULL,
  spent_amount decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_goals_user_id ON health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_user_id ON financial_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for study_plans
CREATE POLICY "Users can view own study plans"
  ON study_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study plans"
  ON study_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans"
  ON study_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own study plans"
  ON study_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for study_sessions
CREATE POLICY "Users can view own study sessions"
  ON study_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions"
  ON study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions"
  ON study_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own study sessions"
  ON study_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for health_records
CREATE POLICY "Users can view own health records"
  ON health_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records"
  ON health_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health records"
  ON health_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health records"
  ON health_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for health_goals
CREATE POLICY "Users can view own health goals"
  ON health_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health goals"
  ON health_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health goals"
  ON health_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health goals"
  ON health_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for financial_accounts
CREATE POLICY "Users can view own financial accounts"
  ON financial_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial accounts"
  ON financial_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial accounts"
  ON financial_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial accounts"
  ON financial_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for budgets
CREATE POLICY "Users can view own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON budgets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON budgets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON budgets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);