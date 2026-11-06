import { SITE_URL, contact, img, projects } from './content'

type SeoInput = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
}

const DEFAULT_IMAGE = img('1600121848594-d8644e57abab', 1200, 75)

export function seo({ title, description, path, image = DEFAULT_IMAGE, type = 'website' }: SeoInput) {
  const url = `${SITE_URL}${path}`
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Quennie — Home Concept & Interior Design' },
      { property: 'og:locale', content: 'pt_PT' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

export function jsonLd(data: object) {
  return { type: 'application/ld+json', children: JSON.stringify(data) }
}

export const businessLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${SITE_URL}/#business`,
  name: 'Quennie — Home Concept & Interior Design',
  alternateName: 'Quennie Interior Design',
  description:
    'Design de interiores, remodelações, fabrico de mobiliário e cortinados & estores à medida para casas, espaços comerciais, hotelaria e restauração.',
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  telephone: contact.whatsappDisplay.replace(/\s/g, ''),
  areaServed: [
    { '@type': 'Country', name: 'Guiné-Bissau' },
    { '@type': 'Country', name: 'Portugal' },
  ],
  sameAs: [contact.instagram, contact.facebook, contact.tiktok],
  knowsAbout: ['Design de interiores', 'Remodelação', 'Mobiliário por medida', 'Cortinados à medida', 'Estores', 'Projeto 3D'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços',
    itemListElement: ['Design de Interiores', 'Remodelações', 'Fabrico de Mobiliário', 'Cortinados & Estores à medida'].map(
      (name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } }),
    ),
  },
}

export const portfolioLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Projetos realizados pela Quennie',
  itemListElement: projects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${SITE_URL}/projetos/${p.slug}`,
    name: `${p.title} ${p.italic}`,
  })),
}
