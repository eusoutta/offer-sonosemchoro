import { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronUp, Lock, CheckCircle2, Play,
  BookOpen, ListChecks, PenLine, Headphones, Lightbulb, Award
} from 'lucide-react';
import { DAY_TITLES, METHOD_VIDEOS, type DayContent } from '../lib/types';
import { FULL_DAY_CONTENT } from '../lib/content';
import { useVibrate } from '../hooks/useVibrate';
import { YouTubeEmbed } from './YouTubeEmbed';
import { useAppContext } from '../hooks/useAppContext';

interface TabMetodoProps {
  isNightMode: boolean;
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
      : [{ id: `t${dayNum}-1`, title: `Texto do Módulo ${dayNum}`, content: 'Conteúdo em preparação...', read: false }],
    videos: METHOD_VIDEOS[dayNum] || [],
    checklist: fullContent
      ? fullContent.checklist.map(c => ({ ...c, checked: false }))
      : [],
    diary_question: fullContent?.diary_question || '',
    audio_slug: `audio-modulo-${dayNum}`,
    pilula: fullContent
      ? { ...fullContent.pilula, viewed: false }
      : { title: '', content: '', viewed: false },
  };
};

const MODULE_EMOJIS: Record<number, string> = {
  1: '🟢', 2: '🌙', 3: '🌙', 4: '🌙', 5: '🌙', 6: '🌙', 7: '💪',
  8: '🤒', 9: '✈️', 10: '📉', 11: '👨‍👩‍👧', 12: '💼', 13: '💙', 14: '🛏️',
};

