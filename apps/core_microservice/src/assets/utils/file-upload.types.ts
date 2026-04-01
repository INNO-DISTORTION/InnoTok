export type FileFilterCallback = (
  error: Error | null,
  acceptFile: boolean,
) => void;

export type DiskStorageCallback = (
  error: Error | null,
  filename: string,
) => void;
