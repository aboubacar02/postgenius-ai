# PostGenius AI — Spécification de design complète

> Document prêt à être transmis à Google Stitch / v0 / un designer. Décrit 100 % du site : caractéristiques produit, système de design, pages, effets d'arrière-plan, images à générer.

---

## 1. Vue d'ensemble du produit

**PostGenius AI** est un studio SaaS de création de **vidéos courtes virales** (TikTok, YouTube Shorts, Instagram Reels) pour créateurs et marques, notamment en Afrique de l'Ouest (FCFA, paiements mobiles Wave / Orange Money / MTN / Moov).

**Utilisateur cible** : créateur solo non-technique, 18-35 ans, qui veut des scripts clés en main en 2 minutes.

**Tonalité** : énergique, premium, confiant. IA présente et valorisée ("Score viral", "checklist virale", "prédiction d'engagement") mais jamais froide.

**Langue de l'interface** : français (avec support EN/ES prévu).

---

## 2. Architecture & parcours utilisateur

| Page | Route | Rôle |
|---|---|---|
| Dashboard | `/` | Vue d'accueil, lancement rapide |
| Générateur | `/generateur` | Formulaire → résultats (3 variantes) |
| Historique | `/historique` | Scripts sauvegardés, régénération, exports |
| Score viral | `/score` | Analyse d'un script existant (5 piliers) |
| Tendances | `/tendances` | Idées, niches, horaires de publication |
| Tarifs | `/tarifs` | Plans + paiement (devises multiples) |
| Paramètres | `/parametres` | Profil, préférences, facturation, sécurité |

**Navigation** : sidebar fixe gauche (icônes + labels) + topbar (crédits, thème, avatar). Mobile : sheet/burger.

**Comptes** : Supabase, auth email/mot de passe. Sans compte → tout fonctionne en démo (crédits quotidiens, plan Starter).

**Crédits** : jauge "crédits journaliers" (ex. 3/5) visible en topbar et dans le générateur.

---

## 3. Système de design

### 3.1 Principe directeur
Dark-first, "studio de lumière dans le noir" : **fond quasi-noir bleuté**, lueurs néon abstraites (violet/fuchsia/cyan) en mesh gradient animé, cartes **glassmorphism** (blur + bordure fine + reflet), accents **violet**. Premium discret, sans images photo dans l'interface (tout est généré/abstrait).

### 3.2 Palette — tokens de couleurs (oklch)

**Mode sombre (par défaut)**

| Token | Valeur | Usage |
|---|---|---|
| `--background` | `oklch(0.135 0.003 264)` | Fond global, noir bleuté profond |
| `--foreground` | `oklch(0.96 0.003 264)` | Texte principal, blanc cassé |
| `--card` | `oklch(0.17 0.004 264)` | Surfaces de cartes |
| `--card-foreground` | `oklch(0.96 0.003 264)` | Texte sur cartes |
| `--popover` | `oklch(0.17 0.004 264)` | Menus, dropdowns |
| `--primary` | `oklch(0.68 0.2 293)` | Violet lumineux — CTA, accents, liens |
| `--primary-foreground` | `oklch(0.99 0.005 293)` | Texte sur violet (blanc) |
| `--secondary` | `oklch(0.22 0.005 264)` | Boutons/badges secondaires |
| `--muted` | `oklch(0.2 0.004 264)` | Fond des surfaces muettes (onglets, champs) |
| `--muted-foreground` | `oklch(0.6 0.01 264)` | Texte secondaire |
| `--accent` | `oklch(0.26 0.04 293)` | Hover/fond sélection |
| `--accent-foreground` | `oklch(0.85 0.09 293)` | Texte sur accent |
| `--destructive` | `oklch(0.65 0.2 25)` | Erreurs, suppression |
| `--success` | `oklch(0.72 0.15 165)` | Score viral élevé, succès |
| `--warning` | `oklch(0.78 0.15 70)` | Avertissements, seuils de score |
| `--border` | `oklch(1 0 0 / 8%)` | Bordures 1px |
| `--input` | `oklch(1 0 0 / 10%)` | Bordures de champs |
| `--ring` | `oklch(0.68 0.2 293)` | Focus |

