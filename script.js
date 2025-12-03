document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const textToCopy = btn.getAttribute('data-copy');
            const copyIcon = btn.querySelector('.copy-icon');
            
            navigator.clipboard.writeText(textToCopy).then(function() {
                btn.classList.add('copied');
                copyIcon.textContent = 'Copied';
                
                setTimeout(function() {
                    btn.classList.remove('copied');
                    copyIcon.textContent = 'Copy';
                }, 2000);
            }).catch(function() {
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                btn.classList.add('copied');
                copyIcon.textContent = 'Copied';
                
                setTimeout(function() {
                    btn.classList.remove('copied');
                    copyIcon.textContent = 'Copy';
                }, 2000);
            });
        });
    });
});

