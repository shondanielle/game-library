document.addEventListener('DOMContentLoaded', () => {
    const popularGamesList = document.getElementById('popular-games');
    const searchInput = document.getElementById('search');
    const gameDetailsSection = document.getElementById('game-details');
    const gameTitle = document.getElementById('game-title');
    const gameImage = document.getElementById('game-image');
    const gameDescription = document.getElementById('game-description');
    const gameInfo = document.getElementById('game-info');
    const backButton = document.getElementById('back-button');
    const homeSection = document.getElementById('home');
    const singlePageSection = document.getElementById('single-page');
    const singlePageTitle = document.getElementById('single-page-title');
    const singlePageGamesList = document.getElementById('single-page-games');
    const paginationControls = document.getElementById('pagination-controls');
    const developersSection = document.getElementById('developers');
    const developersList = document.getElementById('developers-list');
    const paginationControlsPopular = document.getElementById('pagination-controls-popular');
    const paginationControlsDevelopers = document.getElementById('pagination-controls-developers');

    const API_KEY = '9dcb038633f848329b0a72aab0441c1f';
    const API_URL = 'https://api.rawg.io/api';
    let currentPage = 1;
    let currentGenre = '';
    let currentSearch = '';

    // Navigation links
    document.getElementById('home-link').addEventListener('click', () => {
        showSection(homeSection);
    });

    document.getElementById('popular-link').addEventListener('click', () => {
        fetchPopularGames(1);
    });

    document.getElementById('top-link').addEventListener('click', () => {
        fetchTopGames(1);
    });

    document.getElementById('developers-link').addEventListener('click', () => {
        fetchDevelopers(1);
    });

    document.getElementById('genres-link').addEventListener('click', () => {
        fetchGenres();
    });

         // Fetch popular games with pagination
    function fetchPopularGames(page) {
        fetch(`${API_URL}/games/lists/popular?key=${API_KEY}&page_size=30&page=${page}`)
            .then(response => response.json())
            .then(data => {
                displayGames(data.results, popularGamesList);
                setupPaginationControls(data.count, 'popular-games', page, paginationControlsPopular);
                showSection(homeSection);
            });
    }

    // Fetch top games with pagination
    function fetchTopGames(page) {
        fetch(`${API_URL}/games?key=${API_KEY}&ordering=-rating&page_size=30&page=${page}`)
            .then(response => response.json())
            .then(data => {
                displayGames(data.results, singlePageGamesList);
                singlePageTitle.textContent = 'Top Games';
                setupPaginationControls(data.count, 'top-games', page, paginationControls);
                showSection(singlePageSection);
            });
    }

    // Fetch developers with pagination
    function fetchDevelopers(page) {
        fetch(`${API_URL}/developers?key=${API_KEY}&ordering=-games_count&page_size=30&page=${page}`)
            .then(response => response.json())
            .then(data => {
                displayDevelopers(data.results, developersList);
                setupPaginationControls(data.count, 'developers', page, paginationControlsDevelopers);
                showSection(developersSection);
            });
    }

    // Fetch genres and display them
    function fetchGenres() {
        fetch(`${API_URL}/genres?key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                singlePageTitle.textContent = 'Genres';
                singlePageGamesList.innerHTML = '';
                data.results.forEach(genre => {
                    const li = document.createElement('li');
                    const title = document.createElement('h3');
                    title.textContent = genre.name;
                    const img = document.createElement('img');
                    img.src = genre.image_background || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png";
                    img.alt = genre.name;
                    li.appendChild(img);
                    li.appendChild(title);
                    li.addEventListener('click', () => fetchGamesByGenre(genre.slug, 1));
                    singlePageGamesList.appendChild(li);
                });
                showSection(singlePageSection);
            });
    }

    // Fetch games by genre with pagination
    function fetchGamesByGenre(genre, page) {
        currentGenre = genre;
        fetch(`${API_URL}/games?key=${API_KEY}&genres=${genre}&ordering=-added&page_size=30&page=${page}`)
            .then(response => response.json())
            .then(data => {
                singlePageTitle.textContent = `Genre: ${genre}`;
                displayGames(data.results, singlePageGamesList);
                setupPaginationControls(data.count, `genre-${genre}`, page, paginationControls);
                showSection(singlePageSection);
            });
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        if (query.length > 2) { // Fetch only if query length is greater than 2
            currentSearch = query;
            fetchGamesBySearch(query, 1);
        }
    });

    // Fetch games by search with pagination
    function fetchGamesBySearch(query, page) {
        fetch(`${API_URL}/games?key=${API_KEY}&search=${query}&page_size=30&page=${page}`)
            .then(response => response.json())
            .then(data => {
                singlePageTitle.textContent = `Search Results: ${query}`;
                displayGames(data.results, singlePageGamesList);
                setupPaginationControls(data.count, query, page, paginationControls);
                showSection(singlePageSection);
            });
    }
    // Display games
    function displayGames(games, element) {
        element.innerHTML = '';
        games.forEach(game => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            const title = document.createElement('h3');
            img.src = game.background_image || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png";
            img.alt = game.name;
            title.textContent = game.name;
            li.appendChild(img);
            li.appendChild(title);
            li.addEventListener('click', () => displayGameDetails(game));
            element.appendChild(li);
        });
    }

    // Display game details
    function displayGameDetails(game) {
        fetch(`${API_URL}/games/${game.id}?key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                gameTitle.textContent = data.name;
                gameImage.src = data.background_image || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png";
                gameDescription.textContent = data.description_raw;
                gameInfo.innerHTML = `
                    <li>Release Date: ${data.released}</li>
                    <li>Rating: ${data.rating}</li>
                    <li>Platforms: ${data.platforms.map(p => p.platform.name).join(', ')}</li>
                    <li>Genres: ${data.genres.map(g => g.name).join(', ')}</li>
                `;
                showSection(gameDetailsSection);
            });
    }

    // Display developers
function displayDevelopers(developers, element) {
        element.innerHTML = '';
        developers.forEach(developer => {
            const li = document.createElement('li');
            const title = document.createElement('h3');
            title.textContent = developer.name;
            const img = document.createElement('img');
            img.src = developer.image_background || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png";
            li.appendChild(img);
            li.appendChild(title);
            li.addEventListener('click', () => fetchGamesByDeveloper(developer.id, 1));
            element.appendChild(li);
        });
    }

    // Fetch games by developer with pagination
    function fetchGamesByDeveloper(developerId, page) {
        fetch(`${API_URL}/games?key=${API_KEY}&developers=${developerId}&ordering=-added&page_size=30&page=${page}`)
            .then(response => response.json())
            .then(data => {
                singlePageTitle.textContent = `Developer: ${developerId}`;
                displayGames(data.results, singlePageGamesList);
                setupPaginationControls(data.count, `developer-${developerId}`, page, paginationControls);
                showSection(singlePageSection);
            });
    }

    // Show a section and hide others
    function showSection(section) {
        homeSection.classList.add('hidden');
        singlePageSection.classList.add('hidden');
        gameDetailsSection.classList.add('hidden');
        developersSection.classList.add('hidden');
        section.classList.remove('hidden');
    }

    // Setup pagination controls
    function setupPaginationControls(totalResults, type, currentPage, paginationElement) {
        const totalPages = Math.ceil(totalResults / 30);
        paginationElement.innerHTML = '';

        let startPage, endPage;
        if (totalPages <= 12) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 12;
            } else if (currentPage + 5 >= totalPages) {
                startPage = totalPages - 11;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 6;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('page-button');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                if (type === 'popular-games') {
                    fetchPopularGames(i);
                } else if (type === 'top-games') {
                    fetchTopGames(i);
                } else if (type === 'developers') {
                    fetchDevelopers(i);
                } else if (type.startsWith('genre-')) {
                    fetchGamesByGenre(type.split('-')[1], i);
                } else if (type.startsWith('developer-')) {
                    fetchGamesByDeveloper(type.split('-')[1], i);
                } else {
                    fetchGamesBySearch(type, i);
                }
            });
            paginationElement.appendChild(button);
        }

        if (currentPage + 20 <= totalPages) {
            const extraPageButton = document.createElement('button');
            extraPageButton.textContent = currentPage + 20;
            extraPageButton.classList.add('page-button');
            extraPageButton.addEventListener('click', () => {
                if (type === 'popular-games') {
                    fetchPopularGames(currentPage + 20);
                } else if (type === 'top-games') {
                    fetchTopGames(currentPage + 20);
                } else if (type === 'developers') {
                    fetchDevelopers(currentPage + 20);
                } else if (type.startsWith('genre-')) {
                    fetchGamesByGenre(type.split('-')[1], currentPage + 20);
                } else if (type.startsWith('developer-')) {
                    fetchGamesByDeveloper(type.split('-')[1], currentPage + 20);
                } else {
                    fetchGamesBySearch(type, currentPage + 20);
                }
            });
            paginationElement.appendChild(extraPageButton);
        }
    }

    // Back button functionality
    backButton.addEventListener('click', () => {
        showSection(singlePageSection);
    });

    // WebSocket setup
    const socket = new WebSocket('ws://localhost:8080');
    socket.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Handle real-time updates
            fetchPopularGames(1);
        }
    });

    
});
