import { useState, useMemo } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useVibrate } from '../hooks/useVibrate';

interface FAQProps {
  onBack: () => void;
  isNightMode: boolean;
}

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  important?: boolean;
}

const FAQ_DATA: FAQItem[] = [
  // ========== ANTES DE COMECAR ==========
  { id: '1', category: 'antes', question: 'O meu bebe tem 2 meses, posso usar o metodo?', answer: 'Sim! Dos 2 aos 6 meses e a fase ideal. O cerebro do bebe esta a formar padroes de sono, e e mais facil criar novos habitos. Ate os 4 meses, o metodo funciona muito rapido.', tags: ['idade', 'meses', '2 meses', 'recem-nascido', 'novo'] },
  { id: '2', category: 'antes', question: 'O meu bebe tem 3 meses, isso e muito cedo?', answer: 'Nao e cedo demais. Aos 3 meses, o bebe ja consegue aprender a adormecer sem ajuda. Quanto mais cedo comecares, mais rapido sera o resultado. Muitas mae comecam aos 3 meses com sucesso.', tags: ['idade', '3 meses', 'muito cedo', 'idade ideal'] },
  { id: '3', category: 'antes', question: 'O meu bebe tem 8 meses, ainda funciona?', answer: 'Sim, funciona em qualquer idade ate os 3 anos. A partir dos 6 meses pode levar um pouco mais tempo, mas o metodo continua eficaz. A chave e consistencia.', tags: ['idade', '8 meses', 'mais velho', 'funciona'] },
  { id: '4', category: 'antes', question: 'Meu bebe tem 18 meses, funciona para criancas maiores?', answer: 'Sim! Para criancas de 1-3 anos, o metodo funciona mas precisa de adaptacoes. Nesta idade, explicacao verbal ajuda: "Vou ficar aqui contigo, mas nao vou pegar-te." A crianca entende mais do que imaginamos.', tags: ['idade', '18 meses', '1 ano', 'todler', 'grande'] },
  { id: '5', category: 'antes', question: 'Quanto tempo demora ate ver resultados?', answer: 'A maioria das mae ve melhoria significativa nos primeiros 3-5 dias. O objetivo de 7 dias e para consolidar o habito. Algumas mae relatam mudancas desde a primeira noite; outras precisam de 5-7 dias para ver o progresso pleno.', tags: ['tempo', 'duracao', 'dias', 'resultados', 'quando'] },
  { id: '6', category: 'antes', question: 'E se eu desistir a meio do processo?', answer: 'Podes pausar quando precisares. Cada noite que praticas cria progresso. Nao ha desperdicio. Se precisares de parar por doenca, viagem ou cansaco, retoma quando puderes. O bebe nao "desaprende" o que ja aprendeu.', tags: ['desistir', 'pausar', 'voltar', 'parar', 'interromper'] },
  { id: '7', category: 'antes', question: 'Posso continuar a amamentar durante o dia?', answer: 'Absolutamente sim! O metodo nao afeta as mamadas diurnas. Amamenta normalmente durante o dia. O que estamos a separar e a associacao entre "mamar" e "adormecer" - isso ja nao. A mama continua, mas o bebe aprende a adormecer de outra forma.', tags: ['amamentar', 'dia', 'mama', 'leite', 'peito'] },
  { id: '8', category: 'antes', question: 'Como sei se o meu bebe tem uma associacao de sono?', answer: 'Se o teu bebe so adormece quando: mama, e embalado ao colo, tem chupeta, ou vai no carrinho, entao tem uma associacao de sono. Isso significa que ele NAO sabe adormecer sozinho - precisa desse gatilho externo. O metodo quebra essa associacao.', tags: ['associacao', 'habito', 'como sei', 'identificar', 'diagnostico'] },
  { id: '9', category: 'antes', question: 'O que vou precisar para comecar?', answer: 'Apenas o teu telemovel com este app. O metodo nao precisa de equipamento especial. Se tiveres um copo de aprendizagem para o Passo 4 (agua), ajuda. Mas o essencial e so tu e o teu bebe.', tags: ['preparar', 'preciso', 'material', 'equipamento'] },
  { id: '10', category: 'antes', question: 'Devo comecar numa noite particular?', answer: 'Nao ha dia "perfeito" para comecar. O melhor dia e HOJE. No entanto, evita comecar se: tens viagem marcada para amanha, o bebe esta doente, ou tens uma semana muito estressante a frente. Fora isso, comeca.', tags: ['quando', 'dia', 'noite', 'comecar', 'melhor altura'] },

  // ========== DURANTE A NOITE ==========
  { id: '11', category: 'durante', question: 'Esta e a Noite 2 e parece PIOR - e normal?', answer: 'SIM! E completamente normal. Os dias 2-4 sao frequentemente os mais dificeis. O bebe esta a "protestar" a mudanca - ele sabe que algo mudou e esta a testar limites. Isto e chamado "extincao burst". Mantem firme: significa que o metodo esta a funcionar.', tags: ['pior', 'noite 2', 'dia 2', 'regrediu', 'extincao', 'piorar'], important: true },
  { id: '12', category: 'durante', question: 'Ele chora muito tempo - e seguro?', answer: 'NUNCA deixamos o bebe chorar sozinho. Este metodo e diferente: estas SEMPRE presente, mae no peito, voz baixa, presente fisica. O bebe chora porque esta frustrado, nao abandonado. Presenca ativa NAO e abandonio. E uma diferenca fundamental.', tags: ['chorar', 'choro', 'seguro', 'abandono', 'presenca'], important: true },
  { id: '13', category: 'durante', question: 'O que faco se ele adormecer sozinho na pausa de 30 segundos?', answer: 'Excelente! Isso e exactamente o objectivo do Passo 1! Regista como "resolvido no passo 1" no app, e volta a dormir. O teu bebe acabou de aprender que consegue adormecer sozinho.', tags: ['adormeceu', 'sozinho', 'passo 1', 'pausa', 'conseguiu'] },
  { id: '14', category: 'durante', question: 'Posso repetir os passos varias vezes na mesma noite?', answer: 'Sim, absolutamente! Cada despertar e uma nova oportunidade. Segue sempre a sequencia: Pausa 30s -> Presenca -> Embalo -> Agua -> Mama. Nao saltes passos. Se ele acordar 5 vezes numa noite, faz a sequencia 5 vezes.', tags: ['repetir', 'varias vezes', 'mesma noite', 'quantas'] },
  { id: '15', category: 'durante', question: 'Ele so para de chorar se eu pegar ao colo - o que faco?', answer: 'Isto e muito comum. Resististe a pegar ao colo. Tenta o Passo 3 (embalo sem colo) por 2-3 minutos antes de desistir. Se realmente nao funcionar apos tentativas consistentes, usa o Passo 5 (mama consciente) como ultimo recurso.', tags: ['colo', 'pegar', 'resistir', 'so para', 'bracos'] },
  { id: '16', category: 'durante', question: 'O pai pode fazer o metodo tambem?', answer: 'SIM! E EXCELENTE que o pai/participante pratique tambem. Isto ajuda o bebe a nao depender apenas da mama para adormecer. Inclusao: pai, ama, irmao mais velho - qualquer cuidador pode seguir a sequencia.', tags: ['pai', 'participante', 'marido', 'familia', 'ajuda'] },
  { id: '17', category: 'durante', question: 'Quantos minutos devo esperar em cada passo antes de avancar?', answer: 'Passo 1: exatamente 30 segundos. Passo 2: ate 2 minutos, ou ate acalmar. Passo 3: 2 minutos de embalo. Passo 4: 30 segundos de oferta. Passo 5: mama curta, 5-10 minutos maximo. Nao prolongues os passos.', tags: ['tempo', 'minutos', 'quanto tempo', 'esperar'] },
  { id: '18', category: 'durante', question: 'Ele acorda de 15 em 15 minutos - e normal?', answer: 'Nas primeiras noites, sim. O bebe esta a testar os novos limites. Mantem a sequencia em CADA despertar. Com o tempo, os intervalos vao aumentando. E importante NAO desistir quando os despertares sao frequentes.', tags: ['frequente', '15 minutos', 'horas', 'muitas vezes'] },
  { id: '19', category: 'durante', question: 'A que horas devo comecar a aplicar o metodo?', answer: 'Aplica o metodo em TODOS os despertares noturnos, desde que o bebe dorme ate de manha. Se ele acorda as 22h, 1h, 4h - aplica em todos. Nao ha "horario especial". A noite inteira conta.', tags: ['horas', 'quando', 'que horas', 'noite'] },
  { id: '20', category: 'durante', question: 'E se ele estiver a fazer sonecas de dia tambem?', answer: 'O metodo e para sono NOTURNO. Sonecas de dia podes manter como estao, ou aplicar uma versao mais leve. Prioriza a noite primeiro. Quando o sono noturno estiver estavel, podes trabalhar nas sonecas.', tags: ['sonecas', 'dia', 'naps', 'naper'] },

  // ========== PROBLEMAS COMUNS ==========
  { id: '21', category: 'problemas', question: 'Estamos a viajar este fim de semana - como adapto?', answer: 'Mantem a rotina de deitar o mais possivel. Leva o cobertor ou fralda favorita, mantem o ritual pre-sono. Ambiente novo mas habitos antigos. Se possivel, leva o teu telemovel com o app para continuar a registar.', tags: ['viagem', 'viajar', 'fora de casa', 'ferias', 'hotel'] },
  { id: '22', category: 'problemas', question: 'Funciona se ele tiver dentes a nascer?', answer: 'Sim, mas pode haver mais desconforto. Dentes a nascer causam dor, mas nao invalidam o metodo. Se houver MUITA dor ou febre, pausa ate passar. Caso contrario, continua. Podes dar analgesico conforme indicacao do pediatra.', tags: ['dentes', 'nascimento', 'dor', 'dentiacao'] },
  { id: '23', category: 'problemas', question: 'O meu marido/companheiro nao concorda - o que faco?', answer: 'Conversa sobre o metodo JUNTOS. Mostra-lhe o app, explica que NAO e "deixar chorar". Presenca ativa significa estar la, mae no peito, voz baixa - NAO abandono. Se ele continuar relutante, pede que experimente por 2-3 noites antes de julgar.', tags: ['marido', 'companheiro', 'familia', 'apoio', 'discordo'] },
  { id: '24', category: 'problemas', question: 'Ele partilha o quarto com irmaos - como fazer?', answer: 'Explica aos irmaos que o bebe esta a aprender a dormir sozinho. Nas primeiras noites, o bebe vai chorar mais. Podes ter os irmaos noutro quarto temporariamente, ou usar tampoes de ouvido neles. Depois de 3-5 noites, o choro diminui drasticamente.', tags: ['irmaos', 'quarto', 'partilhado', 'familia'] },
  { id: '25', category: 'problemas', question: 'O bebe esta a fazer a transicao de 2 para 1 soneca - devo esperar?', answer: 'Podes comecar mesmo durante transicoes. O metodo ajuda a regular o sono em todas as fases. Não esperes pelo "momento perfeito" - ele pode nao existir. Comeca e adapta conforme necessario.', tags: ['sonecas', 'transicao', 'esperar', 'mudanca'] },
  { id: '26', category: 'problemas', question: 'E se eu estiver tao cansada que nao aguento?', answer: 'E NORMAL sentir-se exausta. Pede ajuda ao pai/familia para分担 algumas noites. Usa o app para te guiar - ele tira a decisao da tua cabeca. O cansaco e real, mas lembra: 7 dias de esforco agora = meses de sono depois.', tags: ['cansaco', 'exaustao', 'ajuda', 'desistir'] },
  { id: '27', category: 'problemas', question: 'O bebe so dorme com chupeta - o metodo funciona?', answer: 'Sim! A chupeta e uma associacao de sono como qualquer outra. O metodo ajuda-o a aprender a adormecer SEM a chupeta. Durante a noite, quando ele a perde, ao inves de a repos, segues a sequencia de passos.', tags: ['chupeta', 'binky', 'soqueta', 'objeto'] },
  { id: '28', category: 'problemas', question: 'E se ele vomitar de tanto chorar?', answer: 'Alguns bebes vomitam quando choram muito. Isto e desagradavel mas nao e perigoso. Limpa com calma, troca se precisares, e CONTINUA. Se isso acontecer, e sinal de que esta mesmo frustrado - mas manter os limites e importante.', tags: ['vomitar', 'vomito', 'engasgar'], important: true },

  // ========== SAUDE DO BEBE ==========
  { id: '29', category: 'saude', question: 'O meu bebe esta com febre - devo continuar o metodo?', answer: 'NAO. Quando ha febre ou doenca, PAUSA o metodo. Volta ao que da conforto: colo, mama o que ele precisar. Retoma o metodo quando ele estiver saudavel novamente. Doenca tem prioridade.', tags: ['febre', 'doenca', 'saude', 'pausar'], important: true },
  { id: '30', category: 'saude', question: 'Quando devo consultar um pediatra?', answer: 'Se houver: febre persistente (mais de 38.5C), perda de peso, recusa total de alimentar, vomitos frequentes, ou comportamento fora do normal. CONFIA NO TEU INSTINTO. Se algo parece errado, consulta.', tags: ['pediatra', 'medico', 'consulta', 'quando', 'urgente'], important: true },
  { id: '31', category: 'saude', question: 'Ele tem refluxo/azia - o metodo ainda funciona?', answer: 'Sim, mas precisa de adaptacoes. Mantem o bebe em posicao elevada 20-30 min apos mamar. Posiciona o colchao inclinado. Consulta o teu pediatra sobre manejo do refluxo. O metodo pode ate melhorar o sono com refluxo.', tags: ['refluxo', 'azia', 'gastro', 'saude'] },
  { id: '32', category: 'saude', question: 'Esta a tomar medicamento - posso continuar?', answer: 'Sim, se o medicamento nao e para o fazer dormir. Antibioticos, paracetamol, etc. nao interferem. Continua o metodo normalmente. Se o medicamento for sedativo, fala com o pediatra.', tags: ['medicamento', 'remedio', 'farmaco', 'saude'] },
  { id: '33', category: 'saude', question: 'O bebe nasceu prematuro - quantos meses preciso de considerar?', answer: 'Para premature, considera a "idade corrigida". Se nasceu 2 meses antes, e tem 4 meses de vida, a idade corrigida e 2 meses. COM SOB ORIENTACAO DO PEDIATRA, o metodo pode ser adaptado para premature.', tags: ['prematuro', 'premie', 'idade corrigida', 'saude'] },
  { id: '34', category: 'saude', question: 'Como sei se e fome ou habito?', answer: 'Se o bebe: come bem durante o dia, ganha peso adequado,tem fraldas molhadas normais, entao os despertares noturnos sao habitualmente HABITO, nao fome. A partir dos 6 meses, especialmente, os despertares raramente sao por fome real.', tags: ['fome', 'habito', 'associacao', 'diferenca'] },

  // ========== FAMILIA E APOIO ==========
  { id: '35', category: 'familia', question: 'Os irmaos mais velhos estao a acordar tambem - como lidar?', answer: 'Explica que o bebe esta a aprender a dormir. E normal nas primeiras noites ter mais choro. Opcoes: tampoes de ouvido nos irmaos, som ambiente (ventilador, musica) nos quartos, ou quartos separados temporariamente. Depois de 3-5 noites, melhora muito.', tags: ['irmaos', 'familia', 'acordar', 'chatear'] },
  { id: '36', category: 'familia', question: 'Como explicar a avo que NAO e "deixar chorar"?', answer: 'Mostra-lhe o app! Explica: "Eu ESTOU la, com a mao no peito dele, a falar baixinho. NAO estou a deixar chorar sozinho." Presenca ativa e muito diferente de abandono. Avos normalmente preocupam-se porque AMAM - explica com amor.', tags: ['avo', 'familia', 'explicar', 'abandono'] },
  { id: '37', category: 'familia', question: 'Tenho gemeos - como fazer?', answer: 'Gemeos sao mais desafiadores, mas o metodo funciona! Tenta: trabalhar num de cada vez, pedir ajuda ao parceiro, sincronizar o maximo possivel. Muitas mae de gemeos tiveram sucesso. A chave e ter ajuda nas primeiras noites.', tags: ['gemes', 'duplo', 'multiplos', 'desafio'] },
  { id: '38', category: 'familia', question: 'O pai acha que "chorar faz mal" - como responder?', answer: 'Mostra investigacao: chorar FRUSTRADO com presenca NAO faz mal. O que faz mal e cronic stress prolongado. 7 dias com limite claro e mais saudavel que meses de privacao de sono para todos. Presenca ativa = presenca amorosa.', tags: ['pai', 'marido', 'fazer mal', 'ciencia'] },
  { id: '39', category: 'familia', question: 'A ama/babysitter pode aplicar o metodo?', answer: 'Sim! Qualquer cuidador pode aplicar a sequencia de 5 passos. Mostra o app a ela, explica a logica. Consistencia e a chave - todos os cuidadores devem seguir a mesma abordagem.', tags: ['ama', 'babysitter', 'cuidador', 'ajuda'] },
  { id: '40', category: 'familia', question: 'Como manter a consistencia quando estou exausta?', answer: 'Usa o app CADA VEZ que ele acorda. Ele guia-te passo a passo. O cansaco faz-nos duvidar, mas o app lembra-te o que fazer. Tira decisao da tua cabeca cansada e deixa o app conduzir. Pedes ajuda sempre que puderes.', tags: ['cansaco', 'consistencia', 'ajuda'] },

  // ========== SOBRE O METODO ==========
  { id: '41', category: 'metodo', question: 'O que e a Tecnica da Vaquinha?', answer: 'A Tecnica da Vaquinha e um metodo de treino de sono gentil desenvolvido para bebes de 0-3 anos. Consiste em 5 passos progressivos: Pausa Consciente, Presenca Fisica, Embalo sem Colo, Oferta de Agua, e Mama Consciente. NUNCA deixamos o bebe chorar sozinho.', tags: ['tecnica', 'vaquinha', 'metodo', 'o que e'] },
  { id: '42', category: 'metodo', question: 'Por que 7 dias especificamente?', answer: 'Pesquisa mostra que bebes levam em media 3-7 noites para estabelecer novos padroes de sono. 7 dias e um periodo suficiente para criar o habito E consolidar. Menos que isso pode nao ser suficiente para mudanca duradoura.', tags: ['7 dias', 'porque', 'tempo', 'duracao'] },
  { id: '43', category: 'metodo', question: 'Este metodo e igual a "Ferber" ou "extincao"?', answer: 'NAO. Ferber/extincao envolve deixar o bebe chorar sozinho com intervalos crescentes. Este metodo NUNCA deixa o bebe sozinho. Presenca ativa e fundamental. Estamos a ensinar a adormecer COM apoio progressivo, nao sem apoio.', tags: ['ferber', 'extincao', 'diferenca', 'comparacao'], important: true },
  { id: '44', category: 'metodo', question: 'O que acontece depois dos 7 dias?', answer: 'O objectivo e que apos 7 dias, o bebe tenha aprendido a adormecer sem a associacao anterior. Despertares ainda podem acontecer, mas serao menos frequentes e mais faceis de resolver. Continua a usar a sequencia quando necessario.', tags: ['depois', '7 dias', 'manutencao', 'continuar'] },
  { id: '45', category: 'metodo', question: 'Posso adaptar os passos para a minha situacao?', answer: 'Os passos sao desenhados para funcionar na sequencia. Nao recomendamos saltar passos. No entanto, podes ajustar TEMPOS (ex: 3 min de embalo em vez de 2) conforme o teu bebe. A estrutura geral deve manter-se.', tags: ['adaptar', 'mudar', 'passos', 'personalizar'] },
];

