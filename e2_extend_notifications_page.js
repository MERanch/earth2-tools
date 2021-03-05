// ==UserScript==
// @name         E2 (earth2.io) - extension - notifications page
// @namespace    http://earth2.io/
// @version      0.1.1
// @description  Adds filter to the notification page to filter them
// @author       Mihaly Szolnoki -> E2: MihajA414 - MSZY5BLXAP -> discord: mihaj
// @match        https://app.earth2.io/
// @grant        none
// @license MIT
// @currentversion	0.1.2 : modified for bid changes
// ==/UserScript==

/* jshint esversion: 8 */
(function() {
    'use strict';

    let isNotificationsPage = () => { return window.location.hash.includes("#notifications") ; };

    let isAvailable = (object) => { return typeof object !== "undefined" && object !== null && object !== ""; };

    const addStyle = (() => {
        const style = document.createElement('style');
        document.head.append(style);
        return (styleString) => style.textContent = styleString;
    })();

    //usage example: addStyle(`body { color: red; }`);

    let checkNotificationsPage = () => {
        if(isNotificationsPage()){
            let extraBitsSelector = `.settings-header .content .${additionalHtmlClass}`;
            let extraBits = document.querySelector(extraBitsSelector);

            let timeOut = 2500;
            if(isAvailable(extraBits)){
                console.log("extra bits already present", extraBits);
                timeOut = 4000;
            }

            setTimeout(() => {
                if(!isAvailable(document.querySelector(extraBitsSelector))){
                    console.log("wait add");
                    addExtraBits();
                } else {
                    console.log("extra bits still present");
                }
            }, timeOut);
        } else{
            console.log("not notifications page");
        }
    };

    let additionalHtmlClass = "extra-bits";
    let additionalHtml = `
        <div class="notifications ${additionalHtmlClass}">
            <div class="notifications support-me"><span>You can support me by using my code (MSZY5BLXAP) or by tipping on Paypal (csimbum@gmail.com)</span></div>
            <div class="notifications contact-me"><span>Any errors, issues, suggestions -> discord: mihaj#5170</span></div>
            <div>
                <input type="radio" class="notification-filter" id="all"                        name="notification_filter" value="all" checked><label class="notification-filter" for="all">All</label><br>
                <input type="radio" class="notification-filter" id="bids_unanswered"            name="notification_filter" value="bids_unanswered"><label class="notification-filter" for="bids_unanswered">Unanswered bids</label><br>
                <input type="radio" class="notification-filter" id="bids_all"                   name="notification_filter" value="bids_all"><label class="notification-filter" for="bids_all">All bids</label><br>
            </div>
        </div>
    `;

    let addExtraBits = () => {
        document.querySelector('.settings-header .content').insertAdjacentHTML("beforeend", additionalHtml);
        addStyle(`
            div.notifications.${additionalHtmlClass}{
                margin-left: 20px;
            }

            div.notifications.support-me{
                font-size: 20px;
            }

            div.notifications.contact-me{
                font-size: 16px;
            }

            .notification-filter[type="radio"]:not(:checked), .notification-filter[type="radio"]:checked{
                opacity: unset;
                pointer-events: all;
            }

            label.notification-filter{
                margin-left: 20px;
            }
        `);

        Array.from(document.querySelectorAll(".notification-filter")).forEach(radio => {
            radio.addEventListener("change", filterNotifications, false);
        })
            
    };

    let filterNotifications = () => {
        let currentlySelected = document.querySelector(`.notification-filter[type="radio"]:checked`);
        if(isAvailable(currentlySelected)){
            //console.log(`filter ${currentlySelected.value}`, currentlySelected);

            let allNotifications = Array.from(document.querySelectorAll(".notifications-item"));

            switch(currentlySelected.value){
                case "all":
                    allNotifications.forEach(notification => {
                        showNotification(notification);
                    })
                    break;
                case "bids_unanswered":
                    allNotifications.forEach(notification => {
                        if(!isBidRow(notification) || hasSubRows(notification)){
                            hideNotification(notification);
                        } else {
                            showNotification(notification);
                        }
                    });
                    break;
                case "bids_all":
                    allNotifications.forEach(notification => {
                        if(!isBidRow(notification)){
                            hideNotification(notification);
                        } else {
                            showNotification(notification);
                        }    
                    });
                    break;
            }
        }
    };

    let hideNotification = (notification) => { notification.style.display = "none"; };
    let showNotification = (notification) => { notification.style.display = "block";};

    let isBidRow = (notification) => {
        let result = false;
        let link = notification.querySelector(".notification-row a");
        if(isAvailable(link)){
            result = link.textContent.includes("bid has been submitted for")
            //console.log(`[${link.textContent}] : ${result}`);
        } 
        return result;
    }

    let hasSubRows = (notification) => {
        let result = false;
        let subRows = notification.querySelectorAll(".sub");
        if(isAvailable(subRows)){
            result = Array.from(subRows).length > 0;
            //console.log(`[${notification.querySelector(".notification-row a").textContent}]: has sub: ${result}`);
        }
        return result;
    };

    //console.log("init");
    checkNotificationsPage();
    window.addEventListener("hashchange", () => { 
        //console.log("hash change");
        checkNotificationsPage(); 
    }, false);

})();
