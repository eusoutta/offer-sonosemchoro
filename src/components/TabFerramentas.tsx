import { useState } from 'react';
import {
  Calculator, Headphones, BookOpen, Baby, MessageSquare, AlertTriangle,
  FileText, Eye, Copy, Check, Search, ChevronDown, ChevronUp, X, ExternalLink
} from 'lucide-react';
import { GLOSSARY, SLEEP_SIGNS, AUDIO_LIBRARY } from '../lib/types';
import { FAMILY_MESSAGES, SOS_CONTENT, LIBRARY_ARTICLES_FULL } from '../lib/content';
import { useVibrate } from '../hooks/useVibrate';
import { SleepCalculator } from './SleepCalculator';

interface TabFerramentasProps {
  isNightMode: boolean;
  babyAgeRange?: '0-6m' | '7-12m' | '13-24m' | '2+';
}

type ToolId = 'calculadora' | 'glossario' | 'sinais' | 'biblioteca';

export function TabFerramentas({ isNightMode, babyAgeRange }: TabFerramentasProps) {
  const { vibrate } = useVibrate();
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGlossary, setExpandedGlossary] = useState<string | null>(null);
  const [sosContent, setSosContent] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const tools: { id: ToolId; title: string; subtitle: string; icon: typeof Calculator; color: string; bgColor: string }[] = [
    { id: 'calculadora', title: 'Calculadora', subtitle: 'Janelas de Sono', icon: Calculator, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'glossario', title: 'Glossário', subtitle: '16 termos', icon: BookOpen, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { id: 'sinais', title: 'Sinais', subtitle: 'Sono do Bebé', icon: Baby, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { id: 'biblioteca', title: 'Biblioteca', subtitle: '8 artigos', icon: FileText, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ];

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    vibrate(50);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredGlossary = GLOSSARY.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className={`min-h-screen ${isNightMode ? 'bg-gradient-night' : 'bg-gradient-warm'} pb-24`}>
      <header className={`sticky top-0 z-10 px-5 py-4 ${isNightMode ? 'glass-dark border-b border-white/5' : 'glass border-b border-coral-100/50'}`}>
        <h1 className={`font-extrabold text-lg tracking-tight ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
          🛠️ Ferramentas
        </h1>
        <p className={`text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Sempre disponíveis, qualquer dia
        </p>
      </header>

      {activeTool === null ? (
        <div className="px-4 py-4 grid grid-cols-2 gap-3">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => { vibrate(30); setActiveTool(tool.id); }}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2.5 transition-all active:scale-95 ${
                isNightMode
                  ? 'bg-gray-800/60 border border-gray-700/30'
                  : 'bg-white/90 border border-gray-100'
              } shadow-sm`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.bgColor}`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <div className="text-center">
                <span className={`font-semibold text-sm block ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  {tool.title}
                </span>
                <span className={`text-[10px] ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {tool.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-4">
          <button
            onClick={() => { vibrate(30); setActiveTool(null); setExpandedArticle(null); }}
            className={`mb-4 flex items-center gap-2 text-sm font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            ← Voltar
          </button>

          {activeTool === 'calculadora' && (
            <SleepCalculator isNightMode={isNightMode} babyAgeRange={babyAgeRange} />
          )}



          {activeTool === 'glossario' && (
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800/60 border border-gray-700/30' : 'bg-white/90 border border-gray-100'} shadow-premium`}>
              <h3 className={`font-bold text-lg mb-4 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                📖 Glossário
              </h3>
              <div className="relative mb-4">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Procurar termo..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${
                    isNightMode
                      ? 'bg-gray-700/50 text-white placeholder-gray-500 border border-gray-600/30'
                      : 'bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-100'
                  }`}
                />
              </div>
              <div className="space-y-2">
                {filteredGlossary.map(term => (
                  <div key={term.term} className={`rounded-xl overflow-hidden ${isNightMode ? 'bg-gray-700/50 border border-gray-600/30' : 'bg-gray-50 border border-gray-100'}`}>
                    <button
                      onClick={() => setExpandedGlossary(expandedGlossary === term.term ? null : term.term)}
                      className="w-full p-3.5 flex items-center justify-between"
                    >
                      <span className={`font-semibold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        {term.term}
                      </span>
                      {expandedGlossary === term.term ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedGlossary === term.term && (
                      <div className="px-3.5 pb-3.5 animate-fade-in">
                        <p className={`text-sm leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {term.definition}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'sinais' && (
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800/60 border border-gray-700/30' : 'bg-white/90 border border-gray-100'} shadow-premium`}>
              <h3 className={`font-bold text-lg mb-2 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                👶 Sinais de Sono do Bebé
              </h3>
              <p className={`text-sm mb-4 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Estes sinais aparecem 5-10 min antes da janela de sono. Aproveita para começar o ritual.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SLEEP_SIGNS.map(sign => (
                  <div
                    key={sign.id}
                    className={`p-4 rounded-xl text-center ${isNightMode ? 'bg-gray-700/50 border border-gray-600/30' : 'bg-gray-50 border border-gray-100'}`}
                  >
                    <Eye className={`w-7 h-7 mx-auto mb-2 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                    <p className={`font-semibold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                      {sign.name}
                    </p>
                    <p className={`text-xs mt-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {sign.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}



          {activeTool === 'biblioteca' && (
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800/60 border border-gray-700/30' : 'bg-white/90 border border-gray-100'} shadow-premium`}>
              <h3 className={`font-bold text-lg mb-2 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                📚 Biblioteca de Leitura
              </h3>
              <p className={`text-xs mb-4 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Artigos sobre temas comuns. Toca para abrir.
              </p>
              <div className="space-y-2">
                {LIBRARY_ARTICLES_FULL.map(article => (
                  <div key={article.id} className={`rounded-xl overflow-hidden ${isNightMode ? 'bg-gray-700/50 border border-gray-600/30' : 'bg-gray-50 border border-gray-100'}`}>
                    <button
                      onClick={() => {
                        vibrate(20);
                        setExpandedArticle(expandedArticle === article.id ? null : article.id);
                      }}
                      className="w-full p-4 flex items-center justify-between"
                    >
                      <div className="text-left">
                        <span className={`font-semibold text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                          {article.title}
                        </span>
                        <span className={`block text-xs mt-0.5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ⏱ {article.readTime}
                        </span>
                      </div>
                      {expandedArticle === article.id
                        ? <ChevronUp className="w-4 h-4 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      }
                    </button>
                    {expandedArticle === article.id && (
                      <div className="px-4 pb-4 animate-fade-in">
                        <p className={`text-sm leading-relaxed whitespace-pre-line content-text ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {article.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