export function TabMetodo({ isNightMode }: TabMetodoProps) {
  const { vibrate } = useVibrate();
  const { state, updateDay, updateContentProgress, registerQuebraDoRitmo, addDiaryEntry } = useAppContext();
  
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [dayStates, setDayStates] = useState<Record<number, DayContent>>({});
  const [expandedText, setExpandedText] = useState<string | null>(null);
  const [diaryInputs, setDiaryInputs] = useState<Record<number, string>>({});
  const [diarySaved, setDiarySaved] = useState<Record<number, boolean>>({});
  
  const [lockedModalData, setLockedModalData] = useState<{ step: 1 | 2, module: number } | null>(null);

  useEffect(() => {
    const states: Record<number, DayContent> = {};
    for (let i = 1; i <= 14; i++) {
      states[i] = getDayContent(i);
      
      // Load progress from context if available
      const progress = state.contentProgress[`modulo${i}`];
      if (progress) {
        states[i].textos.forEach(t => {
          if (progress.textosLidos?.includes(t.id)) t.read = true;
        });
        states[i].videos.forEach(v => {
          if (progress.videosVistos?.includes(v.id)) v.watched = true;
        });
        states[i].checklist.forEach(c => {
          if (progress.checklistMarcada?.includes(c.id)) c.checked = true;
        });
        if (progress.pilulaVista) states[i].pilula.viewed = true;
        
        if (progress.diarioEntrada) {
          setDiaryInputs(prev => ({ ...prev, [i]: progress.diarioEntrada!.texto }));
          setDiarySaved(prev => ({ ...prev, [i]: true }));
        }
      }
    }
    setDayStates(states);
  }, [state.contentProgress]);

  const getDayStatus = (mod: number): 'locked' | 'available' | 'in_progress' | 'completed' => {
    const progress = state.contentProgress[`modulo${mod}`];
    if (progress?.concluido) return 'completed';
    
    if (mod <= 7) {
      if (mod > state.currentDay) return 'locked';
    } else {
      // Optionals are unlocked after module 7 is completed
      if (state.currentDay <= 7) return 'locked';
    }
    
    if (progress?.aberto) return 'in_progress';
    return 'available';
  };

  const syncProgress = (mod: number, newState: DayContent) => {
    const prog = state.contentProgress[`modulo${mod}`] || {
      aberto: true,
      concluido: false,
      dataConclusao: null,
      textosLidos: [],
      videosVistos: [],
      checklistMarcada: [],
      diarioEntrada: null,
      audioOuvido: false,
      pilulaVista: false
    };
    
    prog.aberto = true;
    prog.textosLidos = newState.textos.filter(t => t.read).map(t => t.id);
    prog.videosVistos = newState.videos.filter(v => v.watched).map(v => v.id);
    prog.checklistMarcada = newState.checklist.filter(c => c.checked).map(c => c.id);
    prog.pilulaVista = newState.pilula.viewed;
    
    const diary = diaryInputs[mod];
    if (diarySaved[mod] && diary) {
      prog.diarioEntrada = { texto: diary, timestamp: new Date().toISOString() };
    }
    
    updateContentProgress(`modulo${mod}`, prog);
  };

  const toggleDay = (mod: number) => {
    vibrate(30);
    const status = getDayStatus(mod);
    
    if (status === 'locked') {
      if (mod <= 7) {
        setLockedModalData({ step: 1, module: mod });
      }
      return;
    }
    
    if (expandedDay === mod) {
      setExpandedDay(null);
    } else {
      setExpandedDay(mod);
      setExpandedText(null);
      
      const prog = state.contentProgress[`modulo${mod}`];
      if (!prog?.aberto) {
        syncProgress(mod, dayStates[mod]);
      }
    }
  };

  const bypassLock = () => {
    if (!lockedModalData) return;
    const { module } = lockedModalData;
    
    registerQuebraDoRitmo({
      modulo: module,
      dataPrevia: new Date().toISOString(),
      dataReal: new Date().toISOString()
    });
    
    updateDay(module);
    setLockedModalData(null);
    
    setTimeout(() => {
      toggleDay(module);
    }, 100);
  };

  const markTextRead = (modNum: number, textId: string) => {
    vibrate(20);
    setDayStates(prev => {
      const next = {
        ...prev,
        [modNum]: {
          ...prev[modNum],
          textos: prev[modNum].textos.map(t =>
            t.id === textId ? { ...t, read: true } : t
          ),
        },
      };
      syncProgress(modNum, next[modNum]);
      return next;
    });
  };

  const toggleChecklistItem = (modNum: number, itemId: string) => {
    vibrate(20);
    setDayStates(prev => {
      const next = {
        ...prev,
        [modNum]: {
          ...prev[modNum],
          checklist: prev[modNum].checklist.map(c =>
            c.id === itemId ? { ...c, checked: !c.checked } : c
          ),
        },
      };
      syncProgress(modNum, next[modNum]);
      return next;
    });
  };

  const markPilulaViewed = (modNum: number) => {
    vibrate(30);
    setDayStates(prev => {
      const next = {
        ...prev,
        [modNum]: {
          ...prev[modNum],
          pilula: { ...prev[modNum].pilula, viewed: true },
        },
      };
      syncProgress(modNum, next[modNum]);
      return next;
    });
  };

  const handleCompleteDay = (modNum: number) => {
    vibrate(100);
    
    const prog = state.contentProgress[`modulo${modNum}`] || {
      aberto: true,
      concluido: false,
      dataConclusao: null,
      textosLidos: [],
      videosVistos: [],
      checklistMarcada: [],
      diarioEntrada: null,
      audioOuvido: false,
      pilulaVista: false
    };
    
    prog.concluido = true;
    prog.dataConclusao = new Date().toISOString();
    updateContentProgress(`modulo${modNum}`, prog);
    
    if (modNum === state.currentDay && modNum < 7) {
      updateDay(modNum + 1);
    }
    
    setExpandedDay(null);
  };

  const isDayFullyProgressed = (modNum: number): boolean => {
    const st = dayStates[modNum];
    if (!st) return false;
    const hasReadText = st.textos.some(t => t.read);
    const hasCheckedItem = st.checklist.some(c => c.checked);
    const hasVideo = st.videos.some(v => v.watched);
    return hasReadText || hasCheckedItem || !!diarySaved[modNum] || hasVideo;
  };

  const handleSaveDiary = async (modNum: number) => {
    const content = diaryInputs[modNum];
    if (!content?.trim()) return;

    vibrate(50);
    await addDiaryEntry({
      id: Date.now().toString(),
      user_id: 'user',
      date: new Date().toISOString().split('T')[0],
      day_number: modNum,
      question: dayStates[modNum].diary_question,
      answer: content,
      created_at: new Date().toISOString()
    });
    setDiarySaved(prev => ({ ...prev, [modNum]: true }));
    
    const nextSt = { ...dayStates[modNum] };
    syncProgress(modNum, nextSt);
  };

  const getCompletedCount = () => {
    return [1,2,3,4,5,6,7].filter(m => state.contentProgress[`modulo${m}`]?.concluido).length;
  };
  
  const getOptionalsCompletedCount = () => {
    return [8,9,10,11,12,13,14].filter(m => state.contentProgress[`modulo${m}`]?.concluido).length;
  };

  return (
    <div className={`min-h-screen ${isNightMode ? 'bg-gradient-night' : 'bg-gradient-warm'} pb-24 relative`}>
      {/* Modals for early unlock */}
      {lockedModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
            {lockedModalData.step === 1 ? (
              <>
                <p className={`text-[15px] leading-relaxed mb-6 font-medium ${isNightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Recomendamos esperar até amanhã para o próximo módulo. O cérebro do teu bebé consolida o aprendizado durante a noite — e o teu também. Volta amanhã? 🌙
                </p>
                <button
                  onClick={() => setLockedModalData(null)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-coral-400 to-coral-500 text-white font-bold text-base shadow-lg mb-3 active:scale-95 transition-transform"
                >
                  Vou esperar
                </button>
                <button
                  onClick={() => setLockedModalData({ ...lockedModalData, step: 2 })}
                  className={`w-full text-[13px] font-medium py-2 ${isNightMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Continuar mesmo assim
                </button>
              </>
            ) : (
              <>
                <p className={`text-[15px] leading-relaxed mb-6 font-medium ${isNightMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Tens a certeza? Os resultados costumam ser melhores quando respeitas o ritmo de 1 módulo por dia. Mas a escolha é tua.
                </p>
                <button
                  onClick={bypassLock}
                  className={`w-full py-3.5 rounded-xl font-bold text-base mb-3 active:scale-95 transition-transform ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Continuar à mesma
                </button>
                <button
                  onClick={() => setLockedModalData(null)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-coral-400 to-coral-500 text-white font-bold text-base shadow-lg active:scale-95 transition-transform"
                >
                  Vou esperar
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
              7 Módulos — Técnica da Vaquinha
            </p>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className={`mx-4 mt-4 rounded-2xl p-4 ${isNightMode ? 'bg-gray-800/60 border border-gray-700/30' : 'bg-white/80 border border-coral-100/50'} shadow-premium`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-semibold ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Progresso: {getCompletedCount()} de 7 módulos
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
        
        {getOptionalsCompletedCount() > 0 && (
          <div className="mt-3 text-right">
            <span className={`text-[11px] font-medium ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Módulos extra: {getOptionalsCompletedCount()} de 7 concluídos
            </span>
          </div>
        )}
      </div>

      {/* Module List Function */}
      {(() => {
        const renderModules = (modules: number[]) => {
          return modules.map((modNum, index) => {
            const st = dayStates[modNum];
            const status = getDayStatus(modNum);
            const isExpanded = expandedDay === modNum;
            const prog = state.contentProgress[`modulo${modNum}`];

            return (
              <div
                key={modNum}
                className={`rounded-2xl overflow-hidden transition-all duration-300 relative ${
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
                {modNum === 14 && (
                  <div className="absolute top-0 right-0 rounded-bl-xl rounded-tr-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1 shadow-sm">
                    <span className="text-[10px] font-bold text-yellow-900 uppercase tracking-wide flex items-center gap-1">
                      <Award className="w-3 h-3" /> Mais escolhido por mães moçambicanas
                    </span>
                  </div>
                )}
                
                {/* Module Header */}
                <button
                  onClick={() => toggleDay(modNum)}
                  className={`w-full p-4 flex items-center gap-4 ${
                    status === 'locked' ? 'opacity-50' : ''
                  } ${modNum === 14 ? 'pt-7' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
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
                      <span className="text-lg font-extrabold text-white">{MODULE_EMOJIS[modNum]}</span>
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`font-bold truncate ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        Módulo {modNum}
                      </span>
                      {status === 'in_progress' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral-400 text-white font-semibold">
                          Em curso
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 font-medium truncate ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {DAY_TITLES[modNum]?.title}
                    </p>
                    <p className={`text-[11px] mt-0.5 truncate ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {DAY_TITLES[modNum]?.subtitle}
                    </p>
                    {status === 'locked' && modNum > 7 && (
                      <p className={`text-[10px] mt-1 italic ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Disponível após concluíres o Módulo 7
                      </p>
                    )}
                  </div>

                  {status !== 'locked' && (
                    isExpanded
                      ? <ChevronUp className={`w-5 h-5 flex-shrink-0 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      : <ChevronDown className={`w-5 h-5 flex-shrink-0 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && st && status !== 'locked' && (
                  <div className="px-4 pb-5 space-y-5 animate-fade-in">
                    
                    {/* Textos */}
                    {st.textos.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-coral-500/15' : 'bg-coral-50'}`}>
                            <BookOpen className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                          </div>
                          <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                            Leitura do Módulo
                          </h4>
                        </div>
                        {st.textos.map(text => (
                          <div
                            key={text.id}
                            className={`rounded-xl mb-3 overflow-hidden transition-all ${isNightMode ? 'bg-gray-700/50 border border-gray-600/30' : 'bg-gray-50/80 border border-gray-100'}`}
                          >
                            <button
                              onClick={() => {
                                vibrate(20);
                                setExpandedText(expandedText === text.id ? null : text.id);
                                if (!text.read) markTextRead(modNum, text.id);
                              }}
                              className="w-full p-4 flex items-start justify-between text-left gap-2"
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
                              <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
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
                    )}

                    {/* Vídeos */}
                    {st.videos.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-red-500/15' : 'bg-red-50'}`}>
                            <Play className={`w-4 h-4 ${isNightMode ? 'text-red-400' : 'text-red-500'}`} />
                          </div>
                          <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                            Vídeos
                          </h4>
                        </div>
                        <div className="space-y-3">
                          {st.videos.map(video => (
                            <YouTubeEmbed
                              key={video.id}
                              videoId={video.youtube_id}
                              title={video.title}
                              channel={video.channel}
                              duration={video.duration}
                              dayNumber={modNum}
                              isNightMode={isNightMode}
                              onComplete={() => {
                                setDayStates(prev => {
                                  const next = {
                                    ...prev,
                                    [modNum]: {
                                      ...prev[modNum],
                                      videos: prev[modNum].videos.map(v =>
                                        v.id === video.id ? { ...v, watched: true } : v
                                      ),
                                    },
                                  };
                                  syncProgress(modNum, next[modNum]);
                                  return next;
                                });
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Checklist */}
                    {st.checklist.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-green-500/15' : 'bg-green-50'}`}>
                            <ListChecks className={`w-4 h-4 ${isNightMode ? 'text-green-400' : 'text-green-500'}`} />
                          </div>
                          <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                            Checklist do Módulo
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {st.checklist.map(item => (
                            <button
                              key={item.id}
                              onClick={() => toggleChecklistItem(modNum, item.id)}
                              className={`w-full p-3.5 rounded-xl flex items-center gap-3 transition-all ${
                                item.checked
                                  ? 'bg-green-500/10 border-2 border-green-500/30'
                                  : isNightMode
                                    ? 'bg-gray-700/50 border-2 border-gray-600/30 active:border-coral-500/30'
                                    : 'bg-gray-50 border-2 border-gray-200/80 active:border-coral-300'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
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
                    )}

                    {/* Diário */}
                    {st.diary_question && (
                      <div className={`p-4 rounded-xl ${isNightMode ? 'bg-coral-500/10 border border-coral-500/20' : 'bg-gradient-to-br from-coral-50 to-coral-100/50 border border-coral-100'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-coral-500/20' : 'bg-coral-200/50'}`}>
                            <PenLine className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                          </div>
                          <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                            Reflexão do Módulo
                          </h4>
                        </div>
                        
                        {modNum === 13 && (
                           <div className={`p-3 rounded-lg mb-3 border ${isNightMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                             <p className={`text-xs ${isNightMode ? 'text-blue-300' : 'text-blue-700'}`}>
                               Se estás a sentir-te muito em baixo, fala com alguém: Linha SOS Voz Amiga (em Moz: pesquisar contacto local) ou o teu médico de família.
                             </p>
                           </div>
                        )}
                        
                        <p className={`text-sm mb-3 italic leading-relaxed ${isNightMode ? 'text-coral-300/80' : 'text-coral-600/80'}`}>
                          "{st.diary_question}"
                        </p>
                        
                        <div className="flex justify-between items-center mb-3">
                          {['😭', '😫', '😐', '🙂', '😍'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => setDiaryInputs(prev => ({ ...prev, [modNum]: (prev[modNum] ? prev[modNum] + ' ' : '') + emoji }))}
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
                          value={diaryInputs[modNum] || ''}
                          onChange={(e) => setDiaryInputs(prev => ({ ...prev, [modNum]: e.target.value }))}
                        />
                        <button 
                          onClick={() => handleSaveDiary(modNum)}
                          className={`mt-2 w-full py-2.5 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                            diarySaved[modNum]
                              ? 'bg-green-500'
                              : 'bg-gradient-to-r from-coral-400 to-coral-500'
                          }`}
                        >
                          {diarySaved[modNum] ? '✓ Guardado!' : '💾 Guardar'}
                        </button>
                      </div>
                    )}

                    {/* Pílula */}
                    {st.pilula.content && (
                      <div className={`p-4 rounded-xl ${isNightMode ? 'bg-warm-400/10 border border-warm-400/20' : 'bg-gradient-to-br from-warm-50 to-warm-100/50 border border-warm-200/50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-warm-400/20' : 'bg-warm-200/50'}`}>
                            <Lightbulb className={`w-4 h-4 ${isNightMode ? 'text-warm-400' : 'text-warm-500'}`} />
                          </div>
                          <h4 className={`font-bold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                            {st.pilula.title}
                          </h4>
                        </div>
                        <p className={`text-sm leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {st.pilula.content}
                        </p>
                        {!st.pilula.viewed && (
                          <button
                            onClick={() => markPilulaViewed(modNum)}
                            className={`mt-2 text-xs px-3 py-1.5 rounded-full font-medium ${isNightMode ? 'bg-warm-400/20 text-warm-300' : 'bg-warm-200/50 text-warm-600'}`}
                          >
                            💡 Marcar como visto
                          </button>
                        )}
                      </div>
                    )}

                    {/* Complete Day Button */}
                    <button
                      onClick={() => handleCompleteDay(modNum)}
                      disabled={!isDayFullyProgressed(modNum)}
                      className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
                        isDayFullyProgressed(modNum)
                          ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg glow-green active:scale-[0.97]'
                          : isNightMode
                            ? 'bg-gray-700/50 text-gray-500 border border-gray-600/30'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isDayFullyProgressed(modNum)
                        ? `✓ Concluí o Módulo ${modNum}`
                        : 'Lê pelo menos um texto ou vídeo'}
                    </button>

                    {modNum === 7 && isDayFullyProgressed(7) && (
                      <div className={`p-4 rounded-xl mt-2 text-center ${isNightMode ? 'bg-gradient-to-r from-coral-500/20 to-coral-600/10 border border-coral-500/20' : 'bg-gradient-to-r from-coral-50 to-coral-100 border border-coral-200'}`}>
                        <span className="text-2xl">🎉</span>
                        <p className={`text-sm font-semibold mt-1 ${isNightMode ? 'text-coral-300' : 'text-coral-600'}`}>
                          Parabéns! Completaste os 7 módulos principais.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          });
        };

        return (
          <div className="px-4 py-4 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`h-px flex-1 ${isNightMode ? 'bg-gray-700' : 'bg-coral-200'}`}></div>
                <span className={`text-xs font-bold tracking-widest uppercase ${isNightMode ? 'text-gray-400' : 'text-coral-600'}`}>
                  MÓDULOS CORE
                </span>
                <div className={`h-px flex-1 ${isNightMode ? 'bg-gray-700' : 'bg-coral-200'}`}></div>
              </div>
              
              {renderModules([1,2,3,4,5,6,7])}
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`h-px flex-1 ${isNightMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <span className={`text-xs font-bold tracking-widest uppercase ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  APROFUNDAR MAIS (opcional)
                </span>
                <div className={`h-px flex-1 ${isNightMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              </div>
              
              <div className={`text-center mb-4 px-4 py-3 rounded-xl text-[13px] ${isNightMode ? 'bg-gray-800/50 text-gray-400 border border-gray-700' : 'bg-white/50 text-gray-500 border border-gray-200'}`}>
                Tens dúvidas em situações específicas? Estes módulos são para quando elas surgirem. Não são obrigatórios — usa só os que fizerem sentido para ti.
              </div>

              {renderModules([8,9,10,11,12,13,14])}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
