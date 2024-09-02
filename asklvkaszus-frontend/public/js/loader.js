document.querySelector('.dots').classList.add('dots-visible')

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      document.querySelector('#loader-title').classList.add('loader-fade-out')
      document.querySelector('#loader-main').classList.add('loader-main-fade-out')
    }, 2000);  
    setTimeout(function() {
      document.querySelector('#app-main').classList.add('fade-in')
      document.querySelector('#app-main').classList.remove('app-main-hide')
      document.querySelector('#loader-main').remove()
    }, 3000);
});
