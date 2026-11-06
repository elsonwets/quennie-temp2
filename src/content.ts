/**
 * Quennie — single source of truth for copy, projects and contact data.
 * Info source: TikTok @quennieinteriordesign + linktr.ee/quennieinteriordesign.
 *
 * ⚠️ Project photos are Unsplash placeholders and testimonials are drafts:
 *    replace them with the client's real photos & real reviews before launch.
 */

export const SITE_URL = 'https://www.quennie.com' // TODO: domínio definitivo

export const contact = {
  whatsappNumber: '245956191086',
  whatsappDisplay: '+245 956 191 086',
  instagram: 'https://www.instagram.com/quennieinteriordesign/',
  facebook: 'https://www.facebook.com/quenniedesingeinteriores/',
  tiktok: 'https://www.tiktok.com/@quennieinteriordesign',
  regions: ['Guiné-Bissau', 'Portugal'],
}

export function whatsappLink(message = 'Olá Quennie! Gostaria de pedir um orçamento para o meu projeto.') {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`
}

/** Unsplash CDN helper — responsive, auto-format (AVIF/WebP). */
export function img(id: string, w = 1600, q = 72) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`
}
export function srcSet(id: string, widths = [480, 800, 1200, 1800]) {
  return widths.map((w) => `${img(id, w)} ${w}w`).join(', ')
}

export const services = [
  {
    n: '01',
    title: 'Design de Interiores',
    text: 'Conceito, plantas e projeto 3D. Visualize cada detalhe antes da obra começar.',
    image: '1600210492486-724fe5c67fb0',
  },
  {
    n: '02',
    title: 'Remodelações',
    text: 'Coordenamos a obra do início ao fim — decisões, produção e montagem num só interlocutor.',
    image: '1600607687939-ce8a6c25118c',
  },
  {
    n: '03',
    title: 'Fabrico de Mobiliário',
    text: 'Peças desenhadas para o seu espaço: móveis de TV, cadeirões, mesas, roupeiros.',
    image: '1555041469-a586c61ea9bc',
  },
  {
    n: '04',
    title: 'Cortinados & Estores',
    text: 'Produzidos à medida, pensados para a luz, a proporção e o ambiente de cada divisão.',
    image: '1631679706909-1844bbd07221',
  },
]

export const sectors = ['Casas', 'Espaços Comerciais', 'Hotelaria', 'Restauração', 'Escritórios']

export type Category = 'Casas' | 'Escritórios' | 'Hotelaria' | 'Restauração'

export type Project = {
  slug: string
  title: string
  italic: string
  category: Category
  place: string
  year: string
  services: string[]
  excerpt: string
  story: string[]
  cover: string
  gallery: string[]
  palette: string[]
}

