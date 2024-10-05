let size, puzzle, timer, moveCounter, time, moves, interval;

document.addEventListener("DOMContentLoaded", function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeToggle.checked = currentTheme === "dark";

    themeToggle.addEventListener("change", () => {
        const theme = themeToggle.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    });

    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Smooth scrolling for the "Learn More" button
    const learnMoreButton = document.querySelector('.cta-button');
    learnMoreButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Dropdown toggle for project details
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-target');
            const container = document.getElementById(projectId);
            container.classList.toggle('hidden');
        });
    });

    // Attach event listener for the play button, ensuring no puzzle opens on load
    document.getElementById('play-button').addEventListener('click', openSlidingPuzzle);

    // Scroll to Top Button
    document.getElementById('backToTop').addEventListener('click', scrollToTop);

    // Initialize stats in localStorage
    initStats();
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Open and close the sliding puzzle pop-up
function openSlidingPuzzle() {
    const popup = document.getElementById('popup');
    popup.style.display = 'flex'; // Ensure it's centered by using flex display
    popup.scrollIntoView({ behavior: 'smooth' }); // Ensure the pop-up scrolls into view smoothly
}

function closeSlidingPuzzle() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // Close the pop-up
    clearInterval(interval); // Stop the timer when the popup is closed
}

// Start the sliding puzzle game
function startGame() {
    size = parseInt(document.getElementById('size').value);
    puzzle = generatePuzzle(size);
    time = 0;
    moves = 0;
    updatePlayCount(size); // Track play count
    updateTimerDisplay();
    document.getElementById('moveCounter').textContent = moves;
    document.getElementById('congratulationsMessage').style.display = 'none';
    clearInterval(interval);
    interval = setInterval(() => {
        time++;
        updateTimerDisplay();
    }, 1000);
    renderPuzzle();
}

// Update the timer display
function updateTimerDisplay() {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
}

// Generate the puzzle tiles
function generatePuzzle(size) {
    const tiles = Array.from({ length: size * size }, (_, i) => i + 1);
    tiles[size * size - 1] = 0; // Blank tile
    do {
        shuffleArray(tiles);
    } while (!isSolvable(tiles) || isSolved(tiles));
    return tiles;
}

// Shuffle the puzzle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Check if the puzzle is solvable
function isSolvable(tiles) {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
                inversions++;
            }
        }
    }
    const blankRow = Math.floor(tiles.indexOf(0) / size);
    return (size % 2 === 1 && inversions % 2 === 0) || (size % 2 === 0 && (inversions + blankRow) % 2 === 1);
}

// Check if the puzzle is already solved
function isSolved(tiles) {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return true;
}

// Render the puzzle on the screen
function renderPuzzle() {
    const container = document.getElementById('puzzleContainer');
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.innerHTML = '';
    puzzle.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        if (tile === 0) {
            tileElement.style.visibility = 'hidden';
        } else {
            tileElement.textContent = tile;
            tileElement.addEventListener('click', () => moveTile(index));
        }
        if (tile === index + 1) {
            tileElement.classList.add('correct');
        }
        container.appendChild(tileElement);
    });
}

// Move the tile when clicked
function moveTile(index) {
    const blankIndex = puzzle.indexOf(0);
    const validMoves = [blankIndex - size, blankIndex + size];
    if (blankIndex % size !== 0) validMoves.push(blankIndex - 1);
    if (blankIndex % size !== size - 1) validMoves.push(blankIndex + 1);
    if (validMoves.includes(index)) {
        [puzzle[blankIndex], puzzle[index]] = [puzzle[index], puzzle[blankIndex]];
        moves++;
        document.getElementById('moveCounter').textContent = moves;
        renderPuzzle();
        checkWin();
    }
}

// Check if the player has won the game
function checkWin() {
    if (isSolved(puzzle)) {
        clearInterval(interval);
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.classList.add('finished'));
        document.getElementById('congratulationsMessage').style.display = 'block';
        updateBestStats(size, time, moves); // Track best time and moves
        displayLeaderboard(); // Show leaderboard
    }
}

// Initialize stats in localStorage
function initStats() {
    const sizes = [3, 4, 5, 6, 7];
    sizes.forEach(size => {
        if (!localStorage.getItem(`playCount-${size}`)) {
            localStorage.setItem(`playCount-${size}`, 0);
            localStorage.setItem(`bestTime-${size}`, Infinity);
            localStorage.setItem(`bestMoves-${size}`, Infinity);
        }
    });
}

// Update play count
function updatePlayCount(size) {
    let count = parseInt(localStorage.getItem(`playCount-${size}`)) || 0;
    count++;
    localStorage.setItem(`playCount-${size}`, count);
}

// Update best time and moves
function updateBestStats(size, time, moves) {
    let bestTime = parseInt(localStorage.getItem(`bestTime-${size}`)) || Infinity;
    let bestMoves = parseInt(localStorage.getItem(`bestMoves-${size}`)) || Infinity;

    if (time < bestTime) {
        localStorage.setItem(`bestTime-${size}`, time);
    }
    if (moves < bestMoves) {
        localStorage.setItem(`bestMoves-${size}`, moves);
    }
}

// Show stats on the leaderboard
function showStats(size) {
    let playCount = localStorage.getItem(`playCount-${size}`);
    let bestTime = localStorage.getItem(`bestTime-${size}`);
    let bestMoves = localStorage.getItem(`bestMoves-${size}`);

    return `Size: ${size}x${size}, Plays: ${playCount}, Best Time: ${bestTime === 'Infinity' ? 'N/A' : bestTime} sec, Best Moves: ${bestMoves === 'Infinity' ? 'N/A' : bestMoves}`;
}

function displayLeaderboard() {
    const leaderboard = document.getElementById('leaderboard-list');
    leaderboard.innerHTML = ''; // Clear existing leaderboard

    [3, 4, 5, 6, 7].forEach(size => {
        const row = document.createElement('tr');

        let playCount = localStorage.getItem(`playCount-${size}`) || 0;
        let bestTime = localStorage.getItem(`bestTime-${size}`) === 'Infinity' ? 'N/A' : localStorage.getItem(`bestTime-${size}`);
        let bestMoves = localStorage.getItem(`bestMoves-${size}`) === 'Infinity' ? 'N/A' : localStorage.getItem(`bestMoves-${size}`);

        if (!playCount) playCount = 0;
        if (!bestTime) bestTime = 'N/A';
        if (!bestMoves) bestMoves = 'N/A';

        row.innerHTML = `
            <td>${size}x${size}</td>
            <td>${playCount}</td>
            <td>${bestTime}</td>
            <td>${bestMoves}</td>
        `;
        leaderboard.appendChild(row);
    });
}

// Call this on initialization to ensure the table shows "N/A" for empty values
initStats();
displayLeaderboard();

}
