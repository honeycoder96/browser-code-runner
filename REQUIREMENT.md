Create a npm package which provides a unified API(function) to execute different programming language code in users browser

We need to utilize web workers to not block the main thread and keep performance in mind in every step. Our final result would be to publish the package to npm hence create documentation/readme considreing that.

We only need to focus on Phase 1 for now.

Phase 1 — Easiest (Runs natively or stable WASM builds exist)

    1. JavaScript / TypeScript
        - Already runs in the browser (no extra runtime).
        - Can use eval() or better: Web Workers for isolation.
        - For Node.js-like environment → WebContainers(by StackBlitz).

    2. Python (via Pyodide / PyScript)
        - Pyodide (official CPython → WebAssembly) is production ready.
        - ~7–10 MB load, but works well once cached.

    3. Lua (via Fengari)
        - Tiny interpreter (~1 MB) compiled to JS.
        - Super lightweight, very easy to embed.

Phase 2 — Medium Complexity (but still feasible)

    1. C / C++ (via Emscripten)
        - You can pre-compile code snippets to WASM.
        - Tricky for "compile on the fly", but doable with client-side Clang+LLVM WASM (heavy).
        - Better to restrict to pre-built C runtimes for exercises.
    
    2. Ruby (via Opal or WASM MRI builds)
        - Opal compiles Ruby → JS.
        - Lightweight, but limited (not full Ruby stdlib).
        - WASM MRI ports exist, but heavy.

Unified API example : 

import { runCode } from "my-unified-runner";

const result = await runCode({
  language: "python",   // "javascript" | "python" | "lua"
  code: "print(1+2)",
  stdin: "",
  timeout: 2000
});

console.log(result);
/*
{
  stdout: "3\n",
  stderr: "",
  exitCode: 0,
  timeMs: 15
}
*/

// JS Runner
export async function runJavaScript(code: string, stdin: string) {
  try {
    let stdout = "";
    const log = console.log;
    console.log = (...args) => { stdout += args.join(" ") + "\n"; };
    eval(code);
    console.log = log;
    return { stdout, stderr: "", exitCode: 0 };
  } catch (err) {
    return { stdout: "", stderr: String(err), exitCode: 1 };
  }
}

// Python Runner
import { loadPyodide } from "pyodide";

let pyodide: any;

export async function runPython(code: string) {
  if (!pyodide) {
    pyodide = await loadPyodide(); // one-time load
  }
  try {
    const result = await pyodide.runPythonAsync(code);
    return { stdout: String(result), stderr: "", exitCode: 0 };
  } catch (err) {
    return { stdout: "", stderr: String(err), exitCode: 1 };
  }
}

//  Lua

import { lua, lauxlib, lualib, to_jsstring } from "fengari";

export async function runLua(code: string) {
  try {
    const L = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);
    if (lauxlib.luaL_dostring(L, code) !== lua.LUA_OK) {
      throw new Error(to_jsstring(lua.lua_tostring(L, -1)));
    }
    return { stdout: "", stderr: "", exitCode: 0 };
  } catch (err) {
    return { stdout: "", stderr: String(err), exitCode: 1 };
  }
}

// Manager

import { runJavaScript } from "./runtimes/jsRunner";
import { runPython } from "./runtimes/pyRunner";
import { runLua } from "./runtimes/luaRunner";

export async function runCode({ language, code, stdin, timeout }) {
  const start = performance.now();
  let result;
  switch (language) {
    case "javascript":
      result = await runJavaScript(code, stdin);
      break;
    case "python":
      result = await runPython(code);
      break;
    case "lua":
      result = await runLua(code);
      break;
    default:
      throw new Error("Unsupported language: " + language);
  }
  result.timeMs = performance.now() - start;
  return result;
}


