// Configuration
const categories = ['Backgrounds', 'Hair', 'Bodies', 'Eyes', 'Mouth', 'Tops', 'Socks-tights', 'Bottoms', 'Shoes', 'Features'];
const subCategories = {
    Eyes: ['eye-base', 'iris'],
    Features: ['brows', 'facial-hair', 'liner', 'peircing', 'scara'],
    Hair: ['bangs', 'base', 'shaved', 'sideburns'],
    Tops: ['dress', 'hoodie', 'shirt']
};
const accessories = ['bows', 'collars', 'glasses', 'gloves', 'hats', 'headphones', 'items', 'wings'];

// State
let currentCategory = 'Backgrounds';
let currentSubCategory = null;
let selectedOptions = {};
let selectedAccessories = {};

// DOM Elements
const characterPreview = document.getElementById('characterPreview');
const categoryButtons = document.getElementById('categoryButtons');
const subcategoryButtons = document.getElementById('subcategoryButtons');
const optionsCarousel = document.getElementById('optionsCarousel');
const accessoriesButtons = document.getElementById('accessoriesButtons');
const randomizeBtn = document.getElementById('randomizeBtn');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const printBtn = document.getElementById('printBtn');

// Functions
function init() {
    createCategoryButtons();
    createAccessoryButtons();
    setupEventListeners();
    selectCategory('Backgrounds'); // Start with Backgrounds category selected
}

function createCategoryButtons() {
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('category-button');
        button.addEventListener('click', () => selectCategory(category));
        categoryButtons.appendChild(button);
    });
}

function createSubcategoryButtons(category) {
    subcategoryButtons.innerHTML = '';
    if (subCategories[category]) {
        subCategories[category].forEach(subcategory => {
            const button = document.createElement('button');
            button.textContent = subcategory;
            button.classList.add('subcategory-button');
            button.addEventListener('click', () => selectSubcategory(category, subcategory));
            subcategoryButtons.appendChild(button);
        });
    }
}

function createAccessoryButtons() {
    accessories.forEach(accessory => {
        const button = document.createElement('button');
        button.textContent = accessory;
        button.classList.add('accessory-button');
        button.addEventListener('click', () => toggleAccessory(accessory));
        accessoriesButtons.appendChild(button);
    });
}

function selectCategory(category) {
    currentCategory = category;
    currentSubCategory = null;
    createSubcategoryButtons(category);
    updateOptionsCarousel();
    updateCharacterPreview();

    // Highlight the selected category button
    document.querySelectorAll('.category-button').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === category) {
            btn.classList.add('selected');
        }
    });
}

function selectSubcategory(category, subcategory) {
    currentCategory = category;
    currentSubCategory = subcategory;
    updateOptionsCarousel();
    updateCharacterPreview();
}

function updateOptionsCarousel() {
    optionsCarousel.innerHTML = '';
    const folderPath = currentSubCategory 
        ? `imgs/${currentCategory.toLowerCase()}/${currentSubCategory}/`
        : `imgs/${currentCategory.toLowerCase()}/`;
    
    fetch(folderPath)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const files = Array.from(htmlDoc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.endsWith('.png') || href.endsWith('.webp'));
            
            files.forEach(file => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                const img = document.createElement('img');
                img.src = file;
                img.alt = `${currentCategory} option`;
                button.appendChild(img);
                button.addEventListener('click', () => selectOption(currentCategory, file));
                optionsCarousel.appendChild(button);
            });
        })
        .catch(error => console.error('Error loading images:', error));
}

function selectOption(category, option) {
    if (currentSubCategory) {
        if (!selectedOptions[category]) selectedOptions[category] = {};
        selectedOptions[category][currentSubCategory] = option;
    } else {
        selectedOptions[category] = option;
    }
    updateCharacterPreview();
}

function toggleAccessory(accessory) {
    if (selectedAccessories[accessory]) {
        delete selectedAccessories[accessory];
    } else {
        const folderPath = `imgs/accessories/${accessory}/`;
        fetch(folderPath)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                const files = Array.from(htmlDoc.querySelectorAll('a'))
                    .map(a => a.href)
                    .filter(href => href.endsWith('.png'));
                if (files.length > 0) {
                    selectedAccessories[accessory] = files[0];
                    updateCharacterPreview();
                }
            })
            .catch(error => console.error('Error loading accessory images:', error));
    }
    updateCharacterPreview();
}

