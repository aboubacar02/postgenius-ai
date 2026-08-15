'use client'

import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OptionChipGroup } from '@/components/generator/option-chip-group'
import {
  AUDIENCES,
  CTA_GOALS,
  DURATIONS,
  FORMATS,
  NETWORKS,
  TONES,
  type Audience,
  type CtaGoal,
  type Duration,
  type Format,
  type Network,
  type Tone,
} from '@/lib/mock-data'
import type { GenerateInput } from '@/lib/generator'

export function GeneratorForm({
  value,
  onChange,
  onSubmit,
  loading,
  creditsLeft,
}: {
  value: GenerateInput
  onChange: (next: GenerateInput) => void
  onSubmit: () => void
  loading: boolean
  creditsLeft: number
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-6 rounded-xl border border-border bg-card/60 p-5"
    >
      <OptionChipGroup
        label="Réseau"
        options={NETWORKS.map((n) => ({ value: n.value, label: n.label }))}
        value={value.network}
        onChange={(v) => onChange({ ...value, network: v as Network })}
      />

      <OptionChipGroup
        label="Ton"
        options={TONES}
        value={value.tone}
        onChange={(v) => onChange({ ...value, tone: v as Tone })}
      />

      <OptionChipGroup
        label="Format"
        options={FORMATS}
        value={value.format}
        onChange={(v) => onChange({ ...value, format: v as Format })}
      />

      <OptionChipGroup
        label="Durée"
        options={DURATIONS.map((d) => ({ value: String(d.value), label: d.label }))}
        value={String(value.duration)}
        onChange={(v) => onChange({ ...value, duration: Number(v) as Duration })}
      />

      <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel
            htmlFor="audience"
            className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
          >
            Audience
          </FieldLabel>
          <Select
            value={value.audience}
            onValueChange={(v) => v && onChange({ ...value, audience: v as Audience })}
          >
            <SelectTrigger id="audience" className="w-full">
              <SelectValue placeholder="Choisir une audience">
                {(v: Audience | null) => AUDIENCES.find((a) => a.value === v)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {AUDIENCES.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel
            htmlFor="cta"
            className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
          >
            Objectif du CTA
          </FieldLabel>
          <Select
            value={value.cta}
            onValueChange={(v) => v && onChange({ ...value, cta: v as CtaGoal })}
          >
            <SelectTrigger id="cta" className="w-full">
              <SelectValue placeholder="Choisir un objectif">
                {(v: CtaGoal | null) => CTA_GOALS.find((c) => c.value === v)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CTA_GOALS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel
          htmlFor="topic"
          className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          Sujet
        </FieldLabel>
        <Textarea
          id="topic"
          placeholder="Ex : comment j'ai doublé mon reach en 30 jours sans dépenser en pub"
          value={value.topic}
          onChange={(e) => onChange({ ...value, topic: e.target.value })}
          className="min-h-24 resize-none"
          maxLength={280}
        />
        <FieldDescription>{value.topic.length}/280 caractères</FieldDescription>
      </Field>

      <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-mono text-foreground">{creditsLeft}</span> générations restantes
          aujourd&apos;hui
        </p>
        <Button
          type="submit"
          size="lg"
          className="h-10 px-5"
          disabled={loading || value.topic.trim().length === 0 || creditsLeft <= 0}
        >
          <Sparkles data-icon="inline-start" />
          {loading ? 'Génération…' : 'Générer le scénario'}
        </Button>
      </div>
    </form>
  )
}
