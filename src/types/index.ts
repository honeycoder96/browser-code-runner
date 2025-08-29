/**
 * Supported programming languages
 */
export type SupportedLanguage = 'javascript' | 'python' | 'lua';

/**
 * Input parameters for code execution
 */
export interface RunCodeOptions {
  /** The programming language to execute */
  language: SupportedLanguage;
  /** The source code to execute */
  code: string;
  /** Standard input for the program */
  stdin?: string;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Result of code execution
 */
export interface RunCodeResult {
  /** Standard output */
  stdout: string;
  /** Standard error */
  stderr: string;
  /** Exit code (0 for success, non-zero for errors) */
  exitCode: number;
  /** Execution time in milliseconds */
  timeMs: number;
}

/**
 * Worker message types for communication between main thread and web workers
 */
export interface WorkerMessage {
  type: 'execute' | 'result' | 'error';
  id: string;
  payload?: any;
}

/**
 * Execute message sent to worker
 */
export interface ExecuteMessage extends WorkerMessage {
  type: 'execute';
  payload: {
    language: SupportedLanguage;
    code: string;
    stdin?: string;
    timeout?: number;
  };
}

/**
 * Result message received from worker
 */
export interface ResultMessage extends WorkerMessage {
  type: 'result';
  payload: RunCodeResult;
}

/**
 * Error message received from worker
 */
export interface ErrorMessage extends WorkerMessage {
  type: 'error';
  payload: {
    error: string;
    message: string;
  };
} 