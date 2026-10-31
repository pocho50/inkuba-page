import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const articles = await queryCollection(event, 'blog').all()
  const paths = [
    '/',
    '/ia-search',
    '/blog',
    ...articles.filter(article => !article.draft).map(article => article.path)
  ]
  const urls = paths.map((path) => {
    const location = `https://inkuba.com${path}`
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll('\'', '&apos;')
    return `  <url><loc>${location}</loc></url>`
  })

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.join('\n')
    + '\n</urlset>\n'
})
