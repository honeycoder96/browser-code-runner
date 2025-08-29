import { RunCodeOptions, RunCodeResult, ExecuteMessage, ResultMessage, ErrorMessage } from './types';

/**
 * Main class for executing code in web workers
 */
export class CodeRunner {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, { resolve: (value: RunCodeResult) => void; reject: (error: Error) => void }>();
  private workerUrl: string;

  constructor(workerUrl?: string) {
    this.workerUrl = workerUrl || this.createWorkerBlob();
  }

  /**
   * Creates a worker blob URL from the worker code
   * @returns string - The blob URL for the worker
   */
  private createWorkerBlob(): string {
    // This will be replaced with the actual worker code during build
    const workerCode = `
      // Worker code will be injected here during build
      importScripts('${window.location.origin}/worker.js');
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
  }

  /**
   * Initializes the web worker
   */
  private initializeWorker(): void {
    if (this.worker) {
      return;
    }

    try {
      this.worker = new Worker(this.workerUrl);
      
      this.worker.onmessage = (event: MessageEvent) => {
        const message = event.data as ResultMessage | ErrorMessage;
        const request = this.pendingRequests.get(message.id);
        
        if (!request) {
          return;
        }
        
        this.pendingRequests.delete(message.id);
        
        if (message.type === 'result') {
          request.resolve(message.payload);
        } else if (message.type === 'error') {
          request.reject(new Error(message.payload.message));
        }
      };
      
      this.worker.onerror = (error: ErrorEvent) => {
        console.error('Worker error:', error);
        // Reject all pending requests
        this.pendingRequests.forEach((request) => {
          request.reject(new Error(`Worker error: ${error.message}`));
        });
        this.pendingRequests.clear();
      };
    } catch (error) {
      throw new Error(`Failed to create worker: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generates a unique ID for requests
   * @returns string - Unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Executes code in a web worker
   * @param options - Code execution options
   * @returns Promise<RunCodeResult> - The execution result
   */
  async runCode(options: RunCodeOptions): Promise<RunCodeResult> {
    const { language, code, stdin = '', timeout = 5000 } = options;
    
    // Initialize worker if not already done
    this.initializeWorker();
    
    if (!this.worker) {
      throw new Error('Failed to initialize worker');
    }
    
    const requestId = this.generateRequestId();
    
    return new Promise<RunCodeResult>((resolve, reject) => {
      // Store the promise handlers
      this.pendingRequests.set(requestId, { resolve, reject });
      
      // Create the execute message
      const message: ExecuteMessage = {
        type: 'execute',
        id: requestId,
        payload: {
          language,
          code,
          stdin,
          timeout
        }
      };
      
      // Send the message to the worker
      this.worker!.postMessage(message);
      
      // Set a timeout for the entire operation
      setTimeout(() => {
        const request = this.pendingRequests.get(requestId);
        if (request) {
          this.pendingRequests.delete(requestId);
          request.reject(new Error(`Request timed out after ${timeout}ms`));
        }
      }, timeout + 1000); // Add 1 second buffer
    });
  }

  /**
   * Terminates the worker and cleans up resources
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    // Reject all pending requests
    this.pendingRequests.forEach((request) => {
      request.reject(new Error('Worker terminated'));
    });
    this.pendingRequests.clear();
    
    // Revoke the blob URL
    if (this.workerUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.workerUrl);
    }
  }
}

// Create a singleton instance
const codeRunner = new CodeRunner();

/**
 * Unified API function to execute code
 * @param options - Code execution options
 * @returns Promise<RunCodeResult> - The execution result
 */
export async function runCode(options: RunCodeOptions): Promise<RunCodeResult> {
  return codeRunner.runCode(options);
}

/**
 * Creates a new CodeRunner instance
 * @param workerUrl - Optional custom worker URL
 * @returns CodeRunner - New code runner instance
 */
export function createCodeRunner(workerUrl?: string): CodeRunner {
  return new CodeRunner(workerUrl);
} 