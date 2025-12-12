/**
 * SEO Component - Meta tags, Open Graph, and Structured Data
 * SEO组件 - 元标签、Open Graph和结构化数据
 */

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title: string
  titleZh?: string
  description: string
  descriptionZh?: string
  type?: 'website' | 'product' | 'article'
  image?: string
  url?: string
  // For product pages
  productData?: {
    name: string
    nameZh?: string
    price?: string
    currency?: string
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
    category?: string
  }
}

export function SEO({
  title,
  titleZh,
  description,
  descriptionZh,
  type = 'website',
  image,
  url,
  productData
}: SEOProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const finalTitle = isZh && titleZh ? titleZh : title
  const finalDescription = isZh && descriptionZh ? descriptionZh : description
  const fullTitle = `${finalTitle} | PolarCraft`

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, name)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Basic meta tags
    updateMeta('description', finalDescription)
    updateMeta('author', 'PolarCraft Team')

    // Open Graph tags
    updateMeta('og:title', fullTitle, true)
    updateMeta('og:description', finalDescription, true)
    updateMeta('og:type', type, true)
    if (url) updateMeta('og:url', url, true)
    if (image) updateMeta('og:image', image, true)
    updateMeta('og:site_name', 'PolarCraft', true)
    updateMeta('og:locale', isZh ? 'zh_CN' : 'en_US', true)

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', fullTitle)
    updateMeta('twitter:description', finalDescription)
    if (image) updateMeta('twitter:image', image)

    // Add or update structured data
    let scriptTag = document.querySelector('#structured-data') as HTMLScriptElement
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = 'structured-data'
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }

    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': type === 'product' && productData ? 'Product' : 'WebPage',
      name: fullTitle,
      description: finalDescription,
      url: url || window.location.href
    }

    // Add product-specific data
    if (type === 'product' && productData) {
      structuredData['@type'] = 'Product'
      structuredData.name = isZh && productData.nameZh ? productData.nameZh : productData.name
      if (productData.price) {
        structuredData.offers = {
          '@type': 'Offer',
          price: productData.price,
          priceCurrency: productData.currency || 'CNY',
          availability: `https://schema.org/${productData.availability || 'InStock'}`
        }
      }
      if (productData.category) {
        structuredData.category = productData.category
      }
    }

    scriptTag.textContent = JSON.stringify(structuredData)

    // Cleanup function
    return () => {
      // Optionally reset to defaults on unmount
    }
  }, [fullTitle, finalDescription, type, url, image, productData, isZh])

  return null // This component doesn't render anything visible
}

// Preset SEO configurations for each page
export const SEO_CONFIGS = {
  home: {
    title: 'PolarCraft - Polarization Light Education Platform',
    titleZh: 'PolarCraft - 偏振光教育平台',
    description: 'Educational platform for learning polarization physics through games, hardware experiments, card games, and creative merchandise.',
    descriptionZh: '通过游戏、硬件实验、卡牌桌游和创意文创学习偏振光物理的教育平台。'
  },
  hardware: {
    title: 'UC2 Polarization Hardware Modules',
    titleZh: 'UC2 偏振硬件模块',
    description: 'Open-source modular polarization optics platform based on UC2 framework. Includes modules, light path configurations, and BOM.',
    descriptionZh: '基于UC2框架的开源模块化偏振光学平台。包含模块清单、光路配置和物料清单。'
  },
  cardgame: {
    title: 'PolarQuest Card Game',
    titleZh: '偏振探秘卡牌游戏',
    description: 'Educational tabletop card game for 1-4 players. Learn polarization physics through 44 unique cards and optical missions.',
    descriptionZh: '1-4人教育桌游。通过44张独特卡牌和光学任务学习偏振光物理。'
  },
  merchandise: {
    title: 'Polarization Art & Merchandise',
    titleZh: '偏振艺术与文创',
    description: 'Creative products featuring polarization art: prints, postcards, stickers, acrylic items, filter toys, and exhibition sets.',
    descriptionZh: '偏振艺术创意产品：艺术照片、明信片、贴纸、亚克力制品、滤镜玩具和展陈套装。'
  }
}
