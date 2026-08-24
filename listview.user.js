// ==UserScript==
// @name         Uncluttered Easyappointment List View
// @namespace    http://tampermonkey.net
// @version      1.4.0
// @description  Fast 60s AJAX refresh with an automatic 5-minute full page reload safety fallback if the refresh button is missing.
// @author       Andreas Kundert
// @downloadURL  https://github.com
// @updateURL    https://github.com
// @match        https://weltklassezuerich.ch
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide an element by ID
    function hideElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
        }
    }

    // Function to hide elements by class name
    function hideElementsByClass(className) {
        const elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
            elements[i].style.visibility = 'hidden';
        }
    }

    // Function to replace "/" with "." in h5 elements
    function replaceSlashWithDotInH5() {
        const h5Elements = document.getElementsByTagName('h5');
        for (let i = 0; i < h5Elements.length; i++) {
            let text = h5Elements[i].textContent;
            text = text.replace(/\//g, '.'); // Replace all "/" with "."
            h5Elements[i].textContent = text;
        }
    }

    // Function to add "X" button
    function addCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'fixed';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.zIndex = '1000';
        closeButton.style.backgroundColor = 'lightgrey';
        closeButton.style.color = 'black';
        closeButton.style.border = 'none';
        closeButton.style.padding = '15px 20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            window.location.href = '../index.php/calendar';
        };
        document.body.appendChild(closeButton);
    }

    // Toggle class on body instead of injecting styles repeatedly
    function initializeCursorVisibility() {
        let timeout;

        GM_addStyle(`
            body.hide-cursor, body.hide-cursor * {
                cursor: none !important;
            }
            body.show-cursor, body.show-cursor * {
                cursor: default !important;
            }
        `);

        function hideCursor() {
            document.body.classList.remove('show-cursor');
            document.body.classList.add('hide-cursor');
        }

        function showCursor() {
            if (!document.body.classList.contains('show-cursor')) {
                document.body.classList.remove('hide-cursor');
                document.body.classList.add('show-cursor');
            }

            clearTimeout(timeout);
            timeout = setTimeout(hideCursor, 2000);
        }

        document.addEventListener('mousemove', showCursor);
        timeout = setTimeout(hideCursor, 2000);
    }

    // DUAL-REFRESH LOGIC: Fast AJAX with full page reload backup
    function setupSmartRefresh() {
        let lastSuccessfulAjaxTime = Date.now();

        // 1. Fast AJAX Refresh Loop (Runs every 60 seconds)
        setInterval(function() {
            const reloadBtn = document.getElementById('reload-appointments');
            
            if (reloadBtn) {
                // Dispatch complete native pointer interaction chain
                const mousedownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
                const mouseupEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
                const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });

                reloadBtn.dispatchEvent(mousedownEvent);
                reloadBtn.dispatchEvent(mouseupEvent);
                reloadBtn.dispatchEvent(clickEvent);
                
                // Mark AJAX attempt as active
                lastSuccessfulAjaxTime = Date.now();

                // Format text shortly after data loaded into DOM
                setTimeout(replaceSlashWithDotInH5, 1500);
            }
        }, 60000); // 60000 ms = 60 seconds

        // 2. Hard Fallback Loop (Checks every 10 seconds, reloads after 5 minutes of no AJAX)
        setInterval(function() {
            const timeSinceLastAjax = Date.now() - lastSuccessfulAjaxTime;
            const reloadBtn = document.getElementById('reload-appointments');

            // Fallback triggers if the button disappeared OR if the AJAX fails to fire for 5 minutes
            if (!reloadBtn || timeSinceLastAjax >= 300000) {
                location.reload();
            }
        }, 10000); // Check fallback status every 10 seconds
    }

    // Hide elements with specified IDs
    hideElementById('header');
    hideElementById('calendar-filter');
    hideElementById('calendar-toolbar');
    hideElementById('footer');

    // Hide elements with specified classes
    hideElementsByClass('d-sm-inline-block');
    hideElementsByClass('calendar-header');

    // CSS styling for unavailability events (hide breaks/pauses)
    GM_addStyle(`
        #calendar .fc-unavailability {
            display: none !important;
        }
    `);

    // CSS styling for #calendar .calendar-view
    GM_addStyle(`
        #calendar .calendar-view {
            margin-left: 15px;
        }
    `);

    // Zoom to 150% for 4K displays
    GM_addStyle(`
        body {
            zoom: 150%;
        }
    `);

    // CSS styling for H5 element (date headers)
    GM_addStyle(`
        h5 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-top: 15px;
        }
    `);

    // CSS styling for H6 element (provider names)
    GM_addStyle(`
        h6 {
            font-size: 1.2rem;
            font-weight: bold;
        }
    `);

    // Hide FullCalendar toolbar (if any)
    GM_addStyle(`
        #calendar .fc-header-toolbar {
            display: none !important;
        }
    `);

    // Increase event font size for better readability
    GM_addStyle(`
        #calendar .fc-list-event-title,
        #calendar .fc-list-event-time {
            font-size: 15px;
        }
    `);

    // Increase provider column minimum width
    GM_addStyle(`
        @media (min-width: 768px) {
            #calendar .provider-column {
                min-width: 250px !important;
            }
        }
    `);

    // Ensure calendar has enough height
    GM_addStyle(`
        .fc {
            min-height: 1200px !important;
        }
    `);

    // Wait for page load and then perform actions
    window.addEventListener('load', async function() {
        replaceSlashWithDotInH5();
        addCloseButton(); 
        initializeCursorVisibility(); 
        setupSmartRefresh(); // Active dual-refresh fallback engine
    });

})();
