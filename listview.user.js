// ==UserScript==
// @name         Uncluttered Easyappointment List View
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Reloads the page every 5 minutes, hides header and controls, shows X button for Easyappointment List View.
// @author       Andreas Kundert
// @downloadURL  https://github.com/apkuki/easyappointments-userscripts/raw/main/listview.user.js
// @updateURL    https://github.com/apkuki/easyappointments-userscripts/raw/main/listview.user.js
// @match        https://physio.weltklassezuerich.ch/index.php/calendar?view=list
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
        closeButton.style.padding = '15px 20px 15px 20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            window.location.href = '../index.php/calendar';
        };
        document.body.appendChild(closeButton);
    }

    // Function to hide the cursor and show it only on mouse movement
    function initializeCursorVisibility() {
        let timeout;

        function showCursor() {
            GM_addStyle(`
                * {
                    cursor: default !important;
                }
            `);

            clearTimeout(timeout);
            timeout = setTimeout(hideCursor, 2000);
        }

        function hideCursor() {
            GM_addStyle(`
                * {
                    cursor: none !important;
                }
            `);
        }

        document.addEventListener('mousemove', showCursor);
        timeout = setTimeout(hideCursor, 2000);
    }

    // Function to hard reload the page every 5 minutes
    function reloadPagePeriodically() {
        setTimeout(function() {
            location.reload();
        }, 300000); // 300000 ms = 5 minutes
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
        addCloseButton(); // Add the close button
        initializeCursorVisibility(); // Initialize cursor visibility control
        reloadPagePeriodically(); // Start periodic page reload (every 5 minutes)
    });

})();
