const form = document.getElementById('calorie-form');
const foodInput = document.getElementById('food');
const calorieInput = document.getElementById('calories');
const typeSelect = document.getElementById('type');
const list = document.getElementById('calorie-list');
const totalDisplay = document.getElementById('total');

let items = getCookiesData() || [];

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const food = foodInput.value.trim();
  const calories = parseInt(calorieInput.value);
  const type = typeSelect.value;

  if (!food || isNaN(calories)) return;

  const item = {
    food,
    calories: type === 'burned' ? -Math.abs(calories) : Math.abs(calories),
    type
  };

  items.push(item);
  updateCookies(items);
  renderItems();
  form.reset();
});

function renderItems() {
  list.innerHTML = '';
  let total = 0;

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `card ${item.type}`;

    li.innerHTML = `
      <span>${item.food}</span>
      <span>${item.calories > 0 ? '+' : ''}${item.calories} cal</span>
      <button class="delete-btn" data-index="${index}">X</button>
    `;

    list.appendChild(li);
    total += item.calories;
  });

  totalDisplay.textContent = total;
  attachDeleteEvents();
}

function attachDeleteEvents() {
  const buttons = document.querySelectorAll('.delete-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      items.splice(index, 1);
      updateCookies(items);
      renderItems();
    });
  });
}

function updateCookies(data) {
  const expires = new Date(Date.now() + 7 * 864e5).toUTCString(); // 7 days
  document.cookie = `calories=${encodeURIComponent(JSON.stringify(data))}; expires=${expires}; path=/`;
}

function getCookiesData() {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {});
  return cookies.calories ? JSON.parse(decodeURIComponent(cookies.calories)) : [];
}

// Initial load
renderItems();
