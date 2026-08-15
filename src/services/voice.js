export const EDGE_VOICES = [
  {
    id: 'fr-FR-HenriNeural',
    label: 'Henri',
    desc: 'Masculin · Naturel',
    emoji: '🎙️',
    lang: 'fr-FR',
    gender: 'male'
  },
  {
    id: 'fr-FR-RemyMultilingualNeural',
    label: 'Rémy',
    desc: 'Masculin · Multilingue',
    emoji: '🎬',
    lang: 'fr-FR',
    gender: 'male'
  },
  {
    id: 'fr-FR-YvesNeural',
    label: 'Yves',
    desc: 'Masculin · Énergique',
    emoji: '⚡',
    lang: 'fr-FR',
    gender: 'male'
  },
  {
    id: 'fr-FR-DeniseNeural',
    label: 'Denise',
    desc: 'Féminin · Naturel',
    emoji: '🎤',
    lang: 'fr-FR',
    gender: 'female'
  },
  {
    id: 'fr-FR-VivienneMultilingualNeural',
    label: 'Vivienne',
    desc: 'Féminin · Multilingue',
    emoji: '✨',
    lang: 'fr-FR',
    gender: 'female'
  },
  {
    id: 'fr-FR-EliseNeural',
    label: 'Élise',
    desc: 'Féminin · Posé',
    emoji: '🔊',
    lang: 'fr-FR',
    gender: 'female'
  },
  {
    id: 'fr-FR-SylvieNeural',
    label: 'Sylvie',
    desc: 'Féminin · Jeune',
    emoji: '🎵',
    lang: 'fr-FR',
    gender: 'female'
  }
]

export async function speakWithEdge(text, voiceId) {
  const voice = EDGE_VOICES.find((v) => v.id === voiceId) || EDGE_VOICES[0]

  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice: voice.id,
      lang: voice.lang
    })
  })

  if (!res.ok || !(res.headers.get('content-type') || '').includes('audio')) {
    throw new Error('TTS Edge indisponible')
  }

  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
