import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];
  };
};

function handlePaste(event: ClipboardEvent) {
  const pastedData = event.clipboardData?.getData('text');
  const textarea = event.target as HTMLTextAreaElement;

  // Regex to check if pasted data is a valid URL from here: https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
  const isPastedDataValidUrl = pastedData ? /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/.test(pastedData) : false;

  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const selectedText = textarea.value.substring(selectionStart, selectionEnd);

  if (!textarea || !isPastedDataValidUrl) {
    return;
  }

  if (selectedText) {
    event.preventDefault();
    textarea.value = textarea.value.replace(selectedText, `[${selectedText}](${pastedData})`);
  }
}

const convertLinkToMarkdown = modifier<Signature>((element) => {
  element.addEventListener('paste', handlePaste as EventListener);

  return () => {
    element.removeEventListener('paste', handlePaste as EventListener);
  };
});

export default convertLinkToMarkdown;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'convert-link-to-markdown': typeof convertLinkToMarkdown;
  }
}
