let isAuthN = sessionStorage.getItem('sessionAuthN');
console.log('Auth state:', isAuthN);

if (isAuthN === 'true') {
  document.getElementById('loginState').innerText = 'Hello, Fisher.'
}
else {
  document.getElementById('loginState').innerText = 'Please Login'
}
