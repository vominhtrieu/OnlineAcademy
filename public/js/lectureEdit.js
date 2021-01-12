const videoInput = document.getElementById('video-input');
const videoSelectorToggler = document.getElementById('video-selector-toggler');
const filenameLabel = document.getElementById('file-name-label');
videoInput.addEventListener('change', (e) => {
  if (e.target.files) {
    const file = e.target.files[0];
    const url = window.URL.createObjectURL(file);
    filenameLabel.textContent = file.name;
    videojs('video-preview').src({
      type: `video/${file.name.split('.').pop()}`,
      src: url,
    });
  }
});

videoSelectorToggler.addEventListener('click', (e) => {
  videoInput.click();
});
