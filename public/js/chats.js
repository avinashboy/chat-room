const socket = io.connect('http://localhost:3000');

//quaery
const insertHere = document.getElementById('insertHere');
const replyPreview = document.getElementById('replyPreview');
const replyCloseHide = document.getElementById('replyCloseHide');
const rigth = document.getElementById('right');
const closeHide = document.getElementById('closeHide');
const img = document.getElementById('img');
const title = document.getElementById('title');
const description = document.getElementById('description');
const site = document.getElementById('site');
const linkPreview = document.getElementById('link-preview');
const output = document.getElementById('output');
const message = document.getElementById('message');
const handle = document.getElementById('name');
const send = document.getElementById('send');
const left = document.getElementById('left');
const feedback = document.getElementById('feedback');
const copys = document.getElementById('copy');
const sub = document.getElementById('sub');
const deletes = document.getElementById('delete');
const room = document.getElementById('roomname');
const sticker = document.querySelectorAll('.sticker');
const set_password = document.getElementById('set_password');
const file_upload_here = document.getElementById('file_upload_here');
const show_user_list = document.getElementById('show_user_list');

let keys, hide, passsword;

let switchs = document.getElementById('switch');

let darkMode = localStorage.getItem('darkMode');
const dis = document.getElementById('dis');
const isdis = document.getElementById('isdis');

let j = 0,
  gettingIn = 0,
  xhr,
  gettingInn = 0,
  goDownToPage = 0;
let set_up = '',
  tempDataOne = null,
  tempDataTwo = null,
  tempId = null,
  linkUrl = '';
let status = false,
  reply_state = false;
req_state = false;

let emoji = [],
  delete_list = [];

// for dark
const change_mode = document.getElementById('change_mode');
var checkbox = document.querySelector('input[name=theme]');

sub.addEventListener('click', () => {
  if (handle.value.length == 0) {
    alert('Please enter the name...! ');
  } else {
    socket.emit('list', {
      room: roomName,
      handle: handle.value,
    });
    room.innerHTML = roomName;
    if (dis.style.display === 'none') {
      dis.style.display = 'block';
      isdis.style.display = 'none';
    } else {
      dis.style.display = 'none';
      isdis.style.display = 'block';
    }
  }
});

// check the data
// sub.addEventListener('keyup', function (event) {
//   if (event.keyCode === 13) {
//     if (handle.value.length == 0) {
//       alert('Please enter the name...! ');
//     } else {
//       socket.emit('list', {
//         room: roomName,
//         handle: handle.value,
//       });
//       room.innerHTML = roomName;
//       if (dis.style.display === 'none') {
//         dis.style.display = 'block';
//         isdis.style.display = 'none';
//       } else {
//         dis.style.display = 'none';
//         isdis.style.display = 'block';
//       }
//     }
//     sub.click();
//   }
// });

function truncate(str, no_words) {
  return str.split(' ').splice(0, no_words).join(' ');
}

message.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send.click();
    return;
  }
});

message.addEventListener(
  'keyup',
  () => {
    // babdoy
    const regexp = /^(?:(?:https?|ftp?|http):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(message.value)) {
      gettingIn++;
      if (gettingIn === 2) {
        gettingIn = 0;
        gettingInn = 2;
        const url = 'https://abt-link-preview.herokuapp.com';
        xhr = $.ajax({
          type: 'POST',
          url: `${url}/api`,
          data: {
            Url: message.value,
          },
          success: function (response) {
            req_state = true;
            linkPreview.style.display = 'block';
            linkUrl = response.result[0].url;
            img.src = response.result[0].image;
            title.innerText = truncate(response.result[0].title, 9);
            site.innerText = response.result[0].site;
            description.innerText = truncate(
              response.result[0].description,
              12
            );
          },
        });
      }
      return;
    }
  },
  false
);

closeHide.addEventListener('click', () => {
  linkPreview.style.display = 'none';
  req_state = false;
  return;
});

replyCloseHide.addEventListener('click', () => {
  replyPreview.style.display = 'none';
  insertHere.innerHTML = '';
  return;
});

