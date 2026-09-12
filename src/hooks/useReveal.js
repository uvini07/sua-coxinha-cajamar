import { useEffect } from 'react'

// Aparição suave e única (sobe 24px e surge) para elementos com data-reveal.
// Não roda com "reduzir movimento" nem dentro da abertura animada do computador.
export function useReveal(rootRef, isStory) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = [...root.querySelectorAll('[data-reveal]')].filter((el) => !(isStory && el.closest('.stage')))
    document.documentElement.classList.add('reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootRef, isStory])
}
