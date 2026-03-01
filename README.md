# Inkuba Page

Sitio web de Inkuba construido con **Nuxt 4 + Nuxt UI + Nuxt Content**.

Incluye:

- Landing principal con secciones de tecnología, IA, blog y CTA.
- Contenido editable desde archivos YAML/Markdown.
- Formulario de contacto conectado a Mailgun.
- Protección anti-spam custom (sin cookies) en el formulario.

---

## Stack

- [Nuxt 4](https://nuxt.com/)
- [Nuxt UI](https://ui.nuxt.com/)
- [Nuxt Content](https://content.nuxt.com/)
- [Nuxt Image](https://image.nuxt.com/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Mailgun](https://www.mailgun.com/) para envío de emails

---

## Requisitos

- Node.js 20+
- pnpm 10+

---

## Instalación

```bash
pnpm install
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
NUXT_MAILGUN_API_KEY=your_mailgun_api_key
NUXT_MAILGUN_DOMAIN=your_mailgun_domain
NUXT_MAILGUN_FROM=postmaster@your_domain
NUXT_MAILGUN_TO=contact@your_company.com
```

> Estas variables se usan en `runtimeConfig` para `server/api/contact.post.ts`.

---

## Desarrollo

```bash
pnpm dev
```

Servidor local por defecto: `http://localhost:3000`

---

## Scripts disponibles

```bash
pnpm dev        # Modo desarrollo
pnpm build      # Build de producción
pnpm preview    # Preview del build
pnpm lint       # ESLint
pnpm typecheck  # Type check de Nuxt/TS
```

---

## Estructura del proyecto

```text
app/
  components/home/      # Secciones de la home
  pages/index.vue       # Página principal
content/
  index.yml             # Contenido de la landing
  blog/*.md             # Artículos del blog
server/api/
  contact.post.ts       # Endpoint de contacto (Mailgun + anti-spam)
public/
  video/                # Assets estáticos (ej. demo de IA)
```

---

## Cómo editar contenido

### Landing

Editar `content/index.yml`:

- Hero y secciones (`section`, `vuenuxt`, `ai`, `blog`, `cta`)
- Textos de UI (incluyendo labels del formulario)
- Label del colapsable de video en IA (`ai.collapsibleLabel`)

### Blog

Agregar/editar archivos en `content/blog/*.md` con frontmatter.

---

## Formulario de contacto

Flujo:

1. Frontend envía datos a `POST /api/contact`
2. Backend valida campos y anti-spam
3. Backend envía email vía Mailgun

### Anti-spam sin cookies

Implementado en frontend y backend:

- **Honeypot** (`website`)
- **Tiempo mínimo de envío** (`formTimestamp`)
- **Desafío matemático simple** (`mathAnswer`)

No usa Turnstile ni cookies.

---

## Deploy

Build de producción:

```bash
pnpm build
```

Preview local del build:

```bash
pnpm preview
```

Al desplegar, configurar las mismas variables de entorno de Mailgun en el proveedor.