**Mode clair** : même hue (264° bleu-gris, 293° violet), fond `oklch(0.99 0.002 264)`, cartes blanches, texte `oklch(0.16 0.01 264)`. Lueurs aurora à ~14-18 % d'opacité, `mix-blend-mode: normal`.

**Sémantique des couleurs fonctionnelles**
- **Violet (primary)** = action, sélection, marque.
- **Vert (success)** = score ≥ 70, éléments positifs.
- **Ambre (warning)** = score 45-69, prudence.
- **Rouge (destructive)** = score < 45, suppression, erreurs.
- **Cyan `#22d3ee` & rose/fuchsia `#e93d7d` / `#d946ef`** = uniquement en lueurs d'arrière-plan (jamais en texte UI).

### 3.3 Typographie
- **Corpus / UI** : `Inter`, 15px, line-height 1.6, `-webkit-font-smoothing: antialiased`.
- **Titres** (`font-heading`) : `Space Grotesk`, 600-700, `tracking-tight`, `text-balance`. Tailles : page `text-3xl md:text-4xl`, cartes `text-lg`.
- **Données/chiffres/scores** (`font-mono`) : `JetBrains Mono` — scores, compteurs, horaires, références.
- **Eyebrow (labels de section)** : 11px, majuscules, `letter-spacing 0.09em`, couleur `muted-foreground` (ex. "COMPTE", "CRÉDITS").
- Sémantique 3 niveaux : `text-1` (foreground), `text-2` (muted-foreground), `text-3` (muted à 75 %).

### 3.4 Formes, espacements, effets
- **Radius global** : `--radius: 0.75rem`. Cartes `rounded-xl`, éléments `rounded-lg`, badges/chips `rounded-full`.
- **Verre (`glass`)** : fond `card` à 62 % + `backdrop-filter: blur(18px)` + bordure 1px `foreground` à 12 % + ombre portée douce + **reflet intérieur 1px en haut** (`inset 0 1px 0`).
- **Cartes au survol (`lift`)** : `translateY(-4px)` + ombre accentuée, transition `cubic-bezier(0.16,1,0.3,1)` 0.28 s.
- **Espacement layout** : `max-w-7xl` (générateur) / `max-w-5xl` (autres), `px-4 sm:px-8`, `py-8`, gaps `gap-8`, sections internes `gap-4/5/6`.
- **Sélecteur de texte** : fond violet, texte blanc. **Focus visible** : ring violet 2px.
- **Scrollbar** : `scrollbar-thin`.

### 3.5 Arrière-plan global (le plus important)
Composant `BackgroundFx`, en `position: fixed`, derrière tout le contenu (`z-0`), **4 couches superposées** :

