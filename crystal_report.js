// ==UserScript==
// @name         Crystal/jewel export for earth2.io
// @namespace    http://earth2.io/
// @version      0.1.3
// @description  Generate a csv report for your jewels with daily distribution | ordered by date and time 
// @author       Mihaly Szolnoki -> E2: mihajₒMSZY5BLXAP -> discord: mihaj#5170
// @match        https://app.earth2.io/*
// @grant        none
// @license MIT
// @currentversion	0.1.3 : small bugfix for page recognition and slowness of html element generation
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
    'use strict';

    //console.log("start");

    let Strings = Object.freeze({
        NOTAVAILABLE: "N/A",
        NEWLINE: "\r\n",
    })

    let MessageSeverity = Object.freeze({
        SUCCESS: "success",
        WARNING: "warning",
        ERROR: "error",
    });

    class Helper {
        constructor() {

            this.areas = ["Africa", "America", "Antarctica", "Asia", "Europe", "Oceania", "Other"]

            this.mappings = [
                { code: "__", country: "other (international)?" },

                { code: "ad", area: "Europe", country: "Andorra" },
                { code: "ae", area: "Africa", country: "Dubai" },
                { code: "af", area: "Asia", country: "Afghanistan" },
                { code: "ag", area: "America", country: "Antigua and Barbuda" },
                { code: "ai", area: "America", country: "Anguilla" },
                { code: "al", area: "Europe", country: "Albania" },
                { code: "am", area: "Asia", country: "Armenia" },
                { code: "ao", area: "Africa", country: "Angola" },
                { code: "aq", area: "Antarctica", country: "Antarctica" },
                { code: "ar", area: "America", country: "Argentina" },
                { code: "as", area: "Oceania", country: "American Samoa" },
                { code: "at", area: "Europe", country: "Austria" },
                { code: "au", area: "Oceania", country: "Australia" },
                { code: "aw", area: "America", country: "Aruba" },
                { code: "az", area: "Asia", country: "Azerbaijan" },

                { code: "ba", area: "Europe", country: "Bosnia Herzegovina" },
                { code: "bb", area: "America", country: "Barbados" },
                { code: "bd", area: "Asia", country: "Bangladesh" },
                { code: "be", area: "Europe", country: "Belgium" },
                { code: "bf", area: "Africa", country: "Burkina Faso" },
                { code: "bg", area: "Europe", country: "Bulgaria" },
                { code: "bh", area: "Africa", country: "Bahrain" },
                { code: "bi", area: "Africa", country: "Burundi" },
                { code: "bj", area: "Africa", country: "Benin" },
                { code: "bl", area: "America", country: "Saint Barthelemy" },
                { code: "bm", area: "America", country: "Bermuda" },
                { code: "bn", area: "Asia", country: "Brunei Darussalam" },
                { code: "bo", area: "Africa", country: "Bolivia" },
                { code: "br", area: "America", country: "Brazil" },
                { code: "bs", area: "America", country: "Bahamas" },
                { code: "bt", area: "Asia", country: "Bhutan" },
                { code: "bw", area: "Africa", country: "Botswana" },
                { code: "by", area: "Europe", country: "Belarus" },
                { code: "bz", area: "America", country: "Belize" },

                { code: "ca", area: "America", country: "Canada" },
                { code: "cd", area: "Africa", country: "Democratic Republic of Congo" },
                { code: "cf", area: "Africa", country: "Central African Republic" },
                { code: "cg", area: "Africa", country: "Congo" },
                { code: "ch", area: "Europe", country: "Switzerland" },
                { code: "ci", area: "Africa", country: "Côte d'Ivoire" },
                { code: "ck", area: "Oceania", country: "Cook Islands" },
                { code: "cl", area: "America", country: "Chile" },
                { code: "cm", area: "Africa", country: "Cameroon" },
                { code: "cn", area: "Asia", country: "China" },
                { code: "co", area: "America", country: "Colombia" },
                { code: "cr", area: "America", country: "Costa Rica" },
                { code: "cu", area: "America", country: "Cuba" },
                { code: "cv", area: "Africa", country: "Cape Verde" },
                { code: "cw", area: "America", country: "Curaçao" },
                { code: "cy", area: "Europe", country: "Cyprus" },
                { code: "cz", area: "Europe", country: "Czech Republic" },

                { code: "de", area: "Europe", country: "Germany" },
                { code: "dj", area: "Africa", country: "Djibouti" },
                { code: "dk", area: "Europe", country: "Denmark" },
                { code: "dm", area: "America", country: "Dominica" },
                { code: "do", area: "America", country: "Dominican Republic" },
                { code: "dz", area: "Africa", country: "Algeria" },

                { code: "ec", area: "America", country: "Ecuador" },
                { code: "ee", area: "Europe", country: "Estonia" },
                { code: "eg", area: "Africa", country: "Egypt" },
                { code: "eh", area: "Africa", country: "Western Sahara" },
                { code: "er", area: "Africa", country: "Eritrea" },
                { code: "es", area: "Europe", country: "Spain" },
                { code: "et", area: "Africa", country: "Ethiopia" },

                { code: "fi", area: "Europe", country: "Finland" },
                { code: "fj", area: "Oceania", country: "Fiji" },
                { code: "fk", area: "America", country: "Falkland Islands" },
                { code: "fm", area: "Oceania", country: "Micronesia" },
                { code: "fo", area: "Europe", country: "Faroe" },
                { code: "fr", area: "Europe", country: "France" },

                { code: "ga", area: "Africa", country: "Gabon" },
                { code: "gb", area: "Europe", country: "United Kingdom" },
                { code: "gd", area: "America", country: "Grenada" },
                { code: "ge", area: "Asia", country: "Georgia" },
                { code: "gg", area: "Europe", country: "Guernsey" },
                { code: "gh", area: "Africa", country: "Ghana" },
                { code: "gi", area: "Europe", country: "Gibraltar" },
                { code: "gl", area: "America", country: "Greenland" },
                { code: "gm", area: "Africa", country: "Gambia" },
                { code: "gn", area: "Africa", country: "Guinea" },
                { code: "gq", area: "Africa", country: "Equatorial Guinea" },
                { code: "gr", area: "Europe", country: "Greece" },
                { code: "gs", area: "Antarctica", country: "South Georgia and the South Sandwich Islands" },
                { code: "gt", area: "America", country: "Guatemala" },
                { code: "gu", area: "Oceania", country: "Guam" },
                { code: "gw", area: "Africa", country: "Guinea-Bissau" },
                { code: "gy", area: "America", country: "Guyana" },

                { code: "hk", area: "Asia", country: "Hong Kong" },
                { code: "hm", area: "Antarctica", country: "Heard and McDonald Islands" },
                { code: "hn", area: "America", country: "Honduras" },
                { code: "hr", area: "Europe", country: "Croatia" },
                { code: "ht", area: "America", country: "Haiti" },
                { code: "hu", area: "Europe", country: "Hungary" },

                { code: "id", area: "Asia", country: "Indonesia" },
                { code: "ie", area: "Europe", country: "Ireland" },
                { code: "im", area: "Europe", country: "Isle of Man" },
                { code: "in", area: "Asia", country: "India" },
                { code: "io", area: "Asia", country: "British Indian Ocean Territory" },
                { code: "is", area: "Europe", country: "Iceland" },
                { code: "it", area: "Europe", country: "Italy" },

                { code: "je", area: "Europe", country: "Jersey" },
                { code: "jm", area: "America", country: "Jamaica" },
                { code: "jo", area: "Asia", country: "Jordan" },
                { code: "jp", area: "Asia", country: "Japan" },

                { code: "ke", area: "Africa", country: "Kenya" },
                { code: "kg", area: "Asia", country: "Kyrgyzstan" },
                { code: "kh", area: "Asia", country: "Cambodia" },
                { code: "ki", area: "Oceania", country: "Kiribati" },
                { code: "km", area: "Africa", country: "Comoros" },
                { code: "kn", area: "America", country: "Saint Kitts and Nevis" },
                { code: "kp", area: "Asia", country: "North Korea" },
                { code: "kr", area: "Asia", country: "South Korea" },
                { code: "kw", area: "Asia", country: "Kuwait" },
                { code: "ky", area: "America", country: "Cayman Islands" },
                { code: "kz", area: "Asia", country: "Kazakhstan" },

                { code: "la", area: "Asia", country: "Laos" },
                { code: "lb", area: "Asia", country: "Lebanon" },
                { code: "lc", area: "America", country: "Saint Lucia" },
                { code: "li", area: "Europe", country: "Liechtenstein" },
                { code: "lk", area: "Asia", country: "Sri Lanka" },
                { code: "lr", area: "Africa", country: "Liberia" },
                { code: "ls", area: "Africa", country: "Lesotho" },
                { code: "lt", area: "Europe", country: "Lithuania" },
                { code: "lu", area: "Europe", country: "Luxembourg" },
                { code: "lv", area: "Europe", country: "Latvia" },
                { code: "ly", area: "Africa", country: "Libya" },

                { code: "ma", area: "Africa", country: "Morocco" },
                { code: "mc", area: "Europe", country: "Monaco" },
                { code: "md", area: "Europe", country: "Moldova" },
                { code: "me", area: "Europe", country: "Montenegro" },
                { code: "mf", area: "America", country: "Saint Martin" },
                { code: "mg", area: "Africa", country: "Madagascar" },
                { code: "mh", area: "Oceania", country: "Marshall Islands" },
                { code: "mk", area: "Europe", country: "North Macedonia" },
                { code: "ml", area: "Africa", country: "Mali" },
                { code: "mm", area: "Asia", country: "Myanmar" },
                { code: "mn", area: "Asia", country: "Mongolia" },
                { code: "mo", area: "Asia", country: "Macau" },
                { code: "mp", area: "Asia", country: "Northern Mariana Islands" },
                { code: "mr", area: "Africa", country: "Mauritania" },
                { code: "ms", area: "America", country: "Montserrat" },
                { code: "mt", area: "Europe", country: "Malta" },
                { code: "mu", area: "Africa", country: "Mauritius" },
                { code: "mv", area: "Asia", country: "Maldives" },
                { code: "mw", area: "Africa", country: "Malawi" },
                { code: "mx", area: "America", country: "Mexico" },
                { code: "my", area: "Asia", country: "Malaysia" },
                { code: "mz", area: "Africa", country: "Mozambique" },

                { code: "na", area: "Africa", country: "Namibia" },
                { code: "ne", area: "Africa", country: "Niger" },
                { code: "nf", area: "Oceania", country: "Norfolk Island" },
                { code: "ng", area: "Africa", country: "Nigeria" },
                { code: "ni", area: "America", country: "Nicaragua" },
                { code: "nl", area: "Europe", country: "Netherlands" },
                { code: "no", area: "Europe", country: "Norway" },
                { code: "np", area: "Asia", country: "Nepal" },
                { code: "nr", area: "Oceania", country: "Nauru" },
                { code: "nu", area: "Oceania", country: "Niue" },
                { code: "nz", area: "Oceania", country: "New Zealand" },

                { code: "om", area: "Asia", country: "Oman" },

                { code: "pa", area: "America", country: "Panama" },
                { code: "pe", area: "America", country: "Peru" },
                { code: "pf", area: "Oceania", country: "Polynesia" },
                { code: "pg", area: "Oceania", country: "Papua New Guinea" },
                { code: "ph", area: "Asia", country: "Philippines" },
                { code: "pk", area: "Asia", country: "Pakistan" },
                { code: "pl", area: "Europe", country: "Poland" },
                { code: "pn", area: "Oceania", country: "Pitcairn" },
                { code: "pr", area: "America", country: "Puerto Rico" },
                { code: "ps", area: "Asia", country: "Palestinian Territories" },
                { code: "pt", area: "Europe", country: "Portugal" },
                { code: "pw", area: "Oceania", country: "Palau" },
                { code: "py", area: "America", country: "Paraguay" },

                { code: "qa", area: "Asia", country: "Qatar" },

                { code: "ro", area: "Europe", country: "Romania" },
                { code: "rs", area: "Europe", country: "Serbia" },
                { code: "ru", area: "Asia", country: "Russia" },
                { code: "rw", area: "Africa", country: "Rwanda" },

                { code: "sb", area: "Oceania", country: "Solomon Islands" },
                { code: "sc", area: "Africa", country: "Seychelles" },
                { code: "sd", area: "Africa", country: "Sudan" },
                { code: "se", area: "Europe", country: "Sweden" },
                { code: "sg", area: "Asia", country: "Singapore" },
                { code: "sh", area: "Africa", country: "Saint Helena" },
                { code: "si", area: "Europe", country: "Slovenia" },
                { code: "sj", area: "Europe", country: "Svalbard and Jan Mayen" },
                { code: "sk", area: "Europe", country: "Slovakia" },
                { code: "sl", area: "Africa", country: "Sierra Leone" },
                { code: "sm", area: "Europe", country: "San Marino" },
                { code: "sn", area: "Africa", country: "Senegal" },
                { code: "so", area: "Africa", country: "Somalia" },
                { code: "sr", area: "America", country: "Suriname" },
                { code: "ss", area: "Africa", country: "South Sudan" },
                { code: "st", area: "Africa", country: "Sao Tome and Principe" },
                { code: "sv", area: "America", country: "El Salvador" },
                { code: "sx", area: "America", country: "Little Bay, Sint Maarten" },
                { code: "sy", area: "Asia", country: "Syria" },
                { code: "sz", area: "Africa", country: "Eswatini" },

                { code: "tc", area: "America", country: "Turks and Caicos" },
                { code: "td", area: "Africa", country: "Chad" },
                { code: "tf", area: "Antarctica", country: "French Southern Territories" },
                { code: "tg", area: "Africa", country: "Togo" },
                { code: "th", area: "Asia", country: "Thailand" },
                { code: "tj", area: "Asia", country: "Tajikistan" },
                { code: "tl", area: "Asia", country: "Timor Leste" },
                { code: "tm", area: "Asia", country: "Turkmenistan" },
                { code: "tn", area: "Africa", country: "Tunisia" },
                { code: "to", area: "Oceania", country: "Tonga" },
                { code: "tr", area: "Asia", country: "Turkey" },
                { code: "tt", area: "America", country: "Trinidad and Tobago" },
                { code: "tv", area: "Oceania", country: "Tuvalu" },
                { code: "tw", area: "Asia", country: "Taiwan" },
                { code: "tz", area: "Africa", country: "Tanzania" },

                { code: "ua", area: "Europe", country: "Ukraine" },
                { code: "ug", area: "Africa", country: "Uganda" },
                { code: "us", area: "America", country: "United States" },
                { code: "um", area: "Oceania", country: "US Minor Outlying Islands" },
                { code: "uy", area: "America", country: "Uruguay" },
                { code: "uz", area: "Asia", country: "Uzbekistan" },

                { code: "va", area: "Europe", country: "Vatican City" },
                { code: "vc", area: "America", country: "Saint Vincent and the Grenadines" },
                { code: "ve", area: "America", country: "Venezuela" },
                { code: "vg", area: "America", country: "British Virgin Islands" },
                { code: "vi", area: "America", country: "US Virgin Islands" },
                { code: "vn", area: "Asia", country: "Vietnam" },
                { code: "vu", area: "Oceania", country: "Vanuatu" },

                { code: "ws", area: "Oceania", country: "Samoa" },

                { code: "xx", area: "Asia", country: "Spratly Islands" },
                { code: "xy", area: "Europe", country: "Sovereign Base Areas of Akrotiri and Dhekelia" },

                { code: "ye", area: "Asia", country: "Yemen" },

                { code: "za", area: "Africa", country: "South Africa" },
                { code: "zm", area: "Africa", country: "Zambia" },
                { code: "zw", area: "Africa", country: "Zimbabwe" },

                //----
                { code: "united arab emirates", area: "Asia", country: "United Arab Emirates" },
                { code: "mayotte", area: "Africa", country: "Mayotte" },
                { code: "reunion", area: "Africa", country: "Reunion" },
                { code: "martinique", area: "America", country: "Martinique" },

                //----
                { code: "gf", area: "America", country: "French Guiana" },
                { code: "gp", area: "America", country: "Guadeloupe" },

                { code: "yt", area: "Africa", country: "Mayotte" },
                { code: "nc", area: "Oceania", country: "New Caledonia" },
                { code: "re", area: "Africa", country: "Réunion" },
                { code: "pm", area: "America", country: "Saint Pierre and Miquelon" },
                { code: "tk", area: "Oceania", country: "Tokelau" },
                { code: "wf", area: "Oceania", country: "Wallis and Futuna" },

            ];
        }

        isAvailable (object) { return typeof object !== "undefined" && object !== null && object !== ""; };

        tryParseJSON (data) {
            try {
                let result = JSON.parse(data);
                return result;
            }
            catch (e) {
                return data;
            }
        };

        cleanString (input) {
            let output = "";
            if (this.isAvailable(input)) {
                for (var i = 0; i < input.length; i++) {
                    if (input.charCodeAt(i) <= 255) {
                        output += input.charAt(i);
                    }
                }
            }
            output = output.replaceAll(",", " | ");
            return output;
        };

        getFormattedTime (getDateToo) {
            let now = new Date();

            let hours = now.getHours().toString().padStart(2, '0');
            let minute = now.getMinutes().toString().padStart(2, '0');
            let seconds = now.getSeconds().toString().padStart(2, '0');
            let millisecs = now.getMilliseconds().toString().padStart(3, '0');

            let result = `${hours}:${minute}:${seconds}::${millisecs}`;
            if (getDateToo) {
                let year = now.getFullYear().toString();
                let month = (now.getMonth() + 1).toString().padStart(2, '0');
                let day = now.getDate().toString().padStart(2, '0');
                result = `${year}-${month}-${day}::` + result;
            }
            return result;
        };


        createDownloadFile (prefix, content) {
            let link = document.createElement('a');
            link.download = `${prefix}-${this.getFormattedTime(true).replaceAll(":", "_")}.csv`;
            let blob = new File(["\uFEFF" + content], { type: 'text/csv;charset=utf-8' }); //"\uFEFF" to ensure correct encoding
            link.href = window.URL.createObjectURL(blob);
            if (confirm("do you want to download the results?")) {
                link.click();
            }
        }

        showCustomToast (severity, message, dismissOthers) {
            try {
                console.log(`[${severity}] : ${message}`);

                let showLength = 2500;

                if (dismissOthers === true) {
                    M.Toast.dismissAll();
                }

                let colorClass = "";
                switch (severity) {
                    case MessageSeverity.SUCCESS: colorClass = "green"; break;
                    case MessageSeverity.WARNING: colorClass = "yellow black-text"; break;
                    case MessageSeverity.ERROR: colorClass = "red"; break;
                }

                M.toast({
                    html: `<i class="material-icons">clear</i> ${message}`,
                    classes: `${colorClass} darken-1 pulse`,
                    displayLength: showLength
                });
            } catch (e) {
                console.error("show custom toast error", e);
            }
        }

        getCountryAndArea (property) {
            let result = null;
            try {
                let propertyLocationParts = property["location"].split(",");
                if (propertyLocationParts.length > 0) {
                    let lastLocationPart = propertyLocationParts[propertyLocationParts.length - 1].trim();
                    let matchingCountry = this.mappings.filter(m => m.country === lastLocationPart);
                    if (matchingCountry.length > 0) {
                        result = matchingCountry[0];
                    } else {
                        console.log(`no matching country for [${lastLocationPart}]: loc:[${property["location"]}]`, property);
                    }
                } else {
                    console.log("invalid location", property);
                }
            } catch (e) {
                console.log("error in [getArea]", property);
                result = null;
            }



            return result;
        }
    }

    let helper = new Helper();

    class E2API {
        constructor() {
            this.itemsPerPage = 60;
        }

        getAllJewels = async () => {
            helper.showCustomToast(MessageSeverity.SUCCESS, "getting all jewels, please wait");

            let pageData = await this.fetchJson(`/api/v2/my/jewels/?expires__isnull=true&limit=${this.itemsPerPage}&offset=0&ordering=created`);
            let result = pageData.results;


            while (pageData.next != null) {
                pageData = await this.fetchJson(pageData.next.replace("https://app.earth2.io", ""));
                result = result.concat(pageData.results);
            }

            return result;
        }

        fetchJson = async (fetchURL) => {
            console.log("fetch: " + fetchURL);
            let result = await fetch(fetchURL)
                .then(r => r.json())
                .then(r => r);
            return result;
        }

        getUser = async () => {
            this.userInfo = await fetch(`/api/v2/user_info/${window.auth0user.id}}/`).then(r => r.json()).then(r => r);
            return this.userInfo;
        }

        getCSRFToken = async () => {
            let csrfToken = await cookieStore.get('csrftoken').then(r => r);
            //console.log("token: ", csrfToken);
            return csrfToken;
        }

        getUserLandFields = async () => {
            helper.showCustomToast(MessageSeverity.SUCCESS, "getting user properties");

            let csrfToken = await this.getCSRFToken();

            let query =
                `{
                    getMyLandfields {
                        id, forSale, thumbnail, description, location, center, country, tileCount, tileClass, purchasedStr, purchasedTimestamp, purchaseValue, currentValue, tradingValue, price, transactionSet{
                            price, time
                        }
                    }
                }`;

            let actualQuery = JSON.stringify({ "query": query });

            let properties = await fetch('/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "x-csrftoken": csrfToken.value },
                body: actualQuery
            }).then(r => {
                return r.text();
            }).then(data => {
                //console.log("data: ", data);

                let parsedData = helper.tryParseJSON(data);
                if (parsedData != null) {
                    //console.log("data: ", parsedData);
                    return parsedData.data.getMyLandfields;
                }

                return null;

            }).catch((error) => {
                console.log("fetch error in cacheproperties", error);
            });

            return properties;
        }
    }

    class UIHandler {
        constructor() {
            this.crystalExportSelector = "#crystal-export";
        }

        isResourcesPage () {
            return window.location.hash.includes("resources");
        }

        init () {
            if (this.isResourcesPage()) {
                let spans = Array.from(document.querySelectorAll("span"));
                let inventoryLabel = null;
                for (let i = 0; i < spans.length; i++) {
                    if (spans[i].textContent === "Inventory") {
                        //console.log("span found");
                        inventoryLabel = spans[i];
                        break;
                    }
                }
                if (inventoryLabel != null) {
                    let inventory = inventoryLabel.parentElement.parentElement.parentElement;
                    let html = `
                    <div style="width:100%;height:50px;background:#f0f0f0;">
                        <div style="display:flex; justify-content:space-evenly;">
                            <input type="checkbox" id="include-summary" name="include-summary" value="" checked style="position:relative;opacity:unset;pointer-events:unset;">
                            <label for="include-summary">Include summary (total)</label><br>
                            <input type="checkbox" id="include-summary-daily" name="include-summary-daily" value="" style="position:relative;opacity:unset;pointer-events:unset;">
                            <label for="include-summary-daily">Include summary (daily)</label><br>
                        </div>
                        <button id="crystal-report-export" style="width:100%">Export (csv)</button>
                    </div`;
                    inventory.insertAdjacentHTML("afterbegin", html);

                    document.getElementById("crystal-report-export").addEventListener("click", async () => { await this.handleExportClick(); })
                }
            } else {
                console.log("not resources page");
            }
        }

        async handleExportClick () {
            console.log("export click");

            let api = new E2API();

            let jewels = await api.getAllJewels();
            console.log("jewels: ", jewels);

            if (jewels.length === 0) {
                helper.showCustomToast(MessageSeverity.ERROR, "No jewels in your inventory");
            } else {
                let userProperties = await api.getUserLandFields();
                //console.log("user properties: ", userProperties);

                let reportItems = [];
                jewels = jewels.filter(j => helper.isAvailable(j));
                jewels.forEach(jewel => {
                    reportItems.push(new JewelReportItem(jewel, userProperties));
                });
                reportItems = reportItems.sort((a, b) => a.spawnDateTime > b.spawnDateTime ? 1 : -1);

                //console.log("report items: ", reportItems);
                //console.table(reportItems);

                let reportExport = new ReportExport(reportItems, userProperties);
                reportExport.generateReport(document.querySelector("#include-summary").checked, document.querySelector("#include-summary-daily").checked);
            }
        }
    }

    let JewelData = Object.freeze({
        COLOR: {
            BLUE: "blue", //0
            BLACK: "black", //1
            BROWN: "brown", //2
            OCHRE: "ochre", //3
            GREY: "grey", //4
            SANDY: "sandy", //5
            YELLOW: "yellow", //6
        },

        getColorName: function (colorId) {
            switch (colorId) {
                case 0:
                    return this.COLOR.BLUE;
                case 1:
                    return this.COLOR.BLACK;
                case 2:
                    return this.COLOR.BROWN;
                case 3:
                    return this.COLOR.OCHRE;
                case 4:
                    return this.COLOR.GREY;
                case 5:
                    return this.COLOR.SANDY;
                case 6:
                    return this.COLOR.YELLOW;
                default:
                    return Strings.NOTAVAILABLE;
            }
        },

        getResourceName: function (color) {
            switch (color) {
                case this.COLOR.BLUE:
                    return "Freshwater";
                case this.COLOR.BLACK:
                    return "Coal | Oil";
                case this.COLOR.BROWN:
                    return "Wood";
                case this.COLOR.OCHRE:
                    return "Iron Ore";
                case this.COLOR.GREY:
                    return "Limestone";
                case this.COLOR.SANDY:
                    return "Sand";
                case this.COLOR.YELLOW:
                    return "Gold";
                default:
                    return Strings.NOTAVAILABLE;
            }
        },

        getEffect: function (jewelSize, jewelColor) {
            let percentageMarker = "##";
            let resourceNameMarker = "XXX";
            let result = `+${percentageMarker}% to [${resourceNameMarker}] production`;
            switch (jewelSize) {
                case 0: //small
                    result = result.replace("##", "0.5");
                    break;
                case 1: //medium
                    result = result.replace("##", "1.0"); // TODO: confirm
                    break;
            }

            result = result.replace(resourceNameMarker, this.getResourceName(jewelColor));
            return result;
        },

        getSize: function (sizeNumber) {
            switch (sizeNumber) {
                case 0:
                    return "small (+0.5%)";
                case 1:
                    return "medium";
                case 2:
                    return "large";
                case 3:
                    return "huge";
                default:
                    return Strings.NOTAVAILABLE;
            }
        }
    });

    class JewelReportItem {

        constructor(jewel, userProperties) {
            this.jewel = jewel;
            this.userProperties = userProperties;

            this.initDefault();

            this.init();
        }

        initDefault () {
            this.area = Strings.NOTAVAILABLE;
            this.country = Strings.NOTAVAILABLE;
            this.link = Strings.NOTAVAILABLE;
            this.description = Strings.NOTAVAILABLE;
            this.location = Strings.NOTAVAILABLE;
            this.tileClass = Strings.NOTAVAILABLE;
            this.tileCount = Strings.NOTAVAILABLE;
            this.color = Strings.NOTAVAILABLE;
            this.effect = Strings.NOTAVAILABLE;
            this.spawnDate = Strings.NOTAVAILABLE;
            this.size = Strings.NOTAVAILABLE;
            this.tier = Strings.NOTAVAILABLE;
            this.center = String.NOTAVAILABLE;
        }

        init () {

            let jewel = this.jewel;
            if (!helper.isAvailable(jewel)) {
                console.log("jewel is unavailable :| ");
            } else {

                let jewelLandField = this.jewel.landfield;
                if (!helper.isAvailable(jewelLandField)) {
                    console.log("no landfield for jewel: ", this.jewel);
                } else {
                    let matchingProperty = this.userProperties.find(p => p.id === this.jewel.landfield.id);
                    if (!helper.isAvailable(matchingProperty)) {
                        helper.showCustomToast(MessageSeverity.WARNING, `no matching property for crystal [${this.jewel.id}]`);
                    } else {
                        //console.log(`jewel [${this.jewel.id}] >> property`, matchingProperty);
                        let countryAndArea = helper.getCountryAndArea(matchingProperty);
                        if (!helper.isAvailable(countryAndArea)) {
                            console.warn(`No matching area/country for property`, matchingProperty);
                        } else {
                            this.area = countryAndArea.area;
                            this.country = countryAndArea.country;
                        }

                        this.propertyId = matchingProperty.id;
                        this.link = `https://app.earth2.io/#propertyInfo/${matchingProperty.id}`;
                        this.description = matchingProperty.description;
                        this.location = matchingProperty.location.split(",").map(l => l.trim()).reverse().join(" | ").replace(`${this.country} | `, "");

                        this.tileClass = matchingProperty.tileClass;
                        this.tileCount = matchingProperty.tileCount;
                    }

                    this.color = JewelData.getColorName(this.jewel.color);
                    //this.effect = JewelData.getEffect(this.jewel.size, this.color);
                    this.affectedProduction = JewelData.getResourceName(this.color);

                    this.spawnDateTime = this.jewel.created.replace("T", "|").replace("Z", "");
                    let spawnDateTimeParts = this.spawnDateTime.split("|")
                    this.spawnDate = spawnDateTimeParts[0];
                    this.spawnTime = spawnDateTimeParts[1];

                    this.size = JewelData.getSize(this.jewel.size);
                    this.tier = this.jewel.tier;

                    this.center = this.jewel.landfield.center;
                }
            }
        }

    }

    class ReportExport {
        constructor(reportItems, userProperties) {
            this.reportItems = reportItems;
            this.userProperties = userProperties;
        }

        generateReport (includeSummary, includeSummaryDaily) {
            console.log(`generate report summary [${includeSummary}] daily [${includeSummaryDaily}]`);

            let result = "";
            result += `If you want to thank me:${Strings.NEWLINE}use my code: MSZY5BLXAP${Strings.NEWLINE}or https://www.buymeacoffee.com/mihaj${Strings.NEWLINE}or Paypal (csimbum@gmail.com)${Strings.NEWLINE}or just say hello in discord: mihaj#5170${Strings.NEWLINE}${Strings.NEWLINE}`;

            let propertiesThatGeneratedJewels = [...new Set(this.reportItems.map(m => m.propertyId))];



            if (includeSummary) {

                result += `Total jewel count:,${this.reportItems.length}${Strings.NEWLINE}`;
                result += `Generated jewels:,${propertiesThatGeneratedJewels.length} properties out of ${this.userProperties.length}${Strings.NEWLINE}`;

                let luckyProperties = propertiesThatGeneratedJewels.map(propertyId => ({ propertyId: propertyId, jewelCount: this.reportItems.filter(ri => ri.propertyId === propertyId).length })).filter(res => res.jewelCount > 1);
                if (luckyProperties.length > 0) {
                    result += `${Strings.NEWLINE}lucky properties${Strings.NEWLINE}`;
                    luckyProperties.forEach(x => {
                        result += `${x.propertyId},${x.jewelCount}${Strings.NEWLINE}`;
                    });
                    result += Strings.NEWLINE;
                }
            }


            let csvHarvestHeader = `,Nr,Spawned at, Size, Tier, Production, Country, Location, Property description, Class, Tile count,# of jewels, center, link`;

            let dates = [...new Set(this.reportItems.map(m => m.spawnDate))];

            for (let i = 0; i < dates.length; i++) {
                let date = dates[i];

                console.log(`processing date [${date}]`);
                let reportItemsForDate = this.reportItems.filter(ri => ri.spawnDate === date);
                propertiesThatGeneratedJewels = [...new Set(reportItemsForDate.map(m => m.propertyId))];

                propertiesThatGeneratedJewels.forEach(propertyId => {
                    let jewelsByProperty = reportItemsForDate.filter(ri => ri.propertyId === propertyId);
                    jewelsByProperty.forEach(ri => { ri.jewelCount = jewelsByProperty.length });
                });

                if (i === 0) {
                    result += (includeSummaryDaily ? "," : "") + csvHarvestHeader;
                }
                result += `${Strings.NEWLINE}[${date}]`;
                result += this.getJewelCSVForDate(reportItemsForDate, includeSummaryDaily);


            }

            if (includeSummaryDaily) {
                for (let i = 0; i < dates.length; i++) {
                    let date = dates[i];

                    console.log(`processing date [${date}]`);
                    let reportItemsForDate = this.reportItems.filter(ri => ri.spawnDate === date);
                    propertiesThatGeneratedJewels = [...new Set(reportItemsForDate.map(m => m.propertyId))];
                    result += `${Strings.NEWLINE}[${date}]`;
                    result += `${Strings.NEWLINE}Jewels:,${reportItemsForDate.length}${Strings.NEWLINE}`;
                    result += `generated:,${propertiesThatGeneratedJewels.length} properties out of ${this.userProperties.length}${Strings.NEWLINE}`;

                    if (propertiesThatGeneratedJewels.length != reportItemsForDate.length) {
                        //there are properties that got more than one jewel
                        let multiSpawns = [];
                        propertiesThatGeneratedJewels.forEach(propertyId => {
                            let jewelsByProperty = reportItemsForDate.filter(ri => ri.propertyId === propertyId);
                            if (jewelsByProperty.length > 1) {
                                multiSpawns.push({ propertyId, count: jewelsByProperty.length });
                            }
                        });

                        console.log("multi spawns: ", multiSpawns);

                        if (multiSpawns.length > 0) {
                            result += `${Strings.NEWLINE}multiple jewels from:${Strings.NEWLINE}`;
                            result += `property Id, count${Strings.NEWLINE}`;
                            multiSpawns.forEach(ms => {
                                result += `${ms.propertyId},${ms.count}${Strings.NEWLINE}`;
                            });
                        }
                    }
                }
            }

            console.log("report items: ", this.reportItems);

            return helper.createDownloadFile("crystal-report", result);
        }

        getJewelCSVForDate (reportItemsForDate) {
            let result = "";
            reportItemsForDate.forEach((ri, index) => { result += this.getAsCSVString(ri, index, index !== reportItemsForDate.length - 1); });
            return result;
        }

        getAsCSVString (reportItem, index, addNewLine) {
            let jewelData = `${reportItem.spawnDateTime},${reportItem.size},${reportItem.tier},${reportItem.affectedProduction}`;
            let propertyData = `${reportItem.country},${reportItem.location},${helper.cleanString(reportItem.description)},${reportItem.tileClass},${reportItem.tileCount},${reportItem.jewelCount},${reportItem.center},${reportItem.link}`;
            let result = `,,${index + 1},${jewelData},${propertyData}`;
            if (addNewLine) {
                result += Strings.NEWLINE;
            }
            return result;
        }
    }

    let ui = new UIHandler();

    let resourcesInitStarted = false;
    if (!window.location.href.includes("resources")) {

        console.log("not resources page, init interval");

        let lastPageUrl = window.location.href;

        setInterval(() => {
            //console.log(`check [${lastPageUrl}] vs [${window.location.href}]`);
            if (lastPageUrl !== window.location.href) {

                if (window.location.href.includes("resources")) {
                    if (!resourcesInitStarted) {
                        console.log("init crystal reports")
                        resourcesInitStarted = true;
                        ui.init();
                    }
                }
                lastPageUrl = window.location.href;
            }
        }, 2000);
    } else {
        console.log("resources page");
        setTimeout(() => {
            console.log("resources page, init");
            ui.init();
        }, 1500);

    }

})();







