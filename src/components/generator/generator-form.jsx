import { Field, FieldGroup, FieldLabel, FieldDescription } from '../ui/field'
import { Select, SelectContent, SelectItem, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { OptionChipGroup } from './option-chip-group'
import { NetworkPicker } from './network-picker'
import { OptionRadio } from './option-radio'
import {
  AUDIENCES,
  CTA_GOALS,
  DURATIONS,
  FORMATS,
  MARKETS,
  NETWORKS,
  TONES
} from '../../lib/mock-data'

const DEFAULT_INPUT = {
  network: 'tiktok',
  tone: 'storytelling',
  format: 'hook-histoire',
  duration: 30,
  audience: 'grand-public',
  cta: 'abonne',
  market: 'fr',
  topic: ''
}

const SECTION_LABEL =
  'text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground'

export function GeneratorForm({ value, onChange }) {
  const input = value ?? DEFAULT_INPUT
  const set = (patch) => onChange({ ...input, ...patch })
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section className="glass premium-edge flex flex-col gap-6 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col gap-3">
          <span className={SECTION_LABEL}>Sujet de la vidéo</span>
          <Textarea
            id="topic"
            placeholder="Ex : les 3 secrets pour devenir développeur freelance en 2026…"
            value={input.topic}
            onChange={(e) => set({ topic: e.target.value })}
            className="min-h-28 resize-none"
            maxLength={280}
          />
          <FieldDescription>{input.topic.length}/280 caractères</FieldDescription>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <span className={SECTION_LABEL}>Réseau cible</span>
          <NetworkPicker
            options={NETWORKS.map((n) => ({ value: n.value, label: n.label, emoji: n.emoji }))}
            value={input.network}
            onChange={(v) => set({ network: v })}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="glass premium-edge flex flex-col gap-4 rounded-xl p-5 sm:p-6">
          <span className={SECTION_LABEL}>Marché &amp; Culture</span>
          <OptionRadio
            options={MARKETS.map((m) => ({
              value: m.value,
              label: `${m.flag} ${m.longLabel}`,
              hint: m.lang === 'fr' ? undefined : '🇬🇧 EN'
            }))}
            value={input.market}
            onChange={(v) => set({ market: v })}
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {MARKETS.find((m) => m.value === input.market)?.desc}
          </p>
        </section>

        <section className="glass premium-edge flex flex-col gap-4 rounded-xl p-5 sm:p-6">
          <span className={SECTION_LABEL}>Ton de la vidéo</span>
          <OptionChipGroup
            label={null}
            options={TONES}
            value={input.tone}
            onChange={(v) => set({ tone: v })}
          />
        </section>
      </div>

      <section className="glass premium-edge flex flex-col gap-6 rounded-xl p-5 sm:p-6">
        <span className={SECTION_LABEL}>Détails du script</span>
        <OptionChipGroup
          label={null}
          options={FORMATS}
          value={input.format}
          onChange={(v) => set({ format: v })}
        />
        <OptionChipGroup
          label={null}
          options={DURATIONS.map((d) => ({ value: String(d.value), label: d.label }))}
          value={String(input.duration)}
          onChange={(v) => set({ duration: Number(v) })}
        />
        <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="audience" className={SECTION_LABEL}>
              Audience
            </FieldLabel>
            <Select value={input.audience} onValueChange={(v) => v && set({ audience: v })}>
              <SelectValue placeholder="Choisir une audience" />
              <SelectContent>
                {AUDIENCES.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="cta" className={SECTION_LABEL}>
              Objectif du CTA
            </FieldLabel>
            <Select value={input.cta} onValueChange={(v) => v && set({ cta: v })}>
              <SelectValue placeholder="Choisir un objectif" />
              <SelectContent>
                {CTA_GOALS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </section>
    </div>
  )
}
