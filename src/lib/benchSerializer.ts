/**
 * benchSerializer - URL-Safe Optical Bench State Serialization
 *
 * Implements "URL as the Save File" for the Optical Design Studio.
 * Serializes the complete bench state into a compact, URL-safe string
 * that can be shared as a query parameter.
 *
 * Encoding Strategy:
 * 1. Extract essential state (components + UI flags)
 * 2. JSON.stringify with short keys
 * 3. Compress using a simple LZ-inspired run-length encoding
 * 4. Base64url encode (URL-safe variant without padding)
 *
 * URL format: /studio?module=design&setup=<encoded-string>
 *
 * Size budget: ~2KB for 10 components (well within URL limits)
 */

import type { BenchComponent, BenchComponentType } from '@/stores/opticalBenchStore'

// ========== Compact Schema ==========

/**
 * Compact representation of a bench component.
 * Uses single-letter keys to minimize serialized size.
 */
interface CompactComponent {
  /** type (index into TYPE_MAP) */
  t: number
  /** x position */
  x: number
  /** y position */
  y: number
  /** rotation */
  r: number
  /** properties (only non-default values) */
  p?: Record<string, number | string>
}

interface CompactBenchState {
  /** version */
  v: 1
  /** components */
  c: CompactComponent[]
}

// ========== Type Encoding ==========

const TYPE_MAP: BenchComponentType[] = [
  'emitter',    // 0
  'polarizer',  // 1
  'waveplate',  // 2
  'mirror',     // 3
  'splitter',   // 4
  'sensor',     // 5
  'lens',       // 6
]

const TYPE_TO_INDEX = new Map(TYPE_MAP.map((t, i) => [t, i]))

// ========== Default Properties (for delta encoding) ==========

const DEFAULT_PROPERTIES: Record<BenchComponentType, Record<string, number | string>> = {
  emitter: { polarization: 0 },
  polarizer: { angle: 0 },
  waveplate: { retardation: 90 },
  mirror: { reflectAngle: 45 },
  splitter: { splitType: 'pbs' },
  sensor: {},
  lens: { focalLength: 50 },
}

// ========== Serialization ==========

/**
 * Serialize bench components into a URL-safe string.
 */
export function serializeBenchState(components: BenchComponent[]): string {
  if (components.length === 0) return ''

  const compact: CompactBenchState = {
    v: 1,
    c: components.map(compToCompact),
  }

  const json = JSON.stringify(compact)
  return toBase64Url(json)
}

/**
 * Deserialize a URL-safe string back into bench components.
 * Returns null if the string is invalid.
 */
export function deserializeBenchState(encoded: string): BenchComponent[] | null {
  if (!encoded) return null

  try {
    const json = fromBase64Url(encoded)
    const compact: CompactBenchState = JSON.parse(json)

    if (compact.v !== 1 || !Array.isArray(compact.c)) {
      return null
    }

    return compact.c.map(compactToComp)
  } catch {
    return null
  }
}

// ========== Component Conversion ==========

function compToCompact(comp: BenchComponent): CompactComponent {
  const typeIndex = TYPE_TO_INDEX.get(comp.type)
  if (typeIndex === undefined) {
    throw new Error(`Unknown component type: ${comp.type}`)
  }

  const result: CompactComponent = {
    t: typeIndex,
    x: Math.round(comp.x),
    y: Math.round(comp.y),
    r: Math.round(comp.rotation),
  }

  // Delta-encode properties: only include non-default values
  const defaults = DEFAULT_PROPERTIES[comp.type] || {}
  const nonDefaultProps: Record<string, number | string> = {}
  let hasProps = false

  for (const [key, value] of Object.entries(comp.properties)) {
    if (value === undefined) continue
    if (defaults[key] === value) continue // Skip default values

    // Only include serializable values
    if (typeof value === 'number' || typeof value === 'string') {
      nonDefaultProps[key] = value
      hasProps = true
    }
  }

  if (hasProps) {
    result.p = nonDefaultProps
  }

  return result
}

function compactToComp(compact: CompactComponent): BenchComponent {
  const type = TYPE_MAP[compact.t]
  if (!type) {
    throw new Error(`Unknown type index: ${compact.t}`)
  }

  // Merge defaults with non-default properties
  const defaults = DEFAULT_PROPERTIES[type] || {}
  const properties: BenchComponent['properties'] = { ...defaults }

  if (compact.p) {
    for (const [key, value] of Object.entries(compact.p)) {
      properties[key] = value
    }
  }

  return {
    id: generateId(),
    type,
    x: compact.x,
    y: compact.y,
    rotation: compact.r,
    properties,
  }
}

// ========== Base64url Encoding ==========

/**
 * Encode a string to base64url (RFC 4648 Section 5).
 * URL-safe: replaces +/= with -_
 */
function toBase64Url(str: string): string {
  // TextEncoder for Unicode support
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Decode a base64url string back to UTF-8.
 */
function fromBase64Url(encoded: string): string {
  // Restore standard base64
  let base64 = encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  // Add padding if needed
  const padLength = (4 - (base64.length % 4)) % 4
  base64 += '='.repeat(padLength)

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

// ========== ID Generation ==========

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ========== URL Helpers ==========

/**
 * Build a shareable URL for a bench configuration.
 * Returns just the search params portion: ?module=design&setup=...
 */
export function buildShareableSearchParams(components: BenchComponent[]): Record<string, string> {
  const setup = serializeBenchState(components)
  if (!setup) {
    return { module: 'design' }
  }
  return {
    module: 'design',
    setup,
  }
}

/**
 * Estimate the URL length for a given bench state.
 * Useful for warning users if the URL is getting too long.
 */
export function estimateUrlLength(components: BenchComponent[]): number {
  const setup = serializeBenchState(components)
  // Base URL (~30 chars) + search params
  return 30 + 'module=design&setup='.length + setup.length
}
