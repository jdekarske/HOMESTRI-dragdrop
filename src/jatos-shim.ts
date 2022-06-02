declare const jatos: any;
// don't do anything with jatos if we aren't on the server.
if (process.env.NODE_ENV !== 'production') {
  console.warn('Looks like we are in development mode!');
  jatos.startNextComponent = () => { };
  jatos.submitResultData = () => {};
  jatos.onLoad = (func: () => void) => { func(); };
}
export default jatos;
