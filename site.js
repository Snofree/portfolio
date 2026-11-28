'use strict';
let currentLang = 'pt';
let activeId = null;
let lastFocus = null;

function imgFallback(el) {
  const list = (el.dataset.fallbacks || '').split('|').filter(Boolean);
  if (list.length) { el.src = list.shift(); el.dataset.fallbacks = list.join('|'); return; }
  const box = el.dataset.hide && el.closest(el.dataset.hide);
  if (box) box.remove(); else el.style.visibility = 'hidden';
}
const imgAttrs = (sources) => {
  const list = (sources || []).filter(Boolean);
  return `src="${esc(list[0] || '')}" data-fallbacks="${esc(list.slice(1).join('|'))}"`;
};
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SMALL = ['de', 'da', 'do', 'das', 'dos', 'e', 'para', 'a', 'o', 'and', 'of', 'the'];
const titleCase = (s) => String(s).toLowerCase().split(' ').map((w, i) =>
  (i > 0 && SMALL.includes(w)) ? w : w.replace(/^\p{L}/u, c => c.toUpperCase())).join(' ');

// =========================================================
// TEXTOS
// =========================================================
const i18n = {
  pt: {
    nav_work: 'Trabalhos', nav_about: 'Sobre', nav_contact: 'Contato',
    hero_title: 'Design<span class="sl r">/</span><br>para<span class="sl b">/</span><br>pessoas<span class="y">.</span>',
    hero_text: 'Sou Vinicius Dias, designer e diagramador em São Paulo. Crio soluções visuais com interesse especial em acessibilidade e cultura.',
    cta_work: 'Ver trabalhos', cta_contact: 'Contato',
    ticker: ['Editorial', 'Identidade visual', 'Acessibilidade', 'Cultura', 'Diagramação', 'Branding'],
    work_title: 'Trabalhos', projects: 'projetos',
    about_title: 'Sobre',
    bio_lead: 'Me interesso por criar soluções visuais para pessoas, principalmente quando o assunto é acessibilidade e cultura.',
    bio_1: 'Gosto do editorial porque ele apresenta as coisas de um jeito único: é físico, num mundo cada vez mais digital. Mas não descarto o digital. Trabalho com ele também, principalmente em branding.',
    bio_2: 'Sou formado em Design pela Universidade São Judas Tadeu e hoje diagramo livros na Editora Online.',
    exp_title: 'Experiência', now: 'Atual',
    skill_1: 'Editorial', skill_1_d: 'Livros, revistas, catálogos e relatórios, do projeto gráfico ao arquivo de impressão.',
    skill_2: 'Identidade visual', skill_2_d: 'Marcas, sistemas visuais e manuais de aplicação.',
    skill_3: 'Social media', skill_3_d: 'Peças digitais que mantêm a marca coerente fora do papel.',
    contact_q: 'Tem um projeto editorial, uma marca ou uma ideia? Escreve pra mim.',
    copy: 'Copiar e-mail', copied: 'E-mail copiado', copy_fail: 'Não deu pra copiar',
    back_top: 'Voltar ao topo ↑', back: '← Voltar',
    m_year: 'Ano', m_client: 'Contexto', m_area: 'Área', m_deliv: 'Entregas', m_team: 'Em grupo com', group: 'em grupo',
    challenge: 'Contexto', solution: 'Solução', next: 'Próximo projeto'
  },
  en: {
    nav_work: 'Work', nav_about: 'About', nav_contact: 'Contact',
    hero_title: 'Design<span class="sl r">/</span><br>for<span class="sl b">/</span><br>people<span class="y">.</span>',
    hero_text: 'I’m Vinicius Dias, a designer and layout artist in São Paulo. I create visual solutions with a particular interest in accessibility and culture.',
    cta_work: 'See work', cta_contact: 'Contact',
    ticker: ['Editorial', 'Visual identity', 'Accessibility', 'Culture', 'Layout', 'Branding'],
    work_title: 'Work', projects: 'projects',
    about_title: 'About',
    bio_lead: 'I’m interested in creating visual solutions for people, especially when it comes to accessibility and culture.',
    bio_1: 'I love editorial design because it presents things in a unique way: it’s physical, in an increasingly digital world. But I don’t dismiss digital. I work with it too, mostly in branding.',
    bio_2: 'I hold a degree in Design from Universidade São Judas Tadeu and currently lay out books at Editora Online.',
    exp_title: 'Experience', now: 'Current',
    skill_1: 'Editorial', skill_1_d: 'Books, magazines, catalogs and reports, from layout system to print-ready files.',
    skill_2: 'Visual identity', skill_2_d: 'Brands, visual systems and guidelines.',
    skill_3: 'Social media', skill_3_d: 'Digital pieces that keep a brand consistent off the page.',
    contact_q: 'Have an editorial project, a brand or an idea? Write to me.',
    copy: 'Copy email', copied: 'Email copied', copy_fail: 'Couldn’t copy',
    back_top: 'Back to top ↑', back: '← Back',
    m_year: 'Year', m_client: 'Context', m_area: 'Field', m_deliv: 'Deliverables', m_team: 'Team project with', group: 'team project',
    challenge: 'Context', solution: 'Solution', next: 'Next project'
  }
};
const t = (k) => i18n[currentLang][k];

