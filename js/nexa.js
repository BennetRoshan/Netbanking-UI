document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL GOOGLE TRANSLATE INJECTION ---
    // Only inject if NOT running locally via file:/// to prevent security errors
    if (window.location.protocol !== 'file:') {
        if (!document.getElementById('google_translate_element')) {
            const translateDiv = document.createElement('div');
            translateDiv.id = 'google_translate_element';
            translateDiv.style.display = 'none';
            document.body.appendChild(translateDiv);
        }
        
        window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
        };
        
        const gtScript = document.createElement('script');
        gtScript.type = 'text/javascript';
        gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(gtScript);

        const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
        if (match && match[1]) {
            const langCode = match[1].split('/').pop();
            const selectEl = document.getElementById('languageSelect');
            if (selectEl) {
                selectEl.value = langCode;
                const text = selectEl.options[selectEl.selectedIndex].text;
                const langTextEl = document.getElementById('currentLanguageText');
                if (langTextEl) langTextEl.textContent = text;
            }
        }
    }
    // -----------------------------------------

    // Nexa Floating Widget Logic
    const nexaOrbBtn = document.getElementById('nexaOrbBtn');
    const nexaChatWindow = document.getElementById('nexaChatWindow');
    const nexaCloseChatBtn = document.getElementById('nexaCloseChatBtn');
    const nexaWidgetInput = document.getElementById('nexaWidgetInput');
    const nexaWidgetSubmitBtn = document.getElementById('nexaWidgetSubmitBtn');
    const nexaChatHistory = document.getElementById('nexaChatHistory');
    const nexaPrompt = document.getElementById('nexaPrompt');

    if (nexaOrbBtn) {
        // Repeated prompt logic
        if (nexaPrompt) {
            setInterval(() => {
                if (nexaChatWindow && nexaChatWindow.classList.contains('d-none')) {
                    nexaPrompt.classList.remove('d-none');
                    nexaPrompt.style.opacity = '1';
                    setTimeout(() => {
                        nexaPrompt.style.opacity = '0';
                        setTimeout(() => nexaPrompt.classList.add('d-none'), 300);
                    }, 4000);
                }
            }, 10000); // Show prompt every 10 seconds
        }

        nexaOrbBtn.addEventListener('click', () => {
            if(nexaChatWindow) nexaChatWindow.classList.toggle('d-none');
            if (nexaPrompt) nexaPrompt.classList.add('d-none');
            if (nexaChatWindow && !nexaChatWindow.classList.contains('d-none')) {
                nexaWidgetInput.focus();
            }
        });

        if(nexaCloseChatBtn) nexaCloseChatBtn.addEventListener('click', () => {
            if(nexaChatWindow) nexaChatWindow.classList.add('d-none');
        });

        const addChatMessage = (text, isUser) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `d-flex mb-3 ${isUser ? 'justify-content-end' : ''}`;
            const innerDiv = document.createElement('div');
            innerDiv.className = `p-2 rounded-3 shadow-sm ${isUser ? 'bg-info text-white' : 'bg-white'}`;
            innerDiv.style.maxWidth = '85%';
            innerDiv.style.fontSize = '14px';
            innerDiv.textContent = text;
            msgDiv.appendChild(innerDiv);
            if(nexaChatHistory) {
                nexaChatHistory.appendChild(msgDiv);
                nexaChatHistory.scrollTop = nexaChatHistory.scrollHeight;
            }
        };

        const handleWidgetChat = () => {
            if(!nexaWidgetInput) return;
            const query = nexaWidgetInput.value.toLowerCase().trim();
            if (!query) return;

            addChatMessage(nexaWidgetInput.value, true);
            nexaWidgetInput.value = '';

            let response = "I can help you with Accounts, Loans, Cards, or Fund Transfers. Let me know what you need!";
            if (query.includes("loan") || query.includes("emi")) {
                response = "We offer Personal, Home, and Business loans with rates from 8.5%. Try our EMI calculator on the Loans page!";
            } else if (query.includes("account") || query.includes("open")) {
                response = "You can open an account in minutes! Click 'Open Account' in the top right to start.";
            } else if (query.includes("card") || query.includes("credit")) {
                response = "Our credit cards offer 5% cashback and global lounge access.";
            }

            setTimeout(() => {
                addChatMessage(response, false);
            }, 600);
        };

        if(nexaWidgetSubmitBtn) nexaWidgetSubmitBtn.addEventListener('click', handleWidgetChat);
        if(nexaWidgetInput) nexaWidgetInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleWidgetChat();
        });
    }
});
