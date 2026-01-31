import * as Sentry from '@sentry/ember';
import Model from '@ember-data/model';

export async function fetchFileContentsIfNeeded<S extends string, C extends string>(
  model: Model & { [key in S]: string | null } & { [key in C]: string | null },
  fileUrl: string,
  fileContentsProperty: C,
  fileContentsSourceProperty: S,
) {
  if (model[fileContentsProperty] && model[fileContentsSourceProperty] && model[fileContentsSourceProperty] === fileUrl) {
    return;
  }

  if (!fileUrl) {
    return;
  }

  try {
    const response = await fetch(fileUrl);

    if (response.status === 200) {
      (model[fileContentsProperty] as string) = (await response.text()) as string;
      (model[fileContentsSourceProperty] as string) = fileUrl;
    } else {
      Sentry.captureMessage(`Failed to fetch logs file for submission evaluation`, {
        extra: { response_status: response.status, response_body: await response.text(), model_id: model.id },
      });
    }
  } catch (error) {
    Sentry.captureException(error);
  }
}