function firstName(data) {
  let tempname = data === handle.value ? 'you' : data;
  return tempname.charAt(0).toUpperCase() + tempname.slice(1);
}

function replyComment(name, color, data1, data2, value) {
  tempDataOne = data1;
  tempDataTwo = data2;
  $(value).parent().parent().removeClass('add_bg');
  $('#keywords').fadeIn();
  $('#show_case').fadeOut();

  if (!data1) {
    return `<div class="replyHide" id="replyHide" style="border-left: 2px solid ${color};">
    <div class="replyName" id="replyName" style="color: ${color};" > ${firstName(
      name
    )} </div>
    <div class="replyContent" id="replyContent">
      <img src="${data2}" alt="" id="replyimg" class="replyImg" />
    </div>
  </div>`;
  }

  if (!data2) {
    return `<div class="replyHide" id="replyHide" style="border-left: 2px solid ${color};">
    <div class="replyName" id="replyName" style="color: ${color};" > ${firstName(
      name
    )} </div>
    <div class="replyContent" id="replyContent">
      <span id="reply" class="replyText">${data1}</span>
    </div>
  </div>`;
  } else {
    return `<div class="replyHide" id="replyHide" style="border-left: 2px solid ${color};">
  <div class="replyName" id="replyName" style="color:${color}" > ${firstName(
      name
    )} </div>
    <div class="replyContent replyflex" id="replyContent">
    <span id="reply" class="replyText">${data1}</span>
    <img src="${data2}" alt="" id="replyimg" class="replyImg" />
    </div>
  </div>`;
  }
}

// reply button
copys.addEventListener('click', () => {
  replyPreview.style.display = 'block';
  delete_list.map(delete_function);
  reply_state = true;

  function delete_function(value) {
    let tempColor = colors;
    let tempName = $(value).parent().children().children()[0].textContent;
    let findName = $(value).contents().contents().attr('id');
    tempId = value;
    if (findName === 'stickerUrl') {
      let tempStickerUrl = $(value).contents().contents()[0].src;
      insertHere.innerHTML += replyComment(
        tempName,
        tempColor,
        false,
        tempStickerUrl,
        tempId
      );
      return;
    }

    if (findName === 'httpsUrl') {
      let tempHttpsUrl = $(value).contents().contents().text();
      insertHere.innerHTML += replyComment(
        tempName,
        tempColor,
        tempHttpsUrl,
        false,
        tempId
      );
      return;
    }

    if (findName === 'user-link-preview') {
      let tempText = $(value).contents().contents()[0].lastElementChild
        .textContent;
      let tempImageUrl = $(value).contents().contents()[0].children[0]
        .children[0].src;
      insertHere.innerHTML += replyComment(
        tempName,
        tempColor,
        tempText,
        tempImageUrl,
        tempId
      );
      return;
    }
    if (findName === 'replyHidess') {
      let tempTextOrEmjoi = $(value).contents().contents()[2].textContent;
      if (tempTextOrEmjoi === '') {
        let tempSticker = $(value).contents().contents()[2].children[0].src;
        insertHere.innerHTML += replyComment(
          tempName,
          tempColor,
          false,
          tempSticker,
          tempId
        );
        return;
      }
      insertHere.innerHTML += replyComment(
        tempName,
        tempColor,
        tempTextOrEmjoi,
        false,
        tempId
      );
      return;
    }
    if (!findName) {
      let tempTextOrEmjoi = $(value).contents().contents().text();
      insertHere.innerHTML += replyComment(
        tempName,
        tempColor,
        tempTextOrEmjoi,
        false,
        tempId
      );
      return;
    }
  }
  delete_list = [];
});

// delete button
deletes.addEventListener('click', () => {
  delete_list.map(delete_function);

  function delete_function(value) {
    $(value).text(' ');
    $(value).html('<i class="fas fa-ban"></i> You deleted this message');
    $(value).addClass('add_text');
    socket.emit('delete', {
      id: value,
      room: roomName,
    });
    $(value).parent().parent().removeClass('add_bg');
    $('#keywords, #copy').fadeIn();
    $('#show_case').fadeOut();
  }
  delete_list = [];
});

