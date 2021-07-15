// ==UserScript==
// @name         E2 (earth2.io) - extension - profile page
// @namespace    http://earth2.io/
// @version      1.1.1
// @description  Extending the current functionality with additional filters, ordering and view mode (list, normal) and added night mode style
// @author       Mihaly Szolnoki -> E2: MihajA414 - MSZY5BLXAP -> discord: mihaj
// @match        https://app.earth2.io/
// @grant        none
// @currentversion	1.1.1 : added net worth in new tile price.
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
    'use strict';

    let MessageSeverity = Object.freeze({
        SUCCESS: "success",
        WARNING: "warning",
        ERROR: "error",
    });

    let Areas = Object.freeze({
        EU: "Europe",
        AF: "Africa",
        AS: "Asia",
        AM: "America",
        AT: "Antarctica",
        OC: "Oceania",
    });

    class Helper {
        constructor() {

            this.areas = ["Africa", "America", "Antarctica", "Asia", "Europe", "Oceania", "Other"];

            this.mappings = [
                { code: "__", country: "other (international)?" },

                { code: "ad", area: Areas.EU, country: "Andorra" },
                { code: "ae", area: Areas.AF, country: "Dubai" },
                { code: "af", area: Areas.AS, country: "Afghanistan" },
                { code: "ag", area: Areas.AM, country: "Antigua and Barbuda" },
                { code: "ai", area: Areas.AM, country: "Anguilla" },
                { code: "al", area: Areas.EU, country: "Albania" },
                { code: "am", area: Areas.AS, country: "Armenia" },
                { code: "ao", area: Areas.AF, country: "Angola" },
                { code: "aq", area: Areas.AT, country: "Antarctica" },
                { code: "ar", area: Areas.AM, country: "Argentina" },
                { code: "as", area: Areas.OC, country: "American Samoa" },
                { code: "at", area: Areas.EU, country: "Austria" },
                { code: "au", area: Areas.OC, country: "Australia" },
                { code: "aw", area: Areas.AM, country: "Aruba" },
                { code: "az", area: Areas.AS, country: "Azerbaijan" },

                { code: "ba", area: Areas.EU, country: "Bosnia Herzegovina" },
                { code: "bb", area: Areas.AM, country: "Barbados" },
                { code: "bd", area: Areas.AS, country: "Bangladesh" },
                { code: "be", area: Areas.EU, country: "Belgium" },
                { code: "bf", area: Areas.AF, country: "Burkina Faso" },
                { code: "bg", area: Areas.EU, country: "Bulgaria" },
                { code: "bh", area: Areas.AF, country: "Bahrain" },
                { code: "bi", area: Areas.AF, country: "Burundi" },
                { code: "bj", area: Areas.AF, country: "Benin" },
                { code: "bl", area: Areas.AM, country: "Saint Barthelemy" },
                { code: "bm", area: Areas.AM, country: "Bermuda" },
                { code: "bn", area: Areas.AS, country: "Brunei Darussalam" },
                { code: "bo", area: Areas.AF, country: "Bolivia" },
                { code: "br", area: Areas.AM, country: "Brazil" },
                { code: "bs", area: Areas.AM, country: "Bahamas" },
                { code: "bt", area: Areas.AS, country: "Bhutan" },
                { code: "bw", area: Areas.AF, country: "Botswana" },
                { code: "by", area: Areas.EU, country: "Belarus" },
                { code: "bz", area: Areas.AM, country: "Belize" },

                { code: "ca", area: Areas.AM, country: "Canada" },
                { code: "cd", area: Areas.AF, country: "Democratic Republic of Congo" },
                { code: "cf", area: Areas.AF, country: "Central African Republic" },
                { code: "cg", area: Areas.AF, country: "Congo" },
                { code: "ch", area: Areas.EU, country: "Switzerland" },
                { code: "ci", area: Areas.AF, country: "Côte d'Ivoire" },
                { code: "ck", area: Areas.OC, country: "Cook Islands" },
                { code: "cl", area: Areas.AM, country: "Chile" },
                { code: "cm", area: Areas.AF, country: "Cameroon" },
                { code: "cn", area: Areas.AS, country: "China" },
                { code: "co", area: Areas.AM, country: "Colombia" },
                { code: "cr", area: Areas.AM, country: "Costa Rica" },
                { code: "cu", area: Areas.AM, country: "Cuba" },
                { code: "cv", area: Areas.AF, country: "Cape Verde" },
                { code: "cw", area: Areas.AM, country: "Curaçao" },
                { code: "cy", area: Areas.EU, country: "Cyprus" },
                { code: "cz", area: Areas.EU, country: "Czech Republic" },

                { code: "de", area: Areas.EU, country: "Germany" },
                { code: "dj", area: Areas.AF, country: "Djibouti" },
                { code: "dk", area: Areas.EU, country: "Denmark" },
                { code: "dm", area: Areas.AM, country: "Dominica" },
                { code: "do", area: Areas.AM, country: "Dominican Republic" },
                { code: "dz", area: Areas.AF, country: "Algeria" },

                { code: "ec", area: Areas.AM, country: "Ecuador" },
                { code: "ee", area: Areas.EU, country: "Estonia" },
                { code: "eg", area: Areas.AF, country: "Egypt" },
                { code: "eh", area: Areas.AF, country: "Western Sahara" },
                { code: "er", area: Areas.AF, country: "Eritrea" },
                { code: "es", area: Areas.EU, country: "Spain" },
                { code: "et", area: Areas.AF, country: "Ethiopia" },

                { code: "fi", area: Areas.EU, country: "Finland" },
                { code: "fj", area: Areas.OC, country: "Fiji" },
                { code: "fk", area: Areas.AM, country: "Falkland Islands" },
                { code: "fm", area: Areas.OC, country: "Micronesia" },
                { code: "fo", area: Areas.EU, country: "Faroe" },
                { code: "fr", area: Areas.EU, country: "France" },

                { code: "ga", area: Areas.AF, country: "Gabon" },
                { code: "gb", area: Areas.EU, country: "United Kingdom" },
                { code: "gd", area: Areas.AM, country: "Grenada" },
                { code: "ge", area: Areas.AS, country: "Georgia" },
                { code: "gg", area: Areas.EU, country: "Guernsey" },
                { code: "gh", area: Areas.AF, country: "Ghana" },
                { code: "gi", area: Areas.EU, country: "Gibraltar" },
                { code: "gl", area: Areas.AM, country: "Greenland" },
                { code: "gm", area: Areas.AF, country: "Gambia" },
                { code: "gn", area: Areas.AF, country: "Guinea" },
                { code: "gq", area: Areas.AF, country: "Equatorial Guinea" },
                { code: "gr", area: Areas.EU, country: "Greece" },
                { code: "gs", area: Areas.AT, country: "South Georgia and the South Sandwich Islands" },
                { code: "gt", area: Areas.AM, country: "Guatemala" },
                { code: "gu", area: Areas.OC, country: "Guam" },
                { code: "gw", area: Areas.AF, country: "Guinea-Bissau" },
                { code: "gy", area: Areas.AM, country: "Guyana" },

                { code: "hk", area: Areas.AS, country: "Hong Kong" },
                { code: "hm", area: Areas.AT, country: "Heard and McDonald Islands" },
                { code: "hn", area: Areas.AM, country: "Honduras" },
                { code: "hr", area: Areas.EU, country: "Croatia" },
                { code: "ht", area: Areas.AM, country: "Haiti" },
                { code: "hu", area: Areas.EU, country: "Hungary" },

                { code: "id", area: Areas.AS, country: "Indonesia" },
                { code: "ie", area: Areas.EU, country: "Ireland" },
                { code: "im", area: Areas.EU, country: "Isle of Man" },
                { code: "in", area: Areas.AS, country: "India" },
                { code: "io", area: Areas.AS, country: "British Indian Ocean Territory" },
                { code: "is", area: Areas.EU, country: "Iceland" },
                { code: "it", area: Areas.EU, country: "Italy" },

                { code: "je", area: Areas.EU, country: "Jersey" },
                { code: "jm", area: Areas.AM, country: "Jamaica" },
                { code: "jo", area: Areas.AS, country: "Jordan" },
                { code: "jp", area: Areas.AS, country: "Japan" },

                { code: "ke", area: Areas.AF, country: "Kenya" },
                { code: "kg", area: Areas.AS, country: "Kyrgyzstan" },
                { code: "kh", area: Areas.AS, country: "Cambodia" },
                { code: "ki", area: Areas.OC, country: "Kiribati" },
                { code: "km", area: Areas.AF, country: "Comoros" },
                { code: "kn", area: Areas.AM, country: "Saint Kitts and Nevis" },
                { code: "kp", area: Areas.AS, country: "North Korea" },
                { code: "kr", area: Areas.AS, country: "South Korea" },
                { code: "kw", area: Areas.AS, country: "Kuwait" },
                { code: "ky", area: Areas.AM, country: "Cayman Islands" },
                { code: "kz", area: Areas.AS, country: "Kazakhstan" },

                { code: "la", area: Areas.AS, country: "Laos" },
                { code: "lb", area: Areas.AS, country: "Lebanon" },
                { code: "lc", area: Areas.AM, country: "Saint Lucia" },
                { code: "li", area: Areas.EU, country: "Liechtenstein" },
                { code: "lk", area: Areas.AS, country: "Sri Lanka" },
                { code: "lr", area: Areas.AF, country: "Liberia" },
                { code: "ls", area: Areas.AF, country: "Lesotho" },
                { code: "lt", area: Areas.EU, country: "Lithuania" },
                { code: "lu", area: Areas.EU, country: "Luxembourg" },
                { code: "lv", area: Areas.EU, country: "Latvia" },
                { code: "ly", area: Areas.AF, country: "Libya" },

                { code: "ma", area: Areas.AF, country: "Morocco" },
                { code: "mc", area: Areas.EU, country: "Monaco" },
                { code: "md", area: Areas.EU, country: "Moldova" },
                { code: "me", area: Areas.EU, country: "Montenegro" },
                { code: "mf", area: Areas.AM, country: "Saint Martin" },
                { code: "mg", area: Areas.AF, country: "Madagascar" },
                { code: "mh", area: Areas.OC, country: "Marshall Islands" },
                { code: "mk", area: Areas.EU, country: "North Macedonia" },
                { code: "ml", area: Areas.AF, country: "Mali" },
                { code: "mm", area: Areas.AS, country: "Myanmar" },
                { code: "mn", area: Areas.AS, country: "Mongolia" },
                { code: "mo", area: Areas.AS, country: "Macau" },
                { code: "mp", area: Areas.AS, country: "Northern Mariana Islands" },
                { code: "mr", area: Areas.AF, country: "Mauritania" },
                { code: "ms", area: Areas.AM, country: "Montserrat" },
                { code: "mt", area: Areas.EU, country: "Malta" },
                { code: "mu", area: Areas.AF, country: "Mauritius" },
                { code: "mv", area: Areas.AS, country: "Maldives" },
                { code: "mw", area: Areas.AF, country: "Malawi" },
                { code: "mx", area: Areas.AM, country: "Mexico" },
                { code: "my", area: Areas.AS, country: "Malaysia" },
                { code: "mz", area: Areas.AF, country: "Mozambique" },

                { code: "na", area: Areas.AF, country: "Namibia" },
                { code: "ne", area: Areas.AF, country: "Niger" },
                { code: "nf", area: Areas.OC, country: "Norfolk Island" },
                { code: "ng", area: Areas.AF, country: "Nigeria" },
                { code: "ni", area: Areas.AM, country: "Nicaragua" },
                { code: "nl", area: Areas.EU, country: "Netherlands" },
                { code: "no", area: Areas.EU, country: "Norway" },
                { code: "np", area: Areas.AS, country: "Nepal" },
                { code: "nr", area: Areas.OC, country: "Nauru" },
                { code: "nu", area: Areas.OC, country: "Niue" },
                { code: "nz", area: Areas.OC, country: "New Zealand" },

                { code: "om", area: Areas.AS, country: "Oman" },

                { code: "pa", area: Areas.AM, country: "Panama" },
                { code: "pe", area: Areas.AM, country: "Peru" },
                { code: "pf", area: Areas.OC, country: "Polynesia" },
                { code: "pg", area: Areas.OC, country: "Papua New Guinea" },
                { code: "ph", area: Areas.AS, country: "Philippines" },
                { code: "pk", area: Areas.AS, country: "Pakistan" },
                { code: "pl", area: Areas.EU, country: "Poland" },
                { code: "pn", area: Areas.OC, country: "Pitcairn" },
                { code: "pr", area: Areas.AM, country: "Puerto Rico" },
                { code: "ps", area: Areas.AS, country: "Palestinian Territories" },
                { code: "pt", area: Areas.EU, country: "Portugal" },
                { code: "pw", area: Areas.OC, country: "Palau" },
                { code: "py", area: Areas.AM, country: "Paraguay" },

                { code: "qa", area: Areas.AS, country: "Qatar" },

                { code: "ro", area: Areas.EU, country: "Romania" },
                { code: "rs", area: Areas.EU, country: "Serbia" },
                { code: "ru", area: Areas.AS, country: "Russia" },
                { code: "rw", area: Areas.AF, country: "Rwanda" },

                { code: "sb", area: Areas.OC, country: "Solomon Islands" },
                { code: "sc", area: Areas.AF, country: "Seychelles" },
                { code: "sd", area: Areas.AF, country: "Sudan" },
                { code: "se", area: Areas.EU, country: "Sweden" },
                { code: "sg", area: Areas.AS, country: "Singapore" },
                { code: "sh", area: Areas.AF, country: "Saint Helena" },
                { code: "si", area: Areas.EU, country: "Slovenia" },
                { code: "sj", area: Areas.EU, country: "Svalbard and Jan Mayen" },
                { code: "sk", area: Areas.EU, country: "Slovakia" },
                { code: "sl", area: Areas.AF, country: "Sierra Leone" },
                { code: "sm", area: Areas.EU, country: "San Marino" },
                { code: "sn", area: Areas.AF, country: "Senegal" },
                { code: "so", area: Areas.AF, country: "Somalia" },
                { code: "sr", area: Areas.AM, country: "Suriname" },
                { code: "ss", area: Areas.AF, country: "South Sudan" },
                { code: "st", area: Areas.AF, country: "Sao Tome and Principe" },
                { code: "sv", area: Areas.AM, country: "El Salvador" },
                { code: "sx", area: Areas.AM, country: "Little Bay, Sint Maarten" },
                { code: "sy", area: Areas.AS, country: "Syria" },
                { code: "sz", area: Areas.AF, country: "Eswatini" },

                { code: "tc", area: Areas.AM, country: "Turks and Caicos" },
                { code: "td", area: Areas.AF, country: "Chad" },
                { code: "tf", area: Areas.AT, country: "French Southern Territories" },
                { code: "tg", area: Areas.AF, country: "Togo" },
                { code: "th", area: Areas.AS, country: "Thailand" },
                { code: "tj", area: Areas.AS, country: "Tajikistan" },
                { code: "tl", area: Areas.AS, country: "Timor Leste" },
                { code: "tm", area: Areas.AS, country: "Turkmenistan" },
                { code: "tn", area: Areas.AF, country: "Tunisia" },
                { code: "to", area: Areas.OC, country: "Tonga" },
                { code: "tr", area: Areas.AS, country: "Turkey" },
                { code: "tt", area: Areas.AM, country: "Trinidad and Tobago" },
                { code: "tv", area: Areas.OC, country: "Tuvalu" },
                { code: "tw", area: Areas.AS, country: "Taiwan" },
                { code: "tz", area: Areas.AF, country: "Tanzania" },

                { code: "ua", area: Areas.EU, country: "Ukraine" },
                { code: "ug", area: Areas.AF, country: "Uganda" },
                { code: "us", area: Areas.AM, country: "United States" },
                { code: "um", area: Areas.OC, country: "US Minor Outlying Islands" },
                { code: "uy", area: Areas.AM, country: "Uruguay" },
                { code: "uz", area: Areas.AS, country: "Uzbekistan" },

                { code: "va", area: Areas.EU, country: "Vatican City" },
                { code: "vc", area: Areas.AM, country: "Saint Vincent and the Grenadines" },
                { code: "ve", area: Areas.AM, country: "Venezuela" },
                { code: "vg", area: Areas.AM, country: "British Virgin Islands" },
                { code: "vi", area: Areas.AM, country: "US Virgin Islands" },
                { code: "vn", area: Areas.AS, country: "Vietnam" },
                { code: "vu", area: Areas.OC, country: "Vanuatu" },

                { code: "ws", area: Areas.OC, country: "Samoa" },

                { code: "xx", area: Areas.AS, country: "Spratly Islands" },
                { code: "xy", area: Areas.EU, country: "Sovereign Base Areas of Akrotiri and Dhekelia" },

                { code: "ye", area: Areas.AS, country: "Yemen" },

                { code: "za", area: Areas.AF, country: "South Africa" },
                { code: "zm", area: Areas.AF, country: "Zambia" },
                { code: "zw", area: Areas.AF, country: "Zimbabwe" },

                //----
                { code: "united arab emirates", area: Areas.AS, country: "United Arab Emirates" },
                { code: "mayotte", area: Areas.AF, country: "Mayotte" },
                { code: "reunion", area: Areas.AF, country: "Reunion" },
                { code: "martinique", area: Areas.AM, country: "Martinique" },

                //----
                { code: "gf", area: Areas.AM, country: "French Guiana" },
                { code: "gp", area: Areas.AM, country: "Guadeloupe" },

                { code: "yt", area: Areas.AF, country: "Mayotte" },
                { code: "nc", area: Areas.OC, country: "New Caledonia" },
                { code: "re", area: Areas.AF, country: "Réunion" },
                { code: "pm", area: Areas.AM, country: "Saint Pierre and Miquelon" },
                { code: "tk", area: Areas.OC, country: "Tokelau" },
                { code: "wf", area: Areas.OC, country: "Wallis and Futuna" },

                //----
                { code: "pf", area: Areas.AS, country: "Paracel Islands" },
                { code: "fg", area: Areas.OC, country: "French Polynesia" },
                { code: "kv", area: Areas.EU, country: "Kosovo" },
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
        constructor(helperInstance) {
            this.helper = helperInstance;
        }

        async getUser () {
            this.userInfo = await fetch(`/api/v2/user_info/${window.auth0user.id}}/`).then(r => r.json()).then(r => r);
            return this.userInfo;
        }

        async getCSRFToken () {
            let csrfToken = await cookieStore.get('csrftoken').then(r => r);
            //console.log("token: ", csrfToken);
            return csrfToken;
        }

        async getUserLandFields () {
            let csrfToken = await this.getCSRFToken();

            let query =
                `{
                    getMyLandfields {
                        id, forSale, thumbnail, description, location, center, country, tileCount, tileClass, purchasedStr, purchasedTimestamp, purchaseValue, currentValue, tradingValue, systemValue, tilePrice, price, transactionSet{
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

                let parsedData = this.helper.tryParseJSON(data);
                if (parsedData != null) {
                    console.log("data: ", parsedData);
                    return parsedData.data.getMyLandfields;
                }

                return null;

            }).catch((error) => {
                console.log("fetch error in cacheproperties (getUserLandFields)", error);
            });

            this.setCustomProperties(properties);

            return properties;
        }

        async getUserLandFieldsPaged (userId) {
            let itemsPerPage = 1024;
            let query = `{
                getUserLandfields(userId: "${userId}", page: ##, items: ${itemsPerPage}) {
                    count,        
                    landfields {
                        id, forSale, thumbnail, description, location, center, country, tileCount, tileClass, purchasedStr, purchasedTimestamp, purchaseValue, currentValue, tradingValue, price, transactionSet{ price, time }
                    }
                }
            }`;

            let firstPage = await this.getUserLandfieldPage(query, 1);
            console.log("first page: ", firstPage);
            let result = firstPage.landfields;

            let totalCount = firstPage.count;
            let pageCount = Math.ceil(totalCount / itemsPerPage);

            console.log("total page count: " + pageCount);
            for (let i = 2; i <= pageCount; i++) {
                let pageData = await this.getUserLandfieldPage(query, i, pageCount);
                if (!this.helper.isAvailable(pageData)) {
                    throw new Error("error during fetch");
                } else {
                    result = result.concat(pageData.landfields);
                }
            }

            this.setCustomProperties(result);

            return result;
        }

        async getUserLandfieldPage (query, pageNumber, pageCount) {
            if (helper.isAvailable(pageCount)) {
                //console.log(`query page ${pageNumber} / ${pageCount}`);
                helper.showCustomToast(MessageSeverity.SUCCESS, `query page ${pageNumber} / ${pageCount}`);
            }

            let actualQuery = JSON.stringify({ "query": query.replace("##", pageNumber) });

            let csrfToken = await this.getCSRFToken();
            let properties = await fetch('/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "x-csrftoken": csrfToken.value },
                body: actualQuery
            }).then(r => {
                return r.text();
            }).then(data => {
                let result = null;
                //console.log("data: ", data);

                let parsedData = helper.tryParseJSON(data);
                if (parsedData != null) {
                    //console.log("data: ", parsedData);
                    result = parsedData.data.getUserLandfields;
                }

                return result;

            }).catch((error) => {
                console.log("fetch error in cacheproperties (getUserLandfieldPage)", error);
            });

            return properties;
        }

        setCustomProperties (properties) {
            properties.forEach(p => {
                let lastTransactionDate = p.transactionSet.map(tr => new Date(tr.time)).sort((a, b) => a < b)[0];
                p.purchasedDate = lastTransactionDate;
                let countryAndArea = this.helper.getCountryAndArea(p);
                if (this.helper.isAvailable(countryAndArea)) {
                    p.area = countryAndArea.area;
                    p.country = countryAndArea.country;
                } else {
                    p.area = "Other";
                    p.country = "";
                }

                p.valueIncreaseUSD = p.currentValue - p.purchaseValue;

                //get the #tags
            });
        }
    }

    let api = new E2API(helper);
    //let userInfo = await api.getUser();
    // console.log("user ", userInfo);

    // let userProperties = await api.getUserLandFields();
    // console.log("properties ", userProperties);

    class StyleHandler {
        constructor() {

        }

        addStyle (styleText, className) {
            try {
                if (Array.from(document.querySelectorAll(`style.${className}`)).length === 0) {
                    let sheet = document.createElement('style');
                    sheet.classList.add(className);
                    sheet.innerHTML = styleText;
                    document.body.appendChild(sheet);
                }
            } catch (e) {
                console.log("error in [addStyle]", e);
            }
        }

        addProfileStyles () {
            try {
                this.addFilterStyle();
                this.addSwitchStyle();
                this.addPageStyle();
                this.addCardStyle();
                this.addExportLinkStyle();
            } catch (e) {
                console.log("error in [addProfileStyles]", e);
            }
        }

        addFilterStyle () {
            let style = `

                /* Style The Dropdown Button */
                .filter-dropbtn {
                    background-color: #279B86;
                    color: white;
                    padding: 16px;
                    font-size: 16px;
                    border: none;
                    cursor: pointer;
                }

                /* The container <div> - needed to position the dropdown content */
                .filter-dropdown {
                    position: relative;
                    display: inline-block;
                }

                .filter-dropbtn, .filter-dropdown, .filter-dropdown-content{
                    min-width: 190px;
                }

                /* Dropdown Content (Hidden by Default) */
                .filter-dropdown-content {
                  display: none;
                  position: absolute;
                  background-color: #f9f9f9;
                  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                  z-index: 1;
                }

                .filter-dropdown-content.hide{
                    display:none;
                }

                /* Links inside the dropdown */
                .filter-dropdown-content a {
                  color: black;
                  padding: 12px 16px;
                  text-decoration: none;
                  display: block;
                  background: burlywood;
                  color: sienna;
                }

                /* Change color of dropdown links on hover */
                .filter-dropdown-content a:hover {
                    background-color: rgba(50,50,50,0.75);
                    color: snow;
                }

                /* Show the dropdown menu on hover */
                .filter-dropdown:hover .filter-dropdown-content {
                    display: block;
                    top: -235px;
                }

                /* Change the background color of the dropdown button when the dropdown content is shown */
                .filter-dropdown:hover .filter-dropbtn {
                    background-color: #3e8e41;
                }

                #mihaj-order-dropdown {
                    margin-right: 15px;
                }
            `;
            this.addStyle(style, "profile-filter");
        }

        addSwitchStyle () {
            let switchStyle = `
                .display-switch-container{
                    margin-top: 13px;
                }

                .display-switch-label{
                    margin-right: 10px;
                }

                .display-switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 34px;
                    margin-right: 15px;
                }

                .display-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                display-switch .display-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    -webkit-transition: .4s;
                    transition: .4s;
                }

                display-switch .display-slider:before {
                    position: absolute;
                    content: "";
                    height: 26px;
                    width: 26px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    -webkit-transition: .4s;
                    transition: .4s;
                }

                .display-switch input:checked + span.display-slider {
                    background-color: #279B86;
                }

                .display-switch input:focus + span.display-slider {
                    box-shadow: 0 0 1px #279B86;
                }

                .display-switch input:checked + span.display-slider:before {
                    -webkit-transform: translateX(30px);
                    -ms-transform: translateX(30px);
                    transform: translateX(30px);
                    border-radius: 50%;
                    left: 0;
                }

                /* Rounded sliders */
                .display-slider.round {
                    border-radius: 34px;
                }

                [type="checkbox"]+span.display-slider:not(.lever).round:before {
                    border-radius: 50%;
                }

                [type="checkbox"]+span.display-slider:not(.lever){
                    width: 50px;
                    height:24px;
                    background-color: dimgray;
                    top: 6px;
                }

                [type="checkbox"]+span.display-slider:not(.lever):before{
                    border: 7px solid snow;
                    width: 18px;
                    height: 18px;
                    position:absolute;
                    top: 0;
                }
                `;
            this.addStyle(switchStyle, "profile-view-switch");
        }

        addPageStyle () {
            let pageStyle = `
                .content-holder .profile.section{
                    background-color: darkgray;
                }

                .content-holder .profile.section .settings-header{
                    background-color: dimgray;
                }

                .profile .settings-content-holder b {
                    color: snow;
                }

                .profile-mihaj{
                    font-weight: normal;
                    font-size: 16px;
                }

                .profile-mihaj ref-code,
                .profile-mihaj tip-paypal,
                .profile-mihaj discord{
                    color: peachpuff;
                }
            `;
            this.addStyle(pageStyle, "profile-page-style");
        }

        addCardStyle () {
            let cardStyle = `
                .portfolio-content .card{
                    background-color: dimgray;
                    margin-bottom: 15px;
                }

                div.card-image{
                    border: 1px solid burlywood;
                }

                .portfolio-content .card .card-content{
                    padding-left: 10px;
                    padding-right: 10px;
                }

                div.card-content .description{
                    color: silver;
                }

                .portfolio-content .card .card-content .coordinates{
                    margin-top: 0px;
                }

                .portfolio-content .card .card-content .location,
                .portfolio-content .card .card-content .coordinates,
                .portfolio-content .card .card-content .tilelass {
                    color: snow;
                }

                .portfolio-content .card .card-content .price .trade-value{
                    margin-left: 15px;
                }

                .portfolio-content .card .card-content .price .land-price,
                .portfolio-content .card .card-content .price .tileclass {
                    margin-left: 5px;
                    position: absolute;
                    right: 10px;
                }

                .portfolio-content .card .card-content .price .tileclass{
                    color: darkorange;
                }

                .portfolio-content .card .card-content .price .land-price + .tileclass{
                    bottom: 30px;
                }

                .col-lg-4.col-md-6.col-12{
                    opacity: 1;
                }

                .col-lg-4.col-md-6.col-12:not(.list-view) .card{
                    min-height: 404px;
                }

                .col-lg-4.col-md-6.col-12.list-view{
                    max-width: unset;
                    width: 100%;
                    flex: unset;
                }

                .col-lg-4.col-md-6.col-12.list-view:nth-child(2n+1) .card{
                    background-color: slategray;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-image img{
                    display:none;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-content{
                    padding-top: 5px;
                    height: 100px;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-content .price,
                .col-lg-4.col-md-6.col-12.list-view .card-content .location,
                .col-lg-4.col-md-6.col-12.list-view .card-content .coordinates{
                    position:absolute;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-content .price{
                    top: 40px;
                    width: 100%;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-content .price .tileclass{
                    left: 370px;
                    right: unset;
                    bottom: unset;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-content .price .land-price{
                    right: 23px;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-content .location{
                    top: 70px;
                    left: 384px;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-content .coordinates{
                    top: 72px;
                    padding-left: 0;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-reveal .input-field,
                .col-lg-4.col-md-6.col-12.list-view .card-reveal .checkbox-group{
                    position: absolute;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-reveal .input-field:nth-child(1){
                    /*border: 1px solid red;*/
                }

                .col-lg-4.col-md-6.col-12.list-view .card-reveal .input-field:nth-child(2){
                    display: none;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-reveal .input-field:nth-child(3){
                    /*border: 1px solid green;*/
                    left: 333px;
                }

                .col-lg-4.col-md-6.col-12.list-view .card-reveal .checkbox-group{
                    right: 0;
                    top: 33px;
                }
            `;
            this.addStyle(cardStyle, "profile-card-style");
        }

        addExportLinkStyle () {
            let style = `
                #export-properties-csv{
                    margin-right: 30px;
                    position:relative;
                    top:20px;
                }
            `;
            this.addStyle(style, "export-link-style");
        }
    }

    class profilePageUpgrader {
        constructor(helperInstance) {
            this.selector = "profile";
            this.notifyDevMessage = "Notify dev -> discord: mihaj#5170";
            this.newTypeSelectId = "mihaj-type-filter";

            this.typeFilters = [
                "all",
                "all_forsale",
                "all_notforsale",
                "class1_all",
                "class1_forsale",
                "class2_all",
                "class2_forsale",
                "class3_all",
                "class3_forsale",
                "class4_all",
                "class4_forsale",

                "area_africa",
                "area_america",
                "area_antarctica",
                "area_asia",
                "area_europe",
                "area_oceania",
                "area_other"
            ];

            this.newSelectTemplate = `
            <div id ='${this.newTypeSelectId}' class="filter-dropdown">
                <button id="property-filter-btn" class="filter-dropbtn"></button>
                <div class="filter-dropdown-content">
                    <a href="#" data-filter="${this.typeFilters[0]}" >All owned</a>
                    <a href="#" data-filter="${this.typeFilters[1]}" >For sale (all)</a>
                    <a href="#" data-filter="${this.typeFilters[2]}" >Not for sale</a>

                    <a href="#" data-filter="${this.typeFilters[3]}" >Class 1</a>
                    <a href="#" data-filter="${this.typeFilters[4]}" >Class 1 (for sale)</a>
                    <a href="#" data-filter="${this.typeFilters[5]}" >Class 2</a>
                    <a href="#" data-filter="${this.typeFilters[6]}" >Class 2 (for sale)</a>
                    <a href="#" data-filter="${this.typeFilters[7]}" >Class 3</a>
                    <a href="#" data-filter="${this.typeFilters[8]}" >Class 3 (for sale)</a>
                    <a href="#" data-filter="${this.typeFilters[9]}" >Class 4</a>
                    <a href="#" data-filter="${this.typeFilters[10]}" >Class 4 (for sale)</a>

                    <a href="#" data-filter="${this.typeFilters[11]}" >Area: Africa</a>
                    <a href="#" data-filter="${this.typeFilters[12]}" >Area: America</a>
                    <a href="#" data-filter="${this.typeFilters[13]}" >Area: Antarctica</a>
                    <a href="#" data-filter="${this.typeFilters[14]}" >Area: Asia</a>
                    <a href="#" data-filter="${this.typeFilters[15]}" >Area: Europe</a>
                    <a href="#" data-filter="${this.typeFilters[16]}" >Area: Oceania</a>
                    <a href="#" data-filter="${this.typeFilters[17]}" >Area: Other</a>
                </div>
            </div>
            `;

            this.newOrderSelectId = "mihaj-order-dropdown";

            this.newOrderFilters = [
                "default",
                "purchased_desc",
                "purchased_asc",
                "current_value_desc",
                "current_value_asc",
                "value_increase_desc",
                "value_increase_asc",
                "tile_count_desc",
                "tile_count_asc",
                "location_desc",
                "location_asc",
            ];

            this.newOrderTemplate = `
            <div id ='${this.newOrderSelectId}' class="filter-dropdown">
                <button id="property-order-btn" class="filter-dropbtn"></button>
                <div class="filter-dropdown-content">
                    <a href="#" data-order="${this.newOrderFilters[0]}" >Default order</a>
                    <a href="#" data-order="${this.newOrderFilters[1]}" >Purchased date (desc)</a>
                    <a href="#" data-order="${this.newOrderFilters[2]}" >Purchased date (asc)</a>
                    <a href="#" data-order="${this.newOrderFilters[3]}" >Current value (desc)</a>
                    <a href="#" data-order="${this.newOrderFilters[4]}" >Current value (asc)</a>
                    <a href="#" data-order="${this.newOrderFilters[5]}" >Value increase ($) (desc)</a>
                    <a href="#" data-order="${this.newOrderFilters[6]}" >Value increase ($) (asc)</a>
                    <a href="#" data-order="${this.newOrderFilters[7]}" >Tile count (desc)</a>
                    <a href="#" data-order="${this.newOrderFilters[8]}" >Tile count (asc)</a>
                    <a href="#" data-order="${this.newOrderFilters[9]}" >Location (desc)</a>
                    <a href="#" data-order="${this.newOrderFilters[10]}" >Location (asc)</a>
                </div>
            </div>
            `;

            this.cardsDataCache = new Map();
            //  TO REPLACE:
            //  * #PROPERTYID#
            //  * #DATALANDCENTRE#
            //  * #TILECOUNT#
            //  * #DESCRIPTION#
            //  * #CURRENTVALUE#
            //  * #PURCHASEVALUE#
            //  * #TRADEVALUE#
            //  * #LOCATION#
            //  * #TILECLASS#
            this.cardTemplate = `
                <div class="col-lg-4 col-md-6 col-12">
                    <div class="card ">
                        <a href="#propertyInfo/#PROPERTYID#">
                            <div class="card-image">
                                <img style="height: 320px; object-fit: cover" id="profile-landfield-img-2"
                                    src="https://s3-ap-southeast-2.amazonaws.com/prod-app-media.earth2.io/thumbnails/#PROPERTYID#.jpg"
                                    data-land-centre="#DATALANDCENTRE#">
                                <div class="tile-count"><b>#TILECOUNT#</b> tiles</div>
                            </div>
                            <div class="card-content">
                                <div class="description">#DESCRIPTION#</div>
                                <div class="price">$#CURRENTVALUE# ($#PURCHASEVALUE#) #SELL# <div class="tileclass">Class #TILECLASS#</div></div>
                                <div class="location"><i class="material-icons">location_on</i>#DATALANDCENTRE#</div>
                                <div class="coordinates">#LOCATION#</div>
                            </div>
                        </a>
                        <div class="card-action"> <a class="activator" data-for="#PROPERTYID#">Edit / Sell</a> </div>
                        <div class="card-reveal">
                            <div class="card-content">
                                <div class="input-field"> <input type="text" id="descriptionInput-#PROPERTYID#"> <label class="active" for="descriptionInput-#PROPERTYID#">Description</label> </div>
                                <div class="input-field"> <input type="text" disabled="true" id="locationInput-#PROPERTYID#"> <label class="active" for="locationInput-#PROPERTYID#">Location</label> </div>
                                <div class="input-field"> <input step="0.01" min="0" id="priceInput-#PROPERTYID#" type="number"> <label class="active" for="priceInput-#PROPERTYID#">How much would you like to sell for?</label> </div>
                                <div class="checkbox-group"> <label><input type="checkbox" id="availabiltyCheckbox-#PROPERTYID#" #ADVERTISED#><span>Advertise in Marketplace</span></label> </div>
                            </div>
                            <div class="card-action"> <a class="card-title" id="closeEditButton-#PROPERTYID#">Cancel</a> <a class="card-save">Save</a> </div>
                        </div>
                    </div>
                </div>
            `;

            this.fadeOutDuration = 0.5;

            this.displayModeSwitchTemplate = `
            <div class="display-switch-container">
                <span class="display-switch-label">Normal view</span>
                <label class="display-switch">
                    <input type="checkbox" checked>
                    <span class="display-slider round"></span>
                </label>
            </div>
            `;

            this.propertyExportLinkTemplate = `
            <div><a id="export-properties-csv" href="#"><span>Export properties</span></a></div>
            `;

            this.additionalHtml = `
            <div class="profile-mihaj">
                <div class="profile-mihaj support-me"><span>You can support me by using my code (<ref-code>MSZY5BLXAP</ref-code>) or by tipping on Paypal (<tip-paypal>csimbum@gmail.com</tip-paypal>)</span></div>
                <div class="profile-mihaj contact-me"><span>Any errors, issues, suggestions -> discord: <discord>mihaj#5170</discord></span></div>
            </div>
            `;

            this.helper = helperInstance;
            this.styleHandlerInstance = new StyleHandler(this.helper);
        }

        checkProfilePageUpgrade () {
            if (this.helper.isAvailable(window.location.hash) && window.location.hash.includes("profile")) {

                if (this.helper.isAvailable(window.auth0user)
                    && window.location.hash.includes(window.auth0user.id)) {
                    this.customiseProfilePage();
                }

            } else {
                console.log("no hash");
            }
        }

        customiseProfilePage () {
            //customising the profile page.
            //1) remove filter
            //2) add new filters
            //3) add display type dropdown
            //4) add new style for cards
            //5) pagination (?)
            ; (async () => {
                this.helper.showCustomToast(MessageSeverity.SUCCESS, "Starting profile page upgrade");

                let cachedSuccess = await this.cacheProperties();
                // if (!cachedSuccess) {
                //     let maxRetry = 10;
                //     let retryCount = 1;
                //     while (retryCount < maxRetry) {
                //         console.log(`retry property caching ${retryCount}/${maxRetry}`);
                //         cachedSuccess = await this.cacheProperties();
                //         if (cachedSuccess) {
                //             break;
                //         } else {
                //             retryCount++;
                //         }
                //     }
                // }

                if (!cachedSuccess) {
                    this.helper.showCustomToast(MessageSeverity.ERROR, `something went wrong. Please reload page, if the issue persists: ${this.notifyDevMessage}`)
                } else {
                    //await this.cacheImages();

                    this.styleHandlerInstance.addProfileStyles();
                    this.removeReaddFilters();
                    this.addExtraHtml();

                    //let secondaryImage = document.querySelector(".profile-secondary-image");
                    //secondaryImage.src = secondaryImage.src.replace("svg", "png");

                    setTimeout(() => {
                        this.helper.showCustomToast(MessageSeverity.SUCCESS, "Upgrade finished");
                    }, 1000);

                }
            })();
        }

        addExtraHtml () {
            try {
                document.querySelector(".settings-header .content").insertAdjacentHTML("beforeend", this.additionalHtml);
            } catch (e) {
                console.log("error in [addExtraHtml]", e);
            }
        }

        async cacheProperties () {

            try {
                let properties = await api.getUserLandFields();

                if (properties != null && properties != "") {
                    this.propertiesCache = properties;
                    window.propertiesCache = properties;
                    return true;
                }

                return false;
            } catch (e) {
                console.log("error in [cacheProperties]", e);
            }

            try {
                let properties = await api.getUserLandFieldsPaged(window.auth0user.id);
                if (properties != null && properties != "") {
                    this.propertiesCache = properties;
                    window.propertiesCache = properties;
                    return true;
                }

                return false;
            } catch (e) {
                console.log("error in [cacheProperties 2]")
            }

            return false;
        }

        removeReaddFilters () {
            try {
                let currentFilter = document.querySelector(".select-wrapper");
                if (this.helper.isAvailable(currentFilter)) {
                    currentFilter.remove();
                }
                let currentPagination = document.querySelector("ul.pagination");
                if (this.helper.isAvailable(currentPagination)) {
                    currentPagination.remove();
                }

                this.addDisplayTypeDropdown();
                this.addOrderingDropdown();
                this.addDisplayModeSwitch();
                this.addExportLink();

                this.removeCards();
                this.generateCards(this.typeFilter, this.order);

                this.addNetWorthInNewLandPrice();
            } catch (e) {
                console.log("error in [removeReaddFilters]", e);
            }
        }

        addNetWorthInNewLandPrice(){
            let totalNetWorthInNewLandPrice = window.propertiesCache.reduce((a, b) => a + b.systemValue, 0).toFixed(2);
            console.log("net worth in new tile price: ", totalNetWorthInNewLandPrice);
            document.querySelector(".networth b").insertAdjacentHTML("beforeend", `<span> (in new tile price: E$${totalNetWorthInNewLandPrice})</span>`);
        }

        addDisplayTypeDropdown () {
            try {
                document.querySelector(".profile-title").insertAdjacentHTML("afterend", this.newSelectTemplate);

                let newSelect = document.querySelector(`#${this.newTypeSelectId}`);
                let allLinks = Array.from(newSelect.querySelectorAll("a"));
                this.setPropertyTypeButtonText(allLinks[0].textContent); //set the button text to the first one
                this.typeFilter = allLinks[0].getAttribute("data-filter");

                [1, 2, 3, 4].forEach(classNumber => {
                    let hasClass = this.propertiesCache.some(p => p.tileClass === classNumber);
                    if (!hasClass) {
                        allLinks.filter(l => l.getAttribute("data-filter").includes(`class${classNumber}`)).forEach(l => l.remove());
                    }
                });

                allLinks.forEach(link => {
                    link.addEventListener("click", (e) => {
                        this.handleTypeChange(link, link.getAttribute("data-filter"));
                        e.preventDefault();
                    }, false);
                });
            } catch (e) {
                console.log("error in [addDisplayTypeDropdown]", e);
            }
        }

        setPropertyTypeButtonText (newText) {
            try {
                document.querySelector("#property-filter-btn").textContent = newText;
            } catch (e) {
                console.log("error in [setPropertyTypeButtonText]", e);
            }
        }

        addOrderingDropdown () {
            try {
                document.querySelector(".profile-title").insertAdjacentHTML("afterend", this.newOrderTemplate);

                let newOrder = document.querySelector(`#${this.newOrderSelectId}`);
                let allLinks = Array.from(newOrder.querySelectorAll("a"));
                this.setPropertyOrderButtonText(allLinks[0].textContent);
                this.order = allLinks[0].getAttribute("data-order");

                allLinks.forEach(link => {
                    link.addEventListener("click", (e) => {
                        this.handleOrderChange(link, link.getAttribute("data-order"));
                        e.preventDefault();
                    }, false);
                });
            } catch (e) {
                console.log("error in [addOrderingDropdown]", e);
            }
        }

        setPropertyOrderButtonText (newText) {
            try {
                document.querySelector("#property-order-btn").textContent = newText;
            } catch (e) {
                console.log("error in [setPropertyOrderButtonText]", e);
            }
        }

        addDisplayModeSwitch () {
            try {
                document.querySelector(".profile-title").insertAdjacentHTML("afterend", this.displayModeSwitchTemplate);

                let switchCheckbox = document.querySelector(".display-switch").querySelector("input[type='checkbox']");
                switchCheckbox.addEventListener("change", () => { this.handleDisplayModeChange(switchCheckbox.checked); });

                this.displayMode = "normal";
            } catch (e) {
                console.log("error in [addDisplayModeSwitch]", e);
            }
        }

        handleTypeChange (link, newTypeFilter) {
            try {
                if (this.typeFilter !== newTypeFilter) {
                    this.removeCards();
                    this.generateCards(newTypeFilter, this.order);

                    this.typeFilter = newTypeFilter;
                    this.setPropertyTypeButtonText(link.textContent);
                }
                this.removeDropdownFocus(link);
            } catch (e) {
                console.log("error in [handleTypeChange]", e);
            }
        }

        handleOrderChange (link, newOrder) {
            try {
                if (this.order !== newOrder) {
                    this.removeCards();
                    this.generateCards(this.typeFilter, newOrder);

                    this.order = newOrder;
                    this.setPropertyOrderButtonText(link.textContent);
                }
                this.removeDropdownFocus(link);
            } catch (e) {
                console.log("error in [handleOrderChange]", e);
            }
        }

        handleDisplayModeChange (checked) {
            try {
                let label = document.querySelector(".display-switch-label");
                Array.from(document.querySelectorAll(".col-lg-4.col-md-6.col-12")).forEach(c => {
                    if (checked) {
                        label.textContent = "Normal view";
                        c.classList.remove("list-view");
                        this.displayMode = "normal";
                    } else {
                        label.textContent = "List view";
                        c.classList.add("list-view");
                        this.displayMode = "list";
                    }

                });
            } catch (e) {
                console.log("error in [handleDisplayModeChange]", e);
            }

        }

        removeDropdownFocus (link) {
            try {
                link.parentElement.classList.add("hide");
                setTimeout(() => { link.parentElement.classList.remove("hide"); }, 50);
            } catch (e) {
                console.log("error in [removeDropdownFocus]", e);
            }
        }

        removeCards () {
            try {
                let allCards = Array.from(document.querySelectorAll(".col-lg-4.col-md-6.col-12"));
                let cardRow = [];
                for (let i = 0; i < allCards.length; i++) {
                    let currentCard = allCards[i];
                    currentCard.remove();
                }
            } catch (e) {
                console.log("error in [removeCards]", e);
            }

        }

        generateCards (filter, order) {
            try {
                //console.log(`generate cards filter:[${filter} - ${typeof(filter)}] order:[${order} - ${typeof(order)}]`);
                let newPropertiesData = this.filterAndOrderData(filter, order);

                if (newPropertiesData.length === 0) {
                    console.log("no data");
                    //TODO: show empty page
                } else {

                    let newCards = [];
                    newPropertiesData.forEach(propertyData => {
                        let newCard = this.cardTemplate
                            .replaceAll("#PROPERTYID#", propertyData.id)
                            .replaceAll("#DATALANDCENTRE#", propertyData.center)
                            .replaceAll("#TILECOUNT#", propertyData.tileCount)
                            .replaceAll("#DESCRIPTION#", propertyData.description)
                            .replaceAll("#CURRENTVALUE#", propertyData.currentValue)
                            .replaceAll("#PURCHASEVALUE#", propertyData.purchaseValue)
                            .replaceAll("#TRADEVALUE#", propertyData.tradingValue)
                            .replaceAll("#LOCATION#", propertyData.location.split(",").reverse().map(m => m.trim()).join(" | "))
                            .replaceAll("#TILECLASS#", propertyData.tileClass)
                            .replaceAll("#SELL#", propertyData.forSale ? `<span class="land-price"> ${propertyData.price.toFixed(2)} <span class="buy-tag">BUY</span> </span>` : ``)
                            .replaceAll("#ADVERTISED#", propertyData.forSale ? "checked" : "")
                            ;
                        newCards.push(newCard);
                    });

                    let container = document.querySelector(".portfolio-content.card-list .row");
                    newCards.forEach(card => { container.insertAdjacentHTML("beforeend", card); });

                    this.handleDisplayModeChange(document.querySelector(".display-switch").querySelector("input[type='checkbox']").checked);

                    Array.from(document.querySelectorAll("a.activator")).forEach(anchor => {
                        anchor.addEventListener("click", () => {
                            let propertyId = anchor.getAttribute("data-for");
                            let curProperty = newPropertiesData.filter(p => p.id === propertyId);
                            if (curProperty.length === 1) {
                                curProperty = curProperty[0];

                                let cardElement = anchor.parentElement.parentElement;
                                let inputFields = Array.from(cardElement.querySelectorAll("input"));
                                inputFields.forEach(inputField => {

                                    if (inputField.id.includes("description")) {
                                        inputField.value = curProperty.description;
                                    }
                                    if (inputField.id.includes("location")) {
                                        inputField.value = curProperty.location;
                                    }
                                    if (inputField.id.includes("price")) {
                                        inputField.value = curProperty.price.toFixed(2);
                                    }
                                });

                                cardElement.querySelector(".card-action .card-save").addEventListener("click", () => { this.handleEditSellClick(curProperty, cardElement) });
                            }
                        })
                    });
                }

                document.querySelector(".profile-title").textContent = `Profile | Displayed: ${newPropertiesData.length} items`;
            } catch (e) {
                console.log("error in [generateCards]", e);
            }
        }

        filterAndOrderData (filter, order) {
            try {
                let filterFunc = (p) => true;
                switch (filter) {
                    case this.typeFilters[0]: //all
                        filterFunc = (p) => true;
                        break;
                    case this.typeFilters[1]: //all_forsale
                        filterFunc = (p) => p.forSale;
                        break;
                    case this.typeFilters[2]: //all_notforsale
                        filterFunc = (p) => !p.forSale;
                        break;
                    case this.typeFilters[11]:
                    case this.typeFilters[12]:
                    case this.typeFilters[13]:
                    case this.typeFilters[14]:
                    case this.typeFilters[15]:
                    case this.typeFilters[16]:
                    case this.typeFilters[17]:
                        filterFunc = (p) => p.area.toLowerCase() === filter.replace("area_", "");
                        break;
                    default:
                        //class filter;
                        let forSale = filter.includes("_forsale");
                        let tileClass = parseInt(filter.split("_")[0].replace("class", ""));
                        filterFunc = (p) => (forSale ? p.forSale : true) && (p.tileClass === tileClass);
                        break;
                }

                let newPropertiesData = this.propertiesCache.filter(filterFunc);

                let orderFunc = null;
                switch (order) {
                    case this.newOrderFilters[1]:
                        orderFunc = (p1, p2) => p1.purchasedDate < p2.purchasedDate ? 1 : -1;
                        break;
                    case this.newOrderFilters[2]:
                        orderFunc = (p1, p2) => p1.purchasedDate > p2.purchasedDate ? 1 : -1;
                        break;
                    case this.newOrderFilters[3]:
                        orderFunc = (p1, p2) => p1.currentValue < p2.currentValue ? 1 : -1;
                        break;
                    case this.newOrderFilters[4]:
                        orderFunc = (p1, p2) => p1.currentValue > p2.currentValue ? 1 : -1;
                        break;
                    case this.newOrderFilters[5]:
                        orderFunc = (p1, p2) => p1.valueIncreaseUSD < p2.valueIncreaseUSD ? 1 : -1;
                        break;
                    case this.newOrderFilters[6]:
                        orderFunc = (p1, p2) => p1.valueIncreaseUSD > p2.valueIncreaseUSD ? 1 : -1;
                        break;
                    case this.newOrderFilters[7]:
                        orderFunc = (p1, p2) => p1.tileCount < p2.tileCount ? 1 : -1;
                        break;
                    case this.newOrderFilters[8]:
                        orderFunc = (p1, p2) => p1.tileCount > p2.tileCount ? 1 : -1;
                        break;
                    case this.newOrderFilters[9]:
                        orderFunc = (p1, p2) => {
                            var loc1 = p1.location.split(",").reverse().map(l => l.trim());
                            var loc2 = p2.location.split(",").reverse().map(l => l.trim());

                            let res = 0;
                            for (let i = 0; i < Math.min(loc1.length, loc2.length); i++) {
                                res = -1 * loc1[i].localeCompare(loc2[i]);

                                //console.log(`compare[${i}]: [${loc1[i]}] <> [${loc2[i]}]`, { l1: loc1, l2: loc2, res: loc1[i].localeCompare(loc2[i]) });

                                if (res !== 0) {
                                    break;
                                }
                            }
                            return res;
                        }
                        break;
                    case this.newOrderFilters[10]:
                        orderFunc = (p1, p2) => {
                            var loc1 = p1.location.split(",").reverse().map(l => l.trim());
                            var loc2 = p2.location.split(",").reverse().map(l => l.trim());

                            //console.log(`compare: [${loc1[0]}] <> [${loc2[0]}]`, { l1: loc1, l2: loc2, res: loc1[0].localeCompare(loc2[0]) });
                            let res = 0;
                            for (let i = 0; i < Math.min(loc1.length, loc2.length); i++) {
                                res = loc1[i].localeCompare(loc2[i]);

                                //console.log(`compare[${i}]: [${loc1[i]}] <> [${loc2[i]}]`, { l1: loc1, l2: loc2, res: loc1[i].localeCompare(loc2[i]) });

                                if (res !== 0) {
                                    break;
                                }
                            }
                            return res;

                        }
                }
                if (this.helper.isAvailable(orderFunc)) {
                    newPropertiesData = newPropertiesData.sort(orderFunc);
                }

                return newPropertiesData;
            } catch (e) {
                console.log("error in [filterAndOrderData]", e);
            }
        }

        async handleEditSellClick (property, cardElement) {
            try {
                let inputFields = Array.from(cardElement.querySelectorAll("input"));
                let forSale = cardElement.querySelector(".checkbox-group input[type='checkbox']").checked;
                let forSalePrice = inputFields.filter(i => i.id.includes("price"))[0].value;
                if (!parseFloat(forSalePrice)) {
                    this.helper.showCustomToast(MessageSeverity.ERROR, "invalid for sale value");
                } else {
                    let query = `mutation {
                        editMyLandfield(
                            description: "#DESCRIPTION#",
                            location: "#LOCATION#",
                            price: #FORSALEPRICE#,
                            forSale: #FORSALE#,
                            landfieldId: "#PROPERTYID#"
                        ) {
                            landfields {
                                id
                            }
                        }
                    }`;

                    let newDescription = inputFields.filter(i => i.id.includes("description"))[0].value;

                    query = query
                        .replace("#DESCRIPTION#", newDescription)
                        .replace("#LOCATION#", property.location)
                        .replace("#FORSALEPRICE#", forSalePrice)
                        .replace("#FORSALE#", forSale)
                        .replace("#PROPERTYID#", property.id);
                    let actualQuery = JSON.stringify({ "query": query });

                    let csrfToken = await api.getCSRFToken();

                    let result = await fetch('/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "X-CSRFToken": csrfToken.value },
                        body: actualQuery
                    }).then(r => { return r.text(); }).then(data => {
                        let parsedData = this.helper.tryParseJSON(data);

                        if (!this.helper.isAvailable(parsedData) || !this.helper.isAvailable(parsedData.data)) {
                            console.log("data and parsed: ", { data, parsedData });
                            return "";
                        }

                        return parsedData;
                    }).catch((error) => {
                        console.log("fetch error in handleEditSellClick", error);
                    });;

                    if (this.helper.isAvailable(result.errors)) {
                        //error
                        this.helper.showCustomToast(MessageSeverity.ERROR, result.errors[0].message);
                    } else {
                        //success
                        this.helper.showCustomToast(MessageSeverity.SUCCESS, "Changes saved successfully");
                        cardElement.querySelector("a.card-title").click();

                        property.forSale = forSale;
                        property.price = parseFloat(forSalePrice);
                        property.description = newDescription;

                        this.removeCards();
                        this.generateCards(this.typeFilter, this.order);
                    }
                }
            } catch (e) {
                console.log("error in [handleEditSellClick]", e);
            }
        }

        addExportLink () {
            document.querySelector(".profile-title").insertAdjacentHTML("afterend", this.propertyExportLinkTemplate);

            let _this = this;
            let exportLink = document.querySelector("#export-properties-csv").addEventListener("click", (e) => {
                _this.exportPropertiesCSV();
                e.preventDefault();
            });
        }

        exportPropertiesCSV () {
            try {
                let allProperties = this.propertiesCache.map(p => {
                    let loc = "";
                    if (this.helper.isAvailable(p["location"])) {
                        loc = this.helper.cleanString(p.location.replaceAll(",", " | ").replace(" |  " + p.countryName, ""));
                        if (loc.startsWith(" |  ")) {
                            loc = loc.slice(4);
                        }
                    }
                    let desc = "";
                    if (this.helper.isAvailable(p.description)) {
                        desc = this.helper.cleanString(p.description.replaceAll(",", " | "));
                    }
                    let link = `https://app.earth2.io/#propertyInfo/${p.id}`;
                    let forSale = "No";
                    let forSaleValue = "";
                    let forSaleVsNewLandPrice = "";
                    let forSaleVsPricePaid = "";
                    if (p.forSale) {
                        forSale = "Yes";
                        forSaleValue = p.price;

                        let forSaleVsNewLand = (p.price / p.currentValue) * 100 - 100;
                        forSaleVsNewLandPrice = `${(forSaleVsNewLand).toFixed(2)}%`;

                        let forSaleVsPaid = (p.price / p.purchaseValue) * 100 - 100;
                        forSaleVsPricePaid = `${(forSaleVsPaid).toFixed(2)}%`;
                    }

                    let increase = `${((p.currentValue / p.purchaseValue) * 100).toFixed(2)}%`;
                    let for100profit = p.purchaseValue * 2.05;
                    let for200profit = p.purchaseValue * 3.05;
                    let for300profit = p.purchaseValue * 4.05;
                    let for400profit = p.purchaseValue * 5.05;
                    let for500profit = p.purchaseValue * 6.05;

                    if (this.helper.isAvailable(p.center)) {
                        let latlng = p.center.split(" ");

                        p.latitude = latlng[1];
                        p.longitude = latlng[0];
                    } else {
                        p.latitude = "";
                        p.longitude = "";
                    }

                    let purchasedDate = p.purchasedDate;
                    if (this.helper.isAvailable(purchasedDate)) {
                        let year = purchasedDate.getFullYear().toString();
                        let month = (purchasedDate.getMonth() + 1).toString().padStart(2, '0');
                        let day = purchasedDate.getDate().toString().padStart(2, '0');
                        let hours = purchasedDate.getHours().toString().padStart(2, '0');
                        let minute = purchasedDate.getMinutes().toString().padStart(2, '0');
                        let seconds = purchasedDate.getSeconds().toString().padStart(2, '0');

                        purchasedDate = `${year}-${month}-${day} | ${hours}:${minute}:${seconds}`;
                    }

                    let result = `${p.country},${loc},${desc},${forSale},${p.tileCount},${p.tileClass}`
                        + `,${purchasedDate},${p.purchaseValue},${p.currentValue},${increase},${forSaleValue},${forSaleVsNewLandPrice},${forSaleVsPricePaid},${link}`
                        + `,${for100profit},${for200profit},${for300profit},${for400profit},${for500profit}`
                        + `,${p.latitude},${p.longitude}`
                        ;

                    return result;
                });

                window.allPropertiesCSV = "If you want to thank me:\r\nuse my code: MSZY5BLXAP\r\n or tip (Paypal: csimbum@gmail.com)\r\ncontact: discord: mihaj#5170\r\n"
                    + "Country,Location,Description,For sale?,Tile count, Tile class,Purchase date,Price paid,Current value,Value %,For Sale Value,Sale vs New Land, Sale vs Price Paid,Link"
                    + ",Price for 100% profit,200% profit,300% profit,400% profit,500% profit"
                    + ",Latitude,Longitude"
                    + "\r\n"
                    + allProperties.join("\r\n");

                this.helper.createDownloadFile("properties", window.allPropertiesCSV);
            } catch (e) {
                console.log("error in export", e);
            }
        }
    }

    setTimeout(() => {
        try {

            let profilePageUpgraderInstance = new profilePageUpgrader(helper);
            profilePageUpgraderInstance.checkProfilePageUpgrade();

            let lastPageUrl = window.location.href;
            setInterval(() => {
                //console.log(`check [${lastPageUrl}] vs [${window.location.href}]`);
                if (lastPageUrl !== window.location.href) {
                    if (window.location.href.includes("profile/")) {
                        profilePageUpgraderInstance.checkProfilePageUpgrade();
                    }
                    lastPageUrl = window.location.href;
                }
            }, 2000);

        } catch (e) {
            console.log("error in [init]", e);
        }

    }, 1500);
})();

