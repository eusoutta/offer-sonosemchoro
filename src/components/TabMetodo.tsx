import { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronUp, Lock, CheckCircle2, Play,
  BookOpen, ListChecks, PenLine, Headphones, Lightbulb, Award
} from 'lucide-react';
import { DAY_TITLES, METHOD_VIDEOS, type DayContent } from '../lib/types';
import { FULL_DAY_CONTENT } from '../lib/content';
import { useVibrate } from '../hooks/useVibrate';
import { YouTubeEmbed } from './YouTubeEmbed';

interface TabMetodoProps {
  isNightMode: boolean;
  currentDay: number;
  dayProgress: Record<number, { completed: boolean; opened_at: string | null; completed_at: string | null }>;
  onDayOpen: (day: number) => void;
  onDayComplete: (day: number) => void;
  onSaveDiary: (entry: { date: string; day_number: number; content: string }) => Promise<void>;
}

const getDayContent = (dayNum: number): DayContent => {
  const fullContent = FULL_DAY_CONTENT[dayNum];
  return {
    day_number: dayNum,
    title: DAY_TITLES[dayNum]?.title || '',
    subtitle: DAY_TITLES[dayNum]?.subtitle || '',
    status: 'available',
    textos: fullContent
      ? fullContent.textos.map(t => ({ ...t, read: false }))
      : [{ id: `t${dayNum}-1`, title: `Texto do Dia ${dayNum}`, content: 'Conteúdo em preparação...', read: false }],
    videos: METHOD_VIDEOS[dayNum] || [],
    checklist: fullContent
      ? fullContent.checklist.map(c => ({ ...c, checked: false }))
      : [],
    diary_question: fullContent?.diary_question || '',
    audio_slug: `audio-dia-${dayNum}`,
    pilula: fullContent
      ? { ...fullContent.pilula, viewed: false }
      : { title: '', content: '', viewed: false },
  };
};

const DAY_EMOJIS: Record<number, string> = {
  1: '🌱', 2: '🏠', 3: '🔥', 4: '📈', 5: '💪', 6: '🌅', 7: '🏆',
};

