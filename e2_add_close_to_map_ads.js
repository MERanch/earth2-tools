// ==UserScript==
// @name         E2 - Close button for ads on map
// @namespace    http://earth2.io/
// @version      0.1.0
// @description  Add a close button to E2 map ads
// @author       Mihaly Szolnoki -> E2: mihajₒMSZY5BLXAP -> discord: mihaj#5170
// @match        https://app.earth2.io/*
// @grant        none
// @license MIT
// @currentversion	0.1.0 : initial version
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
    'use strict';

    class Helper {
        isAvailable (object) { return typeof object !== "undefined" && object !== null && object !== ""; };

        isGridPage () { return window.location.hash.includes("#thegrid") || window.location.href === "https://app.earth2.io/" || window.location.href === "https://app.earth2.io/#"; };
    }
    let helper = new Helper();

    class MapAdHandler {
        constructor() {
            this.closeButtonHTML = `<div class='close-marker' style='background:#757575; border: 1px solid #afafaf; width:50px; display:flex; justify-content:center; font-size: 2.5em; margin-right: 10px; padding-top: 10px; padding-bottom: 10px;'>X</div>`
        }

        init () {
            //the container of the map
            this.targetNode = Array.from(document.getElementById("map").childNodes).find(c => c.classList.contains("mapboxgl-canvas-container"));
            // We only need to check whenever items are added to the container
            this.config = { attributes: false, childList: true, subtree: false };

            // Create an observer instance linked to the callback function
            window.mapAdObserver = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length != 0) {

                        Array.from(mutation.addedNodes).forEach(node => {
                            if (node.classList.contains("mapboxgl-marker")) {
                                console.log("marker added", node);

                                let span = node.querySelector("span");
                                if (helper.isAvailable(span)) {
                                    // console.log("span ", span);

                                    span.parentElement.parentElement.insertAdjacentHTML("afterbegin", this.closeButtonHTML);
                                    //span.parentElement.parentElement.parentElement.parentElement.style["min-width"] = "370px";
                                    let closeMarker = span.parentElement.parentElement.querySelector(".close-marker");
                                    closeMarker.addEventListener("click", (e) => {
                                        closeMarker.parentElement.parentElement.parentElement.parentElement.remove();
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }, true);

                                }

                            }
                        });
                    }
                }
            });

            this.startObserving();
        }

        startObserving () {
            if (!this.observing) {
                console.log("start observing ", { target: this.targetNode, config: this.config });
                // Start observing the target node for configured mutations
                window.mapAdObserver.observe(this.targetNode, this.config);
                this.observing = true;
            }
        }

        stopObserving () {
            console.log("stop observing");
            window.mapAdObserver.disconnect();
            this.observing = false;
        }
    }
    let mapAdHandler = new MapAdHandler();

    let gridPageCheckInterval = setInterval(() => {
        let isGrid = helper.isGridPage();
        let hasObserver = helper.isAvailable(window.mapAdObserver);
        let observing = hasObserver && mapAdHandler.observing === true;
        //console.log(`page check: grid[${isGrid}] no observer[${!hasObserver}] observing[${observing}]`);
        if (isGrid) {
            if (!helper.isAvailable(window.mapAdObserver)) {
                console.log("grid page, without observer");
                mapAdHandler.init();
            } else if (!observing) {
                mapAdHandler.init();
            }

        } else if (observing) {
            mapAdHandler.stopObserving();
        }
    }, 2000);

})();


