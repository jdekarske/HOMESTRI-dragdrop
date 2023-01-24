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
  function submitResultData(resultData: object, onSuccess?: () => void, onError?: () => void): void;

  function startNextComponent(resultData?: object, onError?: () => void): void;
  function startNextComponent(
    resultData?: object | string,
    message?: string,
    onError?: () => void): void;

  function onLoad(func: () => void): void;

  function abortStudy(str?: string): void;

  function addJatosIds(resultData?: object): void;

  const componentJsonInput: object;

  const studySessionData: object;

  const workerId: number;
}
