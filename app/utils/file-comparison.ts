type FileComparisonChangeType = 'unchanged' | 'modified' | 'added' | 'deleted';

class BaseFileComparison {
  changeType: FileComparisonChangeType;
  newPath: string | null;
  oldPath: string | null;
  newContent: string | null;
  oldContent: string | null;
  diff: string | null;

  constructor(
    changeType: FileComparisonChangeType,
    newPath: string,
    oldPath: string | null,
    newContent: string | null,
    oldContent: string | null,
    diff: string | null,
  ) {
    this.changeType = changeType;
    this.newPath = newPath;
    this.oldPath = oldPath;
    this.newContent = newContent;
    this.oldContent = oldContent;
    this.diff = diff;
  }
}

export class UnchangedFileComparison extends BaseFileComparison {
  declare changeType: 'unchanged';
  declare oldPath: string;
  declare newPath: string;
  declare oldContent: string;
  declare newContent: null;
  declare diff: null;

  get content(): string {
    return this.oldContent;
  }

  get path(): string {
    if (this.oldPath !== this.newPath) {
      throw new Error('Old and new paths should be the same for unchanged files');
    }

    return this.oldPath;
  }
}

export class ModifiedFileComparison extends BaseFileComparison {
  declare changeType: 'modified';
  declare oldPath: string;
  declare newPath: string;
  declare oldContent: string;
  declare newContent: string;
  declare diff: string;

  get wasRenamed(): boolean {
    return this.oldPath !== this.newPath;
  }
}

export class AddedFileComparison extends BaseFileComparison {
  declare changeType: 'added';
  declare oldPath: null;
  declare newPath: string;
  declare oldContent: null;
  declare newContent: string;
  declare diff: null;

  get content(): string {
    return this.newContent;
  }

  get path(): string {
    return this.newPath;
  }
}

export class DeletedFileComparison extends BaseFileComparison {
  declare changeType: 'deleted';
  declare oldPath: string;
  declare newPath: null;
  declare oldContent: string;
  declare newContent: null;
  declare diff: null;

  get content(): string {
    return this.oldContent;
  }

  get path(): string {
    return this.oldPath;
  }
}

export type FileComparison = UnchangedFileComparison | ModifiedFileComparison | AddedFileComparison | DeletedFileComparison;

export function FileComparisonFromJSON(json: Record<string, unknown>): FileComparison {
  const constructorArgs: [FileComparisonChangeType, string, string | null, string | null, string | null, string | null] = [
    json['change_type'] as FileComparisonChangeType,
    json['new_path'] as string,
    json['old_path'] as string | null,
    json['new_content'] as string | null,
    json['old_content'] as string | null,
    json['diff'] as string | null,
  ];

  switch (json['change_type'] as FileComparisonChangeType) {
    case 'unchanged':
      return new UnchangedFileComparison(...constructorArgs);
    case 'modified':
      return new ModifiedFileComparison(...constructorArgs);
    case 'added':
      return new AddedFileComparison(...constructorArgs);
    case 'deleted':
      return new DeletedFileComparison(...constructorArgs);
    default:
      throw new Error(`Unknown change type: ${json['change_type']}`);
  }
}

export function IsUnchangedFileComparison(fileComparison: FileComparison): fileComparison is UnchangedFileComparison {
  return fileComparison.changeType === 'unchanged';
}

export function IsModifiedFileComparison(fileComparison: FileComparison): fileComparison is ModifiedFileComparison {
  return fileComparison.changeType === 'modified';
}

export function IsAddedFileComparison(fileComparison: FileComparison): fileComparison is AddedFileComparison {
  return fileComparison.changeType === 'added';
}

export function IsDeletedFileComparison(fileComparison: FileComparison): fileComparison is DeletedFileComparison {
  return fileComparison.changeType === 'deleted';
}
