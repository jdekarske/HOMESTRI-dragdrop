import '../static/style.css';

const endpoint = 'https://coe-mae-lella.ou.ad3.ucdavis.edu/manager/';

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
