function validateImgs() {
  const fileInput = document.getElementById('formFile');
  const fileError = document.getElementById('fileError');
  fileError.classList.add('d-none'); // Hide the error message initially
  fileError.textContent = ''; // Clear any existing errors

  const maxFileSize = 5 * 1024 * 1024; // 5 MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  for (let i = 0; i < fileInput.files.length; i++) {
    const file = fileInput.files[i];

    if (!allowedTypes.includes(file.type)) {
      fileError.textContent = 'Only JPEG, PNG, and GIF files are allowed.';
      fileError.classList.remove('d-none'); // Show the error message
      fileInput.value = ''; // Clear the invalid input
      return;
    }

    if (file.size > maxFileSize) {
      fileError.textContent = 'File size should not exceed 5 MB.';
      fileError.classList.remove('d-none'); // Show the error message
      fileInput.value = ''; // Clear the invalid input
      return;
    }
  }
}

document.getElementById('formFile').addEventListener('change', validateImgs);
