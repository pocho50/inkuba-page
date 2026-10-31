import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'
import { createApp, createRouter, defineEventHandler, setHeader, toWebHandler } from 'h3'

async function requestSitemap(articles) {
  const source = await readFile(new URL('../server/routes/sitemap.xml.ts', import.meta.url), 'utf8')
  const handlerSource = source
    .replace('import { queryCollection } from \'@nuxt/content/server\'', '')
    .replace('export default', '')
  const handler = vm.runInNewContext(handlerSource, {
    defineEventHandler,
    setHeader,
    queryCollection(event, collection) {
      assert.equal(event.path, '/sitemap.xml')
      assert.equal(collection, 'blog')
      return { all: async () => articles }
    }
  })
  return toWebHandler(createApp().use(createRouter().get('/sitemap.xml', handler)))(
    new Request('https://preview.example/sitemap.xml')
  )
}

const document = paths => '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + paths.map(path => `  <url><loc>https://inkuba.com${path}</loc></url>`).join('\n')
  + '\n</urlset>\n'

test('sitemap serves fixed routes as absolute XML URLs without invented metadata', async () => {
  const response = await requestSitemap([])
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'application/xml; charset=utf-8')
  assert.equal(await response.text(), document(['/', '/ia-search', '/blog']))
})

test('sitemap preserves publication semantics: missing, null and false drafts are published', async () => {
  const response = await requestSitemap([
    { path: '/blog/published', draft: false },
    { path: '/blog/implicit' },
    { path: '/blog/null', draft: null },
    { path: '/blog/draft', draft: true }
  ])
  assert.equal(response.status, 200)
  assert.equal(await response.text(), document([
    '/', '/ia-search', '/blog', '/blog/published', '/blog/implicit', '/blog/null'
  ]))
})

test('sitemap escapes XML URL text', async () => {
  const response = await requestSitemap([{ path: '/blog/a&b<c>d"e\'f' }])
  assert.equal(response.status, 200)
  assert.equal(await response.text(), document([
    '/', '/ia-search', '/blog', '/blog/a&amp;b&lt;c&gt;d&quot;e&apos;f'
  ]))
})

test('robots allows crawling and advertises the non-www production sitemap', async () => {
  assert.equal(
    await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8'),
    'User-agent: *\nAllow: /\n\nSitemap: https://inkuba.com/sitemap.xml\n'
  )
})
