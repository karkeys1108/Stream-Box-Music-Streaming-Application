const API_KEY = "AIzaSyAXhB3J1E085qOtXlq7rjeeCilldyr90nc";
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");

// Player Container
const playerDiv = document.createElement("div");
playerDiv.className = "fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black/80 text-white w-96 p-4 rounded-lg shadow-lg hidden flex-col items-center";
document.body.appendChild(playerDiv);

let player;
let isPlaying = false;

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        fetchMusicVideos(query);
    }
});

async function fetchMusicVideos(query) {
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}+song&videoCategoryId=10&type=video&maxResults=12&key=${API_KEY}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        resultsDiv.innerHTML = "";

        data.items.forEach((video) => {
            const videoId = video.id.videoId;
            const title = video.snippet.title;
            const thumbnail = video.snippet.thumbnails.high.url;
            const channelTitle = video.snippet.channelTitle;

            const videoCard = document.createElement("div");
            videoCard.className = "bg-black/60 glass p-4 rounded-lg shadow-lg cursor-pointer hover:bg-black/70 transition-all";
            videoCard.innerHTML = `
                <img src="${thumbnail}" alt="${title}" class="rounded-lg w-full object-cover">
                <h3 class="text-lg font-semibold mt-3">${title}</h3>
                <p class="text-sm text-gray-400">by ${channelTitle}</p>
            `;

            videoCard.addEventListener("click", () => {
                playMusic(videoId, title, thumbnail);
            });

            resultsDiv.appendChild(videoCard);
        });

    } catch (error) {
        console.error("Error fetching videos:", error);
        resultsDiv.innerHTML = `<p class="text-red-500">Failed to load videos. Try again later.</p>`;
    }
}

function playMusic(videoId, title, thumbnail) {
    // Show player
    playerDiv.innerHTML = `
        <div class="flex items-center w-full">
            <img src="${thumbnail}" alt="${title}" class="w-16 h-16 rounded-lg mr-4">
            <div class="flex-1">
                <h3 class="text-lg font-semibold">${title}</h3>
                <div class="flex gap-4 mt-2">
                    <button id="playPauseBtn" class="text-2xl"><i class="fas fa-pause"></i></button>
                    <button id="likeBtn" class="text-2xl"><i class="far fa-heart"></i></button>
                    <button id="playlistBtn" class="text-2xl"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
        <iframe id="youtubePlayer" width="0" height="0" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="hidden"></iframe>
    `;

    playerDiv.classList.remove("hidden");

    if (player) {
        player.destroy(); // Destroy previous player instance
    }

    player = new YT.Player("youtubePlayer", {
        events: {
            "onReady": (event) => {
                event.target.playVideo();
                isPlaying = true;
            }
        }
    });

    document.getElementById("playPauseBtn").addEventListener("click", () => {
        if (isPlaying) {
            player.pauseVideo();
            isPlaying = false;
            document.getElementById("playPauseBtn").innerHTML = '<i class="fas fa-play"></i>';
        } else {
            player.playVideo();
            isPlaying = true;
            document.getElementById("playPauseBtn").innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    document.getElementById("likeBtn").addEventListener("click", (e) => {
        e.target.classList.toggle("text-red-500");
    });

    document.getElementById("playlistBtn").addEventListener("click", () => {
        alert("Added to playlist! (Functionality to be implemented)");
    });
}

// Load YouTube API Script
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);
