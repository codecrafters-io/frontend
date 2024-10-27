import { stub } from 'sinon';

const TEXT_MIME_TYPE = 'text/plain';

/**
 * Stubs the following `navigator.clipboard` methods with sinon fakes
 * and returns the array used for storing the fake clipboard cache:
 * - `read`
 * - `write`
 * - `readText`
 * - `writeText`
 * @param {ClipboardItem[]} [cache=new Array<ClipboardItem>()] Predefined contents of the fake clipboard cache
 * @returns {ClipboardItem[]} Fake clipboard cache
 */
export default function stubClipboard(cache: ClipboardItem[] = new Array<ClipboardItem>()): ClipboardItem[] {
  stub(navigator.clipboard, 'read').callsFake(async function () {
    return cache;
  });

  stub(navigator.clipboard, 'write').callsFake(async function (contents: ClipboardItem[] = []) {
    cache.splice(0, Infinity, ...contents);
  });

  stub(navigator.clipboard, 'readText').callsFake(async function () {
    return (await cache[0]?.getType(TEXT_MIME_TYPE))?.text() || '';
  });

  stub(navigator.clipboard, 'writeText').callsFake(async function (text = '') {
    const blob = new Blob([text], { type: TEXT_MIME_TYPE });
    cache.splice(0, Infinity, ...[new ClipboardItem({ [TEXT_MIME_TYPE]: blob })]);
  });

  return cache;
}
