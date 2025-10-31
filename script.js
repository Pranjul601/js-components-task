// --- MODAL LOGIC ---

// 1. Saare zaroori HTML elements ko pakdo
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('my-modal');

// 2. Focus trap ke liye modal ke andar ke saare focusable items dhoondo
const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
const firstFocusableElement = focusableElements[0]; // Modal ka pehla item (Close button)
const lastFocusableElement = focusableElements[focusableElements.length - 1]; // Modal ka aakhri item (Submit button)

// 3. Function: Modal ko kholne ke liye
function openModal() {
    modal.removeAttribute('hidden'); // Modal ko dikhao
    firstFocusableElement.focus(); // Focus ko pehle item (Close button) par set karo
}

// 4. Function: Modal ko band karne ke liye
function closeModal() {
    modal.setAttribute('hidden', 'true'); // Modal ko chhupao
    openModalBtn.focus(); // Focus wapas 'Open Modal' button par le jao
}

// --- Event Listeners (Buttons ko kaam do) ---

// 'Open Modal' button par click
openModalBtn.addEventListener('click', openModal);

// 'Close' (X) button par click
closeModalBtn.addEventListener('click', closeModal);

// Modal ke bahar (overlay) par click
modal.addEventListener('click', (event) => {
    // Check karo ki click 'modal' (kaala background) par hua hai
    if (event.target === modal) {
        closeModal();
    }
});

// Keyboard events (Esc aur Tab)
modal.addEventListener('keydown', (event) => {
    
    // (A) 'Escape' key dabane par modal band karo
    if (event.key === 'Escape') {
        closeModal();
    }

    // (B) 'Tab' key dabane par FOCUS TRAP
    if (event.key === 'Tab') {
        
        if (event.shiftKey) { 
            // Agar 'Shift + Tab' (peeche jaana)
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                event.preventDefault();
            }
        } else {
            // Agar sirf 'Tab' (aage jaana)
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                event.preventDefault();
            }
        }
    }
});

// --- END OF MODAL LOGIC ---


// --- ACCESSIBLE TABS LOGIC ---

// 1. Saare zaroori elements ko pakdo
const tabList = document.querySelector('[role="tablist"]');
const tabs = tabList.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

// Variable to keep track of the currently focused tab index
let currentTabIndex = 0;

// 2. Click Navigation
tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        currentTabIndex = index; // Click se index update karo
        activateTab(tab);
    });
});

// 3. Keyboard Navigation (Arrow keys)
tabList.addEventListener('keydown', (event) => {
    let newIndex = currentTabIndex;

    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            newIndex = (currentTabIndex + 1) % tabs.length; // Agla tab
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            newIndex = (currentTabIndex - 1 + tabs.length) % tabs.length; // Pichla tab
            break;
        default:
            return; // Agar koi aur key hai toh kuch mat karo
    }

    // Naye tab par focus le jao
    tabs[newIndex].focus();
    // Naye tab ko activate bhi karo
    activateTab(tabs[newIndex]);
    
    currentTabIndex = newIndex; // Naya index store karo
});

// 4. Main Function: Tab ko activate karne ke liye
function activateTab(selectedTab) {
    tabs.forEach(tab => {
        const isSelected = (tab === selectedTab);
        // Sabhi tabs ko update karo
        tab.setAttribute('aria-selected', isSelected);
        tab.setAttribute('tabindex', isSelected ? '0' : '-1'); // Sirf active tab hi focusable hoga
    });

    panels.forEach(panel => {
        // Sirf wahi panel dikhao jo active tab se juda hai
        const panelId = panel.getAttribute('id');
        const tabControls = selectedTab.getAttribute('aria-controls');
        
        if (panelId === tabControls) {
            panel.removeAttribute('hidden');
        } else {
            panel.setAttribute('hidden', 'true');
        }
    });
}

// --- END OF TABS LOGIC ---

// --- CAROUSEL LOGIC ---

// 1. Saare zaroori elements ko pakdo
const carousel = document.querySelector('.carousel');
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');

// Har slide ki width set karo
const slideWidth = slides[0].getBoundingClientRect().width;
slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + 'px';
});

let currentSlideIndex = 0;

// Function: Slide ko move karne ke liye
const moveToSlide = (newIndex) => {
    // Check karo ki index boundaries ke andar hai
    if (newIndex < 0) {
        newIndex = 0; // Pehli slide se peeche nahi jaana
    } else if (newIndex >= slides.length) {
        newIndex = slides.length - 1; // Aakhri slide se aage nahi jaana
    }

    track.style.transform = 'translateX(-' + slideWidth * newIndex + 'px)';
    currentSlideIndex = newIndex;

    // Buttons ko enable/disable karo
    prevButton.disabled = (newIndex === 0);
    nextButton.disabled = (newIndex === slides.length - 1);
};

// 2. Button Click Listeners
nextButton.addEventListener('click', () => {
    moveToSlide(currentSlideIndex + 1);
});

prevButton.addEventListener('click', () => {
    moveToSlide(currentSlideIndex - 1);
});

// 3. Keyboard Listeners
carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        event.preventDefault(); // Page scroll na ho
        moveToSlide(currentSlideIndex + 1);
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault(); // Page scroll na ho
        moveToSlide(currentSlideIndex - 1);
    }
});

// 4. Touch (Swipe) Listeners
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
});

carousel.addEventListener('touchmove', (event) => {
    touchEndX = event.touches[0].clientX;
});

carousel.addEventListener('touchend', () => {
    const swipeThreshold = 50; // Kam se kam 50px swipe hona chahiye
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > swipeThreshold) {
        // Left swipe (Next)
        moveToSlide(currentSlideIndex + 1);
    } else if (swipeDistance < -swipeThreshold) {
        // Right swipe (Previous)
        moveToSlide(currentSlideIndex - 1);
    }
});

// Initial setup
moveToSlide(0); // Pehli slide par set karo

// --- END OF CAROUSEL LOGIC ---