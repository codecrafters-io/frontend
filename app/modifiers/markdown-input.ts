import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];
  };
};

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function handlePaste(event: ClipboardEvent) {
  const pastedData = event.clipboardData?.getData('text');
  const textarea = event.target as HTMLTextAreaElement;
  const isPastedDataValidUrl = validateUrl(pastedData as string);

  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const selectedText = textarea.value.substring(selectionStart, selectionEnd);
  const isSelectedTextValidUrl = validateUrl(selectedText);

  if (!textarea || !isPastedDataValidUrl || !selectedText || !isSelectedTextValidUrl) {
    return;
  }

  event.preventDefault();
  textarea.value = textarea.value.replace(selectedText, `[${selectedText}](${pastedData})`);
}

const markdownInput = modifier<Signature>((element) => {
  element.addEventListener('paste', handlePaste as EventListener);

  return () => {
    element.removeEventListener('paste', handlePaste as EventListener);
  };
});

export default markdownInput;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'markdown-input': typeof markdownInput;
  }
}