// Nome, área, cor e posição de cada projeto
const DISPLAY = {
  'proj-01':    { slug: 'mesp',          color: 'var(--blue)',   fg: 'var(--paper)', pt: ['MESP', 'Identidade visual'],        en: ['MESP', 'Visual identity'] },
  'proj-02':    { slug: 'aura-brasil',   color: 'var(--yellow)',    fg: 'var(--ink)', pt: ['Aura Brasil', 'Revista'],           en: ['Aura Brasil', 'Magazine'] },
  'proj-town':  { slug: 'the-town',      color: 'var(--red)',    fg: 'var(--paper)', pt: ['The Town', 'Rebranding de festival'],  en: ['The Town', 'Festival rebranding'] },
  'proj-03':    { slug: 'a-metamorfose', color: 'var(--yellow)', fg: 'var(--ink)',   pt: ['A Metamorfose', 'Design de livro'], en: ['The Metamorphosis', 'Book design'] },
  'proj-ecoar': { slug: 'ecoar',         color: 'var(--blue)',   fg: 'var(--paper)', pt: ['Ecoar', 'Interface e identidade'],  en: ['Ecoar', 'Interface and identity'] },
  'proj-04':    { slug: 'colecao',       color: 'var(--red)',    fg: 'var(--paper)', pt: ['Coleção', 'Projetos diversos'],     en: ['Collection', 'Assorted work'] }
};
const ORDER = ['proj-01', 'proj-town', 'proj-02', 'proj-03', 'proj-ecoar', 'proj-04'];
const HERO = ['proj-01', 'proj-town', 'proj-02', 'proj-03', 'proj-ecoar'];

// Grade Mondrian dos trabalhos (12 colunas): [coluna, linha]
const GRID = [
  { id: 'proj-01',    c: '1 / 9',   r: '1 / 4' },
  { id: 'proj-town',  c: '9 / 13',  r: '1 / 3' },
  { deco: 'blue',     c: '9 / 11',  r: '3 / 4' },
  { deco: 'yellow circle', c: '11 / 13', r: '3 / 4' },
  { id: 'proj-03',    c: '1 / 5',   r: '4 / 8' },
  { id: 'proj-02',    c: '5 / 13',  r: '4 / 6' },
  { id: 'proj-ecoar', c: '5 / 10',  r: '6 / 8' },
  { deco: 'red',      c: '10 / 13', r: '6 / 7' },
  { deco: 'yellow',   c: '10 / 13', r: '7 / 8' },
  { id: 'proj-04',    c: '1 / 10',  r: '8 / 10' },
  { deco: 'blue',     c: '10 / 13', r: '8 / 9' },
  { deco: 'ink',      c: '10 / 13', r: '9 / 10' }
]

const experienceData = [
  { year: '2025', current: true,
    pt: { role: 'Diagramador Jr.', org: 'Editora Online' },
    en: { role: 'Junior Layout Designer', org: 'Editora Online' } },
  { year: '2024',
    pt: { role: 'Estagiário de Diagramação', org: 'Editora Online' },
    en: { role: 'Layout Design Intern', org: 'Editora Online' } },
  { year: '2023',
    pt: { role: 'Social Media', org: 'Fábula Comunicação' },
    en: { role: 'Social Media Designer', org: 'Fábula Comunicação' } }
];

// =========================================================
// PROJETOS
// =========================================================
// Coleção: peças soltas. w/h = proporção da imagem. Para adicionar uma peça,
// salve como img/colecao-13.webp e acrescente uma linha aqui.
const collectionItems = [
  { w: 850,  h: 850,  pt: ['WAVE E-SPORTS CLUB · CONCEITUAL', 'UNIFORME · CAMISA', 'Projeto conceitual de identidade para um time de e-sports.'],        en: ['WAVE E-SPORTS CLUB · CONCEPT', 'KIT · JERSEY', 'Concept identity project for an e-sports team.'] },
  { w: 800,  h: 800,  pt: ['WAVE E-SPORTS CLUB · CONCEITUAL', 'UNIFORME · COSTAS', 'Projeto conceitual de identidade para um time de e-sports.'],        en: ['WAVE E-SPORTS CLUB · CONCEPT', 'KIT · BACK', 'Concept identity project for an e-sports team.'] },
  { w: 1400, h: 1120, pt: ['WAVE E-SPORTS CLUB · CONCEITUAL', 'JAQUETA · FRENTE', 'Projeto conceitual de identidade para um time de e-sports.'],         en: ['WAVE E-SPORTS CLUB · CONCEPT', 'JACKET · FRONT', 'Concept identity project for an e-sports team.'] },
  { w: 1400, h: 1120, pt: ['WAVE E-SPORTS CLUB · CONCEITUAL', 'JAQUETA · COSTAS', 'Projeto conceitual de identidade para um time de e-sports.'],         en: ['WAVE E-SPORTS CLUB · CONCEPT', 'JACKET · BACK', 'Concept identity project for an e-sports team.'] },
  { w: 1080, h: 1359, pt: ['WAVE E-SPORTS CLUB · CONCEITUAL', 'SOCIAL MEDIA · RESULTADO', 'Projeto conceitual de identidade para um time de e-sports.'], en: ['WAVE E-SPORTS CLUB · CONCEPT', 'SOCIAL MEDIA · MATCH RESULT', 'Concept identity project for an e-sports team.'] },
  { w: 1400, h: 1008, pt: ['BÍBLIA PARA CRIANÇAS', 'EDITORIAL · CAPA', 'Desenvolvido na Editora Online.'],       en: ['CHILDREN’S BIBLE', 'EDITORIAL · COVER', 'Designed at Editora Online.'] },
  { w: 1400, h: 1008, pt: ['BÍBLIA PARA CRIANÇAS', 'CAPA, LOMBADA & CONTRACAPA', 'Desenvolvido na Editora Online.'], en: ['CHILDREN’S BIBLE', 'COVER, SPINE & BACK', 'Designed at Editora Online.'] },
  { w: 1400, h: 980,  pt: ['HELLO KITTY — CUTE & COMFY', 'EDITORIAL · CAPA', 'Desenvolvido na Editora Online.'], en: ['HELLO KITTY — CUTE & COMFY', 'EDITORIAL · COVER', 'Designed at Editora Online.'] },
  { w: 1400, h: 980,  pt: ['HELLO KITTY — CUTE & COMFY', 'CAPA, LOMBADA & CONTRACAPA', 'Desenvolvido na Editora Online.'], en: ['HELLO KITTY — CUTE & COMFY', 'COVER, SPINE & BACK', 'Designed at Editora Online.'] },
  { w: 1400, h: 935,  pt: ['HELLO KITTY — 1500 ADESIVOS', 'PRANCHETA PARA COLORIR', 'Desenvolvido na Editora Online.'], en: ['HELLO KITTY — 1500 STICKERS', 'COLORING BOARD BOOK', 'Designed at Editora Online.'] },
  { w: 1400, h: 987,  pt: ['HELLO KITTY — 1500 ADESIVOS', 'EDITORIAL · CAPA', 'Desenvolvido na Editora Online.'], en: ['HELLO KITTY — 1500 STICKERS', 'EDITORIAL · COVER', 'Designed at Editora Online.'] },
  { w: 1400, h: 1129, pt: ['BURGREEN — GREENLY', 'EMBALAGEM'],                en: ['BURGREEN — GREENLY', 'PACKAGING'] }
].map((it, i) => {
  const src = `img/colecao-${String(i + 1).padStart(2, '0')}.webp`;
  return {
    num: `#${String(i + 1).padStart(2, '0')}`,
    ratio: `${it.w} / ${it.h}`,
    images: [src],
    full: src,
    pt: { title: it.pt[0], tag: it.pt[1], desc: it.pt[2] || '' },
    en: { title: it.en[0], tag: it.en[1], desc: it.en[2] || '' }
  };
});

