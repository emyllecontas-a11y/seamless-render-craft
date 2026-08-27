// Mock estático de simulados. Estrutura pensada para receber dados de PDF futuramente.

export type Alternativa = { letra: string; texto: string; correta?: boolean; comentario?: string };

export type Questao = {
  id: number;
  numero: number;
  area: string;
  enunciado: string;
  alternativas: Alternativa[];
  comentario?: string;
};

export type SimuladoStatus = "nao-iniciado" | "em-andamento" | "concluido";

export type Simulado = {
  id: string;
  titulo: string;
  descricao: string;
  area: string;
  nivel: string;
  banca: string;
  ano: number;
  questoes: number;
  minutos: number;
  status: SimuladoStatus;
  progresso: number; // questões respondidas
  resultado?: { acertos: number; erros: number; naoRespondidas: number; tempo: string };
};

export const SIMULADOS: Simulado[] = [
  {
    id: "enare-odonto",
    titulo: "Simulado ENARE — Odontologia",
    descricao: "Prova completa no formato oficial, cobrindo todas as grandes áreas.",
    area: "Multidisciplinar",
    nivel: "Avançado",
    banca: "ENARE",
    ano: 2025,
    questoes: 50,
    minutos: 120,
    status: "nao-iniciado",
    progresso: 0,
  },
  {
    id: "sus-legislacao",
    titulo: "Simulado — SUS e Legislação",
    descricao: "Princípios, diretrizes, financiamento e políticas públicas de saúde.",
    area: "SUS",
    nivel: "Intermediário",
    banca: "ENARE",
    ano: 2025,
    questoes: 30,
    minutos: 60,
    status: "em-andamento",
    progresso: 12,
  },
  {
    id: "patologia-oral",
    titulo: "Simulado — Patologia Oral",
    descricao: "Lesões fundamentais, cistos, tumores odontogênicos e diagnóstico.",
    area: "Patologia",
    nivel: "Avançado",
    banca: "Autoral",
    ano: 2026,
    questoes: 40,
    minutos: 90,
    status: "concluido",
    progresso: 40,
    resultado: { acertos: 31, erros: 8, naoRespondidas: 1, tempo: "1h 12min" },
  },
  {
    id: "periodontia-cirurgia",
    titulo: "Simulado — Periodontia e Cirurgia",
    descricao: "Classificação 2017, terapia periodontal e exodontias complexas.",
    area: "Periodontia",
    nivel: "Intermediário",
    banca: "Autoral",
    ano: 2026,
    questoes: 25,
    minutos: 50,
    status: "nao-iniciado",
    progresso: 0,
  },
];

const BASE: Omit<Questao, "id" | "numero">[] = [
  {
    area: "SUS · Legislação",
    enunciado:
      "Em abril de 2025, entrou em vigor uma atualização importante na Lei nº 8.080/1990, que passou a incluir expressamente um novo princípio organizativo para o Sistema Único de Saúde (SUS): a humanização. Assinale a alternativa que expressa corretamente o conteúdo relacionado a esse novo princípio.",
    alternativas: [
      { letra: "A", texto: "Estabelece metas objetivas para aumento da produtividade dos serviços, priorizando o atendimento por ordem de chegada.", comentario: "Produtividade não é o eixo do princípio da humanização." },
      { letra: "B", texto: "Garante o uso preferencial de tecnologias digitais e de inteligência artificial como substitutas da escuta clínica.", comentario: "A tecnologia não substitui a escuta qualificada." },
      { letra: "C", texto: "Reflete a preocupação com o vínculo entre trabalhadores da saúde e usuários, promovendo escuta, acolhimento e valorização mútua.", correta: true, comentario: "A humanização trata do vínculo, acolhimento e valorização de usuários e profissionais." },
      { letra: "D", texto: "Determina que o atendimento médico seja sempre individualizado e exclusivamente clínico, reduzindo a burocracia dos protocolos.", comentario: "Restringe o cuidado ao ato clínico, contrariando a integralidade." },
      { letra: "E", texto: "Prioriza ações de vigilância em saúde coletiva focadas no risco epidemiológico e no isolamento de sintomáticos.", comentario: "Descreve vigilância, não humanização." },
    ],
    comentario:
      "A humanização como princípio organizativo reforça o acolhimento, a escuta qualificada e o vínculo entre equipes e usuários, valorizando também os profissionais de saúde.",
  },
  {
    area: "Patologia Oral",
    enunciado:
      "Paciente de 32 anos apresenta lesão radiolúcida multilocular em região posterior de mandíbula, com expansão de corticais e reabsorção radicular. Qual a hipótese diagnóstica mais provável?",
    alternativas: [
      { letra: "A", texto: "Cisto radicular.", comentario: "Geralmente unilocular e associado a dente com necrose pulpar." },
      { letra: "B", texto: "Ameloblastoma multicístico.", correta: true, comentario: "Aspecto em 'favo de mel', expansão de corticais e reabsorção radicular são clássicos." },
      { letra: "C", texto: "Granuloma periapical.", comentario: "Lesão pequena, periapical e unilocular." },
      { letra: "D", texto: "Displasia cemento-óssea florida.", comentario: "Lesão mista, frequentemente bilateral e em mulheres negras de meia-idade." },
      { letra: "E", texto: "Osteomielite crônica.", comentario: "Cursa com sintomatologia infecciosa e sequestro ósseo." },
    ],
    comentario: "O ameloblastoma multicístico é a lesão odontogênica agressiva mais comum com esse padrão radiográfico.",
  },
  {
    area: "Farmacologia",
    enunciado:
      "Qual é o antibiótico de primeira escolha para profilaxia de endocardite infecciosa em paciente sem alergia a betalactâmicos, previamente a procedimento odontológico invasivo?",
    alternativas: [
      { letra: "A", texto: "Azitromicina 500 mg.", comentario: "Alternativa apenas em alérgicos." },
      { letra: "B", texto: "Clindamicina 600 mg.", comentario: "Historicamente usada em alérgicos; hoje preterida." },
      { letra: "C", texto: "Amoxicilina 2 g, dose única, 1 hora antes.", correta: true, comentario: "Regime padrão recomendado pelas diretrizes." },
      { letra: "D", texto: "Metronidazol 400 mg.", comentario: "Espectro anaeróbio, não indicado para profilaxia." },
      { letra: "E", texto: "Cefalexina 500 mg por 7 dias.", comentario: "Profilaxia é dose única, não esquema prolongado." },
    ],
    comentario: "Amoxicilina 2 g VO em dose única 30–60 minutos antes do procedimento é o esquema de escolha.",
  },
];

export function gerarQuestoes(total: number): Questao[] {
  return Array.from({ length: total }, (_, i) => {
    const base = BASE[i % BASE.length];
    return { ...base, id: i + 1, numero: i + 1 };
  });
}

export const statusLabel: Record<SimuladoStatus, string> = {
  "nao-iniciado": "Não iniciado",
  "em-andamento": "Em andamento",
  concluido: "Concluído",
};
