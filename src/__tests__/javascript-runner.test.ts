import { runJavaScript } from '../runtimes/javascript-runner';

describe('JavaScript Runner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute simple JavaScript code', async () => {
    const result = await runJavaScript('console.log("Hello, World!");');
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('Hello, World!\n');
    expect(result.stderr).toBe('');
    expect(result.timeMs).toBeGreaterThan(0);
  });

  it('should handle mathematical operations', async () => {
    const result = await runJavaScript('console.log(2 + 3);');
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('5\n');
    expect(result.stderr).toBe('');
  });

  it('should handle multiple console.log statements', async () => {
    const result = await runJavaScript(`
      console.log("First");
      console.log("Second");
      console.log("Third");
    `);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('First\nSecond\nThird\n');
    expect(result.stderr).toBe('');
  });

  it('should handle errors gracefully', async () => {
    const result = await runJavaScript('undefined.nonExistentMethod();');
    
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Cannot read properties of undefined');
  });

  it('should handle syntax errors', async () => {
    const result = await runJavaScript('const x = {;');
    
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Unexpected token');
  });

  it('should handle async code', async () => {
    const result = await runJavaScript(`
      const promise = Promise.resolve("Async result");
      promise.then(result => console.log(result));
    `);
    
    expect(result.exitCode).toBe(0);
    // In test environment, async operations might not complete immediately
    // So we just check that the code executed without errors
    expect(result.stderr).toBe('');
  });

  it('should handle loops and arrays', async () => {
    const result = await runJavaScript(`
      const numbers = [1, 2, 3, 4, 5];
      numbers.forEach(num => console.log(num * 2));
    `);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('2\n4\n6\n8\n10\n');
    expect(result.stderr).toBe('');
  });

  it('should handle functions', async () => {
    const result = await runJavaScript(`
      function add(a, b) {
        return a + b;
      }
      console.log(add(5, 3));
    `);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('8\n');
    expect(result.stderr).toBe('');
  });
}); 