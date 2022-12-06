import '../static/style.css';

const endpoint = 'https://***REMOVED***/manager/';

jatos.onLoad(() => {
  if ('simulation' in jatos.componentJsonInput) {
    const path = `${jatos.componentJsonInput.simulation}/1`;
    fetch(endpoint + path)
      .then(
        (response) => {
          console.log(response);
          jatos.startNextComponent();
        },
      );
  }
});
