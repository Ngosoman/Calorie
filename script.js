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



document.getElementById("fetchCaloriesBtn").addEventListener("click", async function () {
    const food = document.getElementById("foodInput").value.trim();
    const resultElement = document.getElementById("calorieResult");

    if (!food) {
        resultElement.textContent = "Please enter a food item.";
        return;
    }

    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(food)}`, {
            method: "GET",
            headers: {
                "X-Api-Key": "XfPI/uFJt3L6ip6r6Oh+cg==KATeQUx4dfWIqhjC"
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.length === 0) {
            resultElement.textContent = "No data found for that food.";
            return;
        }

        const calories = data[0].calories;
        resultElement.textContent = `Calories in ${food}: ${calories}`;
    } catch (error) {
        console.error(error);
        resultElement.textContent = "Failed to fetch calorie data.";
    }
});

document.getElementById("fetchCaloriesBtn").addEventListener("click", async function (e) {
    e.preventDefault(); // Prevent any unintended form behavior

    const food = document.getElementById("food").value.trim(); // Correct input ID
    const resultElement = document.getElementById("calorieResult");

    if (!food) {
        resultElement.textContent = "Please enter a food item.";
        return;
    }

    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(food)}`, {
            method: "GET",
            headers: {
                "X-Api-Key": "XfPI/uFJt3L6ip6r6Oh+cg==KATeQUx4dfWIqhjC"
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            resultElement.textContent = "No data found for that food.";
            return;
        }

        const calories = data[0].calories;

        resultElement.textContent = `Calories in ${food}: ${calories}`;

        // Optional: auto-fill the calories input field
        document.getElementById("calories").value = calories;
    } catch (error) {
        console.error(error);
        resultElement.textContent = "Failed to fetch calorie data.";
    }
});

