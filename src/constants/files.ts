// File Constants
export const SUPPORTED_FILE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs',
  '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.clj',
  '.hs', '.ml', '.fs', '.vb', '.sql', '.sh', '.bash', '.zsh',
  '.json', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
  '.md', '.txt', '.rst', '.adoc'
] as const;

export const MAX_FILE_SIZE = 1024 * 1024; // 1MB
export const MAX_FILES_PER_REQUEST = 100; 