const projectsData = [
  {
    id: 'proj-01',
    team: ['Matheus Macedo Maximiliano', 'Fernando Guarnieri da Silva', 'Caio Azevedo Camilo', 'André Zandonade Fernandes', 'Guilherme Mariano Caetano'],
    num: '01',
    category: 'identity',
    year: '2024',
    images: ['img/mesp-capa.webp'],
    // { strip: [...] } = lâminas empilhadas sem espaço, como no Behance (as formas continuam de uma para a outra)
    gallery: [
      // 01–18 = manual de marca (lâminas do Behance) · 19–21 = mockups (crachá, camisa, outdoor)
      { strip: Array.from({ length: 21 }, (_, i) => `img/mesp-${String(i + 1).padStart(2, '0')}.webp`) }
    ],
    layoutType: 'standard',
    featuredDefault: true,
    pt: {
      title: 'MESP',
      tag: 'IDENTIDADE VISUAL · REBRANDING',
      tagline: 'Moderna, educativa e voltada à conscientização.',
      client: 'Projeto acadêmico — Museu da Energia de São Paulo',
      mockupLabel: 'MESP — MUSEU DA ENERGIA DE SP',
      summary: 'Projeto acadêmico de rebranding para o Museu da Energia de São Paulo, com identidade visual completa e manual de marca.',
      challenge: 'Inaugurado em 2005 em um palacete histórico de 1894, o Museu da Energia de São Paulo discute o uso da energia, a sustentabilidade e o crescimento urbano-industrial da cidade. A proposta era modernizar sua identidade — com cores vibrantes, logotipo dinâmico e tipografia — e estendê-la para sinalização, materiais gráficos e presença digital, reforçando o museu como espaço educativo e cultural que promove a conscientização sobre energia sustentável.',
      solution: 'A marca se apoia em três conceitos — movimento, sustentabilidade e energia — traduzidos em três ondas no azul marinho, no verde ecológico e no laranja energia. A tipografia combina a Glancyr em títulos e chamadas com a Ranade nos textos corridos. Um grafismo derivado da forma básica pode ser rotacionado (0°, 90°, −90° e 180°) e aplicado sobre ou dentro de imagens, e o manual define regras de posicionamento do logo, área de não interferência e aplicações em impressos e telas.',
      deliverables: ['Logotipo', 'Paleta Cromática', 'Sistema Tipográfico', 'Grafismos', 'Manual de Marca', 'Aplicações & Mockups']
    },
    en: {
      title: 'MESP',
      tag: 'VISUAL IDENTITY · REBRANDING',
      tagline: 'Modern, educational, and awareness-driven.',
      client: 'Academic project — São Paulo Energy Museum',
      mockupLabel: 'MESP — SÃO PAULO ENERGY MUSEUM',
      summary: 'Academic rebranding project for the São Paulo Energy Museum, including a full visual identity and brand guidelines.',
      challenge: 'Opened in 2005 inside a historic 1894 mansion, the São Paulo Energy Museum explores energy use, sustainability, and the city’s urban-industrial growth. The goal was to modernize its identity — with vibrant colors, a dynamic logo, and typography — and extend it to signage, print materials, and digital presence, positioning the museum as an educational and cultural space that raises awareness about sustainable energy.',
      solution: 'The brand rests on three concepts — movement, sustainability, and energy — expressed as three waves in navy blue, ecological green, and energy orange. Typography pairs Glancyr for headlines and calls to action with Ranade for body text. A graphic element derived from the basic shape can be rotated (0°, 90°, −90°, and 180°) and placed over or inside images, and the guidelines define logo placement rules, clear space, and print and screen applications.',
      deliverables: ['Logo', 'Color Palette', 'Typographic System', 'Graphic Elements', 'Brand Guidelines', 'Applications & Mockups']
    }
  },
  {
    id: 'proj-02',
    team: ['Gabriela Moreira Reis'],
    num: '02',
    category: 'editorial',
    year: '2023',
    images: ['img/aura-brasil.webp'],
    // Galeria: string = imagem comum (2 por linha); { src, full: true } = largura total, altura natural (sem corte)
    gallery: [
      'img/aura-02.webp',
      'img/aura-03.webp',
      { src: 'img/aura-identidade.webp', full: true }
    ],
    layoutType: 'standard',
    featuredDefault: false,
    pt: {
      title: 'AURA BRASIL',
      tag: 'EDITORIAL · PROJETO ACADÊMICO',
      tagline: 'A revista que conecta-se com a riqueza cultural do Brasil.',
      client: 'Projeto acadêmico',
      mockupLabel: 'AURA BRASIL — REVISTA',
      summary: 'Trabalho acadêmico editorial para a criação de uma revista fictícia dedicada à cultura brasileira contemporânea.',
      challenge: 'Criar uma revista bimestral que abrange desde tradições folclóricas até expressões artísticas atuais, pensada para circular em centros culturais de todo o país. A edição 01 traz na capa a exposição “Segredos”, dos OSGEMEOS, na Pinacoteca de São Paulo.',
      solution: 'O sistema visual parte das cinco regiões do Brasil: cada uma ganha uma cor e um recorte do mapa — azul para o Sudeste, verde para o Norte, vermelho para o Nordeste, laranja para o Centro-Oeste e amarelo para o Sul — que sinalizam as seções da revista. A tipografia combina a serifa expressiva Granderus no logotipo e títulos com a TT Chocolates no texto, acompanhadas de linhas orgânicas que atravessam as páginas.',
      deliverables: ['Logotipo da Revista', 'Projeto Gráfico Editorial', 'Diagramação', 'Capa', 'Paleta & Sistema de Cores']
    },
    en: {
      title: 'AURA BRASIL',
      tag: 'EDITORIAL · ACADEMIC PROJECT',
      tagline: 'The magazine that connects with Brazil’s cultural richness.',
      client: 'Academic project',
      mockupLabel: 'AURA BRASIL — MAGAZINE',
      summary: 'Academic editorial project: creating a fictional magazine dedicated to contemporary Brazilian culture.',
      challenge: 'Designing a bimonthly magazine spanning folk traditions to current artistic expression, meant to be found in cultural centers across the country. Issue 01 features OSGEMEOS’ “Segredos” exhibition at the Pinacoteca de São Paulo on its cover.',
      solution: 'The visual system is built on Brazil’s five regions: each one gets a color and a map cut-out — blue for the Southeast, green for the North, red for the Northeast, orange for the Center-West, and yellow for the South — used to signal the magazine’s sections. Typography pairs the expressive Granderus serif for the masthead and headlines with TT Chocolates for body text, alongside organic lines that flow across the pages.',
      deliverables: ['Magazine Masthead', 'Editorial Design', 'Page Layout', 'Cover', 'Color System']
    }
  },
  {
    id: 'proj-03',
    num: '03',
    category: 'editorial',
    year: '2025',
    images: ['img/metamorfose.webp'],
    // Capa e contracapa lado a lado; depois sumário e abertura de capítulo
    gallery: ['img/metamorfose-02.webp', 'img/metamorfose-03.webp', 'img/metamorfose-04.webp', 'img/metamorfose-05.webp'],
    layoutType: 'standard',
    featuredDefault: false,
    pt: {
      title: 'A METAMORFOSE',
      tag: 'EDITORIAL · DESIGN DE LIVRO',
      tagline: '',
      client: 'Projeto pessoal',
      mockupLabel: 'A METAMORFOSE — FRANZ KAFKA',
      summary: 'Conceito pessoal de projeto editorial para o livro “A Metamorfose”, de Franz Kafka — capa, contracapa, lombada e miolo.',
      challenge: 'Traduzir a ideia central do livro — a transformação de Gregor Samsa em inseto — em uma capa construída a partir da tipografia, e levar essa linguagem para o restante do livro.',
      solution: 'A capa foi concebida a partir da etimologia da palavra: os caracteres do título se transformam à medida que se relacionam entre si, misturando estilos de letra sobre a silhueta de um besouro em vinho e amarelo, com textura gasta. A contracapa inverte as cores e acomoda a citação e a sinopse dentro do inseto. No miolo, a ilustração, o sumário e as aberturas de capítulo retomam as letras “recortadas” da capa.',
      deliverables: ['Design de Capa', 'Contracapa & Lombada', 'Projeto Gráfico do Miolo', 'Tipografia']
    },
    en: {
      title: 'THE METAMORPHOSIS',
      tag: 'EDITORIAL · BOOK DESIGN',
      tagline: '',
      client: 'Personal project',
      mockupLabel: 'THE METAMORPHOSIS — FRANZ KAFKA',
      summary: 'Personal editorial concept for Franz Kafka’s “The Metamorphosis” — front cover, back cover, spine, and interior.',
      challenge: 'Translating the book’s central idea — Gregor Samsa’s transformation into an insect — into a cover built from typography, and carrying that language through the rest of the book.',
      solution: 'The cover stems from the word’s etymology: the title’s characters transform as they relate to one another, mixing letter styles over a beetle silhouette in burgundy and yellow with a worn texture. The back cover inverts the colors and places the quote and synopsis inside the insect. Inside, the illustration, table of contents, and chapter openers echo the cover’s “cut-out” lettering.',
      deliverables: ['Cover Design', 'Back Cover & Spine', 'Interior Layout', 'Typography']
    }
  },
  {
    id: 'proj-ecoar',
    team: ['João Vitor Barbosa', 'Larissa Sanches Hayashi', 'Letticia Edner Ferreira Alves'],
    num: '04',
    category: 'interface',
    year: '2023',
    images: ['img/ecoar.webp'],
    // Logo + paleta em largura total; depois as telas (perfil, avatar, prancha de comunicação)
    gallery: [
      { src: 'img/ecoar-02.webp', full: true },
      'img/ecoar-03.webp', 'img/ecoar-04.webp', 'img/ecoar-05.webp'
    ],
    layoutType: 'standard',
    featuredDefault: false,
    pt: {
      title: 'PROJETO ECOAR',
      tag: 'INTERFACE · TCC',
      tagline: 'Conectando pessoas.',
      client: 'Trabalho de Conclusão de Curso (TCC)',
      mockupLabel: 'ECOAR — INTERFACE COMUNICADORA',
      summary: 'Trabalho de Conclusão de Curso: desenvolvimento de uma interface comunicadora para crianças com TEA.',
      challenge: 'Desenvolver um ecossistema visual voltado ao suporte de pessoas no espectro autista: uma interface de comunicação que reduza ruídos visuais e respeite o processamento sensorial de quem a utiliza.',
      solution: 'A identidade nasce de uma baleia formada por peças de quebra-cabeça — símbolo da conscientização sobre o autismo — com paleta suave de azuis, amarelo e rosa e tipografia arredondada. Na interface, princípios de design inclusivo guiam cada tela: seleção de perfil, criação de um avatar que ajuda a criança a se identificar com a própria fala e uma prancha de comunicação com palavras organizadas por categoria, atalhos de frase (“Quero”, “Eu”, “Tenho”) e botões grandes de sim e não, em layouts de alta legibilidade.',
      deliverables: ['Logotipo & Mascote', 'Paleta de Cores', 'Interface (UI)', 'Sistema de Avatares', 'Layouts de Alta Legibilidade']
    },
    en: {
      title: 'ECOAR PROJECT',
      tag: 'INTERFACE · THESIS PROJECT',
      tagline: 'Connecting people.',
      client: 'Undergraduate Thesis Project',
      mockupLabel: 'ECOAR — COMMUNICATION INTERFACE',
      summary: 'Undergraduate thesis: design of a communication interface for children on the autism spectrum (ASD).',
      challenge: 'Building a visual ecosystem to support people on the autism spectrum: a communication interface that reduces visual noise and respects users’ sensory processing.',
      solution: 'The identity is built around a whale made of puzzle pieces — a symbol of autism awareness — with a soft palette of blues, yellow, and pink and rounded typography. In the interface, inclusive design principles guide every screen: profile selection, an avatar builder that helps children identify with their own speech, and a communication board with words grouped by category, phrase shortcuts (“I want”, “I”, “I have”), and large yes/no buttons, all in high-legibility layouts.',
      deliverables: ['Logo & Mascot', 'Color Palette', 'Interface (UI)', 'Avatar System', 'High-Legibility Layouts']
    }
  },
  {
    id: 'proj-town',
    num: '06',
    category: 'identity',
    year: '2026',
    images: ['img/thetown.webp'],
    imgPos: 'left center',
    // slides em largura total; as duas de cores lado a lado
    gallery: [{ src: 'img/thetown-02.webp', full: true }, { src: 'img/thetown-03.webp', full: true },
              'img/thetown-04.webp', 'img/thetown-05.webp',
              { src: 'img/thetown-06.webp', full: true }, { src: 'img/thetown-07.webp', full: true },
              { src: 'img/thetown-08.webp', full: true }, { src: 'img/thetown-09.webp', full: true }],
    team: ['Guilherme Souza'],
    layoutType: 'standard',
    featuredDefault: false,
    pt: {
      title: 'THE TOWN',
      tag: 'IDENTIDADE VISUAL · REBRANDING',
      tagline: 'Onde os caminhos se encontram.',
      client: 'Projeto acadêmico',
      summary: 'Projeto acadêmico de rebranding do festival The Town, em São Paulo: logotipo, cores, posts e um novo palco principal.',
      challenge: 'O The Town é a pulsação de São Paulo: um festival onde a música conecta, celebra a diversidade e transforma a cidade em ponto de encontro. O público é plural e jovem de espírito, e a nova identidade precisava traduzir esse encontro de tribos que circulam por palcos e ritmos diferentes.',
      solution: 'A identidade nasce do fluxo da cidade e se inspira na malha de metrô e trem de São Paulo, traduzida de forma fluida. O logotipo, com tipografia baseada na Bauhaus 93, usa conexões que lembram a silhueta da cidade e o princípio de fechamento da Gestalt para manter a leitura. As cores vêm das linhas do metrô e cada uma representa um gênero musical, do funk ao pop. O sistema chega aos posts de line-up e ao palco principal, uma estrutura de 110 m de largura feita de linhas abstratas.',
      deliverables: ['Logotipo', 'Cores por Gênero Musical', 'Posts para Redes Sociais', 'Projeto de Palco']
    },
    en: {
      title: 'THE TOWN',
      tag: 'VISUAL IDENTITY · REBRANDING',
      tagline: 'Where paths meet.',
      client: 'Academic project',
      summary: 'Academic rebranding of The Town music festival in São Paulo: logo, colors, social posts, and a new main stage.',
      challenge: 'The Town is São Paulo’s pulse: a festival where music connects people, celebrates diversity, and turns the city into a meeting point. Its audience is diverse and young at heart, and the new identity had to express this meeting of crowds moving between stages and genres.',
      solution: 'The identity grows out of the city’s flow, drawing on São Paulo’s subway and train map in a fluid way. The logo, with lettering based on Bauhaus 93, uses connections that echo the city skyline and the Gestalt principle of closure to stay legible. The colors come from the subway lines, and each one stands for a music genre, from funk to pop. The system extends to line-up posts and to the main stage, a 110 m wide structure made of abstract lines.',
      deliverables: ['Logo', 'Genre Color System', 'Social Media Posts', 'Stage Design']
    }
  },
  {
    id: 'proj-04',
    num: '05',
    category: 'social',
    year: '2023—26',
    images: [collectionItems[0].images[0]],
    layoutType: 'updates',
    featuredDefault: false,
    pt: {
      title: 'COLEÇÃO · PROJETOS PESSOAIS',
      tag: 'ARQUIVO VIVO / SOCIAL / ESTUDOS',
      mockupLabel: 'COLEÇÃO — ARQUIVO',
      summary: 'Projetos diversos: identidade conceitual para e-sports, livros infantis desenvolvidos na Editora Online, social media e embalagem.'
    },
    en: {
      title: 'COLLECTION · PERSONAL WORK',
      tag: 'LIVING ARCHIVE / SOCIAL / STUDIES',
      mockupLabel: 'COLLECTION — ARCHIVE',
      summary: 'Assorted projects: concept e-sports identity, children’s books designed at Editora Online, social media, and packaging.'
    },
    updatesItems: collectionItems
  }
];



