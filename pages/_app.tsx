// global styles shared across the entire site
import * as React from 'react'
import type { AppProps } from 'next/app'
import { NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'

import * as Fathom from 'fathom-client'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
import posthog from 'posthog-js'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import 'styles/global.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  googleAnalyticsId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete(url: string) {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (googleAnalyticsId) {
        // This should be optional chaining since it sometime not initialized at this point.
        window?.gtag?.('config', googleAnalyticsId, {
          page_path: url
        })
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Head>
            <Script
              id='gtag-init'
              strategy='afterInteractive'
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${googleAnalyticsId}', {
                    page_path: window.location.pathname,
                  });
                `
              }}
            />
          </Head>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy='afterInteractive'
          />
        </>
      )}
      <Component {...pageProps} />
    </>
  )
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // TODO: seems fathom doesn't support webVitals?

  if (googleAnalyticsId) {
    // This should be optional chaining since it sometime not initialized at this point.
    window?.gtag?.('event', metric.name, {
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ), // values must be integers
      event_label: metric.id, // id unique to current page load
      non_interaction: true // avoids affecting bounce rate.
    })
  }

  if (posthogId) {
    posthog.capture(metric.name, metric)
  }
}
