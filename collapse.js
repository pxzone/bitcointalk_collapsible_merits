// ==UserScript==
// @name     Collapsible Received Merits
// @description     Collapse multiple rows of received merits in Bitcointalk
// @author  PX-Z
// @match  https://bitcointalk.org/index.php?topic=*
// @version  1
// @grant       none
// @run-at      document-end
// ==/UserScript==

(function() {
    'use strict';
    
    function injectToggleButtonScript() {
        const script = document.createElement('script');
        script.textContent = `
            window.toggleFunc = function(id) {
                const collapsibleContent = document.getElementById(\`collapsible_content_\${id}\`);
                const toggleButtonId = document.getElementById(\`clickid_\${id}\`);
                if (collapsibleContent.classList.contains('expanded')) {
                    collapsibleContent.classList.remove('expanded');
                    toggleButtonId.textContent = 'Show more...';
                } else {
                    collapsibleContent.classList.add('expanded');
                    toggleButtonId.textContent = 'Show less...';
                }
            };
        `;
        document.body.appendChild(script);
    }
    injectToggleButtonScript();

    let url = window.location.href;
    if( url.indexOf("bitcointalk.org/index.php?topic=") > 0){
        console.log('Collapsible Received Merits Initialized');
        // Select all div elements with IDs starting with "subject_"
        const subjectDivs = document.querySelectorAll('div[id^="subject_"]');
        // Iterate through each div and process the ID
        subjectDivs.forEach(div => {
        const fullId = div.id;
        const msgId = fullId.replace('subject_', '');
        const collpaseId = `collapsible_content_${msgId}`;
        let tbodyTr = div.closest('td.td_headerandpost table tbody tr');
            if (tbodyTr) {
                let tds = tbodyTr.querySelectorAll('td[valign="middle"]');
                let secondTd = tds[1];
                secondTd.setAttribute('id', collpaseId);
  
                let smalltextDivs = secondTd.querySelectorAll('div.smalltext');
                if (smalltextDivs.length === 2) {
                let secondSmalltextDivs = smalltextDivs[1];
                secondSmalltextDivs.setAttribute('class', `smalltext merit-content merit-h-${msgId}`);
  
                const dynamicDiv = document.querySelector(`.merit-h-${msgId}`);
                const height = dynamicDiv.offsetHeight; 
                    if(height > 55){
                        // secondSmalltextDivs.insertAdjacentHTML('afterend', `<span class="toggle-button" data-msgid="${msgId}" id="toggle_button"><span id="clickid_${msgId}">Show more...</span></span>`);
                        secondSmalltextDivs.insertAdjacentHTML('afterend', `<span class="toggle-button" onclick="toggleFunc('${msgId}')"><span id="clickid_${msgId}">Show more...</span></span>`);
                    }
                    else{
                        // To avoid id errors
                        secondSmalltextDivs.insertAdjacentHTML('afterend', `<span class="toggle-button" id="toggle_button"></span>`);
                    }
                }
            }
        });
        
        document.getElementById('toggle_button').addEventListener('click', function() {
            const id = this.getAttribute('data-msgid');
            const collapsibleContent = document.getElementById(`collapsible_content_${id}`);
            const toggleButtonId = document.getElementById(`clickid_${id}`);
            if (collapsibleContent.classList.contains('expanded')) {
                collapsibleContent.classList.remove('expanded');
                toggleButtonId.textContent = 'Show more...';
            } else {
                collapsibleContent.classList.add('expanded');
                toggleButtonId.textContent = 'Show less...';
            }
        });
        
        
    } 
    const style = document.createElement('style');
        style.textContent = `
        .merit-content {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4; /* Limit to 4 rows/line */
            -webkit-box-orient: vertical;
        }
        .expanded .merit-content {
            height: auto; /* Show full content when expanded */
            -webkit-line-clamp: unset; /* Remove line clamp when expanded */
        }
        .toggle-button {
            display: inline-block;
            color: #476C8E;
            cursor: pointer;
            font-size: 11px;
            margin-top: 2px;
        }
        `;
        document.head.appendChild(style);
})();
  
