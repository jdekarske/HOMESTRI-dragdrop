// Type definitions for jatos.js 1.1.0
// Project: https://github.com/JATOS/JATOS
// Reference: https://www.jatos.org/jatos.js-Reference.html
// Definitions by: Jason Dekarske <https://github.com/jdekarske>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4.7

/* ----------------------------------
 This is absolutely not complete. Only makes the library somewhat usable
 ---------------------------------- */

declare namespace jatos {
  function submitResultData(resultData: object, onSuccess?: any, onError?: any): void;

  function startNextComponent(resultData?: object, param2?: any, param3?: any): void;

  function onLoad(func: () => void): void;
}

// don't do anything with jatos if we aren't on the server.
// if (process.env.NODE_ENV !== 'production') {
//   console.warn('Looks like we are in development mode!');
//   jatos.startNextComponent = () => {};
//   jatos.submitResultData = (arr: any[]) => arr;
//   jatos.onLoad = (func: () => void) => { func(); };
// }
