document.addEventListener('DOMContentLoaded', function() {
    var chatMessages = document.getElementById('chatMessages');
    var overlay = document.getElementById('overlay');
    var overlayText = document.getElementById('overlayText');
    var overlayBtn = document.getElementById('overlayBtn');
    var overlaySecondary = document.getElementById('overlaySecondary');
    var progressBar = document.getElementById('progressBar');
    var inputField = document.getElementById('inputField');
    var sendBtn = document.querySelector('.send-btn');
    var mobileSendBtn = document.querySelector('.mobile-send-btn');

    var currentStep = 0;
    var isAnimating = false;
    var exploreMode = false;

    var ctaMessages = [
        'Ready to try it yourself? Install OpenSecretary with BRAT to get started.',
        'Want to organize your own vault? OpenSecretary is free and open source.',
        'This is just a taste of what OpenSecretary can do. Install it to unlock the full experience.',
        'Your notes deserve an AI assistant. Get OpenSecretary running in minutes.'
    ];
    var currentCtaIndex = 0;

    var demoScript = [
        {
            type: 'overlay',
            text: 'This is OpenSecretary running inside Obsidian. An autonomous AI agent that reads, writes, and organizes your notes.'
        },
        {
            type: 'user',
            content: 'What meetings do I have scheduled this week?'
        },
        {
            type: 'tool',
            content: 'SearchFiles: "meeting" in vault...'
        },
        {
            type: 'tool',
            content: 'ReadFile: Calendar/2024-Week-49.md'
        },
        {
            type: 'assistant',
            content: 'You have 3 meetings this week:\n\n- Monday 2pm: Product sync with design team\n- Wednesday 10am: 1:1 with Sarah\n- Friday 3pm: Sprint retrospective\n\nThe Wednesday meeting has a note to discuss Q1 roadmap priorities.'
        },
        {
            type: 'overlay',
            text: 'The agent searched your vault and read your calendar notes. It uses tools like SearchFiles and ReadFile autonomously.'
        },
        {
            type: 'user',
            content: 'Can you write a summary of my project notes for the Q4 review?'
        },
        {
            type: 'tool',
            content: 'SearchFiles: "project" "Q4" in vault...'
        },
        {
            type: 'tool',
            content: 'ReadFile: Projects/Website-Redesign.md'
        },
        {
            type: 'tool',
            content: 'ReadFile: Projects/Mobile-App.md'
        },
        {
            type: 'tool',
            content: 'WriteFile: Summaries/Q4-Review.md'
        },
        {
            type: 'assistant',
            content: 'Done. I\'ve created a Q4 review summary at Summaries/Q4-Review.md covering:\n\n- Website redesign: Launched new homepage, 40% faster load times\n- Mobile app: Beta released, 200 testers onboarded\n- Infrastructure: Migrated to new hosting provider\n\nWant me to add anything else to the summary?'
        },
        {
            type: 'overlay',
            text: 'OpenSecretary writes and creates files in your vault. It searched multiple notes and synthesized them into a new document.'
        },
        {
            type: 'user',
            content: 'Research best practices for personal knowledge management'
        },
        {
            type: 'tool',
            content: 'InvokeSubAgent: ResearchAgent'
        },
        {
            type: 'tool',
            content: 'ResearchAgent: Searching web for PKM best practices...'
        },
        {
            type: 'assistant',
            content: 'Here are the key PKM best practices I found:\n\n1. Capture everything in one place\n2. Use linking over folders - connections reveal insights\n3. Review regularly - weekly reviews prevent orphan notes\n4. Write in your own words - aids retention\n5. Start small - don\'t over-engineer your system\n\nWant me to save this as a note in your vault?'
        },
        {
            type: 'overlay',
            text: 'Sub-agents handle specialized tasks. The ResearchAgent searched the web to find relevant information.'
        },
        {
            type: 'end',
            text: 'Ready to try OpenSecretary? It works on desktop and mobile.',
            showExplore: true
        }
    ];

    var totalSteps = demoScript.filter(function(s) { return s.type === 'overlay' || s.type === 'end'; }).length;
    var completedOverlays = 0;

    function updateProgress() {
        var percent = (completedOverlays / totalSteps) * 100;
        progressBar.style.width = percent + '%';
    }

    function showOverlay(text, showExplore) {
        overlayText.textContent = text;
        
        if (showExplore) {
            overlayBtn.textContent = 'Install with BRAT';
            overlayBtn.onclick = function() {
                window.location.href = '/';
            };
            overlaySecondary.style.display = 'block';
            overlaySecondary.onclick = function() {
                hideOverlay();
                enableExploreMode();
            };
        } else {
            overlayBtn.textContent = 'Continue';
            overlayBtn.onclick = function() {
                hideOverlay();
                completedOverlays++;
                updateProgress();
                currentStep++;
                runStep();
            };
            overlaySecondary.style.display = 'none';
        }
        overlay.classList.add('active');
    }

    function hideOverlay() {
        overlay.classList.remove('active');
    }

    function enableExploreMode() {
        exploreMode = true;
        inputField.disabled = false;
        inputField.focus();
        completedOverlays++;
        updateProgress();
    }

    function addMessage(type, content) {
        return new Promise(function(resolve) {
            var msg = document.createElement('div');
            msg.className = 'message ' + type;
            
            var contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            msg.appendChild(contentDiv);
            
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            if (type === 'assistant' || type === 'user') {
                typeText(contentDiv, content, function() {
                    resolve();
                });
            } else {
                contentDiv.textContent = content;
                setTimeout(resolve, 400);
            }
        });
    }

    function typeText(element, text, callback) {
        var i = 0;
        var speed = 20;
        
        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(type, speed);
            } else {
                setTimeout(callback, 300);
            }
        }
        
        type();
    }

    function addInstallLink() {
        var linkDiv = document.createElement('div');
        linkDiv.className = 'message assistant';
        linkDiv.innerHTML = '<div class="message-content"><a href="/" class="install-cta-link">Install with BRAT</a></div>';
        chatMessages.appendChild(linkDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        return new Promise(function(resolve) {
            var indicator = document.createElement('div');
            indicator.className = 'message assistant';
            indicator.id = 'typingIndicator';
            indicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            chatMessages.appendChild(indicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            setTimeout(function() {
                var el = document.getElementById('typingIndicator');
                if (el) el.remove();
                resolve();
            }, 800);
        });
    }

    async function handleExploreInput(userText) {
        if (isAnimating) return;
        isAnimating = true;
        
        inputField.value = '';
        inputField.disabled = true;
        
        await addMessage('user', userText);
        
        var tools = [
            'SearchFiles: "' + userText.split(' ').slice(0, 2).join(' ') + '" in vault...',
            'ReadFile: Notes/' + userText.split(' ')[0] + '.md',
            'Analyzing content...'
        ];
        
        for (var i = 0; i < tools.length; i++) {
            await addMessage('tool', tools[i]);
        }
        
        await showTypingIndicator();
        
        var cta = ctaMessages[currentCtaIndex];
        currentCtaIndex = (currentCtaIndex + 1) % ctaMessages.length;
        
        var response = 'I\'d help you with that in your actual vault.\n\n' + cta;
        await addMessage('assistant', response);
        
        addInstallLink();
        
        isAnimating = false;
        inputField.disabled = false;
        inputField.focus();
    }

    async function runStep() {
        if (currentStep >= demoScript.length) return;
        if (isAnimating) return;
        
        var step = demoScript[currentStep];
        
        if (step.type === 'overlay') {
            showOverlay(step.text, false);
            return;
        }
        
        if (step.type === 'end') {
            showOverlay(step.text, step.showExplore);
            return;
        }
        
        isAnimating = true;
        
        if (step.type === 'assistant') {
            await showTypingIndicator();
        }
        
        await addMessage(step.type, step.content);
        
        isAnimating = false;
        currentStep++;
        
        setTimeout(runStep, 600);
    }

    function handleSend() {
        if (!exploreMode) return;
        var text = inputField.value.trim();
        if (text) {
            handleExploreInput(text);
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }
    if (mobileSendBtn) {
        mobileSendBtn.addEventListener('click', handleSend);
    }
    
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    showOverlay(demoScript[0].text, false);
});
