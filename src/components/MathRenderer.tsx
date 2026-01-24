import React from 'react'
import katex from 'katex'

type Props = { latex: string; displayMode?: boolean; className?: string }

export default function MathRenderer({ latex, displayMode = false, className }: Props) {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(latex, { displayMode, throwOnError: false })
    } catch (e) {
      return ''
    }
  }, [latex, displayMode])

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
