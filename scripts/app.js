const movies = [
    {
        id: 1,
        title: "Interstellar Odyssey",
        year: 2025,
        genre: "Sci-Fi",
        rating: 8.9,
        duration: "2h 28m",
        cast: "Aarav Mehta, Elena Vance, Kenji Sato",
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        overview: "When Earth's deep-space relay goes silent, a small crew pilots an experimental vessel beyond the outer rim to uncover what happened to humanity's first colony."
    },
    {
        id: 2,
        title: "Midnight in Mumbai",
        year: 2026,
        genre: "Thriller",
        rating: 8.4,
        duration: "2h 06m",
        cast: "Rohan Kapoor, Tara Deshmukh, Devansh Rao",
        poster: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
        overview: "During a monsoon blackout, an investigative journalist receives a burner phone with clues linking a high-profile disappearance to the city's oldest dockyard."
    },
    {
        id: 3,
        title: "Crimson Protocol",
        year: 2024,
        genre: "Action",
        rating: 8.1,
        duration: "2h 14m",
        cast: "Marcus Cole, Nisha Verma, Liam O'Connor",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600&q=80",
        overview: "A retired extraction specialist is pulled back into active duty when an encrypted satellite key falls into the hands of a rogue syndicate."
    },
    {
        id: 4,
        title: "The Last Monsoons",
        year: 2025,
        genre: "Drama",
        rating: 8.7,
        duration: "1h 58m",
        cast: "Meera Nair, Siddharth Menon, Kavita Joshi",
        poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
        overview: "Three estranged siblings return to their coastal tea estate in Kerala to settle an inheritance, confronting decades of unspoken family history."
    },
    {
        id: 5,
        title: "Neon Horizon",
        year: 2026,
        genre: "Sci-Fi",
        rating: 8.5,
        duration: "2h 19m",
        cast: "Zoya Khan, Noah Sterling, Hana Lin",
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        overview: "In a vertical megacity powered by synthetic memories, a memory restorer discovers a hidden file that could rewrite the city's founding."
    },
    {
        id: 6,
        title: "Wedding Crashers Express",
        year: 2024,
        genre: "Comedy",
        rating: 7.8,
        duration: "1h 52m",
        cast: "Kabir Gill, Ananya Roy, Varun Sethi",
        poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
        overview: "Two best friends accidentally board the wrong destination-wedding train and must pretend to be the groom's distant cousins for an entire weekend."
    },
    {
        id: 7,
        title: "Shadow District",
        year: 2025,
        genre: "Action",
        rating: 8.2,
        duration: "2h 09m",
        cast: "Vikram Rathore, Chloe Park, Idris Bello",
        poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80",
        overview: "An undercover detective has twelve hours to escort a key witness across a locked-down industrial district before dawn."
    },
    {
        id: 8,
        title: "Glass Alibi",
        year: 2026,
        genre: "Thriller",
        rating: 8.6,
        duration: "2h 02m",
        cast: "Priya Sen, Daniel Brooks, Arjun Malhotra",
        poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
        overview: "A defense architect realizes the smart-home security footage clearing her client was subtly altered frame by frame."
    }
];

let watchlist = JSON.parse(localStorage.getItem("cinepulse_watchlist")) || [];
let activeGenre = "all";
let searchTerm = "";

// DOM References
const movieGrid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const sectionTitle = document.getElementById("section-title");

const watchlistToggle = document.getElementById("watchlist-toggle");
const watchlistDrawer = document.getElementById("watchlist-drawer");
const closeDrawerBtn = document.getElementById("close-drawer");
const overlay = document.getElementById("overlay");
const watchlistItems = document.getElementById("watchlist-items");
const watchlistCount = document.getElementById("watchlist-count");

