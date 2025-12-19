/*
	Interactive Grid Background
	Creates an interactive grid effect with flipping cells under the cursor
*/

(function() {
	'use strict';

	// Configuration
	let GRID_WIDTH = 80; // Largeur des cases en pixels
	let GRID_HEIGHT = 53; // Hauteur des cases en pixels
	let gridContainer = null;
	let cells = [];
	let activeCells = new Set();
	let animationFrame = null;

	// Fonction pour obtenir la taille de grille adaptée à l'écran
	function getGridSize() {
		if (window.innerWidth <= 736) {
			return { width: 40, height: 27 };
		}
		return { width: 80, height: 53 };
	}

	// Wait for DOM to be ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	function init() {
		createGrid();
		setupEventListeners();
	}

	function createGrid() {
		// Mettre à jour la taille de la grille selon l'écran
		const gridSize = getGridSize();
		GRID_WIDTH = gridSize.width;
		GRID_HEIGHT = gridSize.height;

		// Créer le container pour les cases
		gridContainer = document.createElement('div');
		gridContainer.id = 'grid-interactive';
		document.body.appendChild(gridContainer);

		// Calculer le nombre de cases nécessaires
		const viewportWidth = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0
		);
		const viewportHeight = Math.max(
			document.documentElement.clientHeight || 0,
			window.innerHeight || 0
		);

		const cols = Math.ceil(viewportWidth / GRID_WIDTH) + 2;
		const rows = Math.ceil(viewportHeight / GRID_HEIGHT) + 2;

		// Créer les cases
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const cell = document.createElement('div');
				cell.className = 'grid-cell';
				cell.style.left = (col * GRID_WIDTH) + 'px';
				cell.style.top = (row * GRID_HEIGHT) + 'px';
				cell.dataset.col = col;
				cell.dataset.row = row;
				gridContainer.appendChild(cell);
				cells.push(cell);
			}
		}
		
	}

	function setupEventListeners() {
		// Suivre le mouvement de la souris avec throttling pour performance
		let ticking = false;
		document.addEventListener('mousemove', function(e) {
			if (!ticking) {
				window.requestAnimationFrame(function() {
					handleMouseMove(e);
					ticking = false;
				});
				ticking = true;
			}
		});
		
		// Gérer la sortie de la fenêtre
		document.addEventListener('mouseleave', handleMouseLeave);
		
		// Support tactile pour mobile
		document.addEventListener('touchmove', handleTouchMove, { passive: true });
		
		// Gérer le redimensionnement de la fenêtre
		window.addEventListener('resize', handleResize);
	}

	function handleMouseMove(e) {
		updateCellsUnderCursor(e.clientX, e.clientY);
	}

	function handleTouchMove(e) {
		if (e.touches.length > 0) {
			const touch = e.touches[0];
			updateCellsUnderCursor(touch.clientX, touch.clientY);
		}
	}

	function handleMouseLeave() {
		// Retirer l'effet de toutes les cases
		activeCells.forEach(cell => {
			cell.classList.remove('flipped');
		});
		activeCells.clear();
	}

	function handleResize() {
		// Recréer la grille si nécessaire
		if (gridContainer) {
			gridContainer.remove();
			cells = [];
			activeCells.clear();
			createGrid();
		}
	}

	function updateCellsUnderCursor(x, y) {
		// Calculer quelle case est exactement sous le curseur (une seule case)
		const col = Math.floor(x / GRID_WIDTH);
		const row = Math.floor(y / GRID_HEIGHT);
		
		// Trouver la case exactement sous le curseur
		const cellUnderCursor = findCell(col, row);
		
		// Retirer l'effet de toutes les cases actives sauf celle sous le curseur
		activeCells.forEach(cell => {
			if (cell !== cellUnderCursor) {
				cell.classList.remove('flipped');
				activeCells.delete(cell);
			}
		});

		// Ajouter l'effet uniquement à la case sous le curseur si elle existe
		if (cellUnderCursor && !activeCells.has(cellUnderCursor)) {
			cellUnderCursor.classList.add('flipped');
			activeCells.add(cellUnderCursor);
		}
	}

	function findCell(col, row) {
		return cells.find(cell => {
			return parseInt(cell.dataset.col) === col && 
				   parseInt(cell.dataset.row) === row;
		});
	}
})();
