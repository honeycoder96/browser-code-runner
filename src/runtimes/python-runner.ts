import { RunCodeResult } from '../types';

// Global Pyodide instance
let pyodideInstance: any = null;

/**
 * Loads Pyodide if not already loaded
 * @returns Promise<any> - The Pyodide instance
 */
async function loadPyodide(): Promise<any> {
  if (!pyodideInstance) {
    try {
      // Dynamic import to avoid bundling issues
      const { loadPyodide } = await import('pyodide');
      pyodideInstance = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
      });
    } catch (error) {
      throw new Error(`Failed to load Pyodide: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return pyodideInstance;
}

/**
 * Executes Python code using Pyodide
 * @param code - The Python code to execute
 * @param stdin - Standard input (not currently supported in this implementation)
 * @returns Promise<RunCodeResult> - The execution result
 */
export async function runPython(
  code: string,
  stdin: string = ''
): Promise<RunCodeResult> {
  const startTime = performance.now();
  
  try {
    const pyodide = await loadPyodide();
    
    // Capture stdout and stderr
    let stdout = '';
    let stderr = '';
    
    // Override Python's print function to capture output
    await pyodide.runPythonAsync(`
      import sys
      from io import StringIO
      
      # Create string buffers for stdout and stderr
      stdout_buffer = StringIO()
      stderr_buffer = StringIO()
      
      # Store original streams
      original_stdout = sys.stdout
      original_stderr = sys.stderr
      
      # Redirect streams to our buffers
      sys.stdout = stdout_buffer
      sys.stderr = stderr_buffer
    `);
    
    // Execute the user code
    const result = await pyodide.runPythonAsync(code);
    
    // Restore original streams and get captured output
    await pyodide.runPythonAsync(`
      # Restore original streams
      sys.stdout = original_stdout
      sys.stderr = original_stderr
      
      # Get captured output
      captured_stdout = stdout_buffer.getvalue()
      captured_stderr = stderr_buffer.getvalue()
      
      # Close buffers
      stdout_buffer.close()
      stderr_buffer.close()
    `);
    
    // Get the captured output from Python
    stdout = pyodide.globals.get('captured_stdout') || '';
    stderr = pyodide.globals.get('captured_stderr') || '';
    
    // Add the result to stdout if it's not None
    if (result !== undefined && result !== null) {
      stdout += String(result);
    }
    
    const timeMs = performance.now() - startTime;
    
    return {
      stdout,
      stderr,
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