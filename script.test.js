 const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('Modal Component', () => {

    beforeEach(() => {
        // === FIX YAHAN HAI ===
        // 1. Jest ko batate hain ki 'script.js' ko cache se na uthaye
        jest.resetModules(); 

        // 2. Naya HTML body mein daalte hain
        document.body.innerHTML = html;
        
        // 3. Ab script.js ko dobara (fresh) load karte hain
        require('./script.js');
    });

    // Test 1: Kya modal khulta hai?
    test('Modal "Open Modal" button click karne par khulna chahiye', () => {
        const modal = document.getElementById('my-modal');
        expect(modal.hasAttribute('hidden')).toBe(true);
        
        const openModalBtn = document.getElementById('open-modal-btn');
        openModalBtn.click();
        
        // Check karo ki modal dikh raha hai
        expect(modal.hasAttribute('hidden')).toBe(false);
    });

    // Test 2: Kya modal band hota hai?
    test('Modal "Close" (X) button click karne par band hona chahiye', () => {
        // 1. Modal ko pehle khol do
        const openModalBtn = document.getElementById('open-modal-btn');
        openModalBtn.click();
        
        const modal = document.getElementById('my-modal');
        // Pakka karo ki modal khula hua hai (Test 1 se humein pata hai yeh kaam karega)
        expect(modal.hasAttribute('hidden')).toBe(false); 

        // 2. 'Close' button ko pakdo
        const closeModalBtn = document.getElementById('close-modal-btn');

        // 3. 'Close' button ko click karo
        closeModalBtn.click();

        // 4. Ab check karo ki modal phir se chhip gaya hai
        expect(modal.hasAttribute('hidden')).toBe(true);
    });
});