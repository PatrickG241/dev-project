let fish = JSON.parse(localStorage.getItem('fish')) || [];
console.log('Loaded fish from localStorage:', fish);

function renderFish() {
  const list = document.getElementById('fishList');
  list.innerHTML = '';
  if (fish.length === 0) {
    list.innerHTML = '<li>No catches yet. <a href="add-catch.html">Add one!</a></li>';
    console.log('No catches to display');
    return;
  }
  console.log('Rendering', fish.length, 'catches');
  fish.forEach((f, index) => {
    const li = document.createElement('li');
    let details = `${f.type}`;
    if (f.length) details += ` - ${f.length} inches`;
    if (f.weight) details += ` - ${f.weight}`;
    if (f.water) details += ` - ${f.water}`;
    if (f.temp) details += ` - ${f.temp}°F`;
    if (f.time) details += ` at ${f.time}`;
    details += ` on ${f.date}`;
    li.textContent = details;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      console.log('Deleting catch at index', index);
      fish.splice(index, 1);
      localStorage.setItem('fish', JSON.stringify(fish));
      console.log('Updated localStorage after delete');
      renderFish();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

renderFish();
