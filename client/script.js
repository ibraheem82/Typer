import bot from './assets/bot.svg';
import user from './assets/user.svg';


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');


let loadInterval;

// * Functions that will load the messages
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      // will get character under a specific index, in the text that the AI is going to return. 
      // element.innerHTML = element.innerHTML + text[index];
      element.innerHTML += text.chartAt(index)
      index++;
    } else {
      clearInterval(interval);
    }
  }, 2000)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  // will get 16 characters
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`;
}