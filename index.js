const body = document.querySelector("body"),
  img_num = 3, whereClock = document.querySelector(".js-clock"),
  clock_ = whereClock.querySelector("h1"), form = document.querySelector(".js-nameform"),
  input = form.querySelector("input"), welcome = document.querySelector(".js-name"),
  currentUser = "curretUser", show = "showing", todoF = document.querySelector(".js-todo"),
  todoI = todoF.querySelector("input"), todoL = document.querySelector(".js-toDo_list"),
  todos = "toDos", weather = document.querySelector(".js-weather"), coords = "coords", API_KEY = "ab5d30aa3360efc6030293699f417dac";

let toDos = [];

function bgImage(imageNumber) {
  const image = new Image();
  image.src = `images/${imageNumber + 1}.jpg`;
  image.classList.add("bgImages");
  body.prepend(image);
}

function randomImage() {
  const number = Math.floor(Math.random() * img_num);
  return number;
}

function whatTime() {
  const date = new Date(),
    minutes = date.getMinutes(),
    hours = date.getHours(),
    seconds = date.getSeconds();
  clock_.innerText = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function saveName(text) {
    localStorage.setItem(currentUser, text);
}

function nameHandleSubmit(event) {
    event.preventDefault();
    const userValue = input.value;
    saveName(userValue);
    welcoming(userValue);
}

function welcoming(text) {
    form.classList.remove(show);
    welcome.classList.add(show);
    welcome.innerText = `Hello ${text}`;
}

function whatName() {
    form.classList.add(show);
    form.addEventListener("submit", nameHandleSubmit);
}

function loadName() {
    const userValue = localStorage.getItem(currentUser);
    if (userValue === null) {
        whatName();
    } else {
        welcoming(userValue);
    }
}

function insertTodo(text) {
    const li = document.createElement("li"), span = document.createElement("span"),
        delBtn = document.createElement("button"), newId = toDos.length + 1,
        todoObj = {
            text: text,
            id: newId
        };
    delBtn.innerText = "❌";
    delBtn.addEventListener("click", deleteTodo);
    span.innerText = text;
    li.appendChild(delBtn);
    li.appendChild(span);
    li.id = newId;
    todoL.appendChild(li);
    toDos.push(todoObj);
    saveTodos();
}

function todoHandleSubmit(event) {
    event.preventDefault();
    const userValue = todoI.value;
    insertTodo(userValue);
    todoI.value = "";
}

function deleteTodo(event) {
    const btn = event.target, li = btn.parentNode,
        clean = toDos.filter(function(toDo) {
            return toDo.id !== parseInt(li.id);
        });
    todoL.removeChild(li);
    toDos = clean;
    saveTodos();
}

function saveTodos() {
    localStorage.setItem(todos, JSON.stringify(toDos));
}

function loadTodos() {
    const load = localStorage.getItem(todos);
    if (load !== null) {
        const parse = JSON.parse(load);
        parse.forEach(function(todo) {
            insertTodo(toDo.text);
        });
    }
}

function getWeather(lat, lon) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    ).then(function(response) {
        return response.json()
    }).then(function(json) {
        const temp = json.main.temp;
        const place = json.name;
        weather.innerText = `${temp} @ ${place}`
    })
}

function loadCoords() {
    const load = localStorage.getItem(coords);
    if (load === null) {
        whatCoords();
    } else {
        const parse = JSON.parse(load);
        getWeather(parse.latitude, parse.longitude);
    }
}

function saveCoords(coordsObj) {
    localStorage.setItem(coords, JSON.stringify(coordsObj));
}

function whatCoords() {
    navigator.geolocation.getCurrentPosition(handleGeo, handleerr)
}

function handleGeo(position) {
    const lat = position.coords.latitude, lon = position.coords.longitude,
        coordsObj = {
            latitude: lat,
            longitude: lon
        };
    saveCoords(coordsObj);
    getWeather(lat, lon);
}

function handleerr() {
    console.log("Can't find geo location");
}

function init() {
  const randomNum = randomImage();
  bgImage(randomNum);
  whatTime();
  setInterval(whatTime, 1000);
  loadName();
  loadTodos();
  todoF.addEventListener("submit", todoHandleSubmit);
  loadCoords();
}

init();