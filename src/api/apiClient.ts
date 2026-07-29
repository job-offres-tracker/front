import type { ProblemDetail } from '@src/models/problemDetail'

const BASE_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_PATH

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
  if (err instanceof Error) {
    return err.message
  }
  return 'Une erreur inattendue est survenue'
}

async function ensureOk(response: Response): Promise<void> {
  if (!response.ok) {
    let problem: ProblemDetail | null = null
    try {
      problem = await response.json()
    } catch {
      problem = null
    }
    throw new ApiError(response.status, problem)
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  await ensureOk(response)

  if (response.status === 204 || response.status === 202) {
    return undefined as T
  }

  return response.json()
}

export async function requestUpload<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
  })

  await ensureOk(response)

  return response.json()
}

export async function requestBlob(path: string): Promise<Blob> {
  const response = await fetch(`${BASE_URL}${path}`)

  await ensureOk(response)

  return response.blob()
}
