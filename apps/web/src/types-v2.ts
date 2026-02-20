// ==========================================
// PLYON V2 - MULTI-SPORT TYPES
// ==========================================

export type SportType = 'football' | 'paddle' | 'tennis';
export type MatchResult = 'VICTORIA' | 'EMPATE' | 'DERROTA';

// ==========================================
// USER PROFILE (documento principal)
// ==========================================

export interface UserProfile {
  // Identity
  uid: string;
  name: string;
  username?: string;
  email: string;
  photo?: string;
  
  // Personal data
  dob?: string;
  weight?: number;
  height?: number;
  
  // Social
  friends?: string[];
  blockedUsers?: string[];
  friendRequestsSent?: string[];
  friendRequestsReceived?: string[];
  reputation?: {
    totalValidations: number;
    perfectValidations: number;
  };
  
  // Navigation
  lastSportPlayed?: SportType;
  activeSports: SportType[];
  
  // Settings
  favoriteTeam?: string;
  tutorialsSeen?: Record<string, boolean>;
  
  // Sports config
  sports: {
    football?: FootballSportConfig;
    paddle?: PaddleSportConfig;
    tennis?: TennisSportConfig;
  };
  
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// SPORT CONFIGS
// ==========================================

export interface BaseSportConfig {
  level: number;
  xp: number;
  careerPoints: number;
}

export interface FootballSportConfig extends BaseSportConfig {
  careerMode?: FootballCareerMode;
}

export interface FootballCareerMode {
  type: 'worldcup' | 'qualifiers';
  active: boolean;
  currentCampaign: number;
  progress: any;
  history: any[];
}

export interface PaddleSportConfig extends BaseSportConfig {
  careerMode?: PaddleCareerMode;
}

export interface PaddleCareerMode {
  type: 'regional' | 'national';
  active: boolean;
}

export interface TennisSportConfig extends BaseSportConfig {
  careerMode?: TennisCareerMode;
}

export interface TennisCareerMode {
  type: 'grandslam';
  active: boolean;
}

// ==========================================
// ACTIVITIES
// ==========================================

export interface FootballActivity {
  id: string;
  date: string;
  result: MatchResult;
  myGoals: number;
  myAssists: number;
  myYellowCards: number;
  myRedCards: number;
  goalDifference?: number;
  notes?: string;
  tournament?: string;
  matchMode?: 'regular' | 'world-cup' | 'qualifiers';
  earnedPoints?: number;
  myTeamPlayers?: PlayerPerformance[];
  opponentPlayers?: PlayerPerformance[];
  verified?: boolean;
}

export interface PlayerPerformance {
  name: string;
  goals: number;
  assists: number;
  yellowCards?: number;
  redCards?: number;
}

export interface PaddleActivity {
  id: string;
  date: string;
  result: MatchResult;
  partner: string;
  opponents: [string, string];
  myAces: number;
  myDoubleFaults: number;
  sets: PaddleSet[];
  notes?: string;
  tournament?: string;
}

export interface PaddleSet {
  setNumber: number;
  myScore: number;
  opponentScore: number;
}

// ==========================================
// GOALS, TOURNAMENTS, ACHIEVEMENTS
// ==========================================

export interface FootballGoal {
  id: string;
  metric: string;
  target: number;
  title: string;
}

export interface FootballTournament {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface FootballAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked?: boolean;
}

export interface FootballAIInteraction {
  id: string;
  type: string;
  date: string;
  content: any;
}
