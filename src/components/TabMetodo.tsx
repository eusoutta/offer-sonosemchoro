import { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronRight, ChevronUp, Lock, CheckCircle2, Play, Eye,
  BookOpen, ListChecks, PenLine, Headphones, Lightbulb, Calendar, Award
} from 'lucide-react';
import { DAY_TITLES, METHOD_VIDEOS, type DayContent } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';
import { YouTubeEmbed } from './YouTubeEmbed';

interface TabMetodoProps {
  isNightMode: boolean;
  currentDay: number;
  dayProgress: Record<number, { completed: boolean; opened_at: string | null; completed_at: string | null }>;
  onDayOpen: (day: number) => void;
  onDayComplete: (day: number) => void;
}

// Day content with placeholders
const getDayContent = (dayNum: number): DayContent => ({
  day_number: dayNum,
  title: DAY_TITLES[dayNum]?.title || '',
  subtitle: DAY_TITLES[dayNum]?.subtitle || '',
  status: 'available',
  textos: [
    { id: `t${dayNum}-1`, title: `Texto Principal do Dia ${dayNum}`, content: '[PLACEHOLDER — corpo de ~400 palavras sobre o tema do dia]', read: false },
  ],
  videos: METHOD_VIDEOS[dayNum] || [],
  checklist: [
    { id: `c${dayNum}-1`, text: `[CHECKLIST — item 1 do Dia ${dayNum}]`, checked: false },
    { id: `c${dayNum}-2`, text: `[CHECKLIST — item 2 do Dia ${dayNum}]`, checked: false },
    { id: `c${dayNum}-3`, text: `[CHECKLIST — item 3 do Dia ${dayNum}]`, checked: false },
    { id: `c${dayNum}-4`, text: `[CHECKLIST — item 4 do Dia ${dayNum}]`, checked: false },
    { id: `c${dayNum}-5`, text: `[CHECKLIST — item 5 do Dia ${dayNum}]`, checked: false },
  ],
  diary_question: `[PERGUNTA DO DIÁRIO — Reflexão guiada do Dia ${dayNum}]`,
  audio_slug: `audio-dia-${dayNum}`,
  pilula: {
    title: `Pílula do Dia ${dayNum}`,
    content: '[PÍLULA — curiosidade científica de 50-80 palavras]',
    viewed: false,
  },
});

