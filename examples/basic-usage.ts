import { runCode, createCodeRunner } from 'browser-code-runner';

// Example 1: Simple JavaScript execution
async function runJavaScriptExample() {
  try {
    const result = await runCode({
      language: 'javascript',
      code: `
        const numbers = [1, 2, 3, 4, 5];
        const sum = numbers.reduce((a, b) => a + b, 0);
        console.log('Sum of numbers:', sum);
        
        // Demonstrate async operations
        const promise = Promise.resolve('Async result');
        promise.then(value => console.log('Promise resolved:', value));
      `,
      timeout: 3000
    });
    
    console.log('JavaScript Result:', result);
    console.log('Output:', result.stdout);
    console.log('Execution time:', result.timeMs, 'ms');
  } catch (error) {
    console.error('JavaScript execution failed:', error.message);
  }
}

// Example 2: Python execution with libraries
async function runPythonExample() {
  try {
    const result = await runCode({
      language: 'python',
      code: `
        import math
        import random
        
        # Generate random numbers
        numbers = [random.randint(1, 100) for _ in range(5)]
        print(f"Random numbers: {numbers}")
        
        # Calculate statistics
        mean = sum(numbers) / len(numbers)
        print(f"Mean: {mean:.2f}")
        
        # Use math functions
        print(f"Square root of 16: {math.sqrt(16)}")
        print(f"Pi: {math.pi}")
        
        # List comprehension
        even_numbers = [x for x in numbers if x % 2 == 0]
        print(f"Even numbers: {even_numbers}")
      `,
      timeout: 5000
    });
    
    console.log('Python Result:', result);
    console.log('Output:', result.stdout);
  } catch (error) {
    console.error('Python execution failed:', error.message);
  }
}

// Example 3: Lua execution
async function runLuaExample() {
  try {
    const result = await runCode({
      language: 'lua',
      code: `
        -- Generate random numbers
        local numbers = {}
        for i = 1, 10 do
          numbers[i] = math.random(1, 100)
        end
        
        print("Random numbers:")
        for i, num in ipairs(numbers) do
          print(num)
        end
        
        -- Calculate sum and average
        local sum = 0
        for _, num in ipairs(numbers) do
          sum = sum + num
        end
        local average = sum / #numbers
        
        print("Sum:", sum)
        print("Average:", average)
        
        -- Fibonacci function
        function fibonacci(n)
          if n <= 1 then
            return n
          end
          return fibonacci(n-1) + fibonacci(n-2)
        end
        
        print("Fibonacci sequence (first 10):")
        for i = 0, 9 do
          print("fib(" .. i .. ") = " .. fibonacci(i))
        end
      `,
      timeout: 4000
    });
    
    console.log('Lua Result:', result);
    console.log('Output:', result.stdout);
  } catch (error) {
    console.error('Lua execution failed:', error.message);
  }
}

// Example 4: Advanced usage with custom CodeRunner instance
async function runAdvancedExample() {
  const runner = createCodeRunner();
  
  try {
    // Run multiple languages in sequence
    const results = await Promise.all([
      runner.runCode({
        language: 'javascript',
        code: 'console.log("JS: Hello from JavaScript!");',
        timeout: 2000
      }),
      runner.runCode({
        language: 'python',
        code: 'print("Python: Hello from Python!")',
        timeout: 2000
      }),
      runner.runCode({
        language: 'lua',
        code: 'print("Lua: Hello from Lua!")',
        timeout: 2000
      })
    ]);
    
    console.log('All languages executed successfully:');
    results.forEach((result, index) => {
      const languages = ['JavaScript', 'Python', 'Lua'];
      console.log(`${languages[index]}: ${result.stdout.trim()}`);
    });
    
  } catch (error) {
    console.error('Advanced execution failed:', error.message);
  } finally {
    // Always clean up resources
    runner.terminate();
  }
}

// Example 5: Error handling and timeout
async function runErrorHandlingExample() {
  try {
    // This will cause a syntax error
    const result = await runCode({
      language: 'javascript',
      code: 'const x = {;', // Invalid syntax
      timeout: 2000
    });
    
    console.log('Unexpected success:', result);
  } catch (error) {
    console.log('Expected error caught:', error.message);
  }
  
  try {
    // This will timeout
    const result = await runCode({
      language: 'javascript',
      code: 'while(true) {}', // Infinite loop
      timeout: 100 // Very short timeout
    });
    
    console.log('Unexpected success:', result);
  } catch (error) {
    console.log('Expected timeout:', error.message);
  }
}

// Example 6: Performance comparison
async function runPerformanceComparison() {
  const testCode = `
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n-1) + fibonacci(n-2);
    }
    
    const start = performance.now();
    const result = fibonacci(30);
    const end = performance.now();
    
    console.log('Fibonacci(30):', result);
    console.log('Time taken:', (end - start).toFixed(2), 'ms');
  `;
  
  try {
    const result = await runCode({
      language: 'javascript',
      code: testCode,
      timeout: 10000
    });
    
    console.log('Performance test result:', result);
    console.log('Total execution time:', result.timeMs, 'ms');
  } catch (error) {
    console.error('Performance test failed:', error.message);
  }
}

// Main function to run all examples
async function runAllExamples() {
  console.log('🚀 Starting Browser Code Runner Examples\n');
  
  console.log('=== JavaScript Example ===');
  await runJavaScriptExample();
  
  console.log('\n=== Python Example ===');
  await runPythonExample();
  
  console.log('\n=== Lua Example ===');
  await runLuaExample();
  
  console.log('\n=== Advanced Example ===');
  await runAdvancedExample();
  
  console.log('\n=== Error Handling Example ===');
  await runErrorHandlingExample();
  
  console.log('\n=== Performance Comparison ===');
  await runPerformanceComparison();
  
  console.log('\n✅ All examples completed!');
}

// Export for use in other modules
export {
  runJavaScriptExample,
  runPythonExample,
  runLuaExample,
  runAdvancedExample,
  runErrorHandlingExample,
  runPerformanceComparison,
  runAllExamples
};

// Run examples if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).runAllExamples = runAllExamples;
} else {
  // Node.js environment
  runAllExamples().catch(console.error);
} 