export const projects: Project[] = [
  {
    slug: 'sala-verde-e-ouro',
    title: 'Verde',
    italic: '& ouro',
    category: 'Casas',
    place: 'Residência privada',
    year: '2026',
    services: ['Design de Interiores', 'Mobiliário à medida', 'Cortinados'],
    excerpt: 'Cadeirões verdes, madeira na zona da TV e apontamentos dourados numa sala onde é difícil escolher um só detalhe.',
    story: [
      'O ponto de partida foi o contraste: um verde profundo nos cadeirões contra a calidez da madeira que envolve a zona da TV.',
      'Os apontamentos dourados — molduras, pés de mesa, luminárias — ligam tudo sem pesar. A arte nas paredes fecha a composição.',
    ],
    cover: '1617806118233-18e1de247200',
    gallery: ['1616486338812-3dadae4b4ace', '1555041469-a586c61ea9bc', '1618219908412-a29a1bb7b86e'],
    palette: ['#2f4a3c', '#b0805a', '#c9a35b', '#efe7dc'],
  },
  {
    slug: 'duas-zonas-um-ambiente',
    title: 'Duas zonas,',
    italic: 'um ambiente',
    category: 'Casas',
    place: 'Apartamento',
    year: '2025',
    services: ['Design de Interiores', 'Remodelação', 'Iluminação'],
    excerpt: 'Na sala de jantar, linhas leves, vidro e dourado. Na sala de estar, um azul profundo. Duas personalidades, um só espaço.',
    story: [
      'Uma planta aberta pede continuidade. Definimos dois registos — leveza na zona de refeições, profundidade na zona de estar — e um fio condutor de materiais.',
      'A iluminação foi decidida desde o primeiro esboço: o tom da luz muda por completo a sensação de cada zona.',
    ],
    cover: '1600121848594-d8644e57abab',
    gallery: ['1600210492486-724fe5c67fb0', '1600566753190-17f0baa2a6c3', '1615529182904-14819c35db37'],
    palette: ['#1f2f4a', '#d9cbb5', '#c9a35b', '#f4efe7'],
  },
  {
    slug: 'escritorio-com-identidade',
    title: 'Escritório',
    italic: 'com identidade',
    category: 'Escritórios',
    place: 'Espaço profissional',
    year: '2026',
    services: ['Design de Interiores', 'Mobiliário', 'Cortinados à medida'],
    excerpt: 'Um escritório pensado para a forma como é realmente vivido todos os dias — com cortinados produzidos à medida.',
    story: [
      'Antes de escolher peças, percebemos como o espaço ia funcionar e o que devia transmitir aos clientes que o visitam.',
      'Os cortinados, produzidos pela Quennie, adaptam-se às dimensões exatas das janelas e suavizam a acústica e a luz.',
    ],
    cover: '1598928506311-c55ded91a20c',
    gallery: ['1497366216548-37526070297c', '1524758631624-e2822e304c36', '1600494603989-9650cf6ddd3d'],
    palette: ['#3d4a3a', '#e8e1d4', '#8c6a4f', '#f6f2ec'],
  },
  {
    slug: 'quarto-classico',
    title: 'Clássico',
    italic: 'intemporal',
    category: 'Casas',
    place: 'Moradia',
    year: '2025',
    services: ['Design de Interiores', 'Têxteis', 'Decoração'],
    excerpt: 'Nem todos os interiores precisam de seguir tendências. Detalhes clássicos, tecidos nobres e dourados discretos.',
    story: [
      'Uma cabeceira capitonê, mesas de cabeceira laqueadas e uma paleta de cinzas quentes — o clássico sem rigidez.',
      'Os tecidos fazem o trabalho pesado: cortinados longos, almofadas em camadas e uma banqueta aos pés da cama.',
    ],
    cover: '1505693416388-ac5ce068fe85',
    gallery: ['1540518614846-7eded433c457', '1513694203232-719a280e022f', '1611892440504-42a792e24d32'],
    palette: ['#6f6a66', '#e9e2d8', '#b89b72', '#2a2725'],
  },
  {
    slug: 'suite-hotel',
    title: 'Suite',
    italic: 'de hotel',
    category: 'Hotelaria',
    place: 'Unidade hoteleira',
    year: '2025',
    services: ['Design de Interiores', 'Mobiliário', 'Iluminação'],
    excerpt: 'Madeira, luz âmbar e linho. Uma suite que acolhe como uma casa e funciona como um hotel.',
    story: [
      'Na hotelaria, cada material tem de ser bonito no primeiro dia e resistente no milésimo. Escolhemos madeiras maciças e têxteis de alto tráfego.',
      'A luz indireta, embutida no teto, cria a atmosfera âmbar que os hóspedes recordam.',
    ],
    cover: '1582719478250-c89cae4dc85b',
    gallery: ['1566073771259-6a8506099945', '1615874959474-d609969a20ed', '1600585154526-990dced4db0d'],
    palette: ['#3b2a20', '#a5774f', '#e2c9a3', '#f3ece2'],
  },
  {
    slug: 'restaurante',
    title: 'Mesa',
    italic: 'posta',
    category: 'Restauração',
    place: 'Restaurante',
    year: '2026',
    services: ['Design de Interiores', 'Remodelação', 'Mobiliário'],
    excerpt: 'Um restaurante onde a luz, a madeira e o metal escuro desenham a noite à volta de cada mesa.',
    story: [
      'O conceito partiu do momento do jantar: luz baixa e quente sobre cada mesa, o resto da sala em penumbra.',
      'Mobiliário robusto, banquetas estofadas e uma distribuição que equilibra intimidade e capacidade.',
    ],
    cover: '1517248135467-4c7edcad34c4',
    gallery: ['1414235077428-338989a2e8c0', '1550581190-9c1c48d21d6c', '1484101403633-562f891dc89a'],
    palette: ['#1d1a17', '#7a5a3a', '#c99a5b', '#efe6da'],
  },
]

export const categories: Array<'Todos' | Category> = ['Todos', 'Casas', 'Escritórios', 'Hotelaria', 'Restauração']

export const process = [
  {
    n: '01',
    title: 'Escutar',
    text: 'Visitamos o espaço e definimos três coisas antes de tudo: função, arrumação e ambiente.',
  },
  {
    n: '02',
    title: 'Projetar em 3D',
    text: 'Antes da obra começar, o projeto ganha vida em 3D. Veja cada detalhe antes da transformação real.',
  },
  {
    n: '03',
    title: 'Produzir',
    text: 'Obra, mobiliário e cortinados produzidos à medida — coordenados por uma só equipa.',
  },
  {
    n: '04',
    title: 'Entregar',
    text: 'Montagem, styling final e chave na mão. O resultado é só a última fase de um processo cuidado.',
  },
]

/** ⚠️ Draft testimonials — replace with real client reviews (Google / WhatsApp) before launch. */
export const testimonials = [
  {
    quote: 'Viram a nossa sala em 3D antes de mexerem numa parede. O resultado ficou exatamente como no projeto — melhor, até.',
    name: 'Mariama S.',
    context: 'Sala de estar · Bissau',
  },
  {
    quote: 'Os cortinados à medida mudaram completamente o escritório. Mais luz, menos ruído, e os clientes reparam logo.',
    name: 'Rui A.',
    context: 'Escritório · Lisboa',
  },
  {
    quote: 'Um só interlocutor para a obra, os móveis e a decoração. Para quem não tem tempo, isto vale tudo.',
    name: 'Fatumata B.',
    context: 'Remodelação completa · Bissau',
  },
  {
    quote: 'Pedimos uma suite que parecesse casa. Os hóspedes perguntam onde comprar o candeeiro.',
    name: 'Direção do hotel',
    context: 'Hotelaria',
  },
]

export const stats = [
  { value: 2, suffix: '', label: 'países com obra' },
  { value: 4, suffix: '', label: 'setores — casas, comércio, hotelaria, restauração' },
  { value: 100, suffix: '%', label: 'cortinados produzidos à medida' },
]
