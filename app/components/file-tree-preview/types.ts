export type FileTreeFileItem = { type: 'file'; name: string; isGrayedOut?: boolean };
export type FileTreeFolderItem = { type: 'folder'; name: string; children?: FileTreeItem[] };
export type FileTreeItem = FileTreeFileItem | FileTreeFolderItem;
