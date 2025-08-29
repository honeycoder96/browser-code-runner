import { runCode, createCodeRunner, CodeRunner } from '../code-runner';
import { RunCodeOptions } from '../types';

// Mock the individual runners
jest.mock('../runtimes/javascript-runner');
jest.mock('../runtimes/python-runner');
jest.mock('../runtimes/lua-runner');

describe('CodeRunner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runCode function', () => {
    it('should execute JavaScript code', async () => {
      const options: RunCodeOptions = {
        language: 'javascript',
        code: 'console.log("Hello, World!");',
        stdin: '',
        timeout: 2000
      };

      // Mock the worker response
      const mockWorker = {
        postMessage: jest.fn(),
        onmessage: null as any,
        onerror: null as any,
        terminate: jest.fn()
      };

      // Mock Worker constructor
      (global as any).Worker = jest.fn(() => mockWorker);

      const result = await runCode(options);

      expect(result).toBeDefined();
      expect(result.exitCode).toBe(0);
      expect(result.timeMs).toBeGreaterThan(0);
    });

    it('should handle unsupported language', async () => {
      const options: RunCodeOptions = {
        language: 'unsupported' as any,
        code: 'console.log("test");',
        timeout: 2000
      };

      await expect(runCode(options)).rejects.toThrow('Unsupported language');
    });

    it('should handle timeout', async () => {
      const options: RunCodeOptions = {
        language: 'javascript',
        code: 'while(true) {}', // Infinite loop
        timeout: 100
      };

      await expect(runCode(options)).rejects.toThrow('timed out');
    });
  });

  describe('CodeRunner class', () => {
    it('should create a new instance', () => {
      const runner = createCodeRunner();
      expect(runner).toBeInstanceOf(CodeRunner);
    });

    it('should create instance with custom worker URL', () => {
      const customUrl = 'custom-worker.js';
      const runner = createCodeRunner(customUrl);
      expect(runner).toBeInstanceOf(CodeRunner);
    });

    it('should terminate worker and clean up resources', () => {
      const runner = createCodeRunner();
      const mockWorker = {
        terminate: jest.fn()
      };

      // Mock Worker constructor
      (global as any).Worker = jest.fn(() => mockWorker);

      runner.terminate();
      expect(mockWorker.terminate).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should handle worker creation errors', async () => {
      // Mock Worker to throw error
      (global as any).Worker = jest.fn(() => {
        throw new Error('Worker creation failed');
      });

      const options: RunCodeOptions = {
        language: 'javascript',
        code: 'console.log("test");'
      };

      await expect(runCode(options)).rejects.toThrow('Failed to create worker');
    });

    it('should handle worker errors', async () => {
      const mockWorker = {
        postMessage: jest.fn(),
        onmessage: null as any,
        onerror: null as any,
        terminate: jest.fn()
      };

      (global as any).Worker = jest.fn(() => mockWorker);

      const options: RunCodeOptions = {
        language: 'javascript',
        code: 'console.log("test");'
      };

      // Simulate worker error
      setTimeout(() => {
        if (mockWorker.onerror) {
          mockWorker.onerror(new ErrorEvent('error', { message: 'Worker error' }));
        }
      }, 0);

      await expect(runCode(options)).rejects.toThrow('Worker error');
    });
  });
}); 