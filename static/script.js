/* For index.html */

// TODO: If a user clicks to create a chat, create an auth key for them
// and save it. Redirect the user to /chat/<chat_id>
function createChat() {}

/* For chat.html */

// TODO: Fetch the list of existing chat messages.
// POST to the API when the user posts a new message.
// Automatically poll for new messages on a regular interval.
function postMessage(event) {
  event.preventDefault();
  let postContent = document.querySelector("textarea").value;
  let room_id = document.URL.split("/").pop().slice(0, 1);
  let url = "/api/post_messages";
  let data = {
    roomid: room_id,
    postbody: postContent,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": WATCH_PARTY_API_KEY,
    },
    body: JSON.stringify(data),
  }).then((response) => console.log(response.status));
}

function insertMessages(messages) {
  let messages_div = document.body.querySelector(".messages");
  // Clear the old messages!!
  // NOTE: Is there a better way to only grab new messages?
  messages_div.replaceChildren();
  if (Object.keys(messages).length == 0) {
    return;
  }
  messages.map((message) => {
    let msg = document.createElement("message");
    let author = document.createElement("author");
    author.textContent = message["user_id"];
    let content = document.createElement("content");
    content.textContent = message["body"];
    msg.appendChild(author);
    msg.appendChild(content);
    // Append to the messages class
    messages_div.appendChild(msg);
  });
}

function getMessages() {
  let room_id = document.URL.split("/").pop().slice(0, 1);
  console.log(room_id);
  console.log("getting Mesages");
  const url = `/api/retrieve_messages/${room_id}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "API-Key": WATCH_PARTY_API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => insertMessages(data));
}

function startMessagePolling() {
  /* Clear the sample method upon loading the page */
  console.log("startMessagePolling");
  let messages_div = document.body.querySelector(".messages");
  messages_div.replaceChildren();

  /* Get the messages every 100 ms and add
  any new messages to the chat history */
  setInterval(getMessages, 100);
  return;
}

/* Additional functions to update username */
function updateUsername() {
  let update_username = document.querySelector("input.username").value;
  let url = "/api/user/changename";
  let data = {
    username: update_username,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": WATCH_PARTY_API_KEY,
    },
    body: JSON.stringify(data),
  }).then((response) => console.log(response.status));
}

function updatePassword() {
  let update_password = document.querySelector("input.password").value;
  let url = "/api/user/changepassword";
  let data = {
    password: update_password,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": WATCH_PARTY_API_KEY,
    },
    body: JSON.stringify(data),
  }).then((response) => console.log(response.status));
}

function editRoomname() {
  let url = "/api/room/namechange";
  let room_id = document.URL.split("/").pop().slice(0, 1);
  let room_name = document.querySelector(".roomData input").value;
  let data = {
    room_id: room_id,
    room_name: room_name,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": WATCH_PARTY_API_KEY,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      let span = document.querySelector(".roomData h3.display span");
      span.textContent = data["room_name"];
    })
    .then(() => roomEditShow());
}

function roomEditShow() {
  let edit_panel = document.querySelector(".roomData h3.edit");
  edit_panel.className = "edit hide";

  let room_name = document.querySelector(".roomData h3.display");
  room_name.className = "display";
}

function roomEditHide() {
  let edit_panel = document.querySelector(".roomData h3.edit");
  edit_panel.className = "edit";

  let room_name = document.querySelector(".roomData h3.display");
  room_name.className = "display hide";
}

/* ALL EVENT LISTENERS HERE */
function roomEventListeners() {
  // NOTE: Clear any sample chats out of the messages
  let comment = document.querySelector(".comment_box form");
  comment.addEventListener("submit", postMessage);

  let room_name = document.querySelector(".roomData h3.display a");
  if (room_name != null) {
    room_name.addEventListener("click", roomEditHide);
  }

  let room_name_input = document.querySelector(".roomData h3.edit a span");
  if (room_name_input != null) {
    room_name_input.addEventListener("click", editRoomname);
  }
}

function pageLoadFunctionality() {
  if (document.URL.includes("http://localhost:5000/rooms/")) {
    roomEventListeners();
  } else if (document.URL.includes("http://localhost:5000/profile")) {
    let username = document.querySelector("button.username");
    username.addEventListener("click", updateUsername);

    let password = document.querySelector("button.password");
    password.addEventListener("click", updatePassword);
  }
}

document.addEventListener("DOMContentLoaded", pageLoadFunctionality);
