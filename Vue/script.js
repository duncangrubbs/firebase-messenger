// Initialize Firebase
var config = {
  apiKey: "AIzaSyACfmkuXODDLwrZpGaSL6AZtFKGnPWj3Hc",
  authDomain: "duncan-test0.firebaseapp.com",
  databaseURL: "https://duncan-test0.firebaseio.com",
  storageBucket: "duncan-test0.appspot.com",
  messagingSenderId: "243968147627"
};
var app = firebase.initializeApp(config);

const $app = document.getElementById('app');
const $wrapper = document.getElementById('wrapper');

const $email = document.getElementById('email');
const $password = document.getElementById('password');
const $logIn = document.getElementById('logIn');
const $signUp = document.getElementById('signUp');
const $logOut = document.getElementById('logOut');

var user;

$logIn.addEventListener('click', e => {
    const email = $email.value;
    const password = $password.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email,
    password);
    promise.catch(e => console.warn(e.message));

    $wrapper.style.display = 'none';
    $app.style.display = 'block';
});

$signUp.addEventListener('click', e => {
    const email = $email.value;
    const password = $password.value;
    const auth = firebase.auth();
    //TODO check for real email
    const promise = auth.createUserWithEmailAndPassword(email,
    password);
    promise
        .catch(e => console.warn(e.message));

    $wrapper.style.display = 'none';
    $app.style.display = 'flex';
});

$logOut.addEventListener('click', e => {
    firebase.auth().signOut();
    $email.value = '';
    $password.value = '';
    $wrapper.style.display = 'block';
    $app.style.display = 'none';
});

firebase.auth().onAuthStateChanged(fireBaseUser => {
    if (fireBaseUser) {
        user = fireBaseUser.email;
        $wrapper.style.display = 'none';
        $app.style.display = 'flex';
    } else {
        console.log('Not Logged In');
    }
});

const $send = document.getElementById('send');
const $message = document.getElementById('message');
const $messages = document.getElementById('messages');

const database = app.database();
const storage = app.storage();

var databaseRef = database.ref().child('chat');

$send.addEventListener('click', event => {
  var chat = { name: user, message: $message.value};
  console.log('click');

  databaseRef.push().set(chat);
});

databaseRef.on('child_added', snapshot => {
  var chat = snapshot.val();
  addMessage(chat);
});

function addMessage(chat) {
  var div = document.createElement('div');
  div.innerHTML = "<div class='name'>" + chat.name + "</div><div class='lower'><div class='text'>" + chat.message + "</div></div>";

  div.setAttribute('class', 'textMessage');
  $messages.appendChild(div);
  $message.value = '';
  $messages.scrollTop = $messages.scrollHeight;
}