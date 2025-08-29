declare module 'fengari' {
  // Lua state constants
  export const lua: {
    LUA_OK: number;
    LUA_ERRRUN: number;
    LUA_ERRSYNTAX: number;
    LUA_ERRMEM: number;
    LUA_ERRGCMM: number;
    LUA_ERRERR: number;
    LUA_TNONE: number;
    LUA_TNIL: number;
    LUA_TBOOLEAN: number;
    LUA_TLIGHTUSERDATA: number;
    LUA_TNUMBER: number;
    LUA_TSTRING: number;
    LUA_TTABLE: number;
    LUA_TFUNCTION: number;
    LUA_TUSERDATA: number;
    LUA_TTHREAD: number;
    
    // Lua state functions
    lua_tostring: (L: any, index: number) => string | null;
    lua_pushcfunction: (L: any, fn: Function) => void;
    lua_setglobal: (L: any, name: string) => void;
    lua_gettop: (L: any) => number;
    lua_close: (L: any) => void;
    lua_pushstring: (L: any, str: string) => void;
    lua_pcall: (L: any, nargs: number, nresults: number, msgh: number) => number;
  };

  // Lua auxiliary library
  export const lauxlib: {
    luaL_newstate: () => any;
    luaL_dostring: (L: any, code: string) => number;
    luaL_loadstring: (L: any, code: string) => number;
    luaL_error: (L: any, fmt: string, ...args: any[]) => number;
  };

  // Lua standard library
  export const lualib: {
    luaL_openlibs: (L: any) => void;
    luaopen_base: (L: any) => number;
    luaopen_table: (L: any) => number;
    luaopen_io: (L: any) => number;
    luaopen_os: (L: any) => number;
    luaopen_string: (L: any) => number;
    luaopen_math: (L: any) => number;
    luaopen_debug: (L: any) => number;
    luaopen_package: (L: any) => number;
  };

  // Utility functions
  export function to_jsstring(str: string | null): string;
  export function to_luastring(str: string): any;
} 