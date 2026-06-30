import type { DayContent, VideoContent } from './types';

// ========== CONTEÚDO COMPLETO DOS 7 DIAS DO MÉTODO ==========
// Este ficheiro contém TODO o conteúdo real do método "Sono sem Choro"
// Cada dia tem: textos educativos, checklist, pergunta do diário, pílula científica

export const FULL_DAY_CONTENT: Record<number, {
  textos: { id: string; title: string; content: string }[];
  checklist: { id: string; text: string }[];
  diary_question: string;
  pilula: { title: string; content: string };
}> = {
  // ========== DIA 1: ENTENDER ==========
  1: {
    textos: [
      {
        id: 't1-1',
        title: 'Porque é que o teu bebé acorda tantas vezes?',
        content: `O teu bebé não acorda por maldade, por fome real (na maioria dos casos após os 4 meses), ou porque está a sofrer. Ele acorda porque aprendeu uma coisa simples: "para adormecer, preciso da mama, do colo, ou da chupeta."

Isto chama-se Associação de Sono. É como um adulto que precisa de almofada para dormir — se tiras a almofada, ele acorda e não consegue voltar a adormecer sem ela.

O teu bebé faz o mesmo. Cada vez que termina um ciclo de sono (a cada 45-90 minutos), acorda brevemente. Nós adultos também fazemos isso, mas voltamos a adormecer sem pensar. O teu bebé não consegue, porque precisa do "gatilho" (mama, colo, embalo) para reiniciar o sono.

O Método da Vaquinha não é "deixar chorar". É ensinar ao teu bebé que existe outra forma de adormecer — com a tua presença, mas sem o gatilho antigo.

Hoje o teu único objectivo é ENTENDER isto. Não precisas de mudar nada esta noite. Apenas começa a observar: quantas vezes ele acorda? O que fazes cada vez? Quanto tempo demoras a acalmá-lo?`,
      },
      {
        id: 't1-2',
        title: 'Os 5 Passos da Técnica da Vaquinha',
        content: `A partir de amanhã, cada vez que o teu bebé acordar durante a noite, vais seguir esta sequência:

PASSO 1 — Pausa Consciente (30 segundos)
Quando ouvires o bebé, espera 30 segundos antes de intervir. Muitas vezes, ele resmungará e voltará a adormecer sozinho. Se chorar activamente, avança.

PASSO 2 — Presença Física (até 2 minutos)
Vai até ao bebé. Põe a mão no peito dele, fala baixinho: "Estou aqui, está tudo bem." NÃO o pegues ao colo. A tua presença é o conforto.

PASSO 3 — Embalo Suave (2-3 minutos)
Sem tirar do berço, embala suavemente fazendo "shhhh" contínuo. Podes embalar o colchão ou o corpo dele levemente. Mantém contacto físico.

PASSO 4 — Oferta de Água (30 segundos)
Se tem mais de 6 meses, oferece um gole de água num copo de aprendizagem. Isto interrompe o ciclo "chorar = mama" sem ser mama.

PASSO 5 — Mama Consciente (último recurso)
Se nada funcionou, dá mama. MAS: mama curta (5-10 min máximo), em posição de amamentação normal, e RETIRA antes de adormecer. O objectivo é que adormeça sem a mama na boca.

A ideia é ir sempre do passo 1 ao 5 em sequência. Nunca saltes para o 5 directamente. Com o tempo, vais notar que ele resolve cada vez mais cedo na sequência.`,
      },
    ],
    checklist: [
      { id: 'c1-1', text: 'Li e compreendi o que é uma associação de sono' },
      { id: 'c1-2', text: 'Identifiquei qual é a associação de sono do meu bebé (mama, colo, chupeta, embalo)' },
      { id: 'c1-3', text: 'Li os 5 passos da Técnica da Vaquinha' },
      { id: 'c1-4', text: 'Contei quantas vezes o meu bebé acordou ontem à noite' },
      { id: 'c1-5', text: 'Preparei um copo de água para ter junto ao berço (se bebé >6 meses)' },
    ],
    diary_question: 'Quantas vezes o teu bebé acordou ontem? O que fizeste em cada despertar? Como te sentiste?',
    pilula: {
      title: 'Sabia que…',
      content: 'O cérebro do bebé completa um ciclo de sono a cada 45-90 minutos. Um bebé que "dorme a noite toda" não dorme realmente sem acordar — apenas aprendeu a voltar a adormecer sozinho entre ciclos. É exactamente isso que vamos ensinar.',
    },
  },

  // ========== DIA 2: PREPARAR ==========
  2: {
    textos: [
      {
        id: 't2-1',
        title: 'O Ambiente Perfeito para Dormir',
        content: `O ambiente do quarto é metade da batalha. Um quarto mal preparado sabota até o melhor método. Vamos criar o cenário ideal:

ESCURIDÃO TOTAL
O cérebro produz melatonina (hormona do sono) quando está escuro. Qualquer luz — mesmo a do corredor ou de um LED — reduz a produção. Usa cortinas opacas ou improvisadas (cobertores escuros na janela). O quarto deve estar tão escuro que não consigas ver a tua mão.

TEMPERATURA
O ideal é 18-21°C. Bebés sobreaquecidos acordam mais. Teste: toca na nuca do bebé — se estiver húmida, está quente demais. Vista-o com uma camada a menos do que tu usarias.

SOM AMBIENTE
Silêncio total pode ser contraproducente — o bebé ouve qualquer ruído da casa. Um som branco constante (ventilador, aplicação de white noise) mascara ruídos e ajuda a manter sono profundo. Volume baixo, constante, a noite toda.

BERÇO SEGURO
Colchão firme, sem almofadas, brinquedos, ou cobertores soltos. O bebé deve dormir de costas. Saco de dormir em vez de cobertor.

O RITUAL PRÉ-SONO
Cria uma sequência de 15-20 minutos que fazes TODAS as noites:
1. Banho morno (ou lavagem rápida)
2. Vestir o pijama no quarto com luz baixa
3. Última mamada (SEM adormecer — retira antes de fechar os olhos)
4. Livro curto ou canção
5. Deitar no berço, mão no peito, "Boa noite"

A consistência deste ritual é mais importante que os passos em si. O cérebro do bebé aprende: "depois do banho + pijama + livro = hora de dormir."`,
      },
    ],
    checklist: [
      { id: 'c2-1', text: 'Escureci o quarto o máximo possível (cortinas, tapar LEDs)' },
      { id: 'c2-2', text: 'Verifiquei a temperatura do quarto (18-21°C)' },
      { id: 'c2-3', text: 'Preparei som ambiente (ventilador, white noise, ou app)' },
      { id: 'c2-4', text: 'Removi objectos soltos do berço' },
      { id: 'c2-5', text: 'Defini o meu ritual pré-sono de 15-20 minutos' },
      { id: 'c2-6', text: 'Fiz o ritual hoje à noite antes de deitar o bebé' },
    ],
    diary_question: 'Que mudanças fizeste no quarto hoje? Como foi a reacção do bebé ao novo ritual pré-sono?',
    pilula: {
      title: 'Sabia que…',
      content: 'A melatonina começa a ser produzida cerca de 2 horas antes do sono. Ecrãs (TV, telemóvel, tablet) emitem luz azul que BLOQUEIA essa produção. Evita ecrãs no quarto do bebé a partir das 18h — isto aplica-se a TI também, mãe.',
    },
  },

  // ========== DIA 3: AJUSTAR ==========
  3: {
    textos: [
      {
        id: 't3-1',
        title: 'A Noite Mais Difícil — E Porque Isso É BOM',
        content: `Se estás a ler isto e ontem foi terrível, parabéns. A sério.

O Dia 3 é normalmente o mais difícil. Chama-se "Extinction Burst" — é quando o bebé percebe que a regra mudou e testa os limites com MAIS força. É como um elevador: quando carregas no botão e ele não vem, carregas mais vezes e com mais força antes de desistir.

O teu bebé está a fazer exactamente isso. Ele está a testar: "Se eu chorar MAIS, ela dá-me a mama como antes?" Se mantiveres firme, ele vai aprender que o choro não traz a mama — e vai começar a aceitar as novas formas de conforto.

SINAIS DE QUE ESTÁ A FUNCIONAR:
• Chora mais intensamente que ontem (está a testar)
• Mas acalma-se mais rápido em cada episódio
• Aceita a presença física (Passo 2) por mais tempo
• Começa a adormecer em passos anteriores (3 ou 4 em vez de 5)

O QUE FAZER QUANDO SENTES QUE QUERES DESISTIR:
1. Respira fundo 3 vezes
2. Lembra: isto é temporário (máx 2-3 noites mais)
3. O cansaço de agora é investimento em meses de sono
4. Pede ajuda ao parceiro para alternar despertares
5. Usa o app — ele tira as decisões da tua cabeça cansada

NÃO CEDAS HOJE. Se cederes no Dia 3, o bebé aprende: "Se eu chorar o suficiente, ela volta ao antigo." E da próxima vez, vai chorar AINDA mais. Manter-se firme hoje poupa-te semanas de trabalho.`,
      },
    ],
    checklist: [
      { id: 'c3-1', text: 'Segui a sequência de 5 passos em CADA despertar esta noite' },
      { id: 'c3-2', text: 'Não saltei directamente para a mama (Passo 5)' },
      { id: 'c3-3', text: 'Registei todos os despertares no app' },
      { id: 'c3-4', text: 'Pedi ajuda ao parceiro/família para pelo menos 1 despertar' },
      { id: 'c3-5', text: 'Fiz o ritual pré-sono completo antes de deitar' },
    ],
    diary_question: 'Como foi a noite? Houve um despertar que sentiste que foi mais fácil que os anteriores? Como te sentiste ao manter-te firme?',
    pilula: {
      title: 'Sabia que…',
      content: 'O "extinction burst" está documentado em centenas de estudos. É um fenómeno universal de aprendizagem — não só em bebés. Quando um comportamento que "funcionava" deixa de funcionar, há sempre um aumento temporário antes da extinção. É o sinal de que o cérebro está a reescrever o padrão.',
    },
  },

  // ========== DIA 4: APLICAR ==========
  4: {
    textos: [
      {
        id: 't4-1',
        title: 'A Consolidação — O Progresso Começa a Aparecer',
        content: `Se sobreviveste ao Dia 3, o pior já passou. A partir de hoje, vais começar a ver sinais concretos de progresso.

O QUE MUDA NO DIA 4:
• Os despertares começam a ser MENOS frequentes
• O bebé aceita o Passo 2 (presença) ou 3 (embalo) com mais facilidade
• O tempo de choro em cada despertar é MENOR
• Podes começar a notar o primeiro bloco de sono mais longo (3-4 horas seguidas!)

O CICLO VIRTUOSO:
Mais sono → bebé mais descansado → adormece mais facilmente → menos despertares → mais sono. Este é o ciclo que estamos a construir. Cada noite alimenta a próxima.

AJUSTES PARA HOJE:
1. Se o bebé está a resolver no Passo 2 ou 3, óptimo — mantém assim
2. Começa a encurtar o Passo 5 (mama): de 10 min para 5-7 min
3. Retira a mama ANTES de adormecer completamente — ele deve fechar os olhos no berço, não ao peito
4. Mantém o ritual pré-sono exactamente igual (consistência!)

ERRO COMUM DO DIA 4:
"Correu tão bem que acho que já posso relaxar." NÃO. O progresso do Dia 4 é frágil. Uma noite de "exceção" (dar mama à primeira, saltar passos) pode desfazer 3 dias de trabalho. Mantém a disciplina até ao Dia 7.

Estás a meio caminho. O teu bebé está a aprender. Tu estás a ensinar. Confia no processo.`,
      },
    ],
    checklist: [
      { id: 'c4-1', text: 'Segui os 5 passos em cada despertar (sem saltar)' },
      { id: 'c4-2', text: 'Encurtei o tempo da mama (Passo 5) para menos de 7 minutos' },
      { id: 'c4-3', text: 'Retirei a mama antes de adormecer completamente' },
      { id: 'c4-4', text: 'Registei os despertares e comparei com noites anteriores' },
      { id: 'c4-5', text: 'Mantive o ritual pré-sono consistente' },
    ],
    diary_question: 'Quantos despertares houve esta noite vs. o Dia 1? Notaste algum despertar onde ele voltou a adormecer mais rápido? Como foi a diferença?',
    pilula: {
      title: 'Sabia que…',
      content: 'Estudos mostram que bebés que aprendem a auto-acalmar-se (self-soothe) têm melhor qualidade de sono até à adolescência. Não estás só a resolver um problema de agora — estás a dar ao teu filho uma competência para a vida.',
    },
  },

  // ========== DIA 5: PERSISTIR ==========
  5: {
    textos: [
      {
        id: 't5-1',
        title: 'O Hábito Está a Formar-se',
        content: `Dia 5. Se chegaste até aqui, és mais forte do que pensavas.

Neste ponto, algo notável começa a acontecer: o bebé começa a resolver-se ANTES de tu chegares ao berço. Podes ouvi-lo resmungar, mexer-se, e depois… silêncio. Ele voltou a adormecer sozinho.

Isto é o self-soothing — a competência que estamos a construir. É O objectivo de todo o método.

O DESMAME NOTURNO GENTIL:
A partir de hoje, se o teu bebé tem mais de 6 meses e está a ganhar peso bem, podes começar a reduzir as mamadas nocturnas:

1. Reduz o tempo de cada mamada em 2 minutos por noite
2. Se mamava 10 min, esta noite mama 8 min, amanhã 6 min
3. Quando chegar a 3-4 minutos, substitui por água ou conforto
4. O objectivo é ZERO mamadas nocturnas até ao Dia 7

IMPORTANTE: Se o teu bebé tem menos de 6 meses, mantém 1-2 mamadas nocturnas. Bebés pequenos podem precisar de nutrição nocturna. Fala com o teu pediatra.

SINAIS DE QUE O BEBÉ NÃO TEM FOME REAL:
• Come bem durante o dia
• Está a ganhar peso normalmente
• Mama durante menos de 5 minutos e adormece
• Acorda a intervalos regulares (cada 2h) em vez de aleatórios

Se estes sinais estão presentes, os despertares são HÁBITO, não fome. E hábitos podem ser mudados.`,
      },
    ],
    checklist: [
      { id: 'c5-1', text: 'Notei pelo menos um despertar onde o bebé se auto-acalmou' },
      { id: 'c5-2', text: 'Reduzi o tempo da mama nocturna em 2 minutos' },
      { id: 'c5-3', text: 'Mantive a sequência de 5 passos sem saltar' },
      { id: 'c5-4', text: 'Comparei o progresso com o Dia 1 no gráfico do app' },
      { id: 'c5-5', text: 'O ritual pré-sono continua consistente' },
    ],
    diary_question: 'O teu bebé auto-acalmou-se em algum despertar esta noite? Como te sentiste ao ouvir o silêncio em vez do choro?',
    pilula: {
      title: 'Sabia que…',
      content: 'A capacidade de auto-acalmar-se (self-soothing) activa o córtex pré-frontal do bebé — a mesma região que nos adultos controla emoções e toma decisões. Cada vez que o teu bebé aprende a acalmar-se sozinho, está literalmente a fortalecer conexões cerebrais.',
    },
  },

  // ========== DIA 6: APROFUNDAR ==========
  6: {
    textos: [
      {
        id: 't6-1',
        title: 'A Viragem — Quase Uma Semana',
        content: `Dia 6. Olha para trás e vê o que mudou.

Dia 1: X despertares, cada um resolvido com mama.
Dia 6: Provavelmente metade dos despertares, muitos resolvidos no Passo 1, 2 ou 3.

Se isso aconteceu, o método FUNCIONOU. Mesmo que não esteja perfeito, a tendência é clara.

PERGUNTAS IMPORTANTES PARA HOJE:

"E se ele ainda acorda 2-3 vezes?"
Normal. A maioria dos bebés não vai de 8 despertares para 0 em 6 dias. O progresso é: menos despertares + resolução mais rápida + mais self-soothing. Se passaste de 6 despertares para 2-3, isso é um sucesso enorme.

"E se uma noite foi boa e a seguinte foi má?"
Também normal. O progresso não é linear. É como aprender a andar — há dias de quedas. Olha para a TENDÊNCIA de 6 noites, não para uma noite isolada.

"E se eu preciso de mais do que 7 dias?"
Continua. O método não expira ao Dia 7. Se precisares de 10 ou 14 dias, mantém a consistência. O Dia 7 é o mínimo, não o máximo.

PREPARAÇÃO PARA O FUTURO:
Após o Dia 7, vais precisar de manter a consistência. Regressões de sono acontecem (aos 4, 8, 12 e 18 meses). Quando acontecerem, volta à sequência de 5 passos. O bebé vai recuperar muito mais rápido na segunda vez — ele já sabe como se auto-acalmar, só precisa de ser lembrado.`,
      },
    ],
    checklist: [
      { id: 'c6-1', text: 'Comparei o total de despertares Dia 1 vs. Dia 6' },
      { id: 'c6-2', text: 'O bebé resolveu pelo menos 1 despertar no Passo 1 ou 2' },
      { id: 'c6-3', text: 'A mama nocturna (se ainda existe) está a 5 min ou menos' },
      { id: 'c6-4', text: 'Mantive o ritual pré-sono' },
      { id: 'c6-5', text: 'Preparei-me mentalmente para manter a consistência após o Dia 7' },
    ],
    diary_question: 'Compara o Dia 1 com hoje: quantos despertares? Quanto tempo demoraste a resolvê-los? Que passo funcionou mais vezes?',
    pilula: {
      title: 'Sabia que…',
      content: 'Regressões de sono (períodos onde o bebé volta a acordar mais) são sinais de desenvolvimento cerebral. Acontecem quando o bebé está a aprender novas competências (rolar, sentar, gatinhar). São TEMPORÁRIAS e não apagam o que aprendeu com o método.',
    },
  },

  // ========== DIA 7: CONSOLIDAR ==========
  7: {
    textos: [
      {
        id: 't7-1',
        title: 'Uma Semana. Conseguiste.',
        content: `Dia 7. Chegaste ao fim.

Pára um momento e reconhece o que fizeste. Durante 7 noites, mesmo exausta, mesmo com dúvidas, mesmo quando o choro parecia não ter fim — tu mantiveste-te firme. Tu ensinaste ao teu bebé uma das competências mais importantes da infância: adormecer sozinho.

CELEBRA estes resultados:
• Menos despertares que no Dia 1
• O bebé resolve-se mais rápido
• Tu dormiste mais (mesmo que não pareça)
• O ritual pré-sono está consolidado
• Sabes exactamente o que fazer quando ele acorda

O QUE FAZER A PARTIR DE AGORA:

1. MANTÉM O RITUAL PRÉ-SONO — para sempre. Este é o pilar.

2. QUANDO ELE ACORDAR — usa sempre a sequência de 5 passos. Mesmo daqui a 3 meses.

3. REGRESSÕES — vão acontecer. São temporárias. Volta ao método e resolve-se em 1-3 noites (muito mais rápido que da primeira vez).

4. DOENÇA — quando o bebé estiver doente, pausa o método e dá todo o conforto. Retoma quando estiver saudável.

5. VIAGENS — mantém o ritual o mais possível. Leva objetos familiares. O bebé adapta-se mais rápido agora.

6. NOVOS MARCOS — quando aprender a sentar, gatinhar, andar, pode haver perturbações. Normal. Volta ao método.

Tu és capaz. Tu provaste-o esta semana. E o teu bebé é mais forte e mais seguro graças a ti.

Parabéns, mãe. 💛`,
      },
    ],
    checklist: [
      { id: 'c7-1', text: 'Completei os 7 dias do método' },
      { id: 'c7-2', text: 'Comparei o progresso geral (Dia 1 vs. Dia 7)' },
      { id: 'c7-3', text: 'O ritual pré-sono está estabelecido como hábito' },
      { id: 'c7-4', text: 'Sei o que fazer em caso de regressão de sono' },
      { id: 'c7-5', text: 'Celebrei a conquista — eu mereci!' },
    ],
    diary_question: 'Olha para trás: o que mudou nesta semana? O que aprendeste sobre ti e sobre o teu bebé? O que foi mais difícil e o que te deu mais orgulho?',
    pilula: {
      title: 'Sabia que…',
      content: 'Investigação publicada no journal Pediatrics mostra que métodos de treino de sono com presença parental (como este) não têm efeitos negativos no apego, no comportamento, ou no desenvolvimento emocional do bebé — nem a curto nem a longo prazo. Tu fizeste a coisa certa.',
    },
  },

  // ========== MÓDULO 8: DOENÇA ==========
  8: {
    textos: [
      { id: 't8-1', title: 'Quando pausar e quando continuar', content: '[PLACEHOLDER — "Quando pausar e quando continuar"]' },
      { id: 't8-2', title: 'Como retomar depois da doença', content: '[PLACEHOLDER — "Como retomar depois da doença"]' },
    ],
    checklist: [
      { id: 'c8-1', text: '[PLACEHOLDER]' },
      { id: 'c8-2', text: '[PLACEHOLDER]' },
      { id: 'c8-3', text: '[PLACEHOLDER]' },
      { id: 'c8-4', text: '[PLACEHOLDER]' },
      { id: 'c8-5', text: '[PLACEHOLDER]' },
    ],
    diary_question: '[PLACEHOLDER]',
    pilula: { title: 'Sabia que...', content: '[PLACEHOLDER]' },
  },

  // ========== MÓDULO 9: VIAJAR ==========
  9: {
    textos: [
      { id: 't9-1', title: 'Preparar a viagem', content: '[PLACEHOLDER — "Preparar a viagem"]' },
      { id: 't9-2', title: 'Voltar à rotina depois', content: '[PLACEHOLDER — "Voltar à rotina depois"]' },
    ],
    checklist: [
      { id: 'c9-1', text: '[PLACEHOLDER]' },
      { id: 'c9-2', text: '[PLACEHOLDER]' },
      { id: 'c9-3', text: '[PLACEHOLDER]' },
      { id: 'c9-4', text: '[PLACEHOLDER]' },
      { id: 'c9-5', text: '[PLACEHOLDER]' },
      { id: 'c9-6', text: '[PLACEHOLDER]' },
    ],
    diary_question: '[PLACEHOLDER]',
    pilula: { title: 'Sabia que...', content: '[PLACEHOLDER]' },
  },

  // ========== MÓDULO 10: REGRESSÕES ==========
  10: {
    textos: [
      { id: 't10-1', title: 'Regressão 1', content: '[PLACEHOLDER — uma por regressão]' },
      { id: 't10-2', title: 'Regressão 2', content: '[PLACEHOLDER — uma por regressão]' },
      { id: 't10-3', title: 'Regressão 3', content: '[PLACEHOLDER — uma por regressão]' },
      { id: 't10-4', title: 'Regressão 4', content: '[PLACEHOLDER — uma por regressão]' },
      { id: 't10-5', title: 'Regressão 5', content: '[PLACEHOLDER — uma por regressão]' },
    ],
    checklist: [
      { id: 'c10-1', text: '[PLACEHOLDER]' },
      { id: 'c10-2', text: '[PLACEHOLDER]' },
      { id: 'c10-3', text: '[PLACEHOLDER]' },
      { id: 'c10-4', text: '[PLACEHOLDER]' },
    ],
    diary_question: '',
    pilula: { title: 'Sabia que...', content: '[PLACEHOLDER]' },
  },

  // ========== MÓDULO 11: FAMÍLIA ==========
  11: {
    textos: [
      { id: 't11-1', title: 'Conversa franca com o companheiro', content: '[PLACEHOLDER — "Conversa franca com o companheiro"]' },
      { id: 't11-2', title: 'Lidar com avós que criticam', content: '[PLACEHOLDER — "Lidar com avós que criticam"]' },
      { id: 't11-3', title: 'Pedir ajuda concreta', content: '[PLACEHOLDER — "Pedir ajuda concreta"]' },
    ],
    checklist: [
      { id: 'c11-1', text: '[PLACEHOLDER]' },
      { id: 'c11-2', text: '[PLACEHOLDER]' },
      { id: 'c11-3', text: '[PLACEHOLDER]' },
      { id: 'c11-4', text: '[PLACEHOLDER]' },
      { id: 'c11-5', text: '[PLACEHOLDER]' },
    ],
    diary_question: '[PLACEHOLDER]',
    pilula: { title: 'Sabia que...', content: '[PLACEHOLDER]' },
  },

  // ========== MÓDULO 12: MÃE TRABALHADORA ==========
  12: {
    textos: [
      { id: 't12-1', title: 'Texto 1', content: '[PLACEHOLDER]' },
      { id: 't12-2', title: 'Texto 2', content: '[PLACEHOLDER]' },
    ],
    checklist: [
      { id: 'c12-1', text: '[PLACEHOLDER]' },
      { id: 'c12-2', text: '[PLACEHOLDER]' },
      { id: 'c12-3', text: '[PLACEHOLDER]' },
      { id: 'c12-4', text: '[PLACEHOLDER]' },
      { id: 'c12-5', text: '[PLACEHOLDER]' },
    ],
    diary_question: '[PLACEHOLDER]',
    pilula: { title: 'Sabia que...', content: '[PLACEHOLDER]' },
  },

  // ========== MÓDULO 13: SAÚDE MENTAL ==========
  13: {
    textos: [
      { id: 't13-1', title: 'Texto 1', content: '[PLACEHOLDER]' },
      { id: 't13-2', title: 'Texto 2', content: '[PLACEHOLDER]' },
    ],
    checklist: [],
    diary_question: '[PLACEHOLDER]',
    pilula: { title: '', content: '' },
  },

  // ========== MÓDULO 14: CO-SLEEPING SEGURO ==========
  14: {
    textos: [
      { id: 't14-1', title: 'Regras de co-sleeping seguro', content: '[PLACEHOLDER — "Regras de co-sleeping seguro"]' },
      { id: 't14-2', title: 'Adaptar a Técnica da Vaquinha à cama partilhada', content: '[PLACEHOLDER — "Adaptar a Técnica da Vaquinha à cama partilhada"]' },
      { id: 't14-3', title: 'Quando o pai dorme em quarto separado', content: '[PLACEHOLDER — "Quando o pai dorme em quarto separado"]' },
    ],
    checklist: [
      { id: 'c14-1', text: '[PLACEHOLDER]' },
      { id: 'c14-2', text: '[PLACEHOLDER]' },
      { id: 'c14-3', text: '[PLACEHOLDER]' },
      { id: 'c14-4', text: '[PLACEHOLDER]' },
      { id: 'c14-5', text: '[PLACEHOLDER]' },
      { id: 'c14-6', text: '[PLACEHOLDER]' },
      { id: 'c14-7', text: '[PLACEHOLDER]' },
    ],
    diary_question: '[PLACEHOLDER]',
    pilula: { title: 'Sabia que...', content: '[PLACEHOLDER]' },
  },
};

