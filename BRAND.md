# CredSeal Brand Guidelines

## Brand Identity

**Name:** CredSeal
**Domain:** credseal.ai
**Tagline:** "The credential layer for AI agents"
**Secondary Tagline:** "Zero secrets in your agents"

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Vault Gold** | `#D4A853` | 212, 168, 83 | Primary accent, CTAs, highlights |
| **Gold Bright** | `#E5BE6A` | 229, 190, 106 | Hover states, gradients |
| **Obsidian Black** | `#0A0A0A` | 10, 10, 10 | Primary background |
| **Pure White** | `#FFFFFF` | 255, 255, 255 | Primary text |

### Extended Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Surface** | `#121212` | Cards, elevated surfaces |
| **Surface-2** | `#1A1A1A` | Secondary surfaces |
| **Silver** | `#A3A3A3` | Secondary text |
| **Ash** | `#525252` | Muted text, placeholders |

### Accent Variations

```css
--gold: #D4A853;
--gold-bright: #E5BE6A;
--gold-dim: rgba(212,168,83,0.12);    /* Subtle backgrounds */
--gold-glow: rgba(212,168,83,0.35);   /* Box shadows, glows */
```

### State Colors

| State | Color | Hex |
|-------|-------|-----|
| Success | Emerald | `#22C55E` |
| Error | Ruby | `#EF4444` |
| Warning | Amber | `#F59E0B` |
| Info | Blue | `#3B82F6` |

## Typography

### Font Family

- **Display/Body:** Geist (Google Fonts)
- **Monospace:** Geist Mono

### Type Scale

| Use | Weight | Size |
|-----|--------|------|
| Hero Display | 800 | 72px |
| Section Titles | 800 | 44px |
| Headings | 700 | 24-36px |
| Body | 400 | 16px |
| Small/Labels | 500-600 | 13-14px |
| Code | 500 | 14px |

## Animation System

### Principles

1. **Subtle & Purposeful** — Motion should feel inevitable, not decorative
2. **Performance First** — Use CSS transforms, avoid layout shifts
3. **Respect Preferences** — Honor `prefers-reduced-motion`

### Core Animations

```css
/* Entrance animation */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Gold shimmer for hero text */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Floating particles */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Timing

- Fast transitions: `0.15s ease`
- Standard transitions: `0.3s ease-out`
- Entrance animations: `0.5-0.8s ease-out`
- Stagger delay: `50ms` between items

## Logo

### Logo Mark

- Shape: Rounded rectangle (6px radius)
- Content: Lock/shield icon with keyhole
- Background: Gold gradient (135deg, gold to gold-bright)
- Shadow: `0 2px 8px rgba(212,168,83,0.35)`

### Usage

- Minimum size: 24x24px
- Clear space: Equal to height of mark on all sides
- On dark backgrounds only (brand is dark-mode native)

## UI Components

### Buttons

**Primary (Gold)**
```css
.btn-gold {
  background: var(--gold);
  color: #000;
  font-weight: 700;
}
.btn-gold:hover {
  background: var(--gold-bright);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px var(--gold-glow);
}
```

**Outline**
```css
.btn-outline {
  background: transparent;
  border: 1px solid rgba(212,168,83,0.25);
  color: var(--fg-2);
}
```

### Cards

- Background: `#121212`
- Border: `1px solid rgba(255,255,255,0.08)`
- Border radius: `14px`
- Hover: Gold border glow

### Form Inputs

- Background: `#0A0A0A`
- Border: `1px solid rgba(212,168,83,0.25)`
- Focus: Gold border with `0 0 0 3px rgba(212,168,83,0.12)` shadow

## Voice & Tone

### Principles

1. **Technical but accessible** — Developers first, but CTOs understand
2. **Confident** — We solve a real problem, no hedging
3. **Concise** — Every word earns its place
4. **Secure** — Language reinforces trust and safety

### Do

- "Zero secrets in your agents"
- "Credentials fetched per-request, never stored"
- "Full audit trail, always"

### Don't

- Marketing fluff ("revolutionary", "game-changing")
- Uncertainty ("might help", "could reduce")
- Overpromising ("100% secure")

## Positioning

### Category

Agent-native credential isolation layer

### Competitors & Differentiation

| Competitor | Their Focus | Our Difference |
|------------|-------------|----------------|
| HashiCorp Vault | Enterprise secrets management | Agent-native, simpler |
| Infisical | Developer secrets | No agent identity |
| LiteLLM | LLM routing | No credential isolation |
| Portkey | LLM gateway | Still requires proxy keys |

### Key Messages

1. **Agent-native identity** — Built for AI workloads, not adapted from human IAM
2. **Zero-secret execution** — Agent processes never hold API keys
3. **JIT credentials** — Fetch per-request, discard immediately
4. **Complete audit trail** — Every operation logged with agent context

---

*Last updated: March 2026*
