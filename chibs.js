// Configuration
const imagePaths = {
    Backgrounds: Array.from({length: 8}, (_, i) => `imgs/backgrounds/${i + 1}.webp`),
    Hair: {
        bangs: Array.from({length: 8}, (_, i) => `imgs/hair/bangs/${i + 1}.png`),
        base: Array.from({length: 8}, (_, i) => `imgs/hair/base/${i + 1}.png`),
        shaved: Array.from({length: 8}, (_, i) => `imgs/hair/shaved/${i + 1}.png`),
        sideburns: Array.from({length: 8}, (_, i) => `imgs/hair/sideburns/${i + 1}.png`)
    },
    Bodies: Array.from({length: 8}, (_, i) => `imgs/bodies/${i + 1}.png`),
    Eyes: {
        'eye-base': Array.from({length: 8}, (_, i) => `imgs/eyes/eye-base/${i + 1}.png`),
        iris: Array.from({length: 8}, (_, i) => `imgs/eyes/iris/${i + 1}.png`)
    },
    Mouth: Array.from({length: 8}, (_, i) => `imgs/mouth/${i + 1}.png`),
    Tops: {
        dress: Array.from({length: 8}, (_, i) => `imgs/tops/dress/${i + 1}.png`),
        hoodie: Array.from({length: 8}, (_, i) => `imgs/tops/hoodie/${i + 1}.png`),
        shirt: Array.from({length: 8}, (_, i) => `imgs/tops/shirt/${i + 1}.png`)
    },
    'Socks-tights': Array.from({length: 8}, (_, i) => `imgs/socks-tights/${i + 1}.png`),
    Bottoms: Array.from({length: 8}, (_, i) => `imgs/bottoms/${i + 1}.png`),
    Shoes: Array.from({length: 8}, (_, i) => `imgs/shoes/${i + 1}.png`),
    Features: {
        brows: Array.from({length: 8}, (_, i) => `imgs/features/brows/${i + 1}.png`),
        'facial-hair': Array.from({length: 8}, (_, i) => `imgs/features/facial-hair/${i + 1}.png`),
        liner: Array.from({length: 8}, (_, i) => `imgs/features/liner/${i + 1}.png`),
        peircing: Array.from({length: 8}, (_, i) => `imgs/features/peircing/${i + 1}.png`),
        scara: Array.from({length: 8}, (_, i) => `imgs/features/scara/${i + 1}.png`)
    },
    Accessories: {
        bows: Array.from({length: 8}, (_, i) => `imgs/accessories/bows/${i + 1}.png`),
        collars: Array.from({length: 8}, (_, i) => `imgs/accessories/collars/${i + 1}.png`),
        glasses: Array.from({length: 8}, (_, i) => `imgs/accessories/glasses/${i + 1}.png`),
        gloves: Array.from({length: 8}, (_, i) => `imgs/accessories/gloves/${i + 1}.png`),
        hats: Array.from({length: 8}, (_, i) => `imgs/accessories/hats/${i + 1}.png`),
        headphones: Array.from({length: 8}, (_, i) => `imgs/accessories/headphones/${i + 1}.png`),
        items: Array.from({length: 8}, (_, i) => `imgs/accessories/items/${i + 1}.png`),
        wings: Array.from({length: 8}, (_, i) => `imgs/accessories/wings/${i + 1}.png`)
    }
	// Add similar entries for other categories and subcategories
};


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
    let images;
    if (currentCategory === 'Accessories') {
        images = imagePaths.Accessories[currentSubCategory];
    } else if (subCategories[currentCategory]) {
        images = imagePaths[currentCategory][currentSubCategory];
    } else {
        images = imagePaths[currentCategory];
    }
    
    if (!images) {
        console.error(`No images found for category: ${currentCategory}, subcategory: ${currentSubCategory}`);
        return;
    }

    images.forEach(imagePath => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `${currentCategory} option`;
        img.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
            button.style.display = 'none'; // Hide the button if the image fails to load
        };
        button.appendChild(img);
        button.addEventListener('click', () => selectOption(currentCategory, imagePath));
        optionsCarousel.appendChild(button);
    });
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

    const layers = [...Object.keys(imagePaths), ...Object.keys(imagePaths.Accessories)];
    let loadedImages = 0;
    const totalImages = layers.length;

    layers.forEach(layer => {
        let option;
        if (layer === 'Accessories') {
            Object.keys(selectedAccessories).forEach(accessory => {
                const accessoryOption = selectedAccessories[accessory];
                if (accessoryOption) {
                    loadImage(accessoryOption, true);
                }
            });
            return;
        }
        if (subCategories[layer]) {
            Object.keys(selectedOptions[layer] || {}).forEach(subcategory => {
                option = selectedOptions[layer][subcategory];
                if (option) {
                    loadImage(option);
                }
            });
        } else {
            option = selectedOptions[layer];
            if (option) {
                loadImage(option);
            }
        }
    });

    function loadImage(src, isAccessory = false) {
        const img = new Image();
        img.onload = () => {
            if (layer === 'Backgrounds') {
                ctx.drawImage(img, 0, 0, characterPreview.width, characterPreview.height);
            } else {
                const scale = 0.6;
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const x = 0;
                const y = isAccessory ? characterPreview.height - scaledHeight : 0;
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            }
            loadedImages++;
            if (loadedImages === totalImages) {
                // All images have been loaded and drawn
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            loadedImages++;
            if (loadedImages === totalImages) {
                // All images have been loaded and drawn (or failed to load)
            }
        };
        img.src = src;
    }
}

function randomizeCharacter() {
    Object.keys(imagePaths).forEach(category => {
        if (category === 'Accessories') {
            // Handle accessories separately
            return;
        }
        if (typeof imagePaths[category] === 'object' && !Array.isArray(imagePaths[category])) {
            Object.keys(imagePaths[category]).forEach(subcategory => {
                const options = imagePaths[category][subcategory];
                const randomOption = options[Math.floor(Math.random() * options.length)];
                if (!selectedOptions[category]) selectedOptions[category] = {};
                selectedOptions[category][subcategory] = randomOption;
            });
        } else {
            const options = imagePaths[category];
            const randomOption = options[Math.floor(Math.random() * options.length)];
            selectedOptions[category] = randomOption;
        }
    });

    // Randomize accessories
    selectedAccessories = {};
    Object.keys(imagePaths.Accessories).forEach(accessory => {
        if (Math.random() > 0.5) {
            const options = imagePaths.Accessories[accessory];
            const randomOption = options[Math.floor(Math.random() * options.length)];
            selectedAccessories[accessory] = randomOption;
        }
    });

    updateCharacterPreview();
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
