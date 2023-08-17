// Moved these declarations from types/codecrafters-frontend/index.d.ts
// to avoid typescript errors when importing images.
// Isn't clear why this is necessary as we include the index.d.ts file
// in the tsconfig.json file.

declare module '*.jpg';
declare module '*.svg';