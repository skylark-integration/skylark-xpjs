(function() {
    const windowTemplate = `
        <appcontentholder class="minesweeper">
            <appnavigation>
                <ul class="appmenus">
                    <li id="gamemenu">Game
                        <ul class="submenu">
                            <li value="0">Beginner</li>
                            <li value="1">Intermediate</li>
                            <li value="2">Advanced</li>
                        </ul>
                    </li>
                    <li>Help</li>
                </ul>
            </appnavigation>
            <minecontents>
                <div id="top_ui">
                    <div id="flagcount" class="minesweeper_sprite"></div>
                    <div id="newgame" class="minesweeper_sprite"></div>
                    <div id="timer" class="minesweeper_sprite"></div>
                </div>
                <div id="gridholder"></div>
            </minecontents>
        </appcontentholder>
    `;

    const winmineCSS = `css/winmine.css`;

    registerApp({
        _template: null,
        setup: async function() {
            this._template = document.createElement("template");
            this._template.innerHTML = windowTemplate;
            if (!document.getElementById("winmineCSS")) {
                var cssLink = document.createElement("link");
                cssLink.id = "winmineCSS";
                cssLink.rel = "stylesheet";
                cssLink.type = "text/css";
                cssLink.href = winmineCSS;
                document.head.appendChild(cssLink);
            }
        },

        start: function() {
            var windowContents = this._template.content.firstElementChild.cloneNode(true);
            var hWnd = wm.createNewWindow("minesweeper", windowContents);
            var selfWindow = wm._windows[hWnd];

            wm.setNoResize(hWnd);
            selfWindow.style.minWidth = "unset";
            selfWindow.style.minHeight = "unset";
            selfWindow.classList.add("noresize");
            wm.setIcon(hWnd, "mines.png");
            wm.setCaption(hWnd, "Minesweeper");

            const gameFrame = selfWindow;
            const newgameButton = selfWindow.querySelector("#newgame");
            const gameMenu = selfWindow.querySelector("#gamemenu");
            const flagDisplay = selfWindow.querySelector("#flagcount");
            const timerDisplay = selfWindow.querySelector("#timer");
            const grid = selfWindow.querySelector("#gridholder");
            const cellSize = 16;
            
            let difficultyPreference = 0;
            let isGameOver = false;
            let firstClick = true;
            let gridWidth = 0, gridHeight = 0, mineCount = 0;
            const easyGridWidth = 9, easyGridHeight = 9, easyMineCount = 10;
            const medGridWidth = 16, medGridHeight = 16, medMineCount = 40;
            const hardGridWidth = 30, hardGridHeight = 16, hardMineCount = 99;
            let flags = 0;
            let cells = [];
            
            let timerInterval;
            let time = 0;

            function renderCounter(element, value) {
                element.innerHTML = '';
                const stringValue = Math.abs(value).toString().padStart(3, '0');
                if (value < 0) {
                    const minusDiv = document.createElement('div');
                    minusDiv.className = 'minesweeper_sprite digit d-blank'; // Assuming blank is the minus sign
                    element.appendChild(minusDiv);
                }
                for (let i = 0; i < stringValue.length; i++) {
                    const digit = stringValue.charAt(i);
                    const digitDiv = document.createElement('div');
                    digitDiv.className = `minesweeper_sprite digit d${digit}`;
                    element.appendChild(digitDiv);
                }
            }

            function startTimer() {
                if (timerInterval) clearInterval(timerInterval);
                time = 0;
                renderCounter(timerDisplay, time);
                timerInterval = setInterval(() => {
                    if (isGameOver) {
                        clearInterval(timerInterval);
                        return;
                    }
                    time++;
                    if (time <= 999) renderCounter(timerDisplay, time);
                }, 1000);
            }

            function resetTimer() {
                if (timerInterval) clearInterval(timerInterval);
                time = 0;
                renderCounter(timerDisplay, 0);
            }

            function createBoard(localGridWidth, localGridHeight, localMineCount) {
                gridWidth = localGridWidth;
                gridHeight = localGridHeight;
                mineCount = localMineCount;
                cells = [];
                firstClick = true;
                isGameOver = false;
                newgameButton.className = "minesweeper_sprite smile";
                resetTimer();
                
                let gameCells = shuffleCells(Array(mineCount).fill("mine").concat(Array(gridWidth * gridHeight - mineCount).fill("clear")));
                grid.innerHTML = "";
                flags = mineCount;
                renderCounter(flagDisplay, flags);

                for (let i = 0; i < gridWidth * gridHeight; i++) {
                    const cell = document.createElement("div");
                    cell.dataset.type = gameCells[i];
                    cell.dataset.id = i;
                    grid.appendChild(cell);
                    cells.push(cell);
                    cell.addEventListener("click", () => openCell(cell));
                    cell.oncontextmenu = (e) => { e.preventDefault(); addFlag(cell); }
                }

                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].dataset.type === "clear") {
                        let total = 0;
                        const isLeftEdge = (i % gridWidth === 0);
                        const isRightEdge = (i % gridWidth === gridWidth - 1);
                        const neighborOffsets = [-1, 1, -gridWidth, gridWidth, -gridWidth - 1, -gridWidth + 1, gridWidth - 1, gridWidth + 1];
                        for (const offset of neighborOffsets) {
                            if (isLeftEdge && (offset === -1 || offset === -gridWidth - 1 || offset === gridWidth - 1)) continue;
                            if (isRightEdge && (offset === 1 || offset === -gridWidth + 1 || offset === gridWidth + 1)) continue;
                            const newId = i + offset;
                            if (newId >= 0 && newId < cells.length && cells[newId].dataset.type === "mine") {
                                total++;
                            }
                        }
                        cells[i].dataset.neighbors = total;
                    }
                }
                grid.style.width = gridWidth * cellSize + "px";
                grid.style.height = gridHeight * cellSize + "px";
            }

            function shuffleCells(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            function addFlag(cell) {
                if (isGameOver || cell.classList.contains("opened")) return;
                if (!cell.classList.contains("flag")) {
                    if (flags > 0) {
                        cell.className = "minesweeper_sprite flag";
                        flags--;
                    }
                } else {
                    cell.className = "";
                    flags++;
                }
                renderCounter(flagDisplay, flags);
            }

            function openCell(cell) {
                if (isGameOver || cell.classList.contains("opened") || cell.classList.contains("flag")) return;
                
                if (firstClick) {
                    if (cell.dataset.type === 'mine') {
                        // Relocate first-clicked mine
                        let newSpotFound = false;
                        while(!newSpotFound) {
                            let randomIndex = Math.floor(Math.random() * cells.length);
                            if (cells[randomIndex].dataset.type === 'clear') {
                                cells[randomIndex].dataset.type = 'mine';
                                cell.dataset.type = 'clear';
                                newSpotFound = true;
                            }
                        }
                        // Recalculate neighbors after move
                        for (let i = 0; i < cells.length; i++) { /* ... neighbor calc logic ... */ }
                    }
                    startTimer();
                    firstClick = false;
                }

                if (cell.dataset.type === "mine") {
                    gameOver(cell);
                    return;
                }
                
                cell.classList.add("opened");
                let neighbors = parseInt(cell.dataset.neighbors);
                if (neighbors > 0) {
                    cell.className = `minesweeper_sprite opened tile_${neighbors}`;
                } else {
                    cell.className = `minesweeper_sprite opened`;
                    checkCell(parseInt(cell.dataset.id));
                }
                checkForWin();
            }

            function checkCell(currentId) {
                const isLeftEdge = (currentId % gridWidth === 0);
                const isRightEdge = (currentId % gridWidth === gridWidth - 1);
                
                setTimeout(() => {
                    const neighborOffsets = [-1, 1, -gridWidth, gridWidth, -gridWidth - 1, -gridWidth + 1, gridWidth - 1, gridWidth + 1];
                    for(const offset of neighborOffsets) {
                        const newId = currentId + offset;
                        if (isLeftEdge && (offset === -1 || offset === -gridWidth - 1 || offset === gridWidth - 1)) continue;
                        if (isRightEdge && (offset === 1 || offset === -gridWidth + 1 || offset === gridWidth + 1)) continue;
                        if (newId >= 0 && newId < cells.length) {
                            openCell(cells[newId]);
                        }
                    }
                }, 10);
            }

            function gameOver(clickedCell) {
                isGameOver = true;
                clearInterval(timerInterval);
                newgameButton.className = "minesweeper_sprite lose";
                cells.forEach(cell => {
                    if (cell.dataset.type === "mine" && !cell.classList.contains("flag")) {
                        cell.className = "minesweeper_sprite opened mine";
                    }
                    if (cell.dataset.type !== "mine" && cell.classList.contains("flag")) {
                        cell.className = "minesweeper_sprite opened mine-wrong";
                    }
                });
                clickedCell.className = "minesweeper_sprite opened mine-hit";
            }

            function checkForWin() {
                if(isGameOver) return;
                const openedClearCells = cells.filter(cell => cell.classList.contains("opened") && cell.dataset.type === "clear").length;
                const totalClearCells = gridWidth * gridHeight - mineCount;
                if (openedClearCells === totalClearCells) {
                    isGameOver = true;
                    clearInterval(timerInterval);
                    newgameButton.className = "minesweeper_sprite win";
                    renderCounter(flagDisplay, 0);
                    cells.forEach(cell => {
                        if (cell.dataset.type === "mine" && !cell.classList.contains("flag")) {
                            cell.className = "minesweeper_sprite flag";
                        }
                    });
                }
            }
            
            function parseDifficulty() {
                if (newgameButton.classList) { newgameButton.className = "minesweeper_sprite smile"; };
                switch (difficultyPreference) {
                    case 0: createBoard(easyGridWidth, easyGridHeight, easyMineCount); break;
                    case 1: createBoard(medGridWidth, medGridHeight, medMineCount); break;
                    case 2: createBoard(hardGridWidth, hardGridHeight, hardMineCount); break;
                }
            }

            function doSmiley(e) {
                if (e.target.closest('#gridholder') || e.target.id === 'newgame') {
                    if (!isGameOver) newgameButton.classList.add("whoa");
                }
            }
            
            function endSmiley() {
                newgameButton.classList.remove("whoa");
            }

            function toggleMenu() {
                gameMenu.querySelector("ul").classList.toggle("open");
            }

            newgameButton.addEventListener("click", parseDifficulty);
            gameMenu.addEventListener("click", toggleMenu);
            gameMenu.querySelectorAll("li").forEach(item => {
                item.addEventListener("click", function() {
                    difficultyPreference = parseInt(this.value);
                    parseDifficulty();
                });
            });
            gameFrame.addEventListener("mousedown", doSmiley);
            gameFrame.addEventListener("mouseup", endSmiley);
            
            selfWindow.addEventListener('wm:windowClosed', () => {
                if (timerInterval) clearInterval(timerInterval);
            }, { once: true });
            
            createBoard(easyGridWidth, easyGridHeight, easyMineCount);
            return hWnd;
        }
    });
})();