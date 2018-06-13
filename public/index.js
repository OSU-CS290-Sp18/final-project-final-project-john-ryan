function handleModalAcceptClick() {
    hideCreateTwitModal();
}

function showCreateTwitModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var createTwitModal = document.getElementById('edit-feeds-modal');

  // Show the modal and its backdrop.
  modalBackdrop.classList.remove('hidden');
  createTwitModal.classList.remove('hidden');

}

function hideCreateTwitModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var editFeedsModal = document.getElementById('edit-feeds-modal');

  // Hide the modal and its backdrop.
  modalBackdrop.classList.add('hidden');
  editFeedsModal.classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', function () {


  

  var editFeedsButton = document.getElementsByClassName('edit-feeds');
  if (editFeedsButton) {
    editFeedsButton[0].addEventListener('click', showCreateTwitModal);
  }

  var modalCloseButton = document.querySelector('#edit-feeds-modal .modal-close-button');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', hideCreateTwitModal);
  }

  var modalCancalButton = document.querySelector('#edit-feeds-modal .modal-cancel-button');
  if (modalCancalButton) {
    modalCancalButton.addEventListener('click', hideCreateTwitModal);
  }

  var modalAcceptButton = document.querySelector('#edit-feeds-modal .modal-accept-button');
  if (modalAcceptButton) {
    modalAcceptButton.addEventListener('click', handleModalAcceptClick);
  }


});
