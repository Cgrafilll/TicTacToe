const login = document.getElementById('Log_in');
const signup = document.getElementById('sign_up');

//login - sigup
signuppage = () => {
  login.style.display = 'none';
  signup.style.display = 'flex';
};
loginpage = () => {
  signup.style.display = 'none';
  login.style.display = 'flex';
};


