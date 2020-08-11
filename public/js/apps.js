const socket = io.connect("http://localhost:3000")

const div = document.getElementById("lists");
const lis = document.getElementById('list')
const nam = document.getElementById('name')
const nams = document.getElementById('names')
const btn = document.getElementById('btn')
const demo = document.getElementById('demo')

function list() {
  $('.list, .back').fadeIn()
  nam.disabled = true
}

function create() {
  $('.name, .back').fadeIn()
  lis.disabled = true
}

function backme() {
  $('.list, .name, .back').css("display", "none")
  lis.disabled = false
  nam.disabled = false
}

socket.on("new-room", room => {
  const roomElement = document.createElement('h3')
  roomElement.innerText = ""
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = room
  div.append(roomElement)
  div.append(roomLink)
})




socket.on("count", count => {
  demo.innerHTML = count
})