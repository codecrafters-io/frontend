interface AdapterErrorLike {
  isAdapterError?: boolean;
  errors?: { status?: string | number }[];
}

export default function isExperimentUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const adapterError = error as AdapterErrorLike;

  if (!adapterError.isAdapterError) {
    return false;
  }

  return (adapterError.errors || []).some((item) => {
    const status = Number(item.status);

    return status === 400 || status === 404;
  });
}