// click me
$(document).on('click', '.replyHidess', function () {
  let goToMe = $(this).contents()[3].childNodes[1].id;
  let tempStr = goToMe.split('#');
  const elem = document.getElementById(`${tempStr[1]}`);
  elem.scrollIntoView();
  let clicked = $(`${goToMe}`).parent().parent();
  $(clicked).addClass('add_bg');
  setTimeout(() => {
    $(clicked).removeClass('add_bg');
  }, 2000);
});

// 123select for deleteing
$(document).on('click', '.rxx', function () {
  let clicked = $(`#${$(this)[0].id}`)
    .parent()
    .parent();
  let msg = `#${$(this)[0].id}`;
  if (!$(clicked).hasClass('add_bg')) {
    $(clicked).addClass('add_bg');
    delete_list.push(msg);
    $('#keywords').fadeOut();
    $('#show_case').fadeIn();
  } else {
    $(clicked).removeClass('add_bg');
    const index = delete_list.indexOf(msg);
    if (index > -1) {
      delete_list.splice(index, 1);
    }
    if (delete_list.length >= 1) {
      $('#keywords').fadeOut();
      $('#copy').fadeIn();
    }
  }

  if (delete_list.length >= 2) {
    $('#keywords, #copy').fadeOut();
    $('#delete').fadeIn();
    return;
  }
  if (delete_list == 0) {
    $('#keywords').fadeIn();
    $('#show_case').fadeOut();
    return;
  }
});

$('.logo').click(() => {
  $('.overlay').css({
    bottom: '0',
    height: '100%',
  });
});

$('.back').click(() => {
  $('.overlay').css({
    bottom: '100%',
    height: '0',
  });
});

const enableDarkMode = () => {
  localStorage.setItem('darkMode', 'Dark');
  darkMode = localStorage.getItem('darkMode');
  $('#body').css('background', '#333333');
  change_mode.innerHTML = darkMode;
  switchs.checked = true;
  $('#mario-chat').css('border', '1px solid #212121');
  $('#chat-window').css('background', '#222831');
  $('.inputs').css('border-bottom', '1px solid #116979');
  document.documentElement.setAttribute('data-theme', darkMode);
  $('.msger-header').css({
    background: '#434343',
    color: '#dbdbdb',
  });
};

const disableDarkMode = () => {
  localStorage.setItem('darkMode', 'Light');
  darkMode = localStorage.getItem('darkMode');
  change_mode.innerHTML = darkMode;
  $('#body').css('background', '#fff');
  $('#mario-chat').css('border', '1px solid #ddd');
  switchs.checked = false;
  $('#chat-window').css('background', '#f9f9f9');
  $('.msger-header').css({
    background: '#eee',
    color: '#666',
  });
  document.documentElement.setAttribute('data-theme', darkMode);
};

if (darkMode === 'Dark') {
  j += 1;
  enableDarkMode();
}

checkbox.addEventListener('change', () => {
  if (j == 0) {
    // dark
    trans();
    enableDarkMode();
    j += 1;
    return;
  } else {
    // light
    trans();
    disableDarkMode();
    j -= 1;
    return;
  }
});

// password setting for room

function set_enr_password(txt) {
  var encrypted = CryptoJS.AES.encrypt(txt, passsword);
  return encrypted.toString();
}

