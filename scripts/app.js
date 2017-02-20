// Initialize Firebase
const config = {
  apiKey: 'AIzaSyACfmkuXODDLwrZpGaSL6AZtFKGnPWj3Hc',
  authDomain: 'duncan-test0.firebaseapp.com',
  databaseURL: 'https://duncan-test0.firebaseio.com',
  storageBucket: 'duncan-test0.appspot.com',
  messagingSenderId: '243968147627',
};

const app = firebase.initializeApp(config);

const $app = document.getElementById('app');
const $wrapper = document.getElementById('wrapper');

const $logIn = document.getElementById('logIn');
const $logOut = document.getElementById('logOut');
const $theme = document.getElementById('theme');

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');

let user;

// Theme and Indexed DB Stuff
// Theme is true if light, false if dark

// Primary, background, accent, secondary, text
const darkTheme = ['#03A9F4', '#212121', '#5C6BC0', '#4CAF50', '#FFF'];

const lightTheme = ['#2196F3', '#FFF', '#009688', '#673AB7', '#000'];

const colorNames = ['--app-primary-color', '--app-background-color', '--app-accent-color',
                    '--app-secondary-color', '--app-text-color'];

// Takes boolean, changes theme to that (light = true, dark = false)
function updateTheme(thm) {
  if (thm === 'dark')
    for (let i = 0; i < darkTheme.length; i++)
      document.documentElement.style.setProperty(colorNames[i], darkTheme[i]);
  else
    for (let i = 0; i < darkTheme.length; i++)
      document.documentElement.style.setProperty(colorNames[i], lightTheme[i]);
}

if (!window.indexedDB) {
  console.warn('Your browser does not support IndexedDB');
} else {
  // Check if there is already a preferred theme
  if (!localStorage.getItem('theme')) {
    // Otherwise set the theme to light (default)
    localStorage.setItem('theme', 'light');
    // Make sure theme displaying is preferred in the beginning
    updateTheme(localStorage.getItem('theme'));
  } else {
    updateTheme(localStorage.getItem('theme'));
  }
}

// Anytime update theme is clicked, switch the theme
$theme.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme');
  let newTheme;
  if (currentTheme === 'light') {
    newTheme = 'dark';
  } else {
    newTheme = 'light';
  }
  localStorage.setItem('theme', newTheme);
  updateTheme(newTheme);
});

// BEGIN COMMENTED OUT STUFF

$logIn.addEventListener('click', () => {
  firebase.auth().signInWithPopup(provider).then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const token = result.credential.accessToken;
    // The signed-in user info.
    user = result.user;

    $wrapper.style.display = 'none';
    $app.style.display = 'block';
  }).catch(error => {
    console.log(error);
  });
});

$logOut.addEventListener('click', () => {
  firebase.auth().signOut();
  $wrapper.style.display = 'flex';
  $app.style.display = 'none';
});

firebase.auth().onAuthStateChanged(fireBaseUser => {
  if (fireBaseUser) {
    user = fireBaseUser.email;
    $wrapper.style.display = 'none';
    $app.style.display = 'flex';
  } else {
    console.info('Not Logged In');
  }
});

// END COMMENTED OUT SECTION

const $send = document.getElementById('send');
const $message = document.getElementById('message');
const $messages = document.getElementById('messages');

function addMessage(chat) {
  const div = document.createElement('div');
  div.innerHTML = `<div class="name">${chat.name}</div><div class="lower">
                    <div class="text">${chat.message}</div></div>`;

  div.setAttribute('class', 'textMessage');
  $messages.appendChild(div);
  $message.value = '';
  $messages.scrollTop = $messages.scrollHeight;
}

const database = app.database();

const databaseRef = database.ref().child('chat');

$send.addEventListener('click', () => {
  const chat = { name: user, message: $message.value };

  databaseRef.push().set(chat);
});

databaseRef.on('child_added', snapshot => {
  const chat = snapshot.val();
  addMessage(chat);
});

$message.addEventListener('keyup', evt => {
  if (evt.keyCode === 13)
    $send.click();
});
