// ========== AUTH & USER TYPES ==========
export interface UserProfile {
  id: string;
  user_id: string;
  mother_name: string;
  created_at: string;
  updated_at: string;
}

export interface BabyProfile {
  id: string;
  user_id: string;
  baby_name: string;
  baby_age_range: BabyAge;
  wakeups_per_night: WakeupsPerNight;
  sleep_association: SleepAssociation;
  method_start_date: string;
  created_at: string;
}

// ========== ONBOARDING ==========
export interface OnboardingData {
  babyName: string;
  babyAge: BabyAge;
  wakeupsPerNight: WakeupsPerNight;
  sleepAssociation: SleepAssociation;
  motherName: string;
  completedAt: string;
  dayStartedAt?: string;
}

// ========== VIDEO PROGRESS ==========
export interface VideoProgress {
  id: string;
  user_id: string;
  video_id: string;
  day_number: number;
  segundos_assistidos: number;
  total_segundos: number;
  completed: boolean;
  completed_at: string | null;
  last_watched_at: string;
}

// ========== DAY PROGRESS (7-day method) ==========
export interface DayProgress {
  id: string;
  user_id: string;
  day_number: number;
  opened_at: string | null;
  completed_at: string | null;
  textos_lidos: string[];
  videos_vistos: string[];
  checklist_marcada: string[];
  audio_ouvido: boolean;
  pilula_vista: boolean;
}

// ========== DIARY ENTRIES ==========
export interface DiaryEntry {
  id: string;
  user_id: string;
  day_number: number;
  question: string;
  answer: string;
  created_at: string;
}

// ========== WAKEUP TRACKING ==========
export interface WakeupEntry {
  id: string;
  user_id: string;
  day_number: number;
  timestamp: string;
  resolved_at: string;
  resolved_step: ResolvedStep;
  duration_seconds: number;
  date: string;
}

// ========== ACHIEVEMENTS ==========
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
}

// ========== AUDIO LIBRARY ==========
export interface AudioItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  category: string;
  is_method_audio: boolean;
  day_number: number | null;
}

// ========== APP STATE ==========
export interface AppState {
  onboarding: OnboardingData | null;
  user: UserProfile | null;
  baby: BabyProfile | null;
  currentDay: number;
  dayProgress: Record<number, DayProgress>;
  wakeupHistory: WakeupEntry[];
  diaryEntries: DiaryEntry[];
  achievements: UserAchievement[];
  videoProgress: Record<string, VideoProgress>;
  planoManutencao: boolean;
  ritualCompletedToday: boolean;
  lastRitualDate: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  themePreference?: 'auto' | 'dark' | 'light';
}

// ========== UNIONS ==========
export type BabyAge = '0-6m' | '7-12m' | '13-24m' | '2+';
export type WakeupsPerNight = '1-2' | '3-4' | '5+' | 'unknown';
export type SleepAssociation = 'mama' | 'arms' | 'pacifier' | 'stroller';
export type ResolvedStep = 1 | 2 | 3 | 4 | 5;

// ========== TAB NAVIGATION ==========
export type TabId = 'hoje' | 'metodo' | 'ferramentas' | 'eu';

// ========== DAY CONTENT STRUCTURE ==========
export interface DayContent {
  day_number: number;
  title: string;
  subtitle: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  textos: TextContent[];
  videos: VideoContent[];
  checklist: ChecklistItem[];
  diary_question: string;
  audio_slug: string;
  pilula: PilulaContent;
}

export interface TextContent {
  id: string;
  title: string;
  content: string;
  read: boolean;
}

