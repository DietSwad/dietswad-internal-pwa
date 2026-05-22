import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  value: string
  label?: string
  className?: string
}

export default function CopyButton({ value, label, className = '' }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // iOS / older browser fallback
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
        copied ? 'text-green-600' : 'text-espresso hover:text-espresso/70'
      } ${className}`}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  )
}
