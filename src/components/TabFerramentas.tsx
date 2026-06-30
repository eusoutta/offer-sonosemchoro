import { useState } from 'react';
import {
  Calculator, Headphones, BookOpen, Baby, MessageSquare, AlertTriangle,
  FileText, Eye, Ear, Heart, Copy, Check, Search, ChevronDown, ChevronUp, X
} from 'lucide-react';
import { GLOSSARY, SLEEP_SIGNS, AUDIO_LIBRARY, type GlossaryTerm } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';
import { SleepCalculator } from './SleepCalculator';

interface TabFerramentasProps {
  isNightMode: boolean;
  babyAgeRange?: '0-6m' | '7-12m' | '13-24m' | '2+';
}

type ToolId = 'calculadora' | 'audios' | 'glossario' | 'sinais' | 'mensagens' | 'sos' | 'biblioteca';

const MESSAGE_TEMPLATES = [
  { id: 'm1', title: 'Para o pai/companheiro', content: '[TEMPLATE — Explicar o método ao pai de forma simples e inviting]' },
  { id: 'm2', title: 'Para a avó', content: '[TEMPLATE — Responder a "no meu tempo era assim, deixava chorar"]' },
  { id: 'm3', title: 'Para a sogra', content: '[TEMPLATE — Responder a "deixa-o chorar, depois passa"]' },
  { id: 'm4', title: 'Para a vizinha', content: '[TEMPLATE — Responder a curiosidade sem dar muitos detalhes]' },
  { id: 'm5', title: 'Para o grupo de família', content: '[TEMPLATE — Anunciar que estão a seguir o método, pedir apoio]' },
  { id: 'm6', title: 'Cancelar visita', content: '[TEMPLATE — "Hoje precisamos de calma, melhor não receber visitas"]' },
  { id: 'm7', title: 'Pedir ajuda', content: '[TEMPLATE — Pedir ajuda específica ao companheiro]' },
];

const SOS_OPTIONS = [
  { id: 's1', title: 'O bebé não para de chorar há mais de 20 min', content: '[TÉCNICA DE EMERGÊNCIA 1]\n\n1. Verifica se está confortável (fralda, temperatura)\n2. Tenta a técnica do "holding" — embrulha e balança suavemente\n3. Som branco próximo\n4. Se não melhorar em 10 min, pode ser dor — liga ao pediatra' },
  { id: 's2', title: 'Eu estou no meu limite', content: '[TÉCNICA DE EMERGÊNCIA 2]\n\n1. Coloca o bebé num lugar seguro (berço)\n2. Sai do quarto 2-3 minutos\n3. Respira fundo 5 vezes\n4. Bebe água\n5. Liga a alguém para falar\n\nNÃO É FALHA. É NORMAL.' },
  { id: 's3', title: 'Algo parece errado fisicamente', content: '[TÉCNICA DE EMERGÊNCIA 3]\n\nSINAIS DE ALARME:\n• Febre > 38.5°C\n• Respiração rápida/difícil\n• Rejeição total de comida por >8h\n• Vómitos frequentes\n• Movimento ou cor anormal\n\n→ LIGA AO PEDIATRA AGORA' },
];

const LIBRARY_ARTICLES = [
  { id: 'a1', title: 'Cólicas e sono', readTime: '5 min' },
  { id: 'a2', title: 'Dentinhos e despertares', readTime: '4 min' },
  { id: 'a3', title: 'Regressão dos 4 meses', readTime: '6 min' },
  { id: 'a4', title: 'Regressão dos 8 meses', readTime: '5 min' },
  { id: 'a5', title: 'Regressão dos 12 meses', readTime: '5 min' },
  { id: 'a6', title: 'Sono em viagem', readTime: '4 min' },
  { id: 'a7', title: 'Bebé doente — quando pausar', readTime: '3 min' },
  { id: 'a8', title: 'Mãe que trabalha fora', readTime: '5 min' },
  { id: 'a9', title: 'Alimentação sólida e sono', readTime: '4 min' },
  { id: 'a10', title: 'Co-sleeping seguro', readTime: '5 min' },
  { id: 'a11', title: 'Quando o pai não ajuda', readTime: '6 min' },
  { id: 'a12', title: 'O luto pelas noites de antes', readTime: '4 min' },
];

