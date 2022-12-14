import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/style.css';

// a generalized script to handle most forms
// There can only be one form element per page. All required inputs must have an "required"
// attribute as in: <input required type="radio" name="something" value="i" />
// input has name
// div has id

function intersects(a: any[], b: any[]): boolean {
// check if elements exist in both a and b
// its okay if b has more elements, as long as a intersects b
// a would be the array with required keys
  return a.length === a.filter((item) => b.indexOf(item) >= 0).length;
}

// check if required fields are set
document.getElementById('checkInfo')?.addEventListener('click', () => {
  const form = document.getElementsByTagName('form')[0];
  const requiredKeys = Array.from(form.querySelectorAll('[required]'))
    .map((x) => x.getAttribute('name'))
    .filter((value, index, self) => self.indexOf(value) === index); // unique values

  let data: Object[] = [];
  const values = new FormData(form);
  values.forEach((key, value) => {
    if (key && typeof key === 'string') {
      const newField: Object = {};
      newField[value] = key; // warning, this is counterintuitive
      data.push(newField);
    }
  });
  data.push({ surveyTime: Date.now() });
  data = Object.assign({}, ...data);

  console.log(requiredKeys);
  console.log(data);

  // don't accept if they don't fill out survey
  if (!intersects(requiredKeys, Object.keys(data))) {
    alert('Please complete all necessary fields');
  } else {
    jatos.onLoad(() => {
      jatos.addJatosIds(data);
      jatos.startNextComponent(data);
    });
  }
});

document.getElementById('advance')?.addEventListener('click', () => {
  jatos.onLoad(() => {
    jatos.startNextComponent();
  });
});

document.getElementById('abort')?.addEventListener('click', () => {
  jatos.onLoad(() => {
    jatos.abortStudy('Subject elected to not continue.');
  });
});
