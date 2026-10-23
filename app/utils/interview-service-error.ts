type AdapterErrorLike = { errors?: { detail?: unknown; status?: unknown }[] };

const REFUSAL_STATUSES = ['403', '404', '409'];
const BUSY_STATUSES = ['503'];

function messageForStatuses(error: unknown, statuses: string[]): string | null {
  const [firstError] = (error as AdapterErrorLike | null)?.errors || [];
  const hasStatus = statuses.includes(String(firstError?.status));

  return hasStatus && typeof firstError?.detail === 'string' && firstError.detail.length > 0 ? firstError.detail : null;
}

// Refusals (not eligible, already taken) are written for the participant and would be refused again on retry.
export function interviewServiceRefusalMessage(error: unknown): string | null {
  return messageForStatuses(error, REFUSAL_STATUSES);
}

// Every call slot is taken; unlike a refusal, trying again in a few minutes can get through.
export function interviewServiceBusyMessage(error: unknown): string | null {
  return messageForStatuses(error, BUSY_STATUSES);
}
