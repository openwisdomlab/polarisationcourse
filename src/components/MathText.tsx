import MathRenderer from './MathRenderer'

type Props = { text: string }

// Simple parser: split by inline $...$ or display $$...$$ and render math segments
export default function MathText({ text }: Props) {
  const parts: Array<{ type: 'text' | 'math'; content: string; display?: boolean }> = []
  let rest = text
  const displayRegex = /\$\$(.+?)\$\$/s
  const inlineRegex = /\$(.+?)\$/s

  while (rest.length) {
    const mDisplay = rest.match(displayRegex)
    const mInline = rest.match(inlineRegex)
    if (mDisplay && (!mInline || mDisplay.index! <= mInline.index!)) {
      const idx = mDisplay.index!
      if (idx > 0) parts.push({ type: 'text', content: rest.slice(0, idx) })
      parts.push({ type: 'math', content: mDisplay[1], display: true })
      rest = rest.slice(idx + mDisplay[0].length)
      continue
    }
    if (mInline) {
      const idx = mInline.index!
      if (idx > 0) parts.push({ type: 'text', content: rest.slice(0, idx) })
      parts.push({ type: 'math', content: mInline[1], display: false })
      rest = rest.slice(idx + mInline[0].length)
      continue
    }
    parts.push({ type: 'text', content: rest })
    break
  }

  return (
    <>
      {parts.map((p, i) =>
        p.type === 'text' ? (
          <span key={i}>{p.content}</span>
        ) : (
          <MathRenderer key={i} latex={p.content} displayMode={!!p.display} />
        )
      )}
    </>
  )
}