export interface VideoContent {
  id: string;
  youtube_id: string;
  title: string;
  channel: string;
  duration: string;
  watched: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface PilulaContent {
  title: string;
  content: string;
  viewed: boolean;
}

// ========== METHOD VIDEOS (YouTube IDs) ==========
export const METHOD_VIDEOS: Record<number, VideoContent[]> = {
  1: [
    { id: 'v1a', youtube_id: 'puhAZ_SPbb4', title: 'Bebê que só dorme mamando — Como desassociar', channel: 'Consultora', duration: '~10min', watched: false },
    { id: 'v1b', youtube_id: '2hdp77c4mFE', title: 'Meu bebê só dorme no peito: e agora?', channel: 'Macetes de Mãe', duration: '~12min', watched: false },
  ],
  2: [
    { id: 'v2', youtube_id: 'fqiWoU612gY', title: 'Ritual do sono noturno — 8 passos', channel: 'Macetes de Mãe', duration: '~10min', watched: false },
  ],
  3: [
    { id: 'v3', youtube_id: 'lDRYDpHtic4', title: 'Como ajustar o sono e a rotina — 7 dicas práticas', channel: 'Dra. Ana Jannuzzi', duration: '~12min', watched: false },
  ],
  4: [
    { id: 'v4', youtube_id: 'RZWZSZt4Zv0', title: 'Passo a passo para desacostumar o bebê de dormir mamando', channel: 'Macetes de Mãe', duration: '~12min', watched: false },
  ],
  5: [
    { id: 'v5', youtube_id: '_hYwvm6rQA8', title: 'Desmame noturno gentil e respeitoso', channel: 'Almanaque dos Pais', duration: '~14min', watched: false },
  ],
  6: [
    { id: 'v6', youtube_id: 'lFyevcNFfOo', title: '10 Dicas para o Desmame Noturno Gentil', channel: 'Consultora', duration: '~13min', watched: false },
  ],
  7: [
    { id: 'v7', youtube_id: 'MgG0Ob6ZxD0', title: 'Desmame noturno gentil — 8 dicas pra facilitar', channel: 'Macetes de Mãe', duration: '~8min', watched: false },
  ],
};

// ========== DAY TITLES ==========
export const DAY_TITLES: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Entender', subtitle: 'A Semente' },
  2: { title: 'Preparar', subtitle: 'O Ambiente' },
  3: { title: 'Ajustar', subtitle: 'A Rotina' },
  4: { title: 'Aplicar', subtitle: 'A Técnica' },
  5: { title: 'Persistir', subtitle: 'O Pico' },
  6: { title: 'Aprofundar', subtitle: 'A Viragem' },
  7: { title: 'Consolidar', subtitle: 'A Conquista' },
};

// ========== ACHIEVEMENTS LIST ==========
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'primeira-noite', title: 'Primeira Noite', description: 'Registaste o primeiro despertar', icon: 'moon', condition: 'first_wakeup' },
  { id: 'dia-1', title: 'Dia 1 Completo', description: 'Concluiste o Dia 1 do método', icon: '1', condition: 'd1_complete' },
  { id: 'dia-3', title: 'Aplicou a Técnica', description: 'Chegaste ao Dia 3 — aplicaste pela primeira vez', icon: '3', condition: 'd3_complete' },
  { id: 'dia-7', title: 'Conseguiu!', description: 'Completaste os 7 dias', icon: 'trophy', condition: 'd7_complete' },
  { id: 'diario-1', title: 'Primeiro Registo', description: 'Escreveste no diário pela primeira vez', icon: 'pen', condition: 'first_diary' },
  { id: 'noite-tranquila', title: 'Noite Tranquila', description: 'Uma noite com 0-2 despertares', icon: 'star', condition: 'quiet_night' },
  { id: '30-dias', title: '30 Dias', description: 'Usaste o método por 30 dias', icon: 'calendar', condition: '30_days' },
];

// ========== AUDIO LIBRARY ==========
export const AUDIO_LIBRARY: AudioItem[] = [
  { id: 'a1', slug: 'respiracao-4-7-8', title: 'Respiração 4-7-8 para a mãe ansiosa', description: 'Técnica de respiração para acalmar', duration_seconds: 180, category: 'relaxation', is_method_audio: false, day_number: null },
  { id: 'a2', slug: 'visualizacao-noite', title: 'Visualização — noite tranquila', description: 'Imagina uma noite perfeita', duration_seconds: 300, category: 'meditation', is_method_audio: false, day_number: null },
  { id: 'a3', slug: 'mantra-nao-falhei', title: 'Mantra "Não falhei"', description: 'Afirmação positiva', duration_seconds: 120, category: 'affirmation', is_method_audio: false, day_number: null },
  { id: 'a4', slug: 'white-noise-chuva', title: 'White noise — chuva', description: 'Som de chuva suave', duration_seconds: 600, category: 'ambient', is_method_audio: false, day_number: null },
  { id: 'a5', slug: 'white-noise-coracao', title: 'White noise — coração materno', description: 'Batimento cardíaco suave', duration_seconds: 480, category: 'ambient', is_method_audio: false, day_number: null },
  { id: 'a6', slug: 'meditacao-exausta', title: 'Meditação para mãe exausta', description: 'Relaxamento profundo', duration_seconds: 420, category: 'meditation', is_method_audio: false, day_number: null },
];