1. **Mesh gradient studio** (`.mesh-top`) — bandeau flou (`blur 58px`) qui occupe le haut de l'écran (~62 % de hauteur, légèrement débordant), 3 dégradés radiaux : violet primaire en haut-gauche, **cyan** en haut-droite, **fuchsia** au centre-bas. Animation `mesh-drift` : translation + scale lents, 18 s, alternée.
2. **Aurores flottantes** (`.aurora-a/b/c`) — 3 sphères radiales énormes (`480-560px`, `blur 90px`, `mix-blend-mode: screen`) : violette (haut-gauche), rose (#e93d7d, droite), cyan (#22d3ee, bas-centre). Animation `aurora-float` : dérive 22 s décalées, `scale 0.94 → 1.1`.
3. **Grille fine** — lignes grises 1px tous les 60px, masquée radialement (`ellipse 80% 60%` en haut, transparent vers le bas) → la grille s'efface en descendant.
4. **Bruit (noise)** — grain SVG `feTurbulence`, opacité 3 %, `mix-blend-overlay` pour un rendu "pellicule".

**`prefers-reduced-motion`** : toutes les animations désactivées. Lueurs conservées mais statiques.

**Description prête à donner à Stitch (image d'arrière-plan)** :
> "Dark UI background, deep blue-black (nearly #0B0B14), abstract aurora mesh gradient flowing from top: violet purple (#A855F7) top-left, cyan (#22D3EE) top-right, magenta/fuchsia (#E93D7D) center-low, large soft blurred radial light blobs (screen blend), subtle thin grid lines fading radially from top center, fine film grain, dreamy premium neon studio, no text, no photos, no logo, very dark, atmospheric, 16:9, ultra high quality"

---

## 4. Composants UI

### 4.1 Boutons
- **Default** : fond violet (`bg-primary`), texte blanc, `rounded-lg`, `px-4 h-9 text-sm font-medium`, hover légèrement plus clair, icônes `size-4`.
- **Outline** : bordure `input`/`border`, fond transparent, hover `bg-muted-30`.
- **Ghost** : transparent, hover `bg-muted`.
- **Tailles** : `sm`, `lg`, `icon-sm`. Désactivé = opacity + cursor not-allowed.
- Icônes avec `data-icon="inline-start"` → espacement auto avant le texte.

### 4.2 Cartes (`Card`)
Structure : `CardHeader` (titre + description) → `CardContent` → `CardFooter` (actions alignées à droite). Classes `glass` + `lift`. Titres `font-heading text-lg font-semibold`, descriptions `text-sm text-muted-foreground`.

### 4.3 Badges & chips
- **Badge** : `rounded-full`, variants `secondary` / `outline` / `primary`. Utilisés pour : plan, marché (avec drapeau emoji), plateforme, état.
- **Chips de sélection** (`OptionChipGroup` / `ToggleGroup`) : tuiles arrondies `rounded-xl border` ; sélectionnée = fond `bg-primary-15` + bordure `border-primary-30` + texte violet (marqueur visuel clair). Non sélectionnée = `bg-card` + bordure `border-border-70`.
- **Sélecteur d'angle (résultats)** : chips numérotées 1/2/3 avec mini-scores.

### 4.4 Champs de formulaire
- `Input` / `Textarea` / `Select` : fond `bg-card` solide (jamais transparent sur l'aurora), bordure `input`, focus ring violet, placeholder `muted-foreground`.
- **Field** : label (`text-sm font-medium`) + description (`text-xs text-muted-foreground`) + erreur rouge (`destructive`).
- **Switch** : thème, notifications, sous-titres auto. **Progress** : barre fine (`h-1.5`), violet par défaut, `stroke-success` selon usage.
- **Groupes de champs** : `FieldGroup` espacés `gap-4`, séparateurs (`FieldSeparator`) entre options horizontales.

### 4.5 Onglets (`Tabs`)
`TabsList` = fond `muted`, pill container (`rounded-lg p-[3px]`), triggers en `rounded-md` ; actif = fond `background` + `shadow-sm` + texte `foreground`, inactif = `text-foreground-60`. Icônes dans les triggers (`size-4`). Pages : Paramètres (4 onglets avec icônes), Générateur (tabs par variante).

### 4.6 Feedback & états
- **Toast (sonner)** : bas-droit, animation `sonner-in` (fade + slide + scale), couleurs contextuelles (success/violet/error).
- **Skeleton** : shimmer doux pour chargement du générateur.
- **Empty states** : icône + titre + description + CTA (Historique, Score viral).
- **Loader** : `loader-ring` (spinner, violet).
- **Modale paiement** : overlay `bg-black/60 backdrop-blur-sm`, carte `max-w-md` glass, badge "Mode Test" ambre.

### 4.7 Médias / mockups
- **PhoneMockup** : simulateur de feed TikTok/Reels 9:16 — vidéo dégradée (fuchsia→violet→slate), sous-titres type CapCut géants en blanc avec mots-clés surlignés en violet (`bg-primary`), barre de progression, actions latérales (cœur, commentaires, partage), **égaliseur audio animé** (barres 3px qui pulsent, `eq-bounce`), `caption-in` pour l'apparition des sous-titres.
- **VideoThumb** : vignettes 9:16 / 16:9 avec dégradé vertical, duréé en badge `font-mono`, icône réseau, score en badge coloré.

---

## 5. Pages en détail

### 5.1 Dashboard (`/`)
- **Hero** : halo violet (`HeroGlow`, blur 120px, pulsation lente) derrière un grand titre Space Grotesk + PhoneMockup à droite. CTA "Créer une vidéo" (violet) + "Voir les tendances" (outline).
- **Stats** : 3-4 `StatCard` — script générés, vues estimées, score moyen, crédits — avec **compteurs animés** et badge de tendance (+x %).
- **Actions rapides** : 4 `QuickActionCard` (icône + titre + description) → routes.
- **Créations récentes** : grille de `VideoThumb` avec date relative, badge marché (drapeau), bouton copier.

### 5.2 Générateur (`/generateur`)
- Header + jauge de crédits (`Progress` violet, `font-mono` "3/5").
- **Formulaire 2 colonnes** (lg) : réseau (TikTok/Reels/Shorts), marché (🌍 Afrique de l'Ouest, 🇫🇷 France, 🇨🇦 Canada, 🇺🇸 USA — **Select**, labels longs), ton (6 chips), format (5 chips), durée (15/30/60/90 s), audience (6 chips), CTA (5 chips), sujet (Textarea). Bouton "Générer les 3 angles" violet pleine largeur.
- **Résultats** (sous le formulaire) : 3 onglets "Angle 1/2/3" avec score prévu. Chaque angle : titre + score (badge coloré), hooks alternatifs, **script complet** (hook / hook contextuel / contenu / montée / CTA / fin), **voix off IA** (7 voix Gemini, jouable), **téléprompteur** (défilement auto, vitesse réglable), **aperçu sous-titres** (3 styles : gros mot, karaoké, classique), **timeline tableau** (temps `font-mono` / séquence), **hashtags + légende**, **déclinaisons plateformes** (légende copiable), **checklist virale** (checkmarks) + **prédiction d'engagement**, **fiche technique de tournage** (éclairage, cadrage, b-rolls), **vignettes d'invite** (thumbs). Boutons copier / télécharger / régénérer.

### 5.3 Historique (`/historique`)
- Header + **recherche** (Input avec icône Search, `InputGroup`) + **filtre par réseau** (Select).
- Grille de cartes : vignette, titre, plateforme, date relative, marchés (badges drapeaux), score, actions hover : copier, télécharger, **régénérer (↻, vraie régénération)**, supprimer (avec toast).
- Empty state si aucun résultat.

### 5.4 Score viral (`/score`)
- Textarea "colle ton script" + bouton "Analyser".
- **ScoreGauge** : jauge SVG en arc, gradient violet→vert, gros chiffre `font-mono`, label ("Excellent / Bon / À améliorer").
- **5 piliers** : `hookRetention`, `emotionalPeak`, `seo`, `ctaEfficiency`, `pacing` — chacun : barre de progression colorée (vert/ambre/rouge selon seuil), note x/100, explication IA.
- Breakdown "IA vs local" (score de l'algorithme vs score marché).
- Carte **"Passer de 65 à 95"** : liste d'améliorations concrètes (CheckCircle2 vert) + CTA.

### 5.5 Tendances (`/tendances`)
- **8 niches** (Tech, Gaming, Business, Storytime, Beauté, Fitness, Cuisine, Finance) en grille de cartes `lift`, chacune avec idée du moment + score.
- **Meilleurs horaires** par plateforme : cartes avec fuseau horaire (`font-mono`) + barre de vigueur.
- **10 formats viraux** : liste numérotée avec explication + lien ressource.
- Bouton "Actualiser les tendances" (RefreshCw).

### 5.6 Tarifs (`/tarifs`)
- Header + **sélecteur de devise** : `ToggleGroup` FCFA / EUR / USD (conversion affichée, ex. 19 023 FCFA = 29 €).
- **3 PricingCard** : Starter (gratuit), **Pro (mis en avant**, badge "Populaire", bordure primaire), Studio. Chaque : prix `font-mono` + devise, période, 4-5 features avec CheckCircle2, CTA.
- **Moyens de paiement dynamiques** selon devise : FCFA → Wave / Orange Money / MTN / Moov ; EUR/USD → Carte / PayPal / Apple Pay.
- **Modale de paiement** test : récap + bouton → toast succès → passage au plan Pro (crédits majorés).

### 5.7 Paramètres (`/parametres`)
- Header + `Tabs` avec icônes : **Profil** (User), **Préférences** (SlidersHorizontal), **Facturation** (CreditCard), **Sécurité** (ShieldCheck).
- **Profil** : AuthCard si non connecté, sinon carte "Informations du profil" avec Avatar (initiales), badge plan, champs nom/email + footer Enregistrer.
- **Préférences** : langue (Select FR/EN/ES), thème sombre (Switch), notifications email (Switch), sous-titres auto (Switch), séparés par FieldSeparator.
- **Facturation** : plan actuel (badge violet + prix `font-mono` + bouton "Changer de plan"), jauge crédits + Progress, carte "Moyen de paiement" (aucune carte en démo).
- **Sécurité** : changement de mot de passe (2 champs + Mettre à jour) si connecté.

---

## 6. Micro-interactions & motion

| Effet | Durée / easing | Usage |
|---|---|---|
| `page-in` | 0.45 s `cubic-bezier(0.16,1,0.3,1)` | Entrée de chaque page (fade + 10px) |
| `fade-in-up` | 0.55 s | Apparition des sections |
| `lift` | 0.28 s | Cartes au survol |
| `aurora-float` | 22 s `ease-in-out` infini | Aurores d'arrière-plan |
| `mesh-drift` | 18 s alternate | Mesh studio |
| `hero-pulse` | 9 s | Halo du hero |
| `caption-in` | 0.4 s `cubic-bezier(0.16,1,0.3,1)` | Sous-titres du mockup |
| `eq-bounce` | 1 s infini (décalé 0.15 s) | Égaliseur audio |
| `sonner-in` | 0.25 s | Toasts |
| Compteurs | 0.8-1 s | Stats du dashboard |
| Transitions thème | 0.35 s ease | Fond + texte + bordures |

Tout respecte `prefers-reduced-motion: reduce` (désactivations complètes).

---

## 7. Images & assets à générer (liste de commandes Stitch)

1. **`bg-aurora`** — arrière-plan global (prompt §3.5), 16:9, très sombre.
2. **`hero-glow`** — halo radial violet intense pour le hero dashboard, transparent/homogène, 4K.
3. **`phone-feed`** — contenu de démo pour le PhoneMockup : gros plan vidéo verticale avec sous-titres géants, ambiance néon violet/cyan.
4. **`thumb-niches`** — 8 miniatures par niche (Tech, Gaming, Business, Storytime, Beauté, Fitness, Cuisine, Finance), style photo réaliste 9:16, sans texte.
5. **`empty-states`** — illustration minimaliste "aucun script / aucun historique" : ampoule ou brouillon, néon violet sur fond sombre.
6. **`og-cover`** — bannière 1200×630 pour partage : logo + mockup téléphone + aurore.

---

## 8. À copier-coller dans Google Stitch (résumé exécutif)

> **PostGenius AI** — dark SaaS design system for an AI short-video script studio. Near-black blue background (#0B0B14) with animated aurora mesh gradients: violet purple top-left, cyan top-right, magenta fuchsia center. Glassmorphism cards (blur 18px, 1px white/12% border, inner top highlight), 0.75rem radius. Primary color luminous violet (HSL ~268° 68% 56% / oklch 0.68 0.2 293), success green, warning amber, destructive red. Headings Space Grotesk 700 tight, body Inter 15px, data JetBrains Mono. UI in French. Premium neon studio mood, no photography in interface, only abstract light. Components: violet primary buttons, outline/ghost buttons, pill badges, rounded selectable chips (violet when active), glass cards with lift hover, pill tabs with icons, switches, progress bars, SVG score gauge, animated phone feed mockup with giant subtitles and audio equalizer. Pages: dashboard with animated stat counters, generator with 3-variant results & AI voiceover & teleprompter & subtitle previews, history with search/filter/regenerate, viral score analyzer (5 pillars), trends with 8 niches, pricing with FCFA/EUR/USD and Wave/Moov payment, settings with icon tabs. Motion: 0.45s cubic-bezier page enter, slow aurora drift, hover lift. Respect reduced-motion.

---

*Généré à partir du code source réel (`src/index.css`, `src/components/*`, `src/pages/*`). Toute nouvelle image doit respecter les tokens §3.2 et la profondeur de superposition §3.5.*
