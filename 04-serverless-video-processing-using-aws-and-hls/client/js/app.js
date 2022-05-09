// elements
const form = document.querySelector('form');
const file = document.querySelector('input[name="file"]');
const title = document.querySelector('input[name="title"]');
const videosContainer = document.getElementById('videos-container');
const uploadStatus = document.getElementById('upload-status');
// functions
async function handleSubmit(e) {
  // runs when you click upload button
  e.preventDefault();

  if (!file.files.length) {
    alert('please select a file');
    return;
  }

  if (!title.value) {
    alert('please enter a title');
    return;
  }

  try {
    const {
      data: { url, fields },
    } = await fetch('https://ve2odyhnhg.execute-api.ap-south-1.amazonaws.com/getpresignedurl', {
      // your url might be different from this, replace it with api gateway endpoint of your lambda function
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ title: title.value }), // send other metadata you want here
    }).then(res => res.json());

    const data = {
      bucket: 'video-intake',
      ...fields,
      'Content-Type': file.files[0].type,
      file: file.files[0],
    };

    const formData = new FormData();

    for (const name in data) {
      formData.append(name, data[name]);
    }

    uploadStatus.textContent = 'uploading...';
    await fetch(url, {
      method: 'POST',
      body: formData,
    });
    uploadStatus.textContent = 'successfully uploaded';
  } catch (err) {
    console.error(err);
  }
}

async function displayAllVideos() {
  const videos = await fetch('https://ve2odyhnhg.execute-api.ap-south-1.amazonaws.com/getVideos').then(res => res.json());

  console.log(videos);

  videos.forEach(video => {
    var html;
    if (video.status === 'processing') {
      html = `<div class="video">
      <h3 class="title">${video.title}</h3>
      <div class="spinner-container">
      <div id="loading"></div>
      <p>Processing...</p>
      </div>
      </div>`;
      videosContainer.insertAdjacentHTML('beforeend', html);
    } else {
      html = `<div class="video">
      <h3 class="title">${video.title}</h3>
      <video id="video-${video.id}" class="video-js" data-setup='{}' controls width="500" height="300">
    <source src="${video.url}" type="application/x-mpegURL">
</video>
      </div>`;
      videosContainer.insertAdjacentHTML('beforeend', html);
      const player = videojs(`video-${video.id}`);
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });
    }
  });
}

// listeners
form.addEventListener('submit', e => handleSubmit(e));

//function calls
displayAllVideos();
