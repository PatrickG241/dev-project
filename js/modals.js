/**
 * Modal utility for Bootstrap confirmation dialogs
 * Replaces native confirm() with styled Bootstrap modals
 */

/**
 * Show a confirmation modal
 * @param {string} message - The confirmation message
 * @param {string} title - The modal title
 * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled
 */
function showConfirmModal(message, title = 'Confirm') {
  return new Promise((resolve) => {
    // Create modal container if it doesn't exist
    let modalContainer = document.getElementById('confirmModalContainer');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'confirmModalContainer';
      document.body.appendChild(modalContainer);
    }

    const modalId = 'confirmModal-' + Date.now();
    
    modalContainer.innerHTML = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>${title}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="mb-0">${message}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="bi bi-x-lg me-1"></i>Cancel
              </button>
              <button type="button" class="btn btn-danger" id="confirmBtn-${modalId}">
                <i class="bi bi-check-lg me-1"></i>Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const modalElement = modalContainer.querySelector(`#${modalId}`);
    const modal = new bootstrap.Modal(modalElement);
    
    const confirmBtn = document.getElementById(`confirmBtn-${modalId}`);
    
    confirmBtn.addEventListener('click', () => {
      modal.hide();
      resolve(true);
    });
    
    modalElement.addEventListener('hidden.bs.modal', () => {
      if (!modalElement.hasAttribute('data-confirmed')) {
        resolve(false);
      }
      modalElement.remove();
    });
    
    modal.show();
  });
}