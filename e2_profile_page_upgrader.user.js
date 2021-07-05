// ==UserScript==
// @name         E2 (earth2.io) - extension - profile page
// @namespace    http://earth2.io/
// @version      1.0.1
// @description  Extending the current functionality with additional filters, ordering and view mode (list, normal) and added night mode style
// @author       Mihaly Szolnoki -> E2: MihajA414 - MSZY5BLXAP -> discord: mihaj
// @match        https://app.earth2.io/
// @grant        none
// @currentversion	1.0.1 : changed according to site changes (+react) | added two more orderings for tile count and location. Now the locations shows reversed e.g. Austria | Vienna instead of Vienna, Austria, added interval check as hashchange is not working properly
// ==/UserScript==

/* jshint esversion: 8 */

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
                case "success": colorClass = "green"; break;
                case "warning": colorClass = "yellow black-text"; break;
                case "error": colorClass = "red"; break;
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
                console.log("data: ", parsedData);
                return parsedData.data.getMyLandfields;
            }

            return null;

        }).catch((error) => {
            console.log("fetch error in cacheproperties", error);
        });

        return properties;
    }
}

let api = new E2API();
let userInfo = await api.getUser();
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
        this.notifyDevMessage = "Notify dev -> discord: mihaj";
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

            if (window.location.hash.includes(window.auth0user.id)) {
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
            this.helper.showCustomToast("success", "Starting profile page upgrade");

            let cachedSuccess = await this.cacheProperties();
            if (!cachedSuccess) {
                let maxRetry = 10;
                let retryCount = 1;
                while (retryCount < maxRetry) {
                    console.log(`retry property caching ${retryCount}/${maxRetry}`);
                    cachedSuccess = await this.cacheProperties();
                    if (cachedSuccess) {
                        break;
                    } else {
                        retryCount++;
                    }
                }
            }

            if (!cachedSuccess) {
                this.helper.showCustomToast(`error`, `something went wrong. Please reload page, if the issue persists: ${this.notifyDevMessage}`)
            } else {
                //await this.cacheImages();

                this.styleHandlerInstance.addProfileStyles();
                this.removeReaddFilters();
                this.addExtraHtml();

                //let secondaryImage = document.querySelector(".profile-secondary-image");
                //secondaryImage.src = secondaryImage.src.replace("svg", "png");

                setTimeout(() => {
                    this.helper.showCustomToast("success", "Upgrade finished");
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

            if (properties != null) {
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

                if (properties !== "") {
                    this.propertiesCache = properties;
                    window.propertiesCache = properties;
                    return true;
                }
            }

            return false;
        } catch (e) {
            console.log("error in [cacheProperties]", e);
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
        } catch (e) {
            console.log("error in [removeReaddFilters]", e);
        }
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
                this.helper.showCustomToast("error", "invalid for sale value");
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
                    this.helper.showCustomToast("error", result.errors[0].message);
                } else {
                    //success
                    this.helper.showCustomToast("success", "Changes saved successfully");
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

            window.allPropertiesCSV = "If you want to thank me -> use my code -->MSZY5BLXAP or tip (Paypal: csimbum@gmail.com)\r\n"
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
        //window.addEventListener("hashchange", () => { setTimeout(() => { profilePageUpgraderInstance.checkProfilePageUpgrade(); }, 2500); });

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
