  // Check login state
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  function navigateTo(page) {
      if (!isLoggedIn) {
          document.getElementById('loginModal').classList.add('active');
          document.getElementById('overlay').classList.add('active');
      } else {
          window.location.href = page;
      }
  }

  function closeModal() {
      document.getElementById('loginModal').classList.remove('active');
      document.getElementById('overlay').classList.remove('active');
  }

  function login() {
      localStorage.setItem('isLoggedIn', 'false');
      alert('Redirecting to login page...');
      window.location.href = 'index.html';
  }