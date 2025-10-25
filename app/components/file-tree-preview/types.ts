export type FileTreeFileItem = { type: 'file'; name: string; isGrayedOut?: boolean };
export type FileTreeFolderItem = { type: 'folder'; name: string; isGrayedOut?: boolean; children?: FileTreeItem[] };
export type FileTreeItem = FileTreeFileItem | FileTreeFolderItem;