// ========== MENSAGENS PARA FAMÍLIA (conteúdo real) ==========
export const FAMILY_MESSAGES = [
  {
    id: 'm1',
    title: 'Para o pai/companheiro',
    content: `Olá amor, quero falar contigo sobre uma coisa importante. Estou a seguir um método para ajudar o(a) [nome] a dormir melhor. Não é "deixar chorar" — eu estou sempre presente, com a mão no peito dele(a), a falar baixinho.

O método tem 5 passos e demora 7 noites. Preciso do teu apoio:
- Nos primeiros 3 dias, ele(a) pode chorar mais (é normal, chama-se extinction burst)
- Se puderes fazer 1-2 despertares por noite, ajuda imenso
- O mais importante: quando ele(a) chorar, NÃO dês mama directamente — segue os passos no app

Sei que é difícil ouvir o choro. Mas 7 noites de esforço = meses de sono para todos nós. Estou a fazer isto por nós três. 💙`,
  },
  {
    id: 'm2',
    title: 'Para a avó',
    content: `Mãe/Sogra, quero explicar-te uma coisa. Estou a fazer um método para o(a) [nome] aprender a dormir sem precisar de mamar cada vez que acorda.

NÃO é deixar chorar sozinho. Eu estou SEMPRE ao lado dele(a), com a mão no peito, a falar baixinho. É um método gentil com presença — é exactamente o contrário de abandonar.

O bebé pode chorar mais nos primeiros 2-3 dias. É normal — é como quando mudamos qualquer hábito. Depois disso, melhora muito.

Peço-te que confies em mim e que não dês mama/colo durante a noite se estiveres a ajudar. Segue o que eu fizer. Em 7 dias, vais ver a diferença. 💛`,
  },
  {
    id: 'm3',
    title: 'Para a sogra',
    content: `Sogra, obrigada por te preocupares com o(a) [nome]. Sei que quando ouves chorar, o teu instinto é ajudar — e isso mostra o quanto amas o teu neto(a).

Estou a seguir um método recomendado por pediatras para ajudar o(a) [nome] a dormir. NÃO é "deixar chorar" — estou sempre presente, com contacto físico, voz baixa.

O choro que possa acontecer é frustração (não dor ou abandono). É como quando uma criança chora porque não quer sair do parque — é desconforto pela mudança, não sofrimento.

Em 7 noites, o(a) [nome] vai dormir melhor, eu vou dormir melhor, e todos vamos estar mais felizes. Confia em mim. 💙`,
  },
  {
    id: 'm4',
    title: 'Para amigos/vizinhos',
    content: `Olá! Só para avisar: nas próximas noites, o(a) [nome] pode chorar um bocado mais durante a noite. Estamos a fazer um método para melhorar o sono dele(a) e os primeiros dias podem ser mais barulhentos.

Dura apenas 3-5 dias e depois melhora drasticamente. Peço desculpa pelo incómodo e agradeço a compreensão! 🙏`,
  },
  {
    id: 'm5',
    title: 'Para o grupo de família',
    content: `Família, quero partilhar convosco: estou a seguir um método para ajudar o(a) [nome] a dormir melhor. É um método gentil, com presença constante — não é "deixar chorar sozinho".

Nas próximas 7 noites vou estar focada nisto. Se puderem evitar visitas à noite e compreender que posso estar mais cansada durante o dia, agradeço.

O objectivo é que daqui a uma semana, o(a) [nome] durma a noite toda (ou quase). Vou partilhar o progresso convosco! 💛`,
  },
  {
    id: 'm6',
    title: 'Cancelar visita',
    content: `Olá! Desculpa mas hoje não vamos poder receber visitas. Estamos no meio do método de sono do(a) [nome] e precisamos de manter o ambiente calmo e a rotina estável.

Quando acabarmos (daqui a X dias), marcamos! Obrigada pela compreensão. 🙏`,
  },
  {
    id: 'm7',
    title: 'Pedir ajuda ao parceiro',
    content: `Amor, esta noite preciso que me ajudes. Podes ficar responsável pelos despertares das 00h às 3h? Eu fico das 3h em diante.

Regra: segue os passos no app. Pausa 30s → mão no peito → embalo → água → e SÓ se nada funcionar, chama-me para a mama.

Sei que é difícil, mas partilhar as noites faz toda a diferença. Obrigada. 💙`,
  },
];

