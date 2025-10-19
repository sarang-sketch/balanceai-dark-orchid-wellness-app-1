import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Quiz responses table
export const quizResponses = sqliteTable('quiz_responses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  questionId: text('question_id').notNull(),
  answerIndex: integer('answer_index').notNull(),
  category: text('category').notNull(),
  createdAt: text('created_at').notNull(),
});

// Quiz results table
export const quizResults = sqliteTable('quiz_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  balanceScore: integer('balance_score').notNull(),
  moodResult: text('mood_result').notNull(),
  cognitiveScore: integer('cognitive_score').notNull(),
  physicalScore: integer('physical_score').notNull(),
  digitalScore: integer('digital_score').notNull(),
  createdAt: text('created_at').notNull(),
});

// Wellness goals table
export const wellnessGoals = sqliteTable('wellness_goals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  goalId: text('goal_id').notNull(),
  goalTitle: text('goal_title').notNull(),
  selectedAt: text('selected_at').notNull(),
});

// Wellness plans table
export const wellnessPlans = sqliteTable('wellness_plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  planData: text('plan_data', { mode: 'json' }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// User metrics table
export const userMetrics = sqliteTable('user_metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  metricType: text('metric_type').notNull(),
  value: text('value').notNull(),
  date: text('date').notNull(),
  createdAt: text('created_at').notNull(),
});

// Badges table
export const badges = sqliteTable('badges', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  badgeId: text('badge_id').notNull(),
  badgeName: text('badge_name').notNull(),
  earnedAt: text('earned_at').notNull(),
});

// User streaks table
export const userStreaks = sqliteTable('user_streaks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActivityDate: text('last_activity_date'),
  updatedAt: text('updated_at').notNull(),
});

// Daily tasks table
export const dailyTasks = sqliteTable('daily_tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  taskName: text('task_name').notNull(),
  taskTime: text('task_time').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  completionDate: text('completion_date'),
});

// Family members table
export const familyMembers = sqliteTable('family_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  familyGroupId: text('family_group_id').notNull(),
  userId: integer('user_id').notNull().references(() => users.id),
  joinedAt: text('joined_at').notNull(),
});

// Community posts table
export const communityPosts = sqliteTable('community_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  authorId: integer('author_id').references(() => users.id),
  authorName: text('author_name').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  isAnonymous: integer('is_anonymous', { mode: 'boolean' }).notNull().default(false),
  likesCount: integer('likes_count').notNull().default(0),
  commentsCount: integer('comments_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Post likes table
export const postLikes = sqliteTable('post_likes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').notNull().references(() => communityPosts.id),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
});

// Post comments table
export const postComments = sqliteTable('post_comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').notNull().references(() => communityPosts.id),
  userId: integer('user_id').notNull().references(() => users.id),
  commentText: text('comment_text').notNull(),
  createdAt: text('created_at').notNull(),
});

// User settings table
export const userSettings = sqliteTable('user_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  theme: text('theme').notNull().default('light'),
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' }).notNull().default(true),
  smsEnabled: integer('sms_enabled', { mode: 'boolean' }).notNull().default(false),
  emailEnabled: integer('email_enabled', { mode: 'boolean' }).notNull().default(true),
  updatedAt: text('updated_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});