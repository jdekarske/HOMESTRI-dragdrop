/* eslint-disable @typescript-eslint/no-floating-promises */
import '../static/style.css';

const endpoint = 'https://***REMOVED***/manager/';

jatos.onLoad(() => {
  if ('simulation' in jatos.componentJsonInput) {
    const path = `${jatos.componentJsonInput.simulation as string}/1`;
    (async () => {
      await fetch(endpoint + path)
      // eslint-disable-next-line no-console
        .catch((err) => console.log(err)) // TODO handle this
        .then(() => jatos.startNextComponent());
    })();
  }
});