const movieModal = document.getElementById("movie-modal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.getElementById("close-modal");

// Save Watchlist
function saveWatchlist() {
    localStorage.setItem("cinepulse_watchlist", JSON.stringify(watchlist));
    renderWatchlist();
    renderMovies();
    updateHeroWatchlistBtn();
}

function isSaved(id) {
    return watchlist.includes(id);
}

function toggleWatchlist(id) {
    if (isSaved(id)) {
        watchlist = watchlist.filter(item => item !== id);
    } else {
        watchlist.push(id);
    }
    saveWatchlist();
}

// Render Movie Cards
function renderMovies() {
    const query = searchTerm.trim().toLowerCase();
    const filtered = movies.filter(movie => {
        const matchesGenre = activeGenre === "all" || movie.genre === activeGenre;
        const matchesSearch =
            movie.title.toLowerCase().includes(query) ||
            movie.cast.toLowerCase().includes(query) ||
            String(movie.year).includes(query);
        return matchesGenre && matchesSearch;
    });

    sectionTitle.textContent = activeGenre === "all" ? "Trending Movies" : `${activeGenre} Movies`;

    if (filtered.length === 0) {
        movieGrid.innerHTML = `<p style="grid-column: 1 / -1; color: var(--muted); text-align: center; padding: 2rem 0;">No movies matched your search.</p>`;
        return;
    }

    movieGrid.innerHTML = filtered.map(movie => {
        const saved = isSaved(movie.id);
        return `
            <article class="movie-card">
                <div class="poster-wrap" onclick="openMovieModal(${movie.id})">
                    <img src="${movie.poster}" alt="${movie.title}" loading="lazy" />
                    <span class="rating-chip">&#9733; ${movie.rating}</span>
                </div>
                <div class="card-body">
                    <span class="card-genre">${movie.genre}</span>
                    <h3 class="card-title" onclick="openMovieModal(${movie.id})">${movie.title}</h3>
                    <span class="card-year">${movie.year} &bull; ${movie.duration}</span>
                    <div class="card-actions">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="openMovieModal(${movie.id})">
                            Details
                        </button>
                        <button type="button" class="btn ${saved ? "btn-saved" : "btn-primary"} btn-sm" onclick="toggleWatchlist(${movie.id})">
                            <i class="fas ${saved ? "fa-check" : "fa-plus"}"></i> ${saved ? "Saved" : "Watchlist"}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

// Render Watchlist Sidebar
function renderWatchlist() {
    watchlistCount.textContent = watchlist.length;
    const savedMovies = movies.filter(m => watchlist.includes(m.id));

    if (savedMovies.length === 0) {
        watchlistItems.innerHTML = `<p style="color: var(--muted); text-align: center; margin-top: 2rem;">Your watchlist is empty. Add movies to watch later!</p>`;
        return;
    }

    watchlistItems.innerHTML = savedMovies.map(movie => `
        <div class="saved-item">
            <img src="${movie.poster}" alt="${movie.title}" />
            <div class="saved-info">
                <h4>${movie.title}</h4>
                <p>${movie.year} &bull; ${movie.genre} &bull; &#9733; ${movie.rating}</p>
            </div>
            <button type="button" class="remove-item" onclick="toggleWatchlist(${movie.id})" aria-label="Remove ${movie.title}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join("");
}

// Movie Details Modal
function openMovieModal(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;
    const saved = isSaved(movie.id);

    modalBody.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" class="modal-poster" />
        <div class="modal-details">
            <span class="card-genre">${movie.genre}</span>
            <h2 id="modal-title">${movie.title}</h2>
            <p class="modal-meta">${movie.year} &bull; ${movie.duration} &bull; &#9733; ${movie.rating}/10</p>
            <p class="modal-overview">${movie.overview}</p>
            <p class="modal-cast"><strong>Cast:</strong> ${movie.cast}</p>
            <button type="button" class="btn ${saved ? "btn-saved" : "btn-primary"}" onclick="toggleWatchlist(${movie.id}); openMovieModal(${movie.id});">
                <i class="fas ${saved ? "fa-check" : "fa-bookmark"}"></i>
                ${saved ? "Saved in Watchlist" : "Add to Watchlist"}
            </button>
        </div>
    `;
    movieModal.classList.add("open");
}

function closeMovieModal() {
    movieModal.classList.remove("open");
}

// Hero Featured Movie Buttons
const heroDetailsBtn = document.getElementById("hero-details-btn");
const heroWatchlistBtn = document.getElementById("hero-watchlist-btn");

function updateHeroWatchlistBtn() {
    const saved = isSaved(1);
    heroWatchlistBtn.innerHTML = saved
        ? `<i class="fas fa-check"></i> Saved in Watchlist`
        : `<i class="fas fa-plus"></i> Add to Watchlist`;
}

heroDetailsBtn.addEventListener("click", () => openMovieModal(1));
heroWatchlistBtn.addEventListener("click", () => toggleWatchlist(1));

// Search & Genre Filter Events
searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderMovies();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeGenre = btn.dataset.genre;
        renderMovies();
    });
});

// Drawer & Modal Controls
function openDrawer() {
    watchlistDrawer.classList.add("open");
    overlay.classList.add("open");
}

function closeDrawer() {
    watchlistDrawer.classList.remove("open");
    overlay.classList.remove("open");
}

watchlistToggle.addEventListener("click", openDrawer);
closeDrawerBtn.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
closeModalBtn.addEventListener("click", closeMovieModal);

movieModal.addEventListener("click", (e) => {
    if (e.target === movieModal) closeMovieModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMovieModal();
        closeDrawer();
    }
});

// Initialize
renderMovies();
renderWatchlist();
updateHeroWatchlistBtn();