export function TabFerramentas({ isNightMode, babyAgeRange }: TabFerramentasProps) {
  const { vibrate } = useVibrate();
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGlossary, setExpandedGlossary] = useState<string | null>(null);
  const [sosContent, setSosContent] = useState<string | null>(null);

  const tools: { id: ToolId; title: string; icon: typeof Calculator; color: string }[] = [
    { id: 'calculadora', title: 'Calculadora de Janelas', icon: Calculator, color: 'text-blue-500' },
    { id: 'audios', title: 'Biblioteca de Áudios', icon: Headphones, color: 'text-purple-500' },
    { id: 'glossario', title: 'Glossário', icon: BookOpen, color: 'text-green-500' },
    { id: 'sinais', title: 'Sinais de Sono', icon: Baby, color: 'text-yellow-500' },
    { id: 'mensagens', title: 'Mensagens Prontas', icon: MessageSquare, color: 'text-pink-500' },
    { id: 'sos', title: 'Modo SOS', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'biblioteca', title: 'Biblioteca de Leitura', icon: FileText, color: 'text-orange-500' },
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

  if (activeTool === 'sos' && sosContent) {
    return (
      <div className="fixed inset-0 z-50 bg-black p-6">
        <button
          onClick={() => { vibrate(30); setSosContent(null); }}
          className="absolute top-4 right-4 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center h-full">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {SOS_OPTIONS.find(s => s.id === sosContent)?.title}
          </h2>
          <div className="bg-gray-900 rounded-xl p-6 w-full">
            <p className="text-white text-base leading-relaxed whitespace-pre-line">
              {SOS_OPTIONS.find(s => s.id === sosContent)?.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isNightMode ? 'bg-gray-900' : 'bg-cream'} pb-24`}>
      <header className={`px-4 py-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <h1 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
          Ferramentas
        </h1>
        <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Sempre disponíveis, qualquer dia
        </p>
      </header>

      {activeTool === null ? (
        <div className="px-4 py-4 grid grid-cols-2 gap-3">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => { vibrate(30); setActiveTool(tool.id); }}
              className={`p-5 rounded-2xl flex flex-col items-center gap-3 ${
                tool.id === 'sos'
                  ? 'bg-red-500/20 border-2 border-red-500'
                  : isNightMode
                    ? 'bg-gray-800'
                    : 'bg-white'
              } shadow-sm`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                tool.id === 'sos'
                  ? 'bg-red-500/30'
                  : isNightMode
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
              }`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <span className={`font-medium text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                {tool.title}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-4">
          <button
            onClick={() => { vibrate(30); setActiveTool(null); }}
            className={`mb-4 flex items-center gap-2 text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            ← Voltar às ferramentas
          </button>

          {activeTool === 'calculadora' && (
            <SleepCalculator isNightMode={isNightMode} babyAgeRange={babyAgeRange} />
          )}

          {activeTool === 'audios' && (
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`font-bold text-lg mb-4 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                Biblioteca de Áudios
              </h3>
              <div className="space-y-3">
                {AUDIO_LIBRARY.map(audio => (
                  <div
                    key={audio.id}
                    className={`p-4 rounded-xl flex items-center gap-4 ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <button className="w-12 h-12 rounded-full bg-coral-400 flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-white" />
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        {audio.title}
                      </p>
                      <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {Math.floor(audio.duration_seconds / 60)} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'glossario' && (
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                <h3 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Glossário
                </h3>
              </div>
              <div className="relative mb-4">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Procurar termo..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${
                    isNightMode
                      ? 'bg-gray-700 text-white placeholder-gray-500'
                      : 'bg-gray-100 text-gray-800 placeholder-gray-400'
                  }`}
                />
              </div>
              <div className="space-y-2">
                {filteredGlossary.map(term => (
                  <div key={term.term} className={`rounded-lg ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <button
                      onClick={() => setExpandedGlossary(expandedGlossary === term.term ? null : term.term)}
                      className="w-full p-3 flex items-center justify-between"
                    >
                      <span className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        {term.term}
                      </span>
                      {expandedGlossary === term.term ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedGlossary === term.term && (
                      <div className="px-3 pb-3 animate-fade-in">
                        <p className={`text-sm ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <Baby className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                <h3 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Sinais de Sono do Bebé
                </h3>
              </div>
              <p className={`text-sm mb-4 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Estes sinais aparecem 5-10 min antes da janela de sono.
                Aproveita para começar o ritual.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SLEEP_SIGNS.map(sign => (
                  <div
                    key={sign.id}
                    className={`p-4 rounded-xl text-center ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <Eye className={`w-8 h-8 mx-auto mb-2 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                    <p className={`font-medium text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
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

          {activeTool === 'mensagens' && (
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                <h3 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Mensagens para a Família
                </h3>
              </div>
              <div className="space-y-3">
                {MESSAGE_TEMPLATES.map(msg => (
                  <div key={msg.id} className={`p-4 rounded-xl ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                        {msg.title}
                      </p>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          copiedId === msg.id
                            ? 'bg-green-500 text-white'
                            : 'bg-coral-400 text-white'
                        }`}
                      >
                        {copiedId === msg.id ? (
                          <><Check className="w-3 h-3 inline mr-1" /> Copiado</>
                        ) : (
                          <><Copy className="w-3 h-3 inline mr-1" /> Copiar</>
                        )}
                      </button>
                    </div>
                    <p className={`text-sm ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'sos' && (
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-2 border-red-500`}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Modo SOS — Preciso de Ajuda Agora
                </h3>
              </div>
              <div className="space-y-3">
                {SOS_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { vibrate(100); setSosContent(opt.id); }}
                    className="w-full p-4 rounded-xl bg-red-500 text-white font-medium text-left"
                  >
                    {opt.title}
                  </button>
                ))}
              </div>
              <p className={`text-xs mt-4 text-center ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Se houver emergência médica real, liga 117 ou dirige-te à urgência.
              </p>
            </div>
          )}

          {activeTool === 'biblioteca' && (
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                <h3 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Biblioteca de Leitura Extra
                </h3>
              </div>
              <div className="space-y-2">
                {LIBRARY_ARTICLES.map(article => (
                  <button
                    key={article.id}
                    className={`w-full p-4 rounded-xl flex items-center justify-between ${
                      isNightMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                      {article.title}
                    </span>
                    <span className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {article.readTime}
                    </span>
                  </button>
                ))}
              </div>
              <p className={`text-xs mt-4 italic ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                [PLACEHOLDER — Cada artigo terá 400-700 palavras]
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
