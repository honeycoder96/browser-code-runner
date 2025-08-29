import { RunCodeResult } from '../types';

/**
 * Executes JavaScript code in an isolated environment
 * @param code - The JavaScript code to execute
 * @param stdin - Standard input (not used for JavaScript)
 * @returns Promise<RunCodeResult> - The execution result
 */
export async function runJavaScript(
  code: string,
  stdin: string = ''
): Promise<RunCodeResult> {
  const startTime = performance.now();
  
  try {
    // Create a sandboxed environment
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          sandbox.stdout += args.join(' ') + '\n';
        },
        error: (...args: any[]) => {
          sandbox.stderr += args.join(' ') + '\n';
        },
        warn: (...args: any[]) => {
          sandbox.stderr += args.join(' ') + '\n';
        }
      },
      stdout: '',
      stderr: '',
      // Add other global objects that might be needed
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      Math,
      JSON,
      Date,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Error,
      Promise,
      Map,
      Set,
      WeakMap,
      WeakSet,
      Symbol,
      Proxy,
      Reflect,
      Int8Array,
      Uint8Array,
      Uint8ClampedArray,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array,
      BigInt64Array,
      BigUint64Array,
      DataView,
      ArrayBuffer,
      SharedArrayBuffer,
      Atomics,
      WebAssembly
    };

    // Execute the code in the sandbox
    const result = new Function('sandbox', `
      with (sandbox) {
        ${code}
      }
    `)(sandbox);

    const timeMs = performance.now() - startTime;

    return {
      stdout: sandbox.stdout,
      stderr: sandbox.stderr,
      exitCode: 0,
      timeMs
    };
  } catch (error) {
    const timeMs = performance.now() - startTime;
    
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
      exitCode: 1,
      timeMs
    };
  }
} 