// =========================================================
// HOME
// =========================================================
function renderTicker() {
  const shapes = ['sq', 'ci', 'tr'];
  const words = t('ticker');
  const g = (h) => `<div class="ticker-group"${h ? ' aria-hidden="true"' : ''}>${words.map((w, i) => `<span>${w}</span><i class="${shapes[i % 3]}"></i>`).join('')}</div>`;
  document.getElementById('ticker').innerHTML = g(false) + g(true) + g(true) + g(true);
}

function renderWorks() {
  document.getElementById('work-count').textContent = `${pad(ORDER.length)} ${t('projects')}`;
  let k = 0;
  document.getElementById('works').innerHTML = GRID.map(cell => {
    const pos = `grid-column:${cell.c};grid-row:${cell.r};--d:${(k++) * 90}ms`;
    if (cell.deco) return `<div class="deco ${cell.deco} reveal" style="${pos}" aria-hidden="true"></div>`;
    const p = projectsData.find(x => x.id === cell.id);
    if (!p) return '';
    const D = DISPLAY[p.id], [name, kind] = D[currentLang];
    const n = ORDER.indexOf(p.id) + 1;
    return `
      <button class="work reveal" style="${pos};--hc:${D.color};--hf:${D.fg}" data-case="${p.id}" aria-label="${esc(name)}, ${esc(kind)}, ${p.year}">
        <img ${imgAttrs(p.images)} alt="" loading="lazy" style="object-position:${p.imgPos || 'center'}" />
        <span class="tag"><span class="num">${pad(n)}</span><b>${esc(name)}</b><small>${esc(kind)} · ${p.year}</small></span>
      </button>`;
  }).join('');
}

