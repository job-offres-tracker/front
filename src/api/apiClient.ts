import type { ProblemDetail } from '@src/models/problemDetail'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  readonly status: number
  readonly problem: ProblemDetail | null

  constructor(status: number, problem: ProblemDetail | null) {
    super(problem?.detail ?? `Erreur HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}

export function messageErreur(err: unknown): string {
  if (err instanceof ApiError) {
    return err.problem?.detail ?? err.message
  }
  return 'Une erreur inattendue est survenue'
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!response.ok) {
    let problem: ProblemDetail | null = null
    try {
      problem = await response.json()
    } catch {
      problem = null
    }
    throw new ApiError(response.status, problem)
  }

  if (response.status === 204 || response.status === 202) {
    return undefined as T
  }

  return response.json()
}
