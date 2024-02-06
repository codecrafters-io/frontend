import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];
  };
};

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();

  const pastedData = event.clipboardData?.getData('text');
  const textarea = event.target as HTMLTextAreaElement;
  const isPastedDataValidUrl = pastedData ? /(?:https?:\/\/)?(?:www\.)?[\w.-]+(?:\.[\w\.-]+)+/.test(pastedData) : false;

  if (textarea && isPastedDataValidUrl) {
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = textarea.value.substring(selectionStart, selectionEnd);

    if (selectedText) {
      textarea.value = textarea.value.replace(selectedText, `[${selectedText}](${pastedData})`);
    }
  }
}

const convertLinkToMarkdown = modifier<Signature>((element) => {
  element.addEventListener('paste', handlePaste as EventListener);

  return () => {
    element.removeEventListener('paste', handlePaste as EventListener);
  }
});

export default convertLinkToMarkdown;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'convert-link-to-markdown': typeof convertLinkToMarkdown;
  }
}
