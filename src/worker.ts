import { ExecuteMessage, ResultMessage, ErrorMessage, WorkerMessage } from './types';
import { runJavaScript } from './runtimes/javascript-runner';
import { runPython } from './runtimes/python-runner';
import { runLua } from './runtimes/lua-runner';

// Type guard to check if the message is an execute message
function isExecuteMessage(message: WorkerMessage): message is ExecuteMessage {
  return message.type === 'execute';
}

/**
 * Handles code execution based on the language
 * @param language - The programming language
 * @param code - The source code
 * @param stdin - Standard input
 * @param timeout - Timeout in milliseconds
 * @returns Promise with the execution result
 */
async function executeCode(
  language: string,
  code: string,
  stdin: string = '',
  timeout: number = 5000
): Promise<any> {
  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Execution timed out after ${timeout}ms`));
    }, timeout);
  });

  // Create the execution promise
  const executionPromise = (async () => {
    switch (language) {
      case 'javascript':
        return await runJavaScript(code, stdin);
      case 'python':
        return await runPython(code, stdin);
      case 'lua':
        return await runLua(code, stdin);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  })();

  // Race between execution and timeout
  return Promise.race([executionPromise, timeoutPromise]);
}

// Listen for messages from the main thread
self.addEventListener('message', async (event: MessageEvent) => {
  const message = event.data as WorkerMessage;
  
  if (!isExecuteMessage(message)) {
    return;
  }

  const { id, payload } = message;
  const { language, code, stdin, timeout } = payload;

  try {
    const result = await executeCode(language, code, stdin, timeout);
    
    const response: ResultMessage = {
      type: 'result',
      id,
      payload: result
    };
    
    self.postMessage(response);
  } catch (error) {
    const errorResponse: ErrorMessage = {
      type: 'error',
      id,
      payload: {
        error: 'ExecutionError',
        message: error instanceof Error ? error.message : String(error)
      }
    };
    
    self.postMessage(errorResponse);
  }
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in worker:', event.reason);
});

// Handle errors
self.addEventListener('error', (event) => {
  console.error('Error in worker:', event.error);
}); 