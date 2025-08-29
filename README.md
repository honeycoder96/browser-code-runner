# Browser Code Runner

A unified API to execute different programming languages in the browser using web workers. This package provides a seamless way to run JavaScript, Python, and Lua code directly in the browser without blocking the main thread.

## Features

- 🚀 **Web Worker Support**: All code execution runs in separate threads to keep your main thread responsive
- 🐍 **Python Support**: Execute Python code using Pyodide (CPython compiled to WebAssembly)
- 🔧 **JavaScript Support**: Execute JavaScript/TypeScript code in a sandboxed environment
- 🎯 **Lua Support**: Execute Lua code using Fengari (Lua VM in JavaScript)
- ⏱️ **Timeout Protection**: Configurable timeouts to prevent infinite loops
- 📦 **TypeScript Support**: Full TypeScript definitions included
- 🧪 **Comprehensive Testing**: Thorough test coverage for all features

## Installation

```bash
npm install browser-code-runner
```

## Quick Start

```typescript
import { runCode } from 'browser-code-runner';

// Execute Python code
const result = await runCode({
  language: 'python',
  code: 'print("Hello from Python!")',
  timeout: 2000
});

console.log(result);
// {
//   stdout: "Hello from Python!\n",
//   stderr: "",
//   exitCode: 0,
//   timeMs: 15
// }
```

## 🎮 Try the Demo

Experience the Browser Code Runner in action with our interactive demo:

- **🌐 Live Demo**: [View Demo](https://yourusername.github.io/browser-code-runner/)
- **📱 Mobile Responsive**: Works perfectly on all devices
- **🎨 Monaco Editor**: Professional code editing experience
- **🚀 Real-time Execution**: See results immediately

**Run locally:**
```bash
npm install
npm run demo
```

## Supported Languages

### Phase 1 (Currently Supported)

1. **JavaScript/TypeScript**
   - Runs natively in the browser
   - Sandboxed execution environment
   - Full access to JavaScript APIs

2. **Python**
   - Powered by Pyodide (CPython → WebAssembly)
   - ~7-10 MB initial load (cached after first use)
   - Full Python standard library support

3. **Lua**
   - Powered by Fengari (Lua VM in JavaScript)
   - ~1 MB lightweight interpreter
   - Easy to embed and fast execution

## API Reference

### `runCode(options: RunCodeOptions): Promise<RunCodeResult>`

The main function to execute code in any supported language.

#### Parameters

```typescript
interface RunCodeOptions {
  language: 'javascript' | 'python' | 'lua';
  code: string;
  stdin?: string;
  timeout?: number; // Default: 5000ms
}
```

#### Returns

```typescript
interface RunCodeResult {
  stdout: string;
  stderr: string;
  exitCode: number; // 0 for success, non-zero for errors
  timeMs: number;   // Execution time in milliseconds
}
```

### `createCodeRunner(workerUrl?: string): CodeRunner`

Create a new CodeRunner instance for advanced usage.

### `CodeRunner` Class

Advanced API for managing multiple code executions.

```typescript
const runner = createCodeRunner();

// Execute code
const result = await runner.runCode({
  language: 'javascript',
  code: 'console.log("Hello World");'
});

// Clean up resources
runner.terminate();
```

## Usage Examples

### JavaScript Execution

```typescript
import { runCode } from 'browser-code-runner';

// Simple JavaScript
const jsResult = await runCode({
  language: 'javascript',
  code: `
    const numbers = [1, 2, 3, 4, 5];
    const sum = numbers.reduce((a, b) => a + b, 0);
    console.log('Sum:', sum);
  `
});

console.log(jsResult.stdout); // "Sum: 15\n"
```

### Python Execution

```typescript
import { runCode } from 'browser-code-runner';

// Python with libraries
const pythonResult = await runCode({
  language: 'python',
  code: `
    import math
    import random
    
    numbers = [random.randint(1, 100) for _ in range(5)]
    print(f"Numbers: {numbers}")
    print(f"Average: {sum(numbers) / len(numbers):.2f}")
    print(f"Square root of 16: {math.sqrt(16)}")
  `,
  timeout: 3000
});

console.log(pythonResult.stdout);
```

### Lua Execution

```typescript
import { runCode } from 'browser-code-runner';

// Lua programming
const luaResult = await runCode({
  language: 'lua',
  code: `
    function fibonacci(n)
      if n <= 1 then
        return n
      end
      return fibonacci(n-1) + fibonacci(n-2)
    end
    
    for i = 0, 10 do
      print("fib(" .. i .. ") = " .. fibonacci(i))
    end
  `,
  timeout: 2000
});

console.log(luaResult.stdout);
```

### Error Handling

```typescript
import { runCode } from 'browser-code-runner';

try {
  const result = await runCode({
    language: 'javascript',
    code: 'undefined.method();', // This will cause an error
    timeout: 1000
  });
} catch (error) {
  console.error('Execution failed:', error.message);
}
```

### Advanced Usage with Custom Worker

```typescript
import { createCodeRunner } from 'browser-code-runner';

// Create a custom runner with specific worker URL
const runner = createCodeRunner('/path/to/custom-worker.js');

try {
  const result = await runner.runCode({
    language: 'python',
    code: 'print("Custom worker execution")'
  });
  
  console.log(result);
} finally {
  // Always clean up resources
  runner.terminate();
}
```

## Performance Considerations

### Web Workers
- All code execution runs in separate threads
- Main thread remains responsive during execution
- Automatic cleanup of worker resources

### Caching
- **Python (Pyodide)**: ~7-10 MB initial download, cached after first use
- **Lua (Fengari)**: ~1 MB, very lightweight
- **JavaScript**: No additional downloads required

### Timeouts
- Default timeout: 5000ms (5 seconds)
- Configurable per execution
- Automatic cleanup on timeout

## Browser Compatibility

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Web Worker Support**: Required
- **ES2020 Features**: Required
- **WebAssembly**: Required for Python support

## Development

### Setup

```bash
git clone <repository-url>
cd browser-code-runner
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
npm run test:watch
```

### Lint

```bash
npm run lint
npm run lint:fix
```

### Format

```bash
npm run format
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

### Phase 2 (Future)
- C/C++ support via Emscripten
- Ruby support via Opal or WASM MRI builds
- Go support via WebAssembly
- Rust support via WebAssembly

### Phase 3 (Future)
- Real-time collaboration features
- Code sharing and execution
- Advanced debugging capabilities
- Performance profiling

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/browser-code-runner/issues)
- **Documentation**: [GitHub Wiki](https://github.com/yourusername/browser-code-runner/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/browser-code-runner/discussions)

## Acknowledgments

- [Pyodide](https://pyodide.org/) - Python in the browser
- [Fengari](https://fengari.io/) - Lua VM in JavaScript
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) - Browser threading 