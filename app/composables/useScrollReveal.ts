import type { Ref } from 'vue'

export function useScrollReveal(root: Ref<HTMLElement | null>, selector = '[data-reveal]') {
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const el = root.value
    if (!el) return
    const targets = el.querySelectorAll<HTMLElement>(selector)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    targets.forEach(target => observer?.observe(target))
    el.classList.add('reveal-ready')
  })

  onBeforeUnmount(() => observer?.disconnect())
}