function set_de_password(txt) {
  var decrypted = CryptoJS.AES.decrypt(txt, passsword);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

set_password.addEventListener('click', setme);

function setme() {
  if (set_password.checked == true) {
    set_password.checked = true;
    let sets_password = prompt('Set the password for room');
    let hashText = CryptoJS.SHA256(sets_password);
    set_up = set_enr_password(hashText.toString());
    status = true;
    socket.emit('set_password', {
      check: true,
      room: roomName,
      handle: handle.value,
      password: set_up,
      state: true,
    });
    return;
  } else {
    let remove_password = prompt('To remove password ');
    let hashText = CryptoJS.SHA256(remove_password);
    let ver = set_de_password(set_up);
    if (hashText.toString() == ver) {
      set_password.checked = false;
      socket.emit('set_password', {
        check: false,
        room: roomName,
        handle: 'none',
        password: '',
        state: false,
      });
      status = false;
    } else {
      set_password.checked = true;
    }
    return;
  }
}

let trans = () => {
  document.documentElement.classList.add('transition');
  window.setTimeout(() => {
    document.documentElement.classList.remove('transition');
  }, 1000);
};

function msgOrSticker(txt) {
  let s = txt.split('/');
  if (s[2] == 'raw.githubusercontent.com')
    return `<img class="img_sticker" id="stickerUrl" src="${txt}"/>`;
  return txt;
}

function replyText(name, color, data1, data2, msg, id) {
  if (!data1) {
    return `<div class="replyHidess" id="replyHidess" style="border-left: 2px solid ${color};">
    <div class="replyName replyNames" id="replyName" style="color: ${color};" > ${firstName(
      name
    )} </div>
    <div role="button" class="replyContents " id="replyContents">
    <div id="${id}" class="texthide"></div>
      <img src="${data2}" alt="" id="replyimg" class="replyImg" />
    </div>
  </div>
  <div id="textss" class="textss">${msgOrSticker(msg)}</div>`;
  }

  if (!data2) {
    return `<div class="replyHidess" id="replyHidess" style="border-left: 2px solid ${color};">
    <div class="replyName" id="replyName" style="color: ${color};" > ${firstName(
      name
    )} </div>
    <div role="button class="replyContents" id="replyContents">
    <div id="${id}" class="texthide"></div>
      <span id="reply" class="replyText">${data1}</span>
    </div>
  </div>
  <div id="textss" class="textss">${msgOrSticker(msg)}</div>`;
  } else {
    return `<div class="replyHidess" id="replyHidess" style="border-left: 2px solid ${color};">
  <div class="replyName" id="replyName" style="color:${color}" > ${firstName(
      name
    )} </div>
    <div role="button" class="replyContents replyflex" id="replyContents">
    <div id="${id}" class="texthide"></div>
    <span id="reply" class="replyText">${data1}</span>
    <img src="${data2}" alt="" id="replyimg" class="replyImg" />
    </div>
  </div>
  <div id="textss" class="textss">${msgOrSticker(msg)}</div>`;
  }
}

function encrypt(txt) {
  var encrypted = CryptoJS.AES.encrypt(txt, keys);
  return encrypted.toString();
}

function hide_name(txts) {
  var encrypted = CryptoJS.AES.encrypt(txts, hide);
  return encrypted.toString();
}

function decr_text(text) {
  var decrypted = CryptoJS.AES.decrypt(text, keys);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function url_string(text, link, img, tit, des, sit, id) {
  var decrypted = CryptoJS.AES.decrypt(text, keys);
  let data = decrypted.toString(CryptoJS.enc.Utf8);
  const regexp = /^(?:(?:https?|ftp?|http):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  let s = data.split('/');
  if (s[2] === 'raw.githubusercontent.com') {
    return `<img class="img_sticker" id="stickerUrl" src="${data}"/>`;
  }
  if (regexp.test(data)) {
    return `<a id="httpsUrl" target="_blank" href="${data}">${data}</a>`;
  }
  if (data === 'replySticker' || data === 'replyText') {
    insertHere.innerHTML = '';
    return replyText(
      show_name(link),
      img,
      show_name(tit),
      show_name(des),
      show_name(sit),
      id
    );
  }

  if (data === 'sending-link-preview') {
    return `<div class="user-link-preview" id="user-link-preview">
          <div class="user-link-hide">
            <img src="${img}" alt="No image" id="imgUrl"/>
            <div class="user-link-content">
              <span>${tit}</span>
              <span> ${des} </span>
              <span> ${sit} </span>
            </div>
          </div>
          <span id="linkUrl">${link}</span>
        </div>`;
  }
  if (data === 'text') {
    return decr_text(link);
  }
}

function show_name(txts) {
  var decrypted = CryptoJS.AES.decrypt(txts, hide);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function Firts_letter(string) {
  var decrypted = CryptoJS.AES.decrypt(string, hide);
  let data = decrypted.toString(CryptoJS.enc.Utf8);
  return data.charAt(0).toUpperCase() + data.slice(1);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function idnumber() {
  let r = Math.random().toString(36).substring(7);
  return r;
}

let colors = getRandomColor();

// socket events
send.addEventListener('click', function () {
  if (message.value.length == 0) {
    return alert('please enter the text');
  } else {
    // send room name
    if (gettingInn === 2 && req_state == false) xhr.abort(), (gettingInn = 0);
    linkPreview.style.display = 'none';
    if (!req_state && !reply_state) {
      socket.emit('chat', {
        message: encrypt('text'),
        handle: hide_name(handle.value),
        color: colors,
        id: idnumber(),
        ids: idnumber(),
        room: roomName,
        linkUrl: encrypt(message.value),
        image: null,
        title: null,
        description: null,
        site: null,
        replyId: null,
      });
    }
    if (req_state) {
      // thind state
      req_state = false;
      socket.emit('chat', {
        message: encrypt('sending-link-preview'),
        handle: hide_name(handle.value),
        color: colors,
        id: idnumber(),
        ids: idnumber(),
        room: roomName,
        linkUrl: linkUrl,
        image: img.src,
        title: title.innerText,
        description: description.innerText,
        site: site.innerText,
        replyId: null,
      });
      linkUrl = site.innerText = description.innerText = title.innerText = '';
      img.src = '#';
    }

    if (reply_state) {
      reply_state = false;
      replyPreview.style.display = 'none';
      socket.emit('chat', {
        message: encrypt('replyText'),
        handle: hide_name(handle.value),
        color: colors,
        id: idnumber(),
        ids: idnumber(),
        room: roomName,
        linkUrl: hide_name(handle.value),
        image: colors,
        title: hide_name(tempDataOne),
        description: hide_name(tempDataTwo),
        site: hide_name(message.value),
        replyId: tempId,
      });
      tempDataOne = tempDataTwo = tempId = null;
    }
  }
});

// enter the key
message.addEventListener('keypress', function () {
  socket.emit('typing', {
    handle: handle.value,
    room: roomName,
  });
});

// lister

// to set password for the room
socket.on('set_password', function (data) {
  set_password.checked = data[roomName].checkbox;
  $('#note').text(`Password is set by ${data[roomName].who_set}`);
  set_up = data[roomName].set_password;
  status = data[roomName].status;
});

// to check whether password for that room or not
socket.on('status', function (data) {
  $('#note').text(`Password is set by ${data[roomName].who_set}`);
  if (data[roomName].status != status) {
    set_up = data[roomName].set_password;
    let de_txt = set_de_password(set_up);
    let enter_password = prompt('Enter the paassword for the room');
    let hashText = CryptoJS.SHA256(enter_password);
    set_password.checked = data[roomName].checkbox;
    if (hashText.toString() == de_txt) {
      status = true;
    } else {
      status = false;
      location.reload();
    }
  }
});

// to get passphase
socket.on('data_keys', (data_keys) => {
  keys = data_keys.key;
  hide = data_keys.name;
  passsword = data_keys.password;
});

// chat
socket.on('chat', function (data) {
  feedback.innerHTML = '';
  left.innerHTML = '';
  let time = new Date();
  let ch = time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  let side = show_name(data.handle) === handle.value ? 'right' : 'left';
  if (side === 'right') {
    output.innerHTML +=
      '<div class="msg ' +
      side +
      '-msg" id="' +
      data.ids +
      '" >' +
      '<div class="msg-bubble">' +
      '<div class="msg-info">' +
      '<div class="msg-info-name texthide">' +
      show_name(data.handle) +
      '</div>' +
      '</div>' +
      '<div class="msg-text rxx" id="' +
      data.id +
      '" >' +
      '<span id="copyme">' +
      url_string(
        data.message,
        data.linkUrl,
        data.image,
        data.title,
        data.description,
        data.site,
        data.replyId
      ) +
      '</span>' +
      '</div>' +
      '<div class="msg-info-time"><small>' +
      ch +
      '</small></div>' +
      '</div>' +
      '</div> ';
  } else {
    output.innerHTML +=
      '<div class="msg ' +
      side +
      '-msg" id="' +
      data.ids +
      '" >' +
      '<div class="msg-bubble">' +
      '<div class="msg-info">' +
      '<div class="msg-info-name" style="color:' +
      data.color +
      '!important" >' +
      Firts_letter(data.handle) +
      '</div>' +
      '</div>' +
      '<div class="msg-text change xxr" id="' +
      data.id +
      '" >' +
      '<span id="copyme">' +
      url_string(
        data.message,
        data.linkUrl,
        data.image,
        data.title,
        data.description,
        data.site,
        data.replyId
      ) +
      '</span>' +
      '</div>' +
      '<div class="msg-info-time"><small>' +
      ch +
      '</small></div>' +
      '</div>' +
      '</div> ';
  }

  var isScrolledToBottom =
    output.scrollHeight - output.clientHeight <= output.scrollTop + 1;
  if (!isScrolledToBottom)
    output.scrollTop = output.scrollHeight - output.clientHeight;

  // if (side === 'left') {
  //   // console.log(goDownToPage++);
  //   // rigth.scrollIntoView(true);
  // }
});

// for typing
socket.on('typing', (name) => {
  feedback.innerHTML = '<p><em>' + name + '  is typing...</em></p>';
});

// socket.on('user_file', function (data) {
//   const li = document.createElement('li');
//   const a = document.createElement('a');
//   a.href = `${data.file}`;
//   a.innerText = `${data.filename}`;
//   a.setAttribute('download', '');
//   li.setAttribute('id', data.id);
//   li.setAttribute('class', 'file_up');
//   li.appendChild(a);
//   file_upload_here.appendChild(li);
// });

// check whether name is exist ot not
socket.on('err_name', (data) => {
  alert(data.message);
  location.reload();
});

// show the list of user
socket.on('list_of_user', (room) => {
  let user_list = [];
  const ul = document.createElement('ul');
  for (const name in room) {
    if (user_list.indexOf(room[name]) == -1) {
      user_list.push(room[name]);
      const li = document.createElement('li');
      li.innerText = room[name];
      ul.appendChild(li);
    }
  }
  show_user_list.innerHTML = ' ';
  show_user_list.appendChild(ul);
});

// delete
socket.on('delete', (id) => {
  $(id).text(' ');
  $(id).html('<i class="fas fa-ban"></i> This message was deleted');
  $(id).addClass('add_texts');
});

// show the new user list
socket.on('new-user', (name) => {
  left.innerHTML = '<p><em>' + name + '</em> is join</p>';
});

// log out
socket.on('user-disconnect', (name) => {
  if (name == null) {
    // console.log("null")
  } else {
    left.innerHTML = '<p><em>' + name + '<em> has left</p>';
  }
});

// Clear the Message
send.addEventListener('click', () => {
  message.value = '';
});

// openin the emoji or sticker

$('#open').click(function () {
  $('.modal').slideToggle();
  $('#other2').fadeOut();
  $('#open').fadeOut();
});

$('#close').click(function () {
  $('.modal').slideToggle();
  $('#other2').fadeIn();
  $('#open').fadeIn();
});

$('#open2').click(function () {
  $('.modal2').slideToggle();
  $('#other').fadeOut();
  $('#open2').fadeOut();
});

$('#close2').click(function () {
  $('.modal2').slideToggle();
  $('#other').fadeIn();
  $('#open2').fadeIn();
});

const all = document.querySelectorAll('.emoji_dislay');

function play(e) {
  let h2 = document.getElementById(e.target.id).textContent;
  if (emoji.indexOf(h2) == -1) {
    emoji.push(h2);
    const roomLink = document.createElement('h2');
    roomLink.innerText = h2;
    roomLink.setAttribute('id', idnumber());
    demo.append(roomLink);
  }
  var text = document.getElementById('message');
  text.value += h2;
}
all.forEach((data) => data.addEventListener('click', play));

function plays(e) {
  if (!reply_state) {
    socket.emit('chat', {
      message: encrypt(e.target.src),
      handle: hide_name(handle.value),
      color: colors,
      id: idnumber(),
      ids: idnumber(),
      room: roomName,
    });
  }
  if (reply_state) {
    reply_state = false;
    replyPreview.style.display = 'none';
    socket.emit('chat', {
      message: encrypt('replySticker'),
      handle: hide_name(handle.value),
      color: colors,
      id: idnumber(),
      ids: idnumber(),
      room: roomName,
      linkUrl: hide_name(handle.value),
      image: colors,
      title: hide_name(tempDataOne),
      description: hide_name(tempDataTwo),
      site: hide_name(e.target.src),
      replyId: tempId,
    });
    $('.msg').removeClass('add_bg');
    tempDataOne = tempDataTwo = tempId = null;
  }
}

sticker.forEach((data) => data.addEventListener('click', plays));

$(document).ready(function () {
  $.getJSON(
    'https://raw.githubusercontent.com/avinashboy/sticker/master/emoji.json',
    function (result) {
      getData(result);
    }
  );
});

function getData(d) {
  function em(gt) {
    return `<h2 id="${idnumber()}">${gt.emoji}</h2>`;
  }
  return (document.getElementById('emoji_dislay').innerHTML = d
    .map(em)
    .join(''));
}

$(document).ready(function () {
  $.getJSON(
    'https://raw.githubusercontent.com/avinashboy/sticker/master/img.json',
    function (result) {
      call_me(result[0].data);
    }
  );
});

function call_me(data) {
  function ch(ss) {
    return `<img class="img" src="${ss.photo}">`;
  }
  return (document.getElementById('sticker').innerHTML = data.map(ch).join(''));
}

// reload
window.onbeforeunload = function () {
  return 'Are you sure you want to leave?';
};

var navigating = false;
window.onbeforeunload = function (e) {
  if (!navigating) {
    return null;
  }
  navigating = false;
  var e = e || window.event;
  // For IE and Firefox
  if (e) {
    e.returnValue = 'àààà Are you sure you want to leave?';
  }
  // For Safari
  return ' àààà Are you sure you want to leave?';
};

function navigate(url) {
  navigating = true;
  setTimeout(function () {
    window.location = url;
  }, 0);
}
window.onload = function () {
  var as = document.getElementsByTagName('a');
  var navigateToUrl = function (e) {
    var element = e.target;
    var url = element.getAttribute('data-href');
    navigate(url);
  };
  for (let i = 0; i < as.length; i++) {
    as[i].onclick = navigateToUrl;
  }
};

// to get link for the game session
const url = 'https://hot-games.herokuapp.com';
const sockets = io.connect(url);
const demoo = document.getElementById('demoo');
const btns = document.getElementById('btns');
const btn_copy = document.getElementById('btn_copy');
btns.addEventListener('click', () => {
  const select = document.getElementById('selected').value;
  let sendData = {
    option: select,
  };
  $.ajax({
    type: 'POST',
    url: `${url}/create`,
    data: sendData,
  });
  $('#btns').fadeOut();
  $('#selected').fadeOut();
  $('#show_me').fadeIn();
});
sockets.on('new-room', (data) => {
  demoo.value = `${url}/${data}`;
});
btn_copy.addEventListener('click', () => {
  $('#btns').fadeIn();
  $('#selected').fadeIn();
  $('#show_me').fadeOut();
});
var clipboard = new ClipboardJS('.btns');

clipboard.on('success', function (e) {
  e.clearSelection();
});

clipboard.on('error', function (e) {
  // console.error('Action:', e.action);
  // console.error('Trigger:', e.trigger);
});