// ========== CONTEÚDO SOS REAL ==========
export const SOS_CONTENT = [
  {
    id: 's1',
    title: 'O bebé não para de chorar há mais de 20 minutos',
    content: `CALMA. Respira. Vamos resolver isto.

PASSO A PASSO:

1. VERIFICA O BÁSICO
   • Fralda limpa?
   • Temperatura confortável? (nuca do bebé: húmida = muito quente)
   • Roupa confortável, nada a apertar?

2. TENTA CONFORTO FÍSICO
   • Mão firme e quente no peito ou barriga
   • "Shhhh" contínuo perto do ouvido
   • Embala suavemente de lado a lado
   • Se nada funciona, pega ao colo por 2-3 minutos para acalmar, depois volta a deitar

3. SOM BRANCO
   • Liga o "shhhh" do telemóvel no máximo
   • Ou som de água a correr na casa de banho
   • Coloca perto da cabeça do bebé

4. MUDANÇA DE AMBIENTE
   • Sai do quarto com o bebé durante 5 minutos
   • Ar fresco no rosto pode interromper o choro
   • Volta ao quarto quando acalmar

5. SE NADA FUNCIONAR
   • Dá mama ou biberão (não é falha — é último recurso)
   • Se continuar a chorar MESMO com mama, pode ser dor
   • Liga ao pediatra ou vai à urgência

LEMBRA-TE: Uma noite difícil NÃO apaga o progresso das noites anteriores. Amanhã é um novo dia.`,
  },
  {
    id: 's2',
    title: 'Eu estou no meu limite — não aguento mais',
    content: `ISTO É NORMAL. NÃO ÉS FRACA. NINGUÉM CONSEGUE SOZINHA.

AGORA, FAZ ISTO:

1. COLOCA O BEBÉ NUM LUGAR SEGURO
   • Berço, com as grades fechadas
   • Ele pode chorar — é seguro chorar no berço durante 5 minutos

2. SAI DO QUARTO
   • Fecha a porta
   • Vai à casa de banho ou cozinha

3. RESPIRA
   • Inspira 4 segundos pelo nariz
   • Segura 7 segundos
   • Expira 8 segundos pela boca
   • Repete 3 vezes

4. BEBE UM COPO DE ÁGUA

5. LIGA A ALGUÉM
   • Parceiro, mãe, amiga, irmã
   • Não precisas de falar — só ouvir outra voz ajuda
   • Diz: "Estou exausta e preciso de apoio"

6. VOLTA QUANDO ESTIVERES PRONTA
   • Não há pressa
   • 5-10 minutos de pausa não fazem mal a ninguém
   • Voltas mais capaz, não mais fraca

TU NÃO FALHASTE. Estás a fazer um trabalho impossível sem dormir. Qualquer mãe no teu lugar sentiria o mesmo.

SE SENTES QUE PODES PERDER O CONTROLO OU FAZER MAL AO BEBÉ:
→ Coloca-o no berço AGORA
→ Liga 117 (emergência)
→ Não é vergonha. É coragem.`,
  },
  {
    id: 's3',
    title: 'Algo parece errado fisicamente',
    content: `SINAIS QUE PRECISAM DE ATENÇÃO MÉDICA:

🔴 URGÊNCIA (Liga 117 ou vai ao hospital):
• Febre acima de 38.5°C (em bebés < 3 meses, qualquer febre)
• Respiração muito rápida, difícil, ou com "puxar" do peito
• Lábios ou pele azulada/pálida
• Não responde a estímulos / muito "mole"
• Convulsões
• Vómitos repetidos (mais de 3 vezes em poucas horas)

🟡 ATENÇÃO (Liga ao pediatra dentro de 24h):
• Febre entre 37.5-38.5°C
• Recusa TOTAL de comer há mais de 8 horas
• Menos de 4 fraldas molhadas em 24 horas (desidratação)
• Choro inconsolável diferente do habitual
• Diarreia frequente
• Erupção cutânea nova

🟢 NORMAL (Não é motivo de alarme):
• Choro forte mas que pára com conforto
• Nariz entupido leve
• Fezes de cores variadas (excepto branco ou vermelho vivo)
• Soluços frequentes
• Tremor do queixo quando chora

CONFIA NO TEU INSTINTO. Se algo te parece "diferente", consulta. Nenhum médico te vai julgar por ires à urgência "por precaução."

DURANTE A DOENÇA: PAUSA o método. Dá todo o conforto que o bebé precisar. O método retoma quando estiver saudável — o progresso não se perde.`,
  },
];

