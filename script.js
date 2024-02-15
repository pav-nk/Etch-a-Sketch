console.log('Etch-a-Sketch');

const mainNode = document.querySelector('.main');
const fieldNode = mainNode.querySelector('.field');
const modalNode = document.querySelector('.modal')
const gridSizeSelect = modalNode.querySelector('#grid-size-select');

// buttons

const clearButton = document.querySelector('#clear-btn');
const toggleGridButton = document.querySelector('#toggle-grid-btn');
const changeGridSizeButton = document.querySelector('#change-grid-size-btn');
const modalCloseButton = document.querySelector('.close-button');
const colorPicker = document.querySelector('#color-picker');
const selectTextNode = document.querySelector('.select-value');
const RGBModeButtonActive = document.querySelector('#active-rgb-mode-btn');

let cellNodes = null;

const state = {
    rgbMode: false,
    minSize: 10,
    maxSize: 50,
    fieldSize: 10,
    stepCount: 5,
    currentBrushColor: '#0B0C10',
    isBrushActive: false,
    defaultCellBorderColor: '#0B0C10',
    defaultCellColor: '#ffffff',
    isBorderedGrid: false,
};

const generateRandomColor = (min = 0, max = 256) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const generateColorValue = () => Math.floor(Math.random() * (max - min) + min);
    return `rgb(${generateColorValue()}, ${generateColorValue()}, ${generateColorValue()})`
};

const activeBrush = (event) => {
    const { target } = event;
    if (target.classList.contains('cell') && target.style.backgroundColor !== state.currentBrushColor) {
        if (!state.rgbMode) {
            target.style.backgroundColor = state.currentBrushColor;
        } else {
            target.style.backgroundColor = generateRandomColor();
        }
    }
};

const runApp = () => {
    const { fieldSize } = state;
    renderField(fieldSize);
    addListeners();
};

const createListOfNodes = (size, className) => {
    return [...Array(size).keys()].map(el => {
        const node = document.createElement('div');
        node.classList.add(className);
        return node;
    })
};

const removeField = () => {
    fieldNode.innerHTML = '';
};

const renderField = (size) => {
    const listOfRows = createListOfNodes(size, 'row');
    listOfRows.forEach(rowNode => {
        createListOfNodes(size, 'cell').forEach(node => {
            const cellSize = Math.floor((100 / Math.sqrt(size)));
            node.style.cssText = `width: ${cellSize}px; height: ${cellSize}px;`;
            rowNode.append(node);
        });
    });
    listOfRows.forEach((node) => fieldNode.append(node));
    cellNodes = fieldNode.querySelectorAll('.cell');
};

const changeFieldSize = (value) => {
    state.fieldSize = value;
    renderField(value);
}

const selectFieldSize = (event) => {
    const { value } = event.target;
    selectTextNode.textContent = value;
    state.fieldSize = +value;
    gridSizeSelect.removeEventListener("change", selectFieldSize);
};

const closeModal = () => {
    modalNode.classList.add('visually-hidden');
    modalCloseButton.removeEventListener('click', closeModal);
    removeField();
    renderField(state.fieldSize);
};

const addListeners = () => {
    fieldNode.addEventListener('click', (event) => {
        const { isBrushActive } = state;
        state.isBrushActive = !isBrushActive;

        if (state.isBrushActive) {
            fieldNode.addEventListener('mouseover', activeBrush);
        } else {
            fieldNode.removeEventListener('mouseover', activeBrush);
        }
    });

    clearButton.addEventListener('click', (event) => {
        state.isBrushActive = false;
        cellNodes.forEach((cell) => {
            cell.style.backgroundColor = state.defaultCellColor;
        });
    });

    toggleGridButton.addEventListener('click', (event) => {
        state.isBrushActive = false;
        const { isBorderedGrid } = state;
        state.isBorderedGrid = !isBorderedGrid;
        cellNodes.forEach((cell) => {
            cell.style.borderColor = state.isBorderedGrid ? state.defaultCellBorderColor : 'transparent';
        });
    });

    RGBModeButtonActive.addEventListener('click', function (event) {
        const { rgbMode } = state;
        state.rgbMode = !rgbMode;
    });

    colorPicker.addEventListener("change", (event) => {
        const { value } = event.target;
        state.currentBrushColor = value;
        state.rgbMode = false;
    }, false);

    changeGridSizeButton.addEventListener('click', (event) => {
        modalNode.classList.toggle('visually-hidden');
        modalCloseButton.addEventListener('click', closeModal);
        gridSizeSelect.addEventListener("change", selectFieldSize);
    });
};

runApp();