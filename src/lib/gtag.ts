export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

interface GTagEvent {
  action: string
  category: string
  label: string
  value?: number
}

interface GTagConfig {
  page_path?: string
  event_category?: string
  event_label?: string
  value?: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (!GA_TRACKING_ID) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Add gtag type definition
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: GTagConfig
    ) => void
  }
} 