// ========== ARTIGOS DA BIBLIOTECA (conteúdo real) ==========
export const LIBRARY_ARTICLES_FULL = [
  {
    id: 'a1',
    title: 'Cólicas e Sono',
    readTime: '5 min',
    content: `As cólicas são episódios de choro intenso, normalmente ao final do dia, em bebés de 2 semanas a 4 meses. Não são causadas por má parentalidade.

COMO DISTINGUIR CÓLICA DE DESPERTAR NORMAL:
• Cólica: choro inconsolável ao fim da tarde/início da noite, punhos cerrados, pernas recolhidas
• Despertar normal: acordar durante a noite, acalma com presença ou mama

DURANTE CÓLICAS, NÃO APLIQUES O MÉTODO. Dá conforto:
• Embrulhar apertado (swaddle)
• Embalar ritmicamente
• Som branco alto (nível de chuveiro)
• Chucha se aceitar
• Contacto pele-a-pele

As cólicas passam sozinhas entre os 3-4 meses. Depois disso, podes iniciar o método com tranquilidade.`,
  },
  {
    id: 'a2',
    title: 'Dentição e Despertares',
    readTime: '4 min',
    content: `A dentição pode perturbar o sono, mas não deve ser desculpa para abandonar o método.

SINAIS DE QUE É DENTIÇÃO:
• Gengivas inchadas ou vermelhas
• Baba excessiva
• Morde tudo o que encontra
• Irritabilidade durante o DIA (não só à noite)

O QUE FAZER:
• Dá analgésico adequado antes de deitar (conforme indicação do pediatra)
• Mordedores gelados antes do ritual pré-sono
• Mantém o método MAS sê mais paciente nos passos
• Se há MUITA dor (febre, gengiva a sangrar), pausa 1-2 noites

ARMADILHA COMUM: Atribuir TODOS os despertares à dentição. Na realidade, os dentes causam desconforto episódico, não despertares a cada 2 horas a noite toda.`,
  },
  {
    id: 'a3',
    title: 'Regressão dos 4 Meses',
    readTime: '6 min',
    content: `A regressão dos 4 meses é a mais conhecida e a mais impactante. Acontece porque o padrão de sono do bebé muda permanentemente — de sono "imature" (recém-nascido) para sono "adulto" com ciclos definidos.

O QUE MUDA:
• O bebé começa a ter ciclos de sono de 45 minutos (antes, dormia em blocos longos)
• Acorda entre ciclos e não sabe voltar a adormecer
• É como se "piorasse" de repente

A BOA NOTÍCIA: Esta regressão é na verdade uma MATURAÇÃO. O sono do bebé está a ficar mais organizado. É O MELHOR momento para iniciar o método, porque estás a ensinar o bebé a navegar os novos ciclos.

DURA QUANTO TEMPO: 2-6 semanas sem intervenção. Com o método, 1-2 semanas.

IMPORTANTE: Esta é a única regressão que é permanente (as outras são temporárias). O padrão de sono que o bebé desenvolve agora vai ficar. Por isso vale a pena investir em bons hábitos AGORA.`,
  },
  {
    id: 'a4',
    title: 'Regressão dos 8 Meses',
    readTime: '5 min',
    content: `Aos 8 meses, muitos bebés passam por uma regressão ligada ao desenvolvimento: ansiedade de separação + aprender a gatinhar/sentar.

O QUE ACONTECE:
• O bebé não quer que saias do quarto
• Pode sentar-se ou pôr-se de pé no berço e chorar
• Protesta quando o deitas
• Pode acordar mais frequentemente

O QUE FAZER:
• Mantém o método com mais presença no Passo 2 (fica mais tempo com a mão no peito)
• Se ele se senta/levanta, deita-o calmamente SEM falar muito
• Pratica "senta → deita" durante o dia como brincadeira
• Mais actividade física durante o dia ajuda
• Garantir que não está a dormir demais durante o dia

DURA QUANTO TEMPO: 1-3 semanas. Se já fizeste o método antes, resolve-se em 3-5 noites.`,
  },
  {
    id: 'a5',
    title: 'Regressão dos 12 Meses',
    readTime: '5 min',
    content: `A regressão dos 12 meses está ligada a aprender a andar, transição de 2 para 1 soneca, e explosão de linguagem.

SINAIS:
• Recusa a segunda soneca
• Quer praticar "ficar de pé" no berço
• Mais energia ao final do dia
• Despertares por volta das 4-5h da manhã

O QUE FAZER:
• NÃO elimines a segunda soneca ainda — oferece-a, mesmo que recuse
• Se recusar a soneca 5 dias seguidos, faz a transição para 1 soneca
• Cansaço excessivo piora os despertares — não deites tarde
• Mantém o método como sempre
• Mais actividade e estimulação durante o dia

DURA QUANTO TEMPO: 2-4 semanas. Com método consistente, melhora em 5-7 noites.`,
  },
  {
    id: 'a6',
    title: 'Sono em Viagem',
    readTime: '4 min',
    content: `Viajar com bebé não significa perder o progresso. Mas requer preparação.

ANTES DA VIAGEM:
• Leva o saco de dormir habitual (cheiro familiar)
• Leva uma fralda/objecto com o cheiro do berço
• Se possível, leva o som branco que usas em casa
• Faz o ritual pré-sono completo, mesmo no hotel/casa da avó

DURANTE A VIAGEM:
• Mantém os horários o mais próximo possível
• O quarto pode ser diferente, mas o ritual deve ser igual
• Escurece o quarto da mesma forma (usa cobertores ou sacos de lixo nas janelas)
• Se partilhares quarto, usa uma barreira visual (lençol pendurado)
• Usa o método normalmente — não "descanses" porque estás fora

AO VOLTAR:
• Retoma imediatamente a rotina normal
• Se houve regressão, 2-3 noites de método corrigem
• Não te culpes por noites más em viagem — é normal`,
  },
  {
    id: 'a7',
    title: 'Bebé Doente — Quando Pausar o Método',
    readTime: '3 min',
    content: `Quando o bebé está doente, o conforto tem prioridade sobre o método.

PAUSA O MÉTODO SE:
• Febre (>37.5°C)
• Infecção activa (otite, constipação forte, gastroenterite)
• Pós-vacinação (24-48h)
• Vómitos ou diarreia
• Qualquer situação que cause dor real

DURANTE A DOENÇA:
• Dá todo o conforto que o bebé precisar (colo, mama, embalo)
• Não te preocupes com "estragar" o progresso
• O bebé precisa de se sentir seguro quando está vulnerável
• Mantém o ritual pré-sono se possível (dá normalidade)

QUANDO RETOMAR:
• 1-2 dias após recuperação total
• Volta aos 5 passos como se fosse o Dia 3
• Normalmente resolve-se em 2-3 noites (o bebé lembra-se)
• O progresso anterior NÃO se perdeu — está gravado no cérebro`,
  },
  {
    id: 'a8',
    title: 'Mãe que Trabalha Fora',
    readTime: '5 min',
    content: `Trabalhar e fazer o método ao mesmo tempo é possível, mas requer estratégia.

PLANEAMENTO:
• Começa o método numa SEXTA-FEIRA — tens o fim-de-semana para os piores dias
• As noites 1-3 são as mais difíceis — idealmente não trabalhas no dia seguinte
• Alterna despertares com o parceiro
• Se estás sozinha, faz sestas quando o bebé dorme (anula tudo o resto)

NO TRABALHO:
• Avisa colegas que podes estar mais cansada
• Evita decisões importantes nos Dias 2-4
• Cafeína moderada (afecta o leite materno em excesso)
• Soneca de 20 min na hora de almoço, se possível

CULPA MATERNA:
"Não estou em casa o dia todo e ainda tiro a mama à noite?"
→ Não estás a tirar. Estás a ensinar. Mamar durante o dia continua. O que muda é a associação mama = adormecer.
→ Bebés de mães trabalhadoras dormem TÃO BEM quanto os de mães que ficam em casa — desde que o método seja consistente à noite.`,
  },
];
