import { Field, FieldGroup, FieldLabel, FieldDescription } from '../ui/field'
import { Select, SelectContent, SelectItem, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { OptionChipGroup } from './option-chip-group'
import { NetworkPicker } from './network-picker'
import { MagicPromptEnhancer } from './magic-prompt-enhancer'
import { HookSplitTester } from './hook-split-tester'
import {
  AUDIENCES,
  CTA_GOALS,
  DURATIONS,
  FORMATS,
  NETWORKS,
  TONES
} from '../../lib/mock-data'
import { useI18n } from '../../lib/i18n'

const DEFAULT_INPUT = {
  network: 'tiktok',
  tone: 'storytelling',
  format: 'hook-histoire',
  duration: 30,
  audience: 'grand-public',
  cta: 'abonne',
  topic: ''
}

const SECTION_LABEL =
  'text-xs font-bold uppercase tracking-wider text-muted-foreground'

export function GeneratorForm({ value, onChange }) {
  const { t } = useI18n()
  const input = value ?? DEFAULT_INPUT
  const set = (patch) => onChange({ ...input, ...patch })

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* 1. Sujet & Plateforme */}
      <section className="glow-card glass premium-edge flex flex-col gap-5 rounded-2xl p-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className={SECTION_LABEL}>{t('generator.topicLabel')}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {input.topic.length} / 280
            </span>
          </div>
          <Textarea
            id="topic"
            placeholder={t('generator.topicPlaceholder')}
            value={input.topic}
            onChange={(e) => set({ topic: e.target.value })}
            className="min-h-28 resize-none rounded-xl border-border/80 bg-background/60 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
            maxLength={280}
          />
          <MagicPromptEnhancer
            currentTopic={input.topic}
            onApply={(enhanced) => set({ topic: enhanced })}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <span className={SECTION_LABEL}>{t('generator.networkLabel')}</span>
          <NetworkPicker
            options={NETWORKS.map((n) => ({ value: n.value, label: n.label, emoji: n.emoji }))}
            value={input.network}
            onChange={(v) => set({ network: v })}
          />
        </div>
      </section>

      {/* Split Tester Hooks A/B/C */}
      <HookSplitTester
        topic={input.topic}
        selectedHook={input.customHook}
        onSelectHook={(hookText) => set({ topic: `${hookText} [Sujet : ${input.topic || 'idée'}]` })}
      />

      {/* 2. Tonalité */}
      <section className="glow-card glass premium-edge flex flex-col gap-3 rounded-2xl p-6">
        <span className={SECTION_LABEL}>{t('generator.toneLabel')}</span>
        <OptionChipGroup
          label={null}
          options={TONES}
          value={input.tone}
          onChange={(v) => set({ tone: v })}
        />
      </section>

      {/* 3. Détails & Structure */}
      <section className="glow-card glass premium-edge flex flex-col gap-5 rounded-2xl p-6">
        <span className={SECTION_LABEL}>{t('generator.detailsLabel')}</span>
        
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Format vidéo</span>
          <OptionChipGroup
            label={null}
            options={FORMATS}
            value={input.format}
            onChange={(v) => set({ format: v })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Durée cible</span>
          <OptionChipGroup
            label={null}
            options={DURATIONS.map((d) => ({ value: String(d.value), label: d.label }))}
            value={String(input.duration)}
            onChange={(v) => set({ duration: Number(v) })}
          />
        </div>

        <FieldGroup className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="audience" className={SECTION_LABEL}>
              {t('generator.audienceLabel')}
            </FieldLabel>
            <Select value={input.audience} onValueChange={(v) => v && set({ audience: v })}>
              <SelectValue placeholder={t('generator.audiencePlaceholder')} />
              <SelectContent className="rounded-xl border-border/80 bg-popover/95 backdrop-blur-xl">
                {AUDIENCES.map((a) => (
                  <SelectItem key={a.value} value={a.value} className="rounded-lg text-sm">
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="cta" className={SECTION_LABEL}>
              {t('generator.ctaLabel')}
            </FieldLabel>
            <Select value={input.cta} onValueChange={(v) => v && set({ cta: v })}>
              <SelectValue placeholder={t('generator.ctaPlaceholder')} />
              <SelectContent className="rounded-xl border-border/80 bg-popover/95 backdrop-blur-xl">
                {CTA_GOALS.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="rounded-lg text-sm">
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
