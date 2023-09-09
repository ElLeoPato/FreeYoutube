const urlParams = new URLSearchParams(window.location.search);
var queryUrl = urlParams.get('q');
var instance = "https://vid.puffyan.us/" // Invidious instance
var standardSearch = "cats"

if (queryUrl) {
  standardSearch = queryUrl
  document.getElementById("searchInput").value = queryUrl
} else {
  standardSearch = "cats"
}

function truncateTitle(title, limit) {
  if (title.length > limit) {
    return title.substring(0, limit) + "...";
  }
  return title;
}

document.addEventListener("DOMContentLoaded", function() {
  const apiURL = `${instance}api/v1/search?q=${standardSearch}&type=video`;

  fetch(apiURL)
    .then(response => response.json())
    .then(data => displaySearchResults(data))
    .catch(error => console.error("Error fetching data:", error));
});

document.getElementById("searchButton").addEventListener("click", function() {
  const query = document.getElementById("searchInput").value.trim();
  if (query === "") {
    return;
  }

  const apiURL = `${instance}api/v1/search?type=video&q=${encodeURIComponent(query)}`;

  fetch(apiURL)
    .then(response => response.json())
    .then(data => displaySearchResults(data))
    .catch(error => console.error("Error fetching data:", error));
});

function displaySearchResults(data) {
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "";

  data.forEach(item => {
    if (item.type === "video") {
      const videoElement = createVideoElement(item);
      resultContainer.appendChild(videoElement);
    }
  });
}

function createVideoElement(video) {
  const videoElement = document.createElement("div");
  videoElement.classList.add("video");
  
  const thumbnailContainer = document.createElement("div");
  thumbnailContainer.classList.add("thumbnail-container");

  const titleElement = document.createElement("div");
  titleElement.classList.add("video-title");
  
  titleElement.textContent = `${truncateTitle(video.title, 30)} - by ${video.author}`;
  
  titleElement.addEventListener("click", function() {
    window.location.href = `${instance}latest_version?id=${video.videoId}`;
  });

  const downloadElement = document.createElement("a");
  downloadElement.download = video.title
  downloadElement.href = `${instance}latest_version?id=${video.videoId}`;
  titleElement.appendChild(downloadElement);

  const authorElement = document.createElement("div");
  authorElement.classList.add("video-author");

  videoElement.appendChild(titleElement);
  videoElement.appendChild(authorElement);

  return videoElement;
}