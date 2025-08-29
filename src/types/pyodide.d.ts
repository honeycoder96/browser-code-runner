declare module 'pyodide' {
  export interface PyodideInterface {
    runPythonAsync(code: string): Promise<any>;
    globals: {
      get(key: string): any;
      set(key: string, value: any): void;
    };
    loadPackage(packages: string | string[]): Promise<void>;
  }

  export interface LoadPyodideOptions {
    indexURL?: string;
    fullStdLib?: boolean;
    stdin?: (() => string) | null;
    stdout?: ((text: string) => void) | null;
    stderr?: ((text: string) => void) | null;
  }

  export function loadPyodide(options?: LoadPyodideOptions): Promise<PyodideInterface>;
} 