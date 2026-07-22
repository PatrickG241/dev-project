/**
 * Catches page logic
 * Handles rendering, searching, filtering, sorting, and favorites
 */

let fish = JSON.parse(localStorage.getItem('fish')) || [];
let showFavoritesOnly = false;

console.log('Loaded fish from localStorage:', fish);

/**
 * Render fish as Bootstrap cards
 */
function renderFish() {
  const list = document.getElementById('fishList');
  const emptyState = document.getElementById('emptyState');
  
  list.innerHTML = '';
  
  // Get filter values
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filterType = document.getElementById('filterType').value;
  const sortBy = document.getElementById('sortBy').value;
  
  // Filter fish
  let filteredFish = fish.filter((f, index) => {
    // Search filter
    const searchMatch = !searchTerm || 
      f.type.toLowerCase().includes(searchTerm) ||
      (f.water && f.water.toLowerCase().includes(searchTerm)) ||
      (f.date && f.date.includes(searchTerm));
    
    // Type filter
    const typeMatch = !filterType || f.type === filterType;
    
    // Favorites filter
    const favoriteMatch = !showFavoritesOnly || f.favorite;
    
    return searchMatch && typeMatch && favoriteMatch;
  });
  
  // Sort fish
  filteredFish.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'type-asc':
        return a.type.localeCompare(b.type);
      case 'type-desc':
        return b.type.localeCompare(a.type);
      default:
        return 0;
    }
  });
  
  // Move favorites to top
  if (showFavoritesOnly) {
    filteredFish.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  }
  
  // Show empty state or render cards
  if (filteredFish.length === 0) {
    list.style.display = 'none';
    emptyState.style.display = 'block';
    console.log('No catches to display');
  } else {
    list.style.display = 'flex';
    emptyState.style.display = 'none';
    console.log('Rendering', filteredFish.length, 'catches');
    
    filteredFish.forEach((f) => {
      const originalIndex = fish.indexOf(f);
      const card = createFishCard(f, originalIndex);
      list.appendChild(card);
    });
  }
  
  // Update filter dropdown
  updateFilterDropdown();
}

/**
 * Create a Bootstrap card for a fish catch
 */
function createFishCard(f, index) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4 mb-4';
  
  const card = document.createElement('div');
  card.className = `card h-100 shadow-sm ${f.favorite ? 'border-warning' : ''}`;
  
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  
  // Favorite star
  const favoriteBtn = document.createElement('button');
  favoriteBtn.className = 'btn btn-link p-0 float-end';
  favoriteBtn.innerHTML = f.favorite 
    ? '<i class="bi bi-star-fill text-warning"></i>' 
    : '<i class="bi bi-star text-muted"></i>';
  favoriteBtn.onclick = () => toggleFavorite(index);
  
  // Title
  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = f.type;
  
  // Details
  const details = document.createElement('div');
  details.className = 'card-text';
  
  let detailsHTML = '';
  if (f.length) detailsHTML += `<p><strong>Length:</strong> ${f.length} inches</p>`;
  if (f.weight) detailsHTML += `<p><strong>Weight:</strong> ${f.weight}</p>`;
  if (f.water) detailsHTML += `<p><strong>Location:</strong> ${f.water}</p>`;
  if (f.temp) detailsHTML += `<p><strong>Temperature:</strong> ${f.temp}°F</p>`;
  if (f.time) detailsHTML += `<p><strong>Time:</strong> ${f.time}</p>`;
  detailsHTML += `<p><strong>Date:</strong> ${f.date}</p>`;
  
  details.innerHTML = detailsHTML;
  
  // Edit button (contenteditable)
  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-sm btn-outline-primary me-2';
  editBtn.innerHTML = '<i class="bi bi-pencil me-1"></i>Edit';
  editBtn.onclick = () => enableEditMode(cardBody, index);
  
  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-sm btn-outline-danger';
  deleteBtn.innerHTML = '<i class="bi bi-trash me-1"></i>Delete';
  deleteBtn.onclick = () => deleteFish(index);
  
  // Button group
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'mt-3';
  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);
  
  cardBody.appendChild(favoriteBtn);
  cardBody.appendChild(title);
  cardBody.appendChild(details);
  cardBody.appendChild(buttonGroup);
  
  card.appendChild(cardBody);
  col.appendChild(card);
  
  return col;
}

