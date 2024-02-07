import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];
  };
};

function handlePaste(event: ClipboardEvent) {
  const pastedData = event.clipboardData?.getData('text');
  const textarea = event.target as HTMLTextAreaElement;
  let isPastedDataValidUrl;

  if (pastedData) {
    try {
      new URL(pastedData);
      isPastedDataValidUrl = true;
    } catch (_) {
      isPastedDataValidUrl = false;
    }
  }

  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const selectedText = textarea.value.substring(selectionStart, selectionEnd);

  if (!textarea || !isPastedDataValidUrl || !selectedText) {
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
