type AdapterErrorLike = { errors?: { detail?: unknown; status?: unknown }[] };

const REFUSAL_STATUSES = ['403', '404', '409'];

// Refusals (not eligible, already taken) are written for the participant and would be refused again on retry.
export function interviewServiceRefusalMessage(error: unknown): string | null {
  const [firstError] = (error as AdapterErrorLike | null)?.errors || [];
  const isRefusal = REFUSAL_STATUSES.includes(String(firstError?.status));

  return isRefusal && typeof firstError?.detail === 'string' && firstError.detail.length > 0 ? firstError.detail : null;
}
