import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'

const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect

export function usePageMotion(pageKey?: string | number) {
  useIsomorphicLayoutEffect(() => {
    const page = document.querySelector<HTMLElement>('[data-page-motion]')
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let active = true
    let context: gsap.Context | undefined
    let refresh = 0

    void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (!active) return
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        const hero = page.querySelector<HTMLElement>('[data-hero]')
        if (hero) {
          gsap.fromTo(hero, { opacity: 0, y: 18 }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          })
        }

        gsap.utils.toArray<HTMLElement>('[data-reveal]', page).forEach((section) => {
          gsap.fromTo(section, { opacity: 0, y: 20 }, {
            opacity: 1,
            y: 0,
            duration: 0.68,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: section,
              start: 'top 86%',
              once: true,
            },
          })
        })
      }, page)

      refresh = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    }).catch(() => undefined)

    return () => {
      active = false
      window.clearTimeout(refresh)
      context?.revert()
    }
  }, [pageKey])
}