function updateCharacterPreview() {
    const ctx = characterPreview.getContext('2d');
    ctx.clearRect(0, 0, characterPreview.width, characterPreview.height);

    const layers = [...categories, ...accessories];
    let loadedImages = 0;
    const totalImages = layers.length;

    layers.forEach(layer => {
        let option;
        if (layer === currentCategory && currentSubCategory) {
            option = selectedOptions[layer]?.[currentSubCategory];
        } else {
            option = selectedOptions[layer] || selectedAccessories[layer];
        }
        if (option) {
            const img = new Image();
            img.onload = () => {
                if (layer === 'Backgrounds') {
                    ctx.drawImage(img, 0, 0, characterPreview.width, characterPreview.height);
                } else {
                    const scale = 0.6;
                    const scaledWidth = img.width * scale;
                    const scaledHeight = img.height * scale;
                    const x = 0;
                    const y = accessories.includes(layer) ? characterPreview.height - scaledHeight : 0;
                    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                }
                loadedImages++;
                if (loadedImages === totalImages) {
                    // All images have been loaded and drawn
                }
            };
            img.src = option;
        } else {
            loadedImages++;
        }
    });
}

function randomizeCharacter() {
    categories.forEach(category => {
        if (subCategories[category]) {
            subCategories[category].forEach(subcategory => {
                const folderPath = `imgs/${category.toLowerCase()}/${subcategory}/`;
                fetch(folderPath)
                    .then(response => response.text())
                    .then(data => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');
                        const files = Array.from(htmlDoc.querySelectorAll('a'))
                            .map(a => a.href)
                            .filter(href => href.endsWith('.png') || href.endsWith('.webp'));
                        if (files.length > 0) {
                            const randomOption = files[Math.floor(Math.random() * files.length)];
                            if (!selectedOptions[category]) selectedOptions[category] = {};
                            selectedOptions[category][subcategory] = randomOption;
                        }
                    })
                    .catch(error => console.error('Error loading images:', error));
            });
        } else {
            const folderPath = `imgs/${category.toLowerCase()}/`;
            fetch(folderPath)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(data, 'text/html');
                    const files = Array.from(htmlDoc.querySelectorAll('a'))
                        .map(a => a.href)
                        .filter(href => href.endsWith('.png') || href.endsWith('.webp'));
                    if (files.length > 0) {
                        const randomOption = files[Math.floor(Math.random() * files.length)];
                        selectedOptions[category] = randomOption;
                    }
                })
                .catch(error => console.error('Error loading images:', error));
        }
    });
    
    selectedAccessories = {};
    accessories.forEach(accessory => {
        if (Math.random() > 0.5) {
            const folderPath = `imgs/accessories/${accessory}/`;
            fetch(folderPath)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(data, 'text/html');
                    const files = Array.from(htmlDoc.querySelectorAll('a'))
                        .map(a => a.href)
                        .filter(href => href.endsWith('.png'));
                    if (files.length > 0) {
                        const randomOption = files[Math.floor(Math.random() * files.length)];
                        selectedAccessories[accessory] = randomOption;
                    }
                })
                .catch(error => console.error('Error loading accessory images:', error));
        }
    });
    
    setTimeout(updateCharacterPreview, 500); // Give time for all fetches to complete
}

function resetCharacter() {
    selectedOptions = {};
    selectedAccessories = {};
    updateCharacterPreview();
    selectCategory('Backgrounds');
}

function exportCharacter() {
    const dataUrl = characterPreview.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'chibi-character.png';
    link.click();
}

function printCharacter() {
    const dataUrl = characterPreview.toDataURL('image/png');
    const windowContent = '<!DOCTYPE html>';
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(windowContent);
    printWindow.document.write(`<img src="${dataUrl}" style="width:100%;">`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function setupEventListeners() {
    randomizeBtn.addEventListener('click', randomizeCharacter);
    resetBtn.addEventListener('click', resetCharacter);
    exportBtn.addEventListener('click', exportCharacter);
    printBtn.addEventListener('click', printCharacter);
}

// Initialize the application
init();