export function TabMetodo({
  isNightMode,
  currentDay,
  dayProgress,
  onDayOpen,
  onDayComplete,
}: TabMetodoProps) {
  const { vibrate } = useVibrate();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [dayStates, setDayStates] = useState<Record<number, DayContent>>({});

  useEffect(() => {
    // Initialize day states
    const states: Record<number, DayContent> = {};
    for (let i = 1; i <= 7; i++) {
      states[i] = getDayContent(i);
    }
    setDayStates(states);
  }, []);

  const getDayStatus = (day: number): 'locked' | 'available' | 'in_progress' | 'completed' => {
    const progress = dayProgress[day];
    if (progress?.completed) return 'completed';
    if (day > currentDay) return 'locked';
    if (progress?.opened_at) return 'in_progress';
    return 'available';
  };

  const canOpenDay = (day: number): boolean => {
    if (day === 1) return true;
    const prevProgress = dayProgress[day - 1];
    if (!prevProgress?.completed) return false;
    if (!prevProgress.completed_at) return false;
    // Check 24h passed
    const completedTime = new Date(prevProgress.completed_at).getTime();
    const now = Date.now();
    const hoursPassed = (now - completedTime) / (1000 * 60 * 60);
    return hoursPassed >= 24;
  };

  const getHoursUntilUnlock = (day: number): number => {
    const prevProgress = dayProgress[day - 1];
    if (!prevProgress?.completed_at) return 24;
    const completedTime = new Date(prevProgress.completed_at).getTime();
    const now = Date.now();
    const hoursPassed = (now - completedTime) / (1000 * 60 * 60);
    return Math.max(0, Math.ceil(24 - hoursPassed));
  };

  const toggleDay = (day: number) => {
    vibrate(30);
    const status = getDayStatus(day);
    if (status === 'locked') {
      return;
    }
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
      if (status === 'available') {
        onDayOpen(day);
      }
    }
  };

  const markTextRead = (dayNum: number, textId: string) => {
    vibrate(20);
    setDayStates(prev => ({
      ...prev,
      [dayNum]: {
        ...prev[dayNum],
        textos: prev[dayNum].textos.map(t =>
          t.id === textId ? { ...t, read: true } : t
        ),
      },
    }));
  };

  const toggleChecklistItem = (dayNum: number, itemId: string) => {
    vibrate(20);
    setDayStates(prev => ({
      ...prev,
      [dayNum]: {
        ...prev[dayNum],
        checklist: prev[dayNum].checklist.map(c =>
          c.id === itemId ? { ...c, checked: !c.checked } : c
        ),
      },
    }));
  };

  const markPilulaViewed = (dayNum: number) => {
    vibrate(30);
    setDayStates(prev => ({
      ...prev,
      [dayNum]: {
        ...prev[dayNum],
        pilula: { ...prev[dayNum].pilula, viewed: true },
      },
    }));
  };

  const markAudioHeard = (dayNum: number) => {
    vibrate(30);
    // Placeholder for audio
  };

  const handleCompleteDay = (dayNum: number) => {
    vibrate(100);
    onDayComplete(dayNum);
    setExpandedDay(null);
  };

  const isDayFullyProgressed = (dayNum: number): boolean => {
    const state = dayStates[dayNum];
    if (!state) return false;
    const hasReadText = state.textos.some(t => t.read);
    const hasWatchedVideo = state.videos.some(v => v.watched);
    const hasCheckedItem = state.checklist.some(c => c.checked);
    return hasReadText || hasWatchedVideo || hasCheckedItem;
  };

  return (
    <div className={`min-h-screen ${isNightMode ? 'bg-gray-900' : 'bg-cream'} pb-24`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 px-4 py-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center gap-3">
          <BookOpen className={`w-6 h-6 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
          <div>
            <h1 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              O Meu Método
            </h1>
            <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              7 Dias — Técnica da Vaquinha
            </p>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className={`px-4 py-3 ${isNightMode ? 'bg-gray-800/50' : 'bg-coral-50'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Progresso: Dia {currentDay} de 7
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map(d => (
              <div
                key={d}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  getDayStatus(d) === 'completed'
                    ? 'bg-green-500 text-white'
                    : getDayStatus(d) === 'in_progress'
                      ? 'bg-coral-400 text-white'
                      : getDayStatus(d) === 'available'
                        ? isNightMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-white text-gray-600 border border-gray-200'
                        : isNightMode
                          ? 'bg-gray-800 text-gray-600'
                          : 'bg-gray-200 text-gray-400'
                }`}
              >
                {getDayStatus(d) === 'completed' ? '✓' : d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Days Accordion */}
      <div className="px-4 py-4 space-y-3">
        {[1, 2, 3, 4, 5, 6, 7].map(dayNum => {
          const state = dayStates[dayNum];
          const status = getDayStatus(dayNum);
          const isExpanded = expandedDay === dayNum;

          return (
            <div
              key={dayNum}
              className={`rounded-2xl overflow-hidden ${
                status === 'locked'
                  ? isNightMode
                    ? 'bg-gray-800/50'
                    : 'bg-gray-100'
                  : isNightMode
                    ? 'bg-gray-800'
                    : 'bg-white'
              } shadow-sm`}
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(dayNum)}
                className={`w-full p-4 flex items-center gap-4 ${
                  status === 'locked' ? 'opacity-60' : ''
                }`}
                disabled={status === 'locked'}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  status === 'completed'
                    ? 'bg-green-500'
                    : status === 'in_progress'
                      ? 'bg-coral-400'
                      : status === 'available'
                        ? 'bg-gradient-to-br from-coral-400 to-coral-500'
                        : isNightMode
                          ? 'bg-gray-700'
                          : 'bg-gray-300'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : status === 'locked' ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <span className="text-lg font-bold text-white">{dayNum}</span>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                      Dia {dayNum} — {DAY_TITLES[dayNum]?.title}
                    </span>
                    {status === 'in_progress' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-coral-400 text-white">
                        Em curso
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {DAY_TITLES[dayNum]?.subtitle}
                  </p>
                  {status === 'locked' && (
                    <p className={`text-xs mt-1 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`}>
                      Desbloqueia em {getHoursUntilUnlock(dayNum)}h
                    </p>
                  )}
                </div>

                {status !== 'locked' && (
                  isExpanded
                    ? <ChevronUp className={`w-5 h-5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    : <ChevronDown className={`w-5 h-5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && state && status !== 'locked' && (
                <div className="px-4 pb-4 space-y-4 animate-fade-in">
                  {/* Textos */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                      <h4 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Textos do Dia
                      </h4>
                    </div>
                    {state.textos.map(text => (
                      <div
                        key={text.id}
                        className={`p-4 rounded-xl mb-3 ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                            {text.title}
                          </h5>
                          <button
                            onClick={() => markTextRead(dayNum, text.id)}
                            className={`text-xs px-2 py-1 rounded-full ${
                              text.read
                                ? 'bg-green-500 text-white'
                                : isNightMode
                                  ? 'bg-gray-600 text-gray-300'
                                  : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {text.read ? '✓ Lido' : 'Marcar lido'}
                          </button>
                        </div>
                        <p className={`text-sm leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {text.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Vídeos */}
                  {state.videos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Play className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                        <h4 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                          Vídeos do Dia
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {state.videos.map(video => (
                          <YouTubeEmbed
                            key={video.id}
                            videoId={video.youtube_id}
                            title={video.title}
                            channel={video.channel}
                            duration={video.duration}
                            dayNumber={dayNum}
                            isNightMode={isNightMode}
                            onComplete={() => {
                              setDayStates(prev => ({
                                ...prev,
                                [dayNum]: {
                                  ...prev[dayNum],
                                  videos: prev[dayNum].videos.map(v =>
                                    v.id === video.id ? { ...v, watched: true } : v
                                  ),
                                },
                              }));
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Checklist */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ListChecks className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                      <h4 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Checklist do Dia
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {state.checklist.map(item => (
                        <button
                          key={item.id}
                          onClick={() => toggleChecklistItem(dayNum, item.id)}
                          className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                            item.checked
                              ? 'bg-green-500/20 border-2 border-green-500'
                              : isNightMode
                                ? 'bg-gray-700 border-2 border-gray-600'
                                : 'bg-gray-50 border-2 border-gray-200'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                            item.checked
                              ? 'bg-green-500 border-green-500'
                              : isNightMode
                                ? 'border-gray-500'
                                : 'border-gray-300'
                          }`}>
                            {item.checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`text-sm ${item.checked ? 'text-green-600 line-through' : isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diário */}
                  <div className={`p-4 rounded-xl ${isNightMode ? 'bg-coral-500/10 border border-coral-500/20' : 'bg-coral-50 border border-coral-100'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <PenLine className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                      <h4 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Diário do Dia
                      </h4>
                    </div>
                    <p className={`text-sm mb-3 italic ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {state.diary_question}
                    </p>
                    <textarea
                      className={`w-full p-3 rounded-lg text-sm resize-none ${
                        isNightMode
                          ? 'bg-gray-800 text-white placeholder-gray-500 border border-gray-600'
                          : 'bg-white text-gray-800 placeholder-gray-400 border border-gray-200'
                      }`}
                      rows={4}
                      placeholder="Escreve aqui a tua reflexão..."
                    />
                    <button className="mt-2 px-4 py-2 bg-coral-400 text-white rounded-lg text-sm font-medium">
                      Guardar
                    </button>
                  </div>

                  {/* Áudio */}
                  <div className={`p-4 rounded-xl ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Headphones className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                      <h4 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Áudio do Dia — Ouve antes de deitar
                      </h4>
                    </div>
                    <p className={`text-xs mb-3 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      [PLACEHOLDER — Áudio motivacional de 2-3 min]
                    </p>
                    <div className={`p-4 rounded-lg flex items-center gap-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <button
                        onClick={() => markAudioHeard(dayNum)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isNightMode ? 'bg-coral-500/20' : 'bg-coral-100'
                        }`}
                      >
                        <Play className={`w-6 h-6 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                          Áudio Dia {dayNum}
                        </p>
                        <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ~3 min
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pílula */}
                  <div className={`p-4 rounded-xl ${isNightMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-100'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className={`w-4 h-4 ${isNightMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                      <h4 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Pílula do Dia
                      </h4>
                    </div>
                    <p className={`text-sm ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {state.pilula.content}
                    </p>
                    <button
                      onClick={() => markPilulaViewed(dayNum)}
                      className={`mt-2 text-xs px-2 py-1 rounded-full ${
                        state.pilula.viewed
                          ? 'bg-green-500 text-white'
                          : isNightMode
                            ? 'bg-gray-600 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {state.pilula.viewed ? '✓ Visto' : 'Marcar visto'}
                    </button>
                  </div>

                  {/* Complete Day Button */}
                  <button
                    onClick={() => handleCompleteDay(dayNum)}
                    disabled={!isDayFullyProgressed(dayNum)}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      isDayFullyProgressed(dayNum)
                        ? 'bg-green-500 text-white active:scale-[0.98]'
                        : isNightMode
                          ? 'bg-gray-700 text-gray-500'
                          : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isDayFullyProgressed(dayNum)
                      ? '✓ Concluí o Dia ' + dayNum
                      : 'Complete pelo menos um item acima'}
                  </button>

                  {dayNum === 7 && isDayFullyProgressed(7) && (
                    <div className={`p-4 rounded-xl mt-4 ${isNightMode ? 'bg-coral-500/20' : 'bg-coral-100'}`}>
                      <p className={`text-sm ${isNightMode ? 'text-coral-300' : 'text-coral-600'}`}>
                        💳 Parabéns! Completaste os 7 dias. O Plano Manutenção está disponível.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
