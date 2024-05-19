import * as Sentry from '@sentry/ember';
import Model from '@ember-data/model';

export async function fetchFileContentsIfNeeded<U extends string, C extends string>(
  model: Model & { [key in U]: string } & { [key in C]: string | null },
  fileUrlProperty: U,
  fileContentsProperty: C,
) {
  if (model[fileContentsProperty]) {
    return;
  }

  if (!model[fileUrlProperty]) {
    return;
  }

  try {
    const response = await fetch(model[fileUrlProperty]!);

    if (response.status === 200) {
      (model[fileContentsProperty] as string) = (await response.text()) as string;
    } else {
      Sentry.captureMessage(`Failed to fetch logs file for submission evaluation`, {
        extra: { response_status: response.status, response_body: await response.text(), model_id: model.id },
      });
    }
  } catch (error) {
    Sentry.captureException(error);
  }
}
