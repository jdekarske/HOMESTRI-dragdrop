import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/style.css';
import $ from 'jquery';

const subject = {
  age: null,
  genderIdentity: null,
  addGender: null,
  sex: null,
  ethnicity: null,
  aian: 'false',
  asian: 'false',
  baa: 'false',
  nhopi: 'false',
  white: 'false',
  colorblind: null,
  make: null,
  videoGames: null,
  yesGames: null,
  email: null,
  surveytime: null,
};

interface FormObject {
  name: string,
  value: string,
}

// Function used to check if all questions were filled in info form, if so, starts the experiment
document.getElementById('checkInfo').addEventListener('click', () => {
  const values: FormObject[] = $('#infoform').serializeArray();
  console.log(values);
  values.forEach((obj) => {
    subject[obj.name] = obj.value;
  });

  subject.surveytime = Date.now();

  // don't accept if they don't fill out survey
  if (
    ![
      subject.age,
      subject.ethnicity,
      subject.genderIdentity,
      subject.sex,
      subject.colorblind,
      subject.make,
      subject.videoGames,
      subject.yesGames,
    ].every((e) => e)
  ) {
    alert('incomplete');
    return false;
  }

  jatos.addJatosIds(subject);
  jatos.startNextComponent(subject);
});

const advancebtn = document.getElementById('advance');
advancebtn?.addEventListener('click', () => {
  jatos.onLoad(() => {
    jatos.startNextComponent();
  });
});

const abortbtn = document.getElementById('abort');
abortbtn?.addEventListener('click', () => {
  jatos.onLoad(() => {
    jatos.abortStudy('Subject elected to not continue.');
  });
});