/**
 * Toggle favorite status
 */
function toggleFavorite(index) {
  fish[index].favorite = !fish[index].favorite;
  localStorage.setItem('fish', JSON.stringify(fish));
  console.log('Toggled favorite for fish at index', index);
  renderFish();
}

/**
 * Enable edit mode with contenteditable
 */
function enableEditMode(cardBody, index) {
  const f = fish[index];
  
  // Replace text with inputs
  const inputs = {
    type: createEditableInput('Fish Type', f.type),
    length: createEditableInput('Length (inches)', f.length || ''),
    weight: createEditableInput('Weight', f.weight || ''),
    water: createEditableInput('Body of Water', f.water || ''),
    temp: createEditableInput('Temperature (°F)', f.temp || ''),
    time: createEditableInput('Time', f.time || ''),
    date: createEditableInput('Date', f.date)
  };
  
  // Clear card body and add inputs
  cardBody.innerHTML = '';
  
  Object.entries(inputs).forEach(([key, input]) => {
    cardBody.appendChild(input);
  });
  
  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-success mt-3';
  saveBtn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Save';
  saveBtn.onclick = () => {
    fish[index] = {
      type: inputs.type.value,
      length: inputs.length.value,
      weight: inputs.weight.value,
      water: inputs.water.value,
      temp: inputs.temp.value,
      time: inputs.time.value,
      date: inputs.date.value,
      favorite: f.favorite
    };
    localStorage.setItem('fish', JSON.stringify(fish));
    console.log('Updated fish at index', index);
    renderFish();
  };
  
  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary mt-3 ms-2';
  cancelBtn.innerHTML = '<i class="bi bi-x-lg me-1"></i>Cancel';
  cancelBtn.onclick = renderFish;
  
  cardBody.appendChild(saveBtn);
  cardBody.appendChild(cancelBtn);
}

/**
 * Create an editable input field
 */
function createEditableInput(label, value) {
  const div = document.createElement('div');
  div.className = 'mb-2';
  
  const labelEl = document.createElement('label');
  labelEl.className = 'form-label small mb-1';
  labelEl.textContent = label;
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control form-control-sm';
  input.value = value;
  
  div.appendChild(labelEl);
  div.appendChild(input);
  
  return input;
}

/**
 * Delete a fish catch
 */
async function deleteFish(index) {
  const confirmed = await showConfirmModal('Are you sure you want to delete this catch?', 'Delete Catch');
  
  if (confirmed) {
    console.log('Deleting catch at index', index);
    fish.splice(index, 1);
    localStorage.setItem('fish', JSON.stringify(fish));
    console.log('Updated localStorage after delete');
    renderFish();
  }
}

/**
 * Update the filter dropdown with unique fish types
 */
function updateFilterDropdown() {
  const filterType = document.getElementById('filterType');
  const currentValue = filterType.value;
  
  // Get unique fish types
  const types = [...new Set(fish.map(f => f.type))].sort();
  
  // Save current selection
  filterType.innerHTML = '<option value="">All Fish Types</option>';
  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    filterType.appendChild(option);
  });
  
  // Restore selection if still valid
  if (types.includes(currentValue)) {
    filterType.value = currentValue;
  }
}

/**
 * Toggle favorites view
 */
function toggleFavorites() {
  showFavoritesOnly = !showFavoritesOnly;
  const btn = document.getElementById('showFavorites');
  
  if (showFavoritesOnly) {
    btn.classList.remove('btn-outline-warning');
    btn.classList.add('btn-warning');
  } else {
    btn.classList.remove('btn-warning');
    btn.classList.add('btn-outline-warning');
  }
  
  renderFish();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Require authentication
  requireAuth();
  
  renderFish();
  
  document.getElementById('searchInput').addEventListener('input', renderFish);
  document.getElementById('filterType').addEventListener('change', renderFish);
  document.getElementById('sortBy').addEventListener('change', renderFish);
  document.getElementById('showFavorites').addEventListener('click', toggleFavorites);
});
