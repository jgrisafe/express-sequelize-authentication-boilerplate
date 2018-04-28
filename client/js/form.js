$(function() {
  if (window.location.pathname === '/') {
    $('.signup-form').remove()
    $('.login').on('click', login);
  }
  if (window.location.pathname === '/register') {
    $('.login-form').remove()
    $('.signup').on('click', signup);
  }
  if ($('.logout').length) {
    $('.logout').on('click', logout);
  }
})

function validInput(names) {
  for(let i=0; i<names.length; i++) {
    if (!$('[name="'+ names[i] +'"]').val()) {
      return false;
    }
  }
  return true;
}

function login(e) {
  e.preventDefault();
  if (!validInput(['username', 'password'])) return;
  $.ajax('/login', {
    method: 'POST',
    data: {
      username: $('[name="username"]').val(),
      password: $('[name="password"]').val()
    }
  }).done(user => {
    $.cookie('auth_token', user.token, { expires: 7 });
    window.location.reload()
  }).fail((err) => alert(err.responseText))
}

function signup(e) {
  e.preventDefault();
  if (!validInput(['username', 'password', 'email'])) return;
  $.ajax('/register', {
    method: 'POST',
    data: {
      username: $('[name="username"]').val(),
      email: $('[name="email"]').val(),
      password: $('[name="password"]').val()
    }
  }).then(user => {
    if (user.token) {
      $.cookie('auth_token', user.token, { expires: 7 });
      window.location = '/'
    } else {
      throw new Error('something went wrong')
    }
  }).fail((err) => alert(err.responseText))
}

function logout(e) {
  e.preventDefault();
  $.ajax('/logout', {
    method: 'DELETE',
    data: {}
  }).then(user => {
    $.removeCookie('auth_token');
    window.location.reload()
  })
}