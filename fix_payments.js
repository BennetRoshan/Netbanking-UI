const fs = require('fs');
const path = 'features/transfers/payments.html';
let text = fs.readFileSync(path, 'utf8');

// The fuzzy search removed </body></html> so let's append the nexa widget and the closing tags.
let widget = `

    <!-- Nexa Floating Chat Widget -->
    <div id="nexaWidget" class="position-fixed z-index-3 d-flex align-items-end" style="bottom: 30px; right: 30px; gap: 15px;">
        
        <!-- Repeated Prompt -->
        <div id="nexaPrompt" class="bg-white text-dark p-2 rounded-4 shadow-sm mb-3 position-relative d-none" style="transition: opacity 0.3s; border: 1px solid #0d6efd; max-width: 150px; font-size: 13px;">
            Hi! Need help? <b>Ask Nexa!</b>
            <div class="position-absolute" style="right: -8px; bottom: 15px; width: 15px; height: 15px; background: white; transform: rotate(45deg); border-top: 1px solid #0d6efd; border-right: 1px solid #0d6efd;"></div>
        </div>

        <!-- Orb -->
        <button id="nexaOrbBtn" class="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center border border-3 border-white" style="width: 65px; height: 65px; animation: pulse 2s infinite; background: linear-gradient(135deg, #0d6efd 0%, #3a7bd5 100%);">
            <i class="bi bi-robot fs-3 text-white"></i>
        </button>

        <!-- Chat Window (Hidden) -->
        <div id="nexaChatWindow" class="bg-white rounded-4 shadow-lg d-none position-absolute" style="bottom: 80px; right: 0; width: 350px; overflow: hidden; border: 1px solid #e9ecef;">
            <div class="text-white p-3 d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, #0d6efd 0%, #3a7bd5 100%);">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-robot fs-4"></i>
                    <h6 class="mb-0 fw-bold">Ask Nexa</h6>
                </div>
                <button id="nexaCloseChatBtn" class="btn-close btn-close-white shadow-none"></button>
            </div>
            <div class="p-3 bg-light" style="height: 250px; overflow-y: auto;" id="nexaChatHistory">
                <div class="d-flex mb-3">
                    <div class="bg-white p-2 rounded-3 shadow-sm" style="max-width: 85%; font-size: 14px;">
                        Hi! I'm Nexa. How can I help you with your banking today?
                    </div>
                </div>
            </div>
            <div class="p-2 bg-white border-top d-flex">
                <input type="text" id="nexaWidgetInput" class="form-control border-0 shadow-none" placeholder="Type your question...">
                <button id="nexaWidgetSubmitBtn" class="btn rounded-circle ms-2 d-flex align-items-center justify-content-center text-white" style="width: 40px; height: 40px; padding: 0; background: #0d6efd;"><i class="bi bi-send"></i></button>
            </div>
        </div>
    </div>
    <style>
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(0, 210, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0); }
        }
    </style>
    <script src="../../assets/js/nexa.js"></script>
</body>
</html>
`;
text = text.trim() + widget;
fs.writeFileSync(path, text);
console.log("Appended Nexa widget");
