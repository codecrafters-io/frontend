import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];
  };
};

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();

  const clipboardData = event.clipboardData;
  const pastedData = clipboardData?.getData('text');
  const textarea = event.target as HTMLTextAreaElement;
  const isPastedDataValidUrl = pastedData ? /(?:https?:\/\/)?(?:www\.)?[\w.-]+(?:\.[\w\.-]+)+/.test(pastedData) : false;

  if (textarea && isPastedDataValidUrl) {
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = textarea.value.substring(selectionStart, selectionEnd);

    if (selectedText) {
      event.preventDefault();

      const newText = textarea.value.replace(selectedText, `[${selectedText}](${pastedData})`);
      textarea.value = newText;
    }
  }
}

const convertLinkToMarkdown = modifier<Signature>((element) => {
  // @ts-ignore
  element.addEventListener('paste', handlePaste);

  return () => {
    // @ts-ignore
    element.removeEventListener('paste', handlePaste);
  }
});

export default convertLinkToMarkdown;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'convert-link-to-markdown': typeof convertLinkToMarkdown;
  }
}
