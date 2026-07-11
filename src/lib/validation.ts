export interface ValidationResult { valid: boolean; error?: string }

const BLOCKED = /[\x00-\x08\x0B\x0C\x0E-\x1F]/

export function sanitizeText(v: string): string {
  return v.replace(BLOCKED, '').trim()
}

export function validateName(v: string): ValidationResult {
  const s = sanitizeText(v)
  if (!s) return { valid: false, error: 'Name is required.' }
  if (s.length > 120) return { valid: false, error: 'Name must be 120 characters or fewer.' }
  return { valid: true }
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function validateEmail(v: string): ValidationResult {
  const s = sanitizeText(v)
  if (!s) return { valid: false, error: 'Email is required.' }
  if (!EMAIL_RE.test(s)) return { valid: false, error: 'Enter a valid email address.' }
  return { valid: true }
}

export function validateSubject(v: string): ValidationResult {
  const s = sanitizeText(v)
  if (!s) return { valid: false, error: 'Subject is required.' }
  if (s.length > 200) return { valid: false, error: 'Subject must be 200 characters or fewer.' }
  return { valid: true }
}

export function validateMessage(v: string): ValidationResult {
  const s = sanitizeText(v)
  if (!s || s.length < 10) return { valid: false, error: 'Message must be at least 10 characters.' }
  if (s.length > 4000) return { valid: false, error: 'Message must be 4000 characters or fewer.' }
  return { valid: true }
}

export function validateOrganization(v: string): ValidationResult {
  if (!v) return { valid: true }
  const s = sanitizeText(v)
  if (s.length > 120) return { valid: false, error: 'Organization must be 120 characters or fewer.' }
  return { valid: true }
}

export function validatePassword(v: string): ValidationResult {
  if (!v) return { valid: false, error: 'Password is required.' }
  if (v.length < 12) return { valid: false, error: 'Password must be at least 12 characters.' }
  if (!/[A-Z]/.test(v)) return { valid: false, error: 'Password must include an uppercase letter.' }
  if (!/[a-z]/.test(v)) return { valid: false, error: 'Password must include a lowercase letter.' }
  if (!/[0-9]/.test(v)) return { valid: false, error: 'Password must include a digit.' }
  if (!/[^A-Za-z0-9]/.test(v)) return { valid: false, error: 'Password must include a symbol.' }
  return { valid: true }
}

export function validateSlug(v: string): ValidationResult {
  const s = sanitizeText(v).toLowerCase()
  if (!s) return { valid: false, error: 'Slug is required.' }
  if (!/^[a-z0-9-]+$/.test(s)) return { valid: false, error: 'Slug may only contain lowercase letters, digits, and hyphens.' }
  return { valid: true }
}

const RATE_WINDOWS: Record<string, number[]> = {}
export function rateLimit(key: string, maxCalls: number, windowMs: number): boolean {
  const now = Date.now()
  const wins = (RATE_WINDOWS[key] ?? []).filter((t) => now - t < windowMs)
  if (wins.length >= maxCalls) return false
  wins.push(now)
  RATE_WINDOWS[key] = wins
  return true
}