export function TabMetodo({
  isNightMode,
  currentDay,
  dayProgress,
  onDayOpen,
  onDayComplete,
  onSaveDiary,
}: TabMetodoProps) {
  const { vibrate } = useVibrate();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [dayStates, setDayStates] = useState<Record<number, DayContent>>({});
  const [expandedText, setExpandedText] = useState<string | null>(null);
  const [diaryInputs, setDiaryInputs] = useState<Record<number, string>>({});
  const [diarySaved, setDiarySaved] = useState<Record<number, boolean>>({});

  useEffect(() => {
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

  const toggleDay = (day: number) => {
    vibrate(30);
    const status = getDayStatus(day);
    if (status === 'locked') return;
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
      setExpandedText(null);
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

  const handleCompleteDay = (dayNum: number) => {
    vibrate(100);
    onDayComplete(dayNum);
    setExpandedDay(null);
  };

  const isDayFullyProgressed = (dayNum: number): boolean => {
    const state = dayStates[dayNum];
    if (!state) return false;
    const hasReadText = state.textos.some(t => t.read);
    const hasCheckedItem = state.checklist.some(c => c.checked);
    return hasReadText || hasCheckedItem || !!diarySaved[dayNum];
  };

  const handleSaveDiary = async (dayNum: number) => {
    const content = diaryInputs[dayNum];
    if (!content?.trim()) return;

    vibrate(50);
    await onSaveDiary({
      date: new Date().toISOString().split('T')[0],
      day_number: dayNum,
      content,
    });
    setDiarySaved(prev => ({ ...prev, [dayNum]: true }));
    setTimeout(() => {
      setDiarySaved(prev => ({ ...prev, [dayNum]: false }));
    }, 3000);
  };

  const getCompletedCount = () => {
    return Object.values(dayProgress).filter(p => p.completed).length;
  };

  return (
    <div className={`min-h-screen ${isNightMode ? 'bg-gradient-night' : 'bg-gradient-warm'} pb-24`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 px-5 py-4 ${isNightMode ? 'glass-dark border-b border-white/5' : 'glass border-b border-coral-100/50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isNightMode ? 'bg-gradient-to-br from-coral-500/30 to-coral-600/20' : 'bg-gradient-to-br from-coral-400 to-coral-500'}`}>
            <BookOpen className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-white'}`} />
          </div>
          <div>
            <h1 className={`font-extrabold text-lg tracking-tight ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              O Meu Método
            </h1>
            <p className={`text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              7 Dias — Técnica da Vaquinha
            </p>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className={`mx-4 mt-4 rounded-2xl p-4 ${isNightMode ? 'bg-gray-800/60 border border-gray-700/30' : 'bg-white/80 border border-coral-100/50'} shadow-premium`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-semibold ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Progresso: {getCompletedCount()} de 7 dias
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isNightMode ? 'bg-coral-500/20 text-coral-300' : 'bg-coral-100 text-coral-600'}`}>
            {Math.round((getCompletedCount() / 7) * 100)}%
          </span>
        </div>
        {/* Progress bar */}
        <div className={`h-2 rounded-full overflow-hidden ${isNightMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-coral-400 via-coral-500 to-coral-600 transition-all duration-700 ease-out"
            style={{ width: `${(getCompletedCount() / 7) * 100}%` }}
          />
        </div>
        {/* Day circles */}
        <div className="flex justify-between mt-3 px-1">
          {[1, 2, 3, 4, 5, 6, 7].map(d => {
            const status = getDayStatus(d);
            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  status === 'completed'
                    ? 'bg-green-500 text-white shadow-sm glow-green'
                    : status === 'in_progress'
                      ? 'bg-gradient-to-br from-coral-400 to-coral-500 text-white shadow-sm'
                      : status === 'available'
                        ? isNightMode
                          ? 'bg-gray-700 text-gray-300 border border-gray-600'
                          : 'bg-white text-gray-600 border-2 border-gray-200'
                        : isNightMode
                          ? 'bg-gray-800 text-gray-600'
                          : 'bg-gray-100 text-gray-400'
                }`}>
                  {status === 'completed' ? '✓' : d}
                </div>
                <span className={`text-[10px] ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {DAY_EMOJIS[d]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Days Accordion */}
      <div className="px-4 py-4 space-y-3">
        {[1, 2, 3, 4, 5, 6, 7].map((dayNum, index) => {
          const state = dayStates[dayNum];
          const status = getDayStatus(dayNum);
          const isExpanded = expandedDay === dayNum;

          return (
            <div
              key={dayNum}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                status === 'locked'
                  ? isNightMode
                    ? 'bg-gray-800/30 border border-gray-800/50'
                    : 'bg-gray-50/80 border border-gray-200/50'
                  : isExpanded
                    ? isNightMode
                      ? 'bg-gray-800/80 border border-coral-500/20 shadow-premium-dark'
                      : 'bg-white border border-coral-200/50 shadow-premium'
                    : isNightMode
                      ? 'bg-gray-800/60 border border-gray-700/30'
                      : 'bg-white/90 border border-gray-100'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(dayNum)}
                className={`w-full p-4 flex items-center gap-4 ${
                  status === 'locked' ? 'opacity-50' : ''
                }`}
                disabled={status === 'locked'}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  status === 'completed'
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : status === 'in_progress'
                      ? 'bg-gradient-to-br from-coral-400 to-coral-600 animate-pulse-soft'
                      : status === 'available'
                        ? 'bg-gradient-to-br from-coral-400 to-coral-500'
                        : isNightMode
                          ? 'bg-gray-700'
                          : 'bg-gray-200'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : status === 'locked' ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <span className="text-lg font-extrabold text-white">{DAY_EMOJIS[dayNum]}</span>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                      Dia {dayNum}
                    </span>
                    <span className={`text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      — {DAY_TITLES[dayNum]?.title}
                    </span>
                    {status === 'in_progress' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral-400 text-white font-semibold">
                        Em curso
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {DAY_TITLES[dayNum]?.subtitle}
                  </p>
                </div>

                {status !== 'locked' && (
                  isExpanded
                    ? <ChevronUp className={`w-5 h-5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    : <ChevronDown className={`w-5 h-5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && state && status !== 'locked' && (
                <div className="px-4 pb-5 space-y-5 animate-fade-in">

                  {/* Textos */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-coral-500/15' : 'bg-coral-50'}`}>
                        <BookOpen className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                      </div>
                      <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Leitura do Dia
                      </h4>
                    </div>
                    {state.textos.map(text => (
                      <div
                        key={text.id}
                        className={`rounded-xl mb-3 overflow-hidden transition-all ${isNightMode ? 'bg-gray-700/50 border border-gray-600/30' : 'bg-gray-50/80 border border-gray-100'}`}
                      >
                        <button
                          onClick={() => {
                            vibrate(20);
                            setExpandedText(expandedText === text.id ? null : text.id);
                            if (!text.read) markTextRead(dayNum, text.id);
                          }}
                          className="w-full p-4 flex items-start justify-between text-left"
                        >
                          <div className="flex-1">
                            <h5 className={`font-semibold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                              {text.title}
                            </h5>
                            {expandedText !== text.id && (
                              <p className={`text-xs mt-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Toca para ler →
                              </p>
                            )}
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            text.read
                              ? 'bg-green-500 text-white'
                              : isNightMode
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-gray-200 text-gray-600'
                          }`}>
                            {text.read ? '✓ Lido' : 'Novo'}
                          </span>
                        </button>
                        {expandedText === text.id && (
                          <div className="px-4 pb-4 animate-fade-in">
                            <div className={`text-sm leading-relaxed content-text whitespace-pre-line ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {text.content}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Vídeos */}
                  {state.videos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-red-500/15' : 'bg-red-50'}`}>
                          <Play className={`w-4 h-4 ${isNightMode ? 'text-red-400' : 'text-red-500'}`} />
                        </div>
                        <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
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
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-green-500/15' : 'bg-green-50'}`}>
                        <ListChecks className={`w-4 h-4 ${isNightMode ? 'text-green-400' : 'text-green-500'}`} />
                      </div>
                      <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Checklist do Dia
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {state.checklist.map(item => (
                        <button
                          key={item.id}
                          onClick={() => toggleChecklistItem(dayNum, item.id)}
                          className={`w-full p-3.5 rounded-xl flex items-center gap-3 transition-all ${
                            item.checked
                              ? 'bg-green-500/10 border-2 border-green-500/30'
                              : isNightMode
                                ? 'bg-gray-700/50 border-2 border-gray-600/30 active:border-coral-500/30'
                                : 'bg-gray-50 border-2 border-gray-200/80 active:border-coral-300'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            item.checked
                              ? 'bg-green-500 border-green-500'
                              : isNightMode
                                ? 'border-gray-500'
                                : 'border-gray-300'
                          }`}>
                            {item.checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`text-sm text-left ${item.checked ? 'text-green-600 line-through' : isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diário */}
                  <div className={`p-4 rounded-xl ${isNightMode ? 'bg-coral-500/10 border border-coral-500/20' : 'bg-gradient-to-br from-coral-50 to-coral-100/50 border border-coral-100'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-coral-500/20' : 'bg-coral-200/50'}`}>
                        <PenLine className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                      </div>
                      <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Reflexão do Dia
                      </h4>
                    </div>
                    <p className={`text-sm mb-3 italic leading-relaxed ${isNightMode ? 'text-coral-300/80' : 'text-coral-600/80'}`}>
                      "{state.diary_question}"
                    </p>
                    
                    <div className="flex justify-between items-center mb-3">
                      {['😭', '😫', '😐', '🙂', '😍'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => setDiaryInputs(prev => ({ ...prev, [dayNum]: (prev[dayNum] ? prev[dayNum] + ' ' : '') + emoji }))}
                          className={`text-2xl p-2 rounded-full transition-all active:scale-90 ${isNightMode ? 'hover:bg-gray-800' : 'hover:bg-coral-100'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <textarea
                      className={`w-full p-3 rounded-xl text-sm resize-none leading-relaxed ${
                        isNightMode
                          ? 'bg-gray-800/80 text-white placeholder-gray-500 border border-gray-600/50 focus:border-coral-500/50'
                          : 'bg-white text-gray-800 placeholder-gray-400 border border-coral-200/50 focus:border-coral-400'
                      }`}
                      rows={4}
                      placeholder="Escreve aqui a tua reflexão..."
                      value={diaryInputs[dayNum] || ''}
                      onChange={(e) => setDiaryInputs(prev => ({ ...prev, [dayNum]: e.target.value }))}
                    />
                    <button 
                      onClick={() => handleSaveDiary(dayNum)}
                      className={`mt-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        diarySaved[dayNum]
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-coral-400 to-coral-500'
                      }`}
                    >
                      {diarySaved[dayNum] ? '✓ Guardado!' : '💾 Guardar'}
                    </button>
                  </div>

                  {/* Pílula */}
                  {state.pilula.content && (
                    <div className={`p-4 rounded-xl ${isNightMode ? 'bg-warm-400/10 border border-warm-400/20' : 'bg-gradient-to-br from-warm-50 to-warm-100/50 border border-warm-200/50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-warm-400/20' : 'bg-warm-200/50'}`}>
                          <Lightbulb className={`w-4 h-4 ${isNightMode ? 'text-warm-400' : 'text-warm-500'}`} />
                        </div>
                        <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                          {state.pilula.title}
                        </h4>
                      </div>
                      <p className={`text-sm leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {state.pilula.content}
                      </p>
                      {!state.pilula.viewed && (
                        <button
                          onClick={() => markPilulaViewed(dayNum)}
                          className={`mt-2 text-xs px-3 py-1.5 rounded-full font-medium ${isNightMode ? 'bg-warm-400/20 text-warm-300' : 'bg-warm-200/50 text-warm-600'}`}
                        >
                          💡 Marcar como visto
                        </button>
                      )}
                    </div>
                  )}

                  {/* Complete Day Button */}
                  <button
                    onClick={() => handleCompleteDay(dayNum)}
                    disabled={!isDayFullyProgressed(dayNum)}
                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
                      isDayFullyProgressed(dayNum)
                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg glow-green active:scale-[0.97]'
                        : isNightMode
                          ? 'bg-gray-700/50 text-gray-500 border border-gray-600/30'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {isDayFullyProgressed(dayNum)
                      ? `✓ Concluí o Dia ${dayNum}`
                      : 'Lê pelo menos um texto ou marca um item'}
                  </button>

                  {dayNum === 7 && isDayFullyProgressed(7) && (
                    <div className={`p-4 rounded-xl mt-2 text-center ${isNightMode ? 'bg-gradient-to-r from-coral-500/20 to-coral-600/10 border border-coral-500/20' : 'bg-gradient-to-r from-coral-50 to-coral-100 border border-coral-200'}`}>
                      <span className="text-2xl">🎉</span>
                      <p className={`text-sm font-semibold mt-1 ${isNightMode ? 'text-coral-300' : 'text-coral-600'}`}>
                        Parabéns! Completaste os 7 dias do método.
                      </p>
                      <p className={`text-xs mt-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        O Plano Manutenção está disponível.
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
