import '../static/style.css';

jatos.onLoad(() => {
  function httpGetAsync(theUrl: string, callback?: (response: string) => void) {
    const xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.onreadystatechange = () => {
      if (xmlHttpReq.readyState === 4 && xmlHttpReq.status === 200) {
        callback(xmlHttpReq.responseText);
      }
      xmlHttpReq.open('GET', theUrl, true); // true for asynchronous
      xmlHttpReq.send(null);
    };
  }

  if ('simulation' in jatos.componentJsonInput) {
    httpGetAsync(`https://***REMOVED***/manager/${jatos.componentJsonInput.simulation}/1`, (result) => {
            alert(result);
    });
  }

  jatos.startNextComponent();
});