// ========== GLOSSARY ==========
export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: 'Associação de sono', definition: 'Hábito que o bebé desenvolve de precisar de algo específico (mamar, ser embalado, chupeta) para adormecer. O método quebra esta associação.' },
  { term: 'Janela de sono', definition: 'Período de tempo em que o bebé está propenso a adormecer naturalmente. Varia com a idade: 45min (recém-nascido) a 6h (3 anos).' },
  { term: 'Regressão de sono', definition: 'Fase temporária em que o bebé acorda mais vezes durante a noite. Comum aos 4, 8 e 12 meses.' },
  { term: 'Sono REM', definition: 'Fase de sono em que ocorrem os sonhos e o cérebro processa memórias. Mais superficial que o sono profundo.' },
  { term: 'Sono profundo', definition: 'Fase de sono restaurador. O bebé respira regularmente e é difícil acordá-lo.' },
  { term: 'Sucção não-nutritiva', definition: 'Sucção por conforto, não por fome. Comum na chupeta ou mama usada para adormecer.' },
  { term: 'Ritual pré-sono', definition: 'Sequência de ações consistentes antes de deitar. Ajuda o cérebro a reconhecer que é hora de dormir.' },
  { term: 'Mamada cluster', definition: 'Várias mamadas seguidas num curto período, comum ao final do dia. Normal.' },
  { term: 'Drowsy but awake', definition: 'Colocar o bebé na cama sonolento mas ainda acordado. Permite que aprenda a adormecer sozinho.' },
  { term: 'Sleep training', definition: 'Treino de sono — métodos para ajudar o bebé a dormir melhor. Este método é gentil, com presença ativa.' },
  { term: 'Co-sleeping', definition: 'Dormir na mesma cama ou quarto que o bebé. Requer precauções de segurança específicas.' },
  { term: 'Salto de desenvolvimento', definition: 'Fase em que o bebé aprende novas competências e pode ter sono mais instável.' },
  { term: 'Dream feed', definition: 'Mamada dada enquanto o bebé dorme, antes de os pais irem para a cama.' },
  { term: 'Extinção burst', definition: 'Aumento temporário do choro quando o bebé testa novos limites. Normal nos dias 2-4.' },
  { term: 'Self-soothing', definition: 'Capacidade do bebé de se acalmar sozinho. Desenvolve-se com prática.' },
  { term: 'Desmame noturno', definition: 'Processo de reduzir gradualmente as mamadas noturnas até o bebé dormir a noite toda.' },
];

// ========== SLEEP WINDOWS BY AGE ==========
export interface SleepWindows {
  age_range: string;
  awake_window: string;
  naps_per_day: string;
  total_sleep: string;
}

export const SLEEP_WINDOWS: SleepWindows[] = [
  { age_range: '0-3 meses', awake_window: '45-90 min', naps_per_day: '4-5', total_sleep: '14-17h' },
  { age_range: '4-6 meses', awake_window: '1.5-2.5h', naps_per_day: '3-4', total_sleep: '12-16h' },
  { age_range: '7-12 meses', awake_window: '2-3h', naps_per_day: '2-3', total_sleep: '12-15h' },
  { age_range: '13-24 meses', awake_window: '3-4h', naps_per_day: '1-2', total_sleep: '11-14h' },
  { age_range: '25-36 meses', awake_window: '5-6h', naps_per_day: '1 (opcional)', total_sleep: '10-13h' },
];

// ========== BABY SLEEP SIGNS ==========
export interface SleepSign {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const SLEEP_SIGNS: SleepSign[] = [
  { id: 's1', name: 'Esfregar os olhos', description: 'O bebé esfrega os olhos com as mãos', icon: 'eye' },
  { id: 's2', name: 'Bocejar', description: 'Bocejos frequentes', icon: 'wind' },
  { id: 's3', name: 'Olhar perdido', description: 'Olhar fixo ou "no espaço"', icon: 'search' },
  { id: 's4', name: 'Irritabilidade', description: 'Fica mais irritado sem razão aparente', icon: 'frown' },
  { id: 's5', name: 'Puxar a orelha', description: 'Toque frequente na orelha', icon: 'ear' },
  { id: 's6', name: 'Virar a cara', description: 'Vira a cara para longe de estímulos', icon: 'rotate-ccw' },
  { id: 's7', name: 'Suspiro fundo', description: 'Respiração mais profunda e lenta', icon: 'wind' },
  { id: 's8', name: 'Movimentos lentos', description: 'Movimentos do corpo mais lentos', icon: 'activity' },
];
