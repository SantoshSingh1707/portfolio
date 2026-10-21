import { useEffect, useRef, type ReactNode } from 'react'
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router'
import gsap from 'gsap'
import appCss from '../styles.css?url'

function NotFound() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <main className="not-found-page container" id="main" tabIndex={-1}>
        <p>404 · Page not found</p>
        <h1>A LITTLE OFF COURSE.</h1>
        <p className="not-found-copy">This page doesn’t exist. There’s plenty to explore back at my portfolio.</p>
        <Link className="button button-primary" to="/">Back to my portfolio</Link>
      </main>
    </div>
  )
}

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const pageRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<HTMLDivElement>(null)
  const initialPathname = useRef(pathname)

  useEffect(() => {
    if (pathname === initialPathname.current) return undefined
    const page = pageRef.current
    const mask = transitionRef.current
    if (!page || !mask || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      gsap.timeline()
        .set(mask, { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' })
        .to(mask, { clipPath: 'inset(0 0 0 0)', duration: 0.22, ease: 'power2.inOut' })
        .fromTo(page, { opacity: 0, y: 12 }, {
          opacity: 1,
          y: 0,
          duration: 0.42,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        }, '-=0.06')
        .to(mask, { clipPath: 'inset(0 0 0 100%)', duration: 0.24, ease: 'power2.inOut' }, '-=0.16')
        .set(mask, { autoAlpha: 0 })
    }, page)

    return () => context.revert()
  }, [pathname])

  useEffect(() => {
    const desktopMotion = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    )
    if (!desktopMotion.matches) return undefined

    let active = true
    let lenis: import('lenis').default | undefined
    let tick: ((time: number) => void) | undefined
    void Promise.all([import('lenis'), import('gsap/ScrollTrigger')]).then(([lenisModule, triggerModule]) => {
      if (!active) return
      const { ScrollTrigger } = triggerModule
      gsap.registerPlugin(ScrollTrigger)
      lenis = new lenisModule.default({
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: 108 },
      })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }).catch(() => undefined)

    return () => {
      active = false
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      gsap.ticker.lagSmoothing(500)
    }
  }, [])

  return (
    <>
      <div className="route-page" ref={pageRef}>
        <Outlet />
      </div>
      <div
        className="route-transition-mask"
        ref={transitionRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 120,
          pointerEvents: 'none',
          background: 'var(--accent)',
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
          visibility: 'hidden',
        }}
      />
    </>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'Santosh Singh — AI/ML Student' },
      { name: 'description', content: 'Projects, learning experiments, and the work behind them from Santosh Singh, an AI/ML student at DIT University.' },
      { name: 'theme-color', content: '#080B14' },
      { name: 'author', content: 'Santosh Singh' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Santosh Singh' },
      { property: 'og:image', content: '/folio-og.svg' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;450;500;550;600;650;700&family=IBM+Plex+Serif:ital@1&family=Space+Mono:wght@400;700&display=swap' },
    ],
  }),
  component: RootLayout,
  shellComponent: ({ children }: { children: ReactNode }) => (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  ),
  notFoundComponent: NotFound,
})
