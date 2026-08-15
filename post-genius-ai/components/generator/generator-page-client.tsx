'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { GeneratorForm } from '@/components/generator/generator-form'
import { ResultsPanel } from '@/components/generator/results-panel'
import { generateScript, type GenerateInput, type GeneratedScript } from '@/lib/generator'
import { DAILY_CREDITS } from '@/lib/mock-data'

const DEFAULT_INPUT: GenerateInput = {
  network: 'tiktok',
  tone: 'storytelling',
  format: 'hook-histoire',
  duration: 30,
  audience: 'grand-public',
  cta: 'abonne',
  topic: '',
}

export function GeneratorPageClient() {
  const [input, setInput] = useState<GenerateInput>(DEFAULT_INPUT)
  const [result, setResult] = useState<GeneratedScript | null>(null)
  const [loading, setLoading] = useState(false)
  const [creditsUsed, setCreditsUsed] = useState(DAILY_CREDITS.used)

  function runGeneration() {
    if (input.topic.trim().length === 0) {
      toast.error('Décrivez votre sujet avant de générer un script.')
      return
    }
    setLoading(true)
    // Simulated latency to mimic a real model call.
    setTimeout(() => {
      setResult(generateScript(input))
      setCreditsUsed((c) => c + 1)
      setLoading(false)
      toast.success('Script généré avec succès')
    }, 900)
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[420px_1fr]">
      <GeneratorForm
        value={input}
        onChange={setInput}
        onSubmit={runGeneration}
        loading={loading}
        creditsLeft={Math.max(0, DAILY_CREDITS.total - creditsUsed)}
      />
      <ResultsPanel result={result} loading={loading} onRegenerate={runGeneration} />
    </div>
  )
}
