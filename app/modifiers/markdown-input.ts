import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];
  };
};

function handlePaste(event: ClipboardEvent) {
  const pastedData = event.clipboardData?.getData('text');
  const textarea = event.target as HTMLTextAreaElement;
  const isPastedDataValidUrl = validateUrl(pastedData as string);

  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const selectedText = textarea.value.substring(selectionStart, selectionEnd);
  const isSelectedTextValidUrl = validateUrl(selectedText);

  if (!textarea || !isPastedDataValidUrl || !selectedText || isSelectedTextValidUrl) {
    return;
  }

  event.preventDefault();

  const newText = `[${selectedText}](${pastedData})`;
  textarea.value = textarea.value.replace(selectedText, newText);

  const newCursorPosition = selectionStart + newText.length;
  textarea.selectionStart = newCursorPosition;
  textarea.selectionEnd = newCursorPosition;
}

function validateUrl(url: string): boolean {
  try {
    new URL(url);

    return true;
  } catch (_) {
    return false;
  }
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
