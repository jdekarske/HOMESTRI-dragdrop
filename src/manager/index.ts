/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import '../static/style.css';

// from webpack define plugin
const host = `https://${process.env.simulator_host}/manager/`;
// const authKey = process.env.manager_key;

type Token = string;

// TODO check if other user is in the way
// TODO CORS
async function register(workerID: number): Promise<Token | void> {
  const workerToken = await fetch(`${host}register`, {
    method: 'POST',
    body: JSON.stringify({
      workerID,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
  // eslint-disable-next-line no-console
    .catch((err) => console.log(err)) // TODO handle this
    .then((response) => {
      if (response) {
        return response.json().then((data) => (data as { token: Token }).token);
      }
      return 'no token';
    });

  return workerToken;
}

async function start(token: Token) {
  await fetch(`${host}start`, {
    method: 'POST',
    headers: { 'x-access-token': token },
  })
  // eslint-disable-next-line no-console
    .catch((err) => console.log(err)) // TODO handle this
    .then((response) => {
      if (response) {
        response.json().then((data) => console.log(data));
      }
    });
}

async function kill(token: Token) {
  await fetch(`${host}kill`, {
    method: 'POST',
    headers: { 'x-access-token': token },
  })
  // eslint-disable-next-line no-console
    .catch((err) => console.log(err)) // TODO handle this
    .then((response) => {
      if (response) {
        response.json().then((data) => console.log(data));
      }
    });
}

jatos.onLoad(async () => {
  if ('manager' in jatos.componentJsonInput) {
    const endpoint = jatos.componentJsonInput.manager as string;
    const workerID = jatos.workerId;
    if (endpoint === 'register') {
      jatos.studySessionData.token = await register(workerID);
    } else if ('token' in jatos.studySessionData) {
      if (endpoint === 'start') {
        start(jatos.studySessionData.token as Token);
      } else if (endpoint === 'kill') {
        kill(jatos.studySessionData.token as Token);
      }
    } else {
      console.log('something went wrong starting the simulation');
      return;
    }
    jatos.startNextComponent();
  }
});
