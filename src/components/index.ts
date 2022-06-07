import '../static/style.css';

console.log('this is for components');

// const subject = {
//   age: null,
//   genderIdentity: null,
//   addGender: null,
//   sex: null,
//   ethnicity: null,
//   aian: 'false',
//   asian: 'false',
//   baa: 'false',
//   nhopi: 'false',
//   white: 'false',
//   colorblind: null,
//   make: null,
//   videoGames: null,
//   yesGames: null,
//   email: null,
//   surveytime: null,
// };

// // Function used to check if all questions were filled in info form, if so, starts the experiment
// function checkInfo() {
//   const values = $('#infoform').serializeArray();
//   console.log(values);
//   $(values).each((index, obj) => {
//     subject[obj.name] = obj.value;
//   });

//   subject.surveytime = Date.now();

//   // don't accept if they don't fill out survey
//   if (![subject.age, subject.ethnicity, subject.genderIdentity, subject.sex, subject.colorblind, subject.make, subject.videoGames, subject.yesGames].every((e) => e)) {
//     alert('incomplete');
//     return false;
//   }

//   }
//     jatos.showBeforeUnloadWarning(true);

//     jatos.addJatosIds(subject); // adds the component information to the results
//     jatos.startNextComponent(subject); // submit data and move on to grid or ctt

//   return true;