const CATEGORIES = [
  { id: 'todos', label: 'Todas', icon: '?' },
  { id: 'antes', label: 'Antes de comecar', icon: '!' },
  { id: 'durante', label: 'Durante a noite', icon: '?' },
  { id: 'problemas', label: 'Problemas comuns', icon: '!' },
  { id: 'saude', label: 'Saude do bebe', icon: '?' },
  { id: 'familia', label: 'Familia e apoio', icon: '?' },
  { id: 'metodo', label: 'Sobre o metodo', icon: '?' },
];

export function FAQ({ onBack, isNightMode }: FAQProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { vibrate } = useVibrate();

  const filteredItems = useMemo(() => {
    let items = FAQ_DATA;

    if (activeCategory !== 'todos') {
      items = items.filter(item => item.category === activeCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      items = items.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return items;
  }, [search, activeCategory]);

  const importantCount = filteredItems.filter(i => i.important).length;

  return (
    <div className={`min-h-screen flex flex-col ${isNightMode ? 'bg-gray-900' : 'bg-cream'}`}>
      <header className={`px-4 py-4 flex items-center gap-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <button onClick={() => { vibrate(50); onBack(); }} className={`p-2 ${isNightMode ? 'text-white' : 'text-gray-600'}`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className={`font-semibold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
            Perguntas Frequentes
          </h1>
          <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {FAQ_DATA.length} respostas para as tuas duvidas
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-24">
        {/* Search */}
        <div className={`mb-4 relative ${isNightMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isNightMode ? 'text-gray-400' : 'text-gray-400'}`} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Procurar uma pergunta..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl ${isNightMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-800 placeholder-gray-400'} focus:outline-none`}
          />
        </div>

        {/* Important Notice */}
        {importantCount > 0 && !search && (
          <div className={`mb-4 p-3 rounded-xl ${isNightMode ? 'bg-coral-500/20 border border-coral-400' : 'bg-coral-50 border border-coral-200'}`}>
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
              <p className={`text-sm font-medium ${isNightMode ? 'text-coral-300' : 'text-coral-600'}`}>
                Encontras {importantCount} respostas importantes
              </p>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const count = cat.id === 'todos'
              ? FAQ_DATA.length
              : FAQ_DATA.filter(i => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => { vibrate(30); setActiveCategory(cat.id); }}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-coral-400 text-white'
                    : isNightMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
                }`}
              >
                {cat.label}
                <span className={`text-xs ${activeCategory === cat.id ? 'text-white/70' : isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Questions */}
        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <div className={`text-center py-12 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-lg mb-2">Nenhuma pergunta encontrada</p>
              <p className="text-sm">Tenta outra palavra ou categoria</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className={`rounded-xl overflow-hidden ${
                  item.important
                    ? 'border-2 border-coral-400'
                    : ''
                } ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
              >
                <button
                  onClick={() => { vibrate(30); setExpandedId(expandedId === item.id ? null : item.id); }}
                  className="w-full px-4 py-4 flex items-start gap-3 text-left"
                >
                  {item.important && (
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                  )}
                  <span className={`font-medium flex-1 ${isNightMode ? 'text-white' : 'text-gray-800'} ${!item.important ? 'pl-8' : ''}`}>
                    {item.question}
                  </span>
                  {expandedId === item.id ? (
                    <ChevronUp className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </button>
                {expandedId === item.id && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className={`text-sm leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
