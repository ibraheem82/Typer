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
      element.innerHTML += text.charAt(index)
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  // will get 16 characters
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId){
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
    <div class="chat">
       <div class="profile">
       <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}">
       </div>

       <div class="message" id=${uniqueId}>
       ${value}
       </div>
    </div>
    </div>
    `
  )
}


const handleSubmit = async (e) => {
  e.preventDefault();

  // Get the datas that was typed into the form.
  const data = new FormData(form)

  // Generate the User's chatstripe  i.e where the user messages will be displayed
  // const value = input.value;
    // [false] -> not the Ai, [value] -> 
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  
  const uniqueId = generateUniqueId();
  // will be filled with the '...' loadInterval
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  
  // keep scrolling as the user types.
  // will put the new message in view.
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);


  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // * is the datas that is coming from out textarea, we are using the post request ethod
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong ❌❌❌";

    // alert(err);

    console.log(err);

  }

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})