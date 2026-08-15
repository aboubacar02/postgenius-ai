import { EdgeTTS } from 'node-edge-tts'
import { readFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

export const DEFAULT_VOICE = 'fr-FR-HenriNeural'

export async function synthesize(text, voice = DEFAULT_VOICE, lang = 'fr-FR') {
  const tmpPath = path.join(tmpdir(), `${randomUUID()}.mp3`)
  const tts = new EdgeTTS({
    voice,
    lang,
    outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
    rate: '+8%',
    pitch: '+0%',
    timeout: 45000
  })
  try {
    await tts.ttsPromise(text, tmpPath)
    return readFileSync(tmpPath)
  } finally {
    try {
      unlinkSync(tmpPath)
    } catch {}
  }
}