function renderExperience() {
  document.getElementById('exp-list').innerHTML = experienceData.map(e => {
    const d = e[currentLang];
    return `<div class="trow"><span class="y">${e.year}</span><span>${esc(d.role)} <span class="muted">· ${esc(d.org)}</span></span>${e.current ? `<span class="now">${t('now')}</span>` : '<span></span>'}</div>`;
  }).join('');
}

function applyStatic() {
  document.querySelectorAll('[data-i18n]').forEach(el => { const v = i18n[currentLang][el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { const v = i18n[currentLang][el.dataset.i18nHtml]; if (typeof v === 'string') el.innerHTML = v; });
}

function renderAll() {
  applyStatic(); renderTicker(); renderWorks(); renderExperience(); renderHeroLabels(); observe(); requestAnimationFrame(fitAll);
  if (activeId) renderCase(activeId);
}

function setLanguage(lang) {
  if (lang === currentLang) return;
  currentLang = lang;
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.getElementById('btn-pt').setAttribute('aria-pressed', lang === 'pt');
  document.getElementById('btn-en').setAttribute('aria-pressed', lang === 'en');
  try { localStorage.setItem('vd-lang', lang); } catch (e) {}
  renderAll();
}

// =========================================================
// COMPOSIÇÃO DO TOPO: a grade se reequilibra e troca o projeto em destaque
// =========================================================
const LAYOUTS = [
  { c: '1.55fr 1fr .62fr', r: '1.15fr .85fr .7fr', rot: 0 },
  { c: '1.2fr 1.1fr .9fr', r: '1fr 1.1fr .55fr',   rot: 90 },
  { c: '1.7fr .8fr .75fr', r: '1.3fr .6fr .8fr',   rot: 180 },
  { c: '1.35fr 1.2fr .5fr', r: '.95fr 1fr .8fr',   rot: 270 }
];
let heroIndex = 0, heroTimer = null, heroPaused = false, front = 'a';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function heroImage(id) { const p = projectsData.find(x => x.id === id); return p ? p.images : []; }
function renderHeroLabels() {
  const id = HERO[heroIndex];
  document.getElementById('comp-num').textContent = pad(ORDER.indexOf(id) + 1);
  document.getElementById('comp-name').textContent = DISPLAY[id][currentLang][0];
  document.getElementById('comp-img').setAttribute('aria-label', DISPLAY[id][currentLang].join(', '));
  document.getElementById('comp-dots').innerHTML = HERO.map((h, i) =>
    `<button aria-label="${esc(DISPLAY[h][currentLang][0])}" aria-current="${i === heroIndex}" data-hero="${i}"></button>`).join('');
}
function showHero(i, manual) {
  heroIndex = (i + HERO.length) % HERO.length;
  const L = LAYOUTS[heroIndex % LAYOUTS.length];
  const comp = document.getElementById('comp');
  comp.style.setProperty('--c', L.c); comp.style.setProperty('--r', L.r);
  comp.querySelector('.c-yel').style.setProperty('--rot', L.rot + 'deg');
  const a = document.getElementById('comp-a'), b = document.getElementById('comp-b');
  const [show, hide] = front === 'a' ? [b, a] : [a, b];
  const srcs = heroImage(HERO[heroIndex]);
  show.onload = () => { show.classList.remove('out'); hide.classList.add('out'); };
  show.dataset.fallbacks = srcs.slice(1).join('|');
  show.style.objectPosition = (projectsData.find(x => x.id === HERO[heroIndex]) || {}).imgPos || 'center';
  show.src = srcs[0];
  front = front === 'a' ? 'b' : 'a';
  renderHeroLabels();
  if (manual) scheduleHero();
}
function scheduleHero() {
  clearTimeout(heroTimer);
  if (!heroPaused) heroTimer = setTimeout(() => { showHero(heroIndex + 1); scheduleHero(); }, 5000);
}
function initHero() {
  const a = document.getElementById('comp-a');
  const s = heroImage(HERO[0]); a.dataset.fallbacks = s.slice(1).join('|'); a.src = s[0];
  const zone = document.getElementById('comp').parentElement;
  const pause = (v) => { heroPaused = v; v ? clearTimeout(heroTimer) : scheduleHero(); };
  zone.addEventListener('mouseenter', () => pause(true));
  zone.addEventListener('mouseleave', () => pause(false));
  document.addEventListener('visibilitychange', () => pause(document.hidden));
  scheduleHero();
}

// Títulos grandes nunca quebram no meio da palavra: se a palavra mais longa
// não cabe na largura, a fonte diminui até caber (só quebra entre palavras).
function fitText(el) {
  if (!el) return;
  el.style.fontSize = '';
  let size = parseFloat(getComputedStyle(el).fontSize);
  let guard = 60;
  while (el.scrollWidth > el.clientWidth + 1 && size > 18 && guard--) {
    size *= 0.94; el.style.fontSize = size + 'px';
  }
}
function fitAll() {
  document.querySelectorAll('.hero h1, .sec-head h2, #case-title, .case-next .display').forEach(fitText);
}
let fitTimer; addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitAll, 120); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

// =========================================================
// PÁGINA DO PROJETO
// =========================================================
function galleryHTML(project, title) {
  const items = (project.gallery || []).map(g => typeof g === 'string' ? { src: g } : g);
  const regular = items.filter(g => !g.full && !g.strip).length;
  let spanned = false;
  return items.map((g, i) => {
    if (g.strip) return `<div class="strip">${g.strip.map((src, j) => `<img ${imgAttrs([src])} alt="${esc(title)}, lâmina ${j + 1}" loading="lazy" />`).join('')}</div>`;
    let span = '';
    if (g.full) span = 'span2';
    else if (regular % 2 === 1 && !spanned) { span = 'span2'; spanned = true; }
    return `<figure class="${span} g-item"><img ${imgAttrs([g.src])} data-hide=".g-item" alt="${esc(title)}, imagem ${i + 1}" loading="lazy" /></figure>`;
  }).join('');
}

function renderCase(id) {
  const p = projectsData.find(x => x.id === id);
  if (!p) return;
  const d = p[currentLang], D = DISPLAY[id];
  const [name, kind] = D[currentLang];
  const idx = ORDER.indexOf(id);
  const nextId = ORDER[(idx + 1) % ORDER.length], N = DISPLAY[nextId];
  document.getElementById('case-count').textContent = `${pad(idx + 1)} / ${pad(ORDER.length)}`;
  const head = `
    <header class="case-head wrap">
      <span class="caps">${pad(idx + 1)} — ${esc(kind)}</span>
      <h1 class="display" id="case-title">${esc(name)}</h1>
      <div class="stripe" style="--hc:${D.color}"></div>
      ${d.tagline ? `<p class="case-tagline">${esc(d.tagline)}</p>` : ''}
      <p class="case-summary">${esc(d.summary)}</p>
      ${p.layoutType === 'updates' ? '' : `
      <dl class="meta">
        <div><dt class="caps">${t('m_year')}</dt><dd>${p.year}</dd></div>
        <div><dt class="caps">${t('m_client')}</dt><dd>${esc(d.client || '—')}</dd></div>
        <div><dt class="caps">${t('m_area')}</dt><dd>${esc(kind)}</dd></div>
        <div><dt class="caps">${t('m_deliv')}</dt><dd><ul>${d.deliverables.map(x => `<li>${esc(x)}</li>`).join('')}</ul></dd></div>
        ${p.team && p.team.length ? `<div class="team"><dt class="caps">${t('m_team')}</dt>${p.team.map(n => `<dd>${esc(n)}</dd>`).join('')}</div>` : ''}
      </dl>`}
    </header>`;
  let body;
  if (p.layoutType === 'updates') {
    body = `<div class="wrap" style="margin-top:clamp(40px,7vh,72px)"><div class="collection">${(p.updatesItems || []).map(it => {
      const c = it[currentLang];
      const tag = c.tag.charAt(0) + c.tag.slice(1).toLowerCase();
      return `<figure class="c-item">
        <a href="${esc(it.full)}" target="_blank" rel="noopener noreferrer"><img ${imgAttrs(it.images)} data-hide=".c-item" alt="${esc(titleCase(c.title))}" loading="lazy" style="aspect-ratio:${it.ratio}" /></a>
        <figcaption><span class="n">${it.num.replace('#', '')}</span><span class="t">${esc(titleCase(c.title))}</span><span class="d">${esc(tag)}${c.desc ? '. ' + esc(c.desc) : ''}</span></figcaption>
      </figure>`;
    }).join('')}</div></div>`;
  } else {
    body = `
      <div class="wrap">
        <figure class="case-hero"><img ${imgAttrs(p.images)} alt="${esc(name)}" /></figure>
        <div class="case-text">
          <div><h2 class="caps">${t('challenge')}</h2><p>${esc(d.challenge)}</p></div>
          <div><h2 class="caps">${t('solution')}</h2><p>${esc(d.solution)}</p></div>
        </div>
        <div class="gallery">${galleryHTML(p, name)}</div>
      </div>`;
  }
  document.getElementById('case-body').innerHTML = head + body + `
    <button class="case-next" style="--hc:${N.color};--hf:${N.fg}" data-case="${nextId}" data-from-case="1">
      <span><span class="caps">${t('next')}</span><span class="display">${esc(N[currentLang][0])}</span></span>
      <span class="arrow" aria-hidden="true">→</span>
    </button>`;
  requestAnimationFrame(() => { fitText(document.getElementById('case-title')); fitText(document.querySelector('.case-next .display')); });
}

function openCase(id, fromCase) {
  if (!Object.prototype.hasOwnProperty.call(DISPLAY, id)) return;
  const box = document.getElementById('case');
  if (!fromCase) lastFocus = document.activeElement;
  activeId = id;
  renderCase(id);
  box.classList.remove('open'); void box.offsetWidth; box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
  box.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  const slug = DISPLAY[id].slug;
  if (location.hash !== '#' + slug) history.pushState({ case: id }, '', '#' + slug);
  document.getElementById('case-close').focus({ preventScroll: true });
}
function closeCase(fromHistory) {
  if (!activeId) return;
  const box = document.getElementById('case');
  activeId = null;
  box.classList.remove('open'); box.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (!fromHistory && location.hash) history.pushState(null, '', location.pathname + location.search);
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
function caseFromHash() {
  const slug = location.hash.slice(1);
  const id = Object.keys(DISPLAY).find(k => DISPLAY[k].slug === slug);
  if (id) openCase(id, true); else closeCase(true);
}
addEventListener('popstate', caseFromHash);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCase(); });

