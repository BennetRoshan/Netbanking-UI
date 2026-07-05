import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Replace broken Rupee symbols
    content = content.replace('â,¹', '&#8377;')
    
    # In index.html, we also have broken Nexa chatbots in the footer
    if file == 'index.html':
        # Remove the injected Nexa chatbots
        content = re.sub(r'<!-- Nexa Chatbot Bar -->.*?<!-- Nexa Chat Response Area \(Hidden by default\) -->.*?</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
        
        # Add the Floating Orb just before </body>
        orb_html = """
    <!-- Nexa Floating Chat Widget -->
    <div id="nexaWidget" class="position-fixed z-index-3" style="bottom: 30px; right: 30px;">
        <!-- Orb -->
        <button id="nexaOrbBtn" class="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center border border-2 border-white" style="width: 60px; height: 60px; animation: pulse 2s infinite;">
            <i class="bi bi-robot fs-3"></i>
        </button>

        <!-- Chat Window (Hidden) -->
        <div id="nexaChatWindow" class="bg-white rounded-4 shadow-lg d-none position-absolute" style="bottom: 80px; right: 0; width: 350px; overflow: hidden; border: 1px solid #e9ecef;">
            <div class="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
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
                <button id="nexaWidgetSubmitBtn" class="btn btn-primary rounded-circle ms-2" style="width: 40px; height: 40px; padding: 0;"><i class="bi bi-send"></i></button>
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
"""
        content = content.replace('</body>', orb_html + '\n</body>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML fixes applied!")
