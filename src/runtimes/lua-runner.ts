import { RunCodeResult } from '../types';

/**
 * Executes Lua code using Fengari
 * @param code - The Lua code to execute
 * @param stdin - Standard input (not currently supported in this implementation)
 * @returns Promise<RunCodeResult> - The execution result
 */
export async function runLua(
  code: string,
  stdin: string = ''
): Promise<RunCodeResult> {
  const startTime = performance.now();
  
  try {
    // Dynamic import to avoid bundling issues
    const { lua, lauxlib, lualib, to_jsstring } = await import('fengari');
    
    // Create a new Lua state
    const L = lauxlib.luaL_newstate();
    
    // Open standard libraries
    lualib.luaL_openlibs(L);
    
    // Capture print output by overriding print function
    let stdout = '';
    let stderr = '';
    
    // Create a custom print function that captures output
    const customPrint = (L: any) => {
      const n = lua.lua_gettop(L);
      let output = '';
      
      for (let i = 1; i <= n; i++) {
        if (i > 1) output += '\t';
        output += to_jsstring(lua.lua_tostring(L, i));
      }
      output += '\n';
      stdout += output;
      
      return 0;
    };
    
    // Register the custom print function
    lua.lua_pushcfunction(L, customPrint);
    lua.lua_setglobal(L, 'print');
    
    // Execute the Lua code
    const result = lauxlib.luaL_dostring(L, code);
    
    if (result !== lua.LUA_OK) {
      // Get error message from Lua stack
      const errorMsg = to_jsstring(lua.lua_tostring(L, -1));
      stderr = errorMsg;
      
      // Close the Lua state
      lua.lua_close(L);
      
      const timeMs = performance.now() - startTime;
      
      return {
        stdout,
        stderr,
        exitCode: 1,
        timeMs
      };
    }
    
    // Close the Lua state
    lua.lua_close(L);
    
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