// =========================================================
// MOVIMENTO
// =========================================================
// Revela blocos quando entram na tela. Checagem pela posição (funciona mesmo com
// elementos recortados por clip-path, que o IntersectionObserver não enxerga).
let pending = [];
function checkReveals() {
  const limit = innerHeight * 0.92;
  pending = pending.filter(el => {
    if (!el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.top < limit && r.bottom > 0) { el.classList.add('in'); return false; }
    return true;
  });
}
function observe() {
  pending = [...document.querySelectorAll('.reveal:not(.in), .rise:not(.in)')];
  checkReveals();
}
let revealTick = false;
const onScrollReveal = () => { if (revealTick) return; revealTick = true; requestAnimationFrame(() => { revealTick = false; checkReveals(); }); };
addEventListener('scroll', onScrollReveal, { passive: true });
addEventListener('resize', onScrollReveal);
// segurança: se algo falhar, nada fica escondido para sempre
setTimeout(() => document.querySelectorAll('.reveal, .rise').forEach(el => {
  const r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in');
}), 2500);

// letreiro acelera com a rolagem e inverte quando a página sobe
(() => {
  const track = document.getElementById('ticker');
  let lastY = scrollY, boost = 0, dir = 1, running = false;
  const frame = () => {
    boost *= 0.9;
    const a = track.getAnimations && track.getAnimations()[0];
    if (a) a.playbackRate = dir * (1 + boost);
    if (boost > 0.03) requestAnimationFrame(frame); else { running = false; if (a) a.playbackRate = dir; }
  };
  addEventListener('scroll', () => {
    if (reduceMotion) return;
    const dy = scrollY - lastY; lastY = scrollY;
    if (Math.abs(dy) > 2) dir = dy > 0 ? 1 : -1;
    boost = Math.min(boost + Math.abs(dy) / 60, 4);
    if (!running) { running = true; requestAnimationFrame(frame); }
  }, { passive: true });
})();

// =========================================================
// CONTATO
// =========================================================
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 2200);
}
async function copyEmail() {
  try { await navigator.clipboard.writeText('dias00448@gmail.com'); toast(t('copied')); }
  catch (e) { toast(t('copy_fail')); }
}

// =========================================================
// CLIQUES E ERROS DE IMAGEM (sem JavaScript embutido no HTML, por segurança)
// =========================================================
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action], [data-lang], [data-case], [data-hero]');
  if (!el) return;
  if (el.dataset.lang) { setLanguage(el.dataset.lang); return; }
  if (el.dataset.case) { openCase(el.dataset.case, !!el.dataset.fromCase); return; }
  if (el.dataset.hero !== undefined) { showHero(Number(el.dataset.hero), true); return; }
  switch (el.dataset.action) {
    case 'top': e.preventDefault(); scrollTo({ top: 0 }); break;
    case 'copy': copyEmail(); break;
    case 'close': closeCase(); break;
    case 'hero-open': openCase(HERO[heroIndex]); break;
  }
});
// imagens que não carregam: tenta a próxima da lista ou esconde o bloco
document.addEventListener('error', (e) => {
  if (e.target && e.target.tagName === 'IMG') imgFallback(e.target);
}, true);

// =========================================================
// INÍCIO
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();
try { if (localStorage.getItem('vd-lang') === 'en') currentLang = 'en'; } catch (e) {}
document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';
document.getElementById('btn-pt').setAttribute('aria-pressed', currentLang === 'pt');
document.getElementById('btn-en').setAttribute('aria-pressed', currentLang === 'en');
renderAll();
initHero();
if (location.hash) caseFromHash();
