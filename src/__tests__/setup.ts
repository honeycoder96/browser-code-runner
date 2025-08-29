// Mock Web Worker for testing
export class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  
  constructor(scriptURL: string) {
    // Mock worker implementation
  }
  
  postMessage(message: any): void {
    // Mock message posting
  }
  
  terminate(): void {
    // Mock termination
  }
}

// Make MockWorker available globally for tests
declare global {
  var MockWorker: any;
}

global.MockWorker = MockWorker;

// Mock performance API
global.performance = {
  now: () => Date.now(),
} as any;

// Mock URL.createObjectURL
if (typeof global.URL !== 'undefined') {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();
} else {
  // Mock URL if it doesn't exist
  global.URL = {
    createObjectURL: jest.fn(() => 'blob:mock-url'),
    revokeObjectURL: jest.fn(),
  } as any;
}

// Mock Worker
global.Worker = MockWorker as any;

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}; 