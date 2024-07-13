// ==UserScript==
// @name         Uncluttered Easyappointment Table View
// @namespace    http://tampermonkey.net/
// @version      1.7.4
// @description  Reloads the page periodically, hides specific elements, changes CSS of Easyappointment Table View.
// @author       Andreas Kundert
// @downloadURL  https://github.com/apkuki/easyappointments-userscripts/raw/main/tableview.user.js
// @updateURL    https://github.com/apkuki/easyappointments-userscripts/raw/main/tableview.user.js
// @match        https://easyappoint.tail60ade3.ts.net/index.php/calendar?view=table
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

    // Function to click buttons by class name
    function clickButtonsByClass(className) {
        const buttons = document.getElementsByClassName(className);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].click();
        }
    }

    // Function to reload the page periodically
    function reloadPagePeriodically(interval) {
        setInterval(() => {
            location.reload();
        }, interval);
    }

    // Function to delay execution
    function delayExecution(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
        closeButton.style.padding = '20px 20px 20px 20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            window.location.href = 'https://easyappoint.tail60ade3.ts.net/index.php/calendar';
        };
        document.body.appendChild(closeButton);
    }

    // Hide elements with specified IDs
    hideElementById('header');
    hideElementById('calendar-filter');
    hideElementById('calendar-toolbar');
    hideElementById('footer');

    // Hide elements with specified classes
    hideElementsByClass('dropdown');
    hideElementsByClass('d-sm-inline-block');
    hideElementsByClass('calendar-header');
    hideElementsByClass('fc-button-group');

    // CSS styling for H5 element
    GM_addStyle(`
        h5 {
            font-size: 1.5rem;
            font-weight: bold;
        }
    `);

    // CSS styling for H6 element
    GM_addStyle(`
        h6 {
            font-size: 1.2rem;
            font-weight: bold;
        }
    `);

    // Additional CSS styling for #calendar .fc-header-toolbar
    GM_addStyle(`
        #calendar .fc-header-toolbar {
            display: none !important;
        }
    `);

    // Wait for 10 milliseconds after page load and then click buttons with class "fc-listDay-button"
    window.addEventListener('load', async function() {
        await delayExecution(10); // Wait for 10 milliseconds
        replaceSlashWithDotInH5();
        clickButtonsByClass('fc-listDay-button');
        addCloseButton(); // Add the close button
    });

    // Reload the page every 60 seconds (60000 milliseconds)
    reloadPagePeriodically(60000);
})();
