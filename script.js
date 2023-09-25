const shuffleBtn = document.getElementById("shuffleBtn");
const prevBtn = document.getElementById("prevBtn");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const playlistBtn = document.getElementById("playlistBtn");
const closeBtn = document.getElementById("close-btn");
const volumeSlider = document.querySelector('.volume_slider');

const audio = document.getElementById("audio");
const songImg = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");

const totalTime = document.getElementById("total-time");
const currentTime = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const currentProgress = document.getElementById("current-progress");
const playlistContainer = document.getElementById("playlist-container");
const playlistSongs = document.getElementById("playlist-songs");

let index;
let loop = true;

// Array of songs
const songsArray = [{
        name: "Ben Sahar",
        link: "audio/Ben Sahar.mp3",
        artist: "Behemoth",
        image: "images/the-satanist.png",
    },
    {
        name: "Voice of the Soul (Instrumental)",
        link: "audio/Voice of the Soul (Instrumental).mp3",
        artist: "Death",
        image: "images/the-sound-of-perseverance.png", 
    },
    {
        name: "Burden",
        link: "audio/Burden.mp3",
        artist: "Opeth",
        image: "images/watershed.png", 
    },
    {
        name: "Death Becomes My Light",
        link: "audio/Death Becomes My Light.mp3",
        artist: "Kreator",
        image: "images/gods-of-violence.png", 
    },
    {
        name: "Carving the Voices",
        link: "audio/Carving the Voices.mp3",
        artist: "Gaahls WYRD",
        image: "images/gastir-ghosts-invited.png", 
    },
];

// Events 
let events = {
    mouse: {click: "click"},
    touch: {click: "touchstart"}
};

let deviceType = "";

// Detect whether device is touch or not
const isTouch = () => {
    try {
        // Touch event: will return true ONLY for a touch device.
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

// Format time: convert from milliseconds to minutes and seconds.
const timeFormat = (time) => {
    let minute = Math.floor(time / 60);
    minute = minute < 10 ? "0" + minute : minute;

    let second = Math.floor(time % 60);
    second = second < 10 ? "0" + second : second;

    return `${minute}:${second}`
};

//console.log(timeFormat(700))

// Set song
const setSong = (index) => {
    let {name, link, artist, image} = songsArray[index];
    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImg.src = image;

    // Duration when metadata loads
    audio.onloadedmetadata = () => {
        totalTime.innerText = timeFormat(audio.duration);
    };
    //playSong();
};

// Play song
const playSong = () => {
    audio.play();
    pauseBtn.classList.remove("hide");
    playBtn.classList.add("hide");
};

// Pause song
const pauseSong = () => {
    audio.pause();
    pauseBtn.classList.add("hide");
    playBtn.classList.remove("hide");
};

// Repeat button
repeatBtn.addEventListener("click", () => {
    if (repeatBtn.classList.contains("active")) {
        repeatBtn.classList.remove("active");
        audio.loop = false;
        console.log("repeat off");
    } else {
        repeatBtn.classList.add("active");
        audio.loop = true;
        console.log("repeat on")
    }
});

// Play next song
const nextSong = () => {
    if (loop) { // If loop is true, continue 
        if (index == songsArray.length - 1) {
            // If last song is playing, then
            index = 0;
        } else {
            index ++;
        }
        setSong(index);
        playSong();
    } else {
        // Random index and play that song
        let randIndex = Math.floor(Math.random() * songsArray.length);
        console.log(randIndex);
        setSong(randIndex);
        playSong();
    }
};

// Play previous song
const prevSong = () => {
    if (index > 0) {
        pauseSong();
        index --;
    } else {
        // If first song is playing
        index = songsArray.length - 1;
    }
    setSong(index);
    playSong();
};

// Play next song when actual song ends
audio.onended = () => {
    nextSong();
};

// Shuffle mode
shuffleBtn.addEventListener("click", () => {
    if (shuffleBtn.classList.contains("active")) {
        shuffleBtn.classList.remove("active");
        loop = true;
        console.log("shuffle off")
    } else {
        shuffleBtn.classList.add("active");
        loop = false;
        console.log("shuffle on");
    }
});

// Volume control
function setVolume() {
    audio.volume = volumeSlider.value / 100;
}

// Play button
playBtn.addEventListener("click", playSong);

// Pause button
pauseBtn.addEventListener("click", pauseSong);

// Play next
nextBtn.addEventListener("click", nextSong);

// Play previous
prevBtn.addEventListener("click", prevSong);

// Progress bar (user clicks on it)
isTouch();
progressBar.addEventListener(events[deviceType].click, (event) => {
    // Start of progress bar
    let start = progressBar.getBoundingClientRect().left;

    // Click position
    let end = !isTouch() ? event.clientX : event.touches[0].clientX;
    let progress = (end - start) / progressBar.offsetWidth;

    // Set width
    currentProgress.style.width = progress * 100 + "%";

    // Set time
    audio.currentTime = progress * audio.duration;

    // Play
    audio.play();
    pauseBtn.classList.remove("hide");
    playBtn.classList.add("hide");
});

// Update progress bar
setInterval(() => {
    currentTime.innerHTML = timeFormat(audio.currentTime);
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
})

// Update time
audio.addEventListener("timeupdate", () => {
    currentTime.innerText = timeFormat(audio.currentTime);
});


// Playlist is created
const initializePlaylist = () => {
    for (let i in songsArray) {
        playlistSongs.innerHTML += `<li class='playlistSong' onclick='setSong(${i}), playSong(${i})'>
            <div class="playlist-image-container">
                <img src="${songsArray[i].image}">
            </div>
            <div class="playlist-song-details">
                <span id="playlist-song-name">
                    ${songsArray[i].name}
                </span>
                <span id="playlist-song-artist-album">
                    ${songsArray[i].artist}
                </span>
            </div>
        </li>`;
    }
};

// Show playlist
playlistBtn.addEventListener("click", () => {
    playlistContainer.classList.remove("hide");
});

// Hide playlist
closeBtn.addEventListener("click", () => {
    playlistContainer.classList.add("hide");
});

window.onload = () => {
    index = 0;  // Load first song
    setSong(index);

    // Create playlist
    initializePlaylist();
};