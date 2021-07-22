// ==UserScript==
// @name         Crystal/jewel export for earth2.io
// @namespace    http://earth2.io/
// @version      0.1.5
// @description  Generate a csv report for your jewels with daily distribution | ordered by spawn date and time 
// @author       Mihaly Szolnoki -> E2: mihajₒMSZY5BLXAP -> discord: mihaj#5170
// @match        https://app.earth2.io/*
// @grant        none
// @license MIT
// @currentversion	0.1.5 : adjusted for bazaar, fixed some incorrect areas in mapping | NOTE: Only lists currently owned jewels in your inventory, not those you sold!
// ==/UserScript==

/* jshint esversion: 8 */



(function () {
    'use strict';

    //console.log("start");

    let Strings = Object.freeze({
        NOTAVAILABLE: "N/A",
        NEWLINE: "\r\n",
    });

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

            this.mappings = new Map([
                ["__", { code: "__", country: "other (international)?" }],

                //EU alphabetical
                ["ad", { code: "ad", area: Areas.EU, country: "Andorra" }],
                ["al", { code: "al", area: Areas.EU, country: "Albania" }],
                ["at", { code: "at", area: Areas.EU, country: "Austria" }],
                ["ba", { code: "ba", area: Areas.EU, country: "Bosnia Herzegovina" }],
                ["be", { code: "be", area: Areas.EU, country: "Belgium" }],
                ["bg", { code: "bg", area: Areas.EU, country: "Bulgaria" }],
                ["by", { code: "by", area: Areas.EU, country: "Belarus" }],
                ["ch", { code: "ch", area: Areas.EU, country: "Switzerland" }],
                ["cy", { code: "cy", area: Areas.EU, country: "Cyprus" }],
                ["cz", { code: "cz", area: Areas.EU, country: "Czech Republic" }],
                ["de", { code: "de", area: Areas.EU, country: "Germany" }],
                ["dk", { code: "dk", area: Areas.EU, country: "Denmark" }],
                ["ee", { code: "ee", area: Areas.EU, country: "Estonia" }],
                ["es", { code: "es", area: Areas.EU, country: "Spain" }],
                ["fi", { code: "fi", area: Areas.EU, country: "Finland" }],
                ["fo", { code: "fo", area: Areas.EU, country: "Faroe" }],
                ["fr", { code: "fr", area: Areas.EU, country: "France" }],
                ["gb", { code: "gb", area: Areas.EU, country: "United Kingdom" }],
                ["gg", { code: "gg", area: Areas.EU, country: "Guernsey" }],
                ["gi", { code: "gi", area: Areas.EU, country: "Gibraltar" }],
                ["gr", { code: "gr", area: Areas.EU, country: "Greece" }],
                ["hr", { code: "hr", area: Areas.EU, country: "Croatia" }],
                ["hu", { code: "hu", area: Areas.EU, country: "Hungary" }],
                ["ie", { code: "ie", area: Areas.EU, country: "Ireland" }],
                ["im", { code: "im", area: Areas.EU, country: "Isle of Man" }],
                ["is", { code: "is", area: Areas.EU, country: "Iceland" }],
                ["it", { code: "it", area: Areas.EU, country: "Italy" }],
                ["je", { code: "je", area: Areas.EU, country: "Jersey" }],
                ["kv", { code: "kv", area: Areas.EU, country: "Kosovo" }],
                ["li", { code: "li", area: Areas.EU, country: "Liechtenstein" }],
                ["lt", { code: "lt", area: Areas.EU, country: "Lithuania" }],
                ["lu", { code: "lu", area: Areas.EU, country: "Luxembourg" }],
                ["lv", { code: "lv", area: Areas.EU, country: "Latvia" }],
                ["mc", { code: "mc", area: Areas.EU, country: "Monaco" }],
                ["md", { code: "md", area: Areas.EU, country: "Moldova" }],
                ["me", { code: "me", area: Areas.EU, country: "Montenegro" }],
                ["mk", { code: "mk", area: Areas.EU, country: "North Macedonia" }],
                ["mt", { code: "mt", area: Areas.EU, country: "Malta" }],
                ["nl", { code: "nl", area: Areas.EU, country: "Netherlands" }],
                ["no", { code: "no", area: Areas.EU, country: "Norway" }],
                ["pl", { code: "pl", area: Areas.EU, country: "Poland" }],
                ["pt", { code: "pt", area: Areas.EU, country: "Portugal" }],
                ["ro", { code: "ro", area: Areas.EU, country: "Romania" }],
                ["rs", { code: "rs", area: Areas.EU, country: "Serbia" }],
                ["se", { code: "se", area: Areas.EU, country: "Sweden" }],
                ["si", { code: "si", area: Areas.EU, country: "Slovenia" }],
                ["sj", { code: "sj", area: Areas.EU, country: "Svalbard and Jan Mayen" }],
                ["sk", { code: "sk", area: Areas.EU, country: "Slovakia" }],
                ["sm", { code: "sm", area: Areas.EU, country: "San Marino" }],
                ["ua", { code: "ua", area: Areas.EU, country: "Ukraine" }],
                ["va", { code: "va", area: Areas.EU, country: "Vatican City" }],
                ["xy", { code: "xy", area: Areas.EU, country: "Sovereign Base Areas of Akrotiri and Dhekelia" }],

                //AF(rica)
                ["ao", { code: "ao", area: Areas.AF, country: "Angola" }],
                ["bf", { code: "bf", area: Areas.AF, country: "Burkina Faso" }],
                ["bi", { code: "bi", area: Areas.AF, country: "Burundi" }],
                ["bj", { code: "bj", area: Areas.AF, country: "Benin" }],
                ["bw", { code: "bw", area: Areas.AF, country: "Botswana" }],
                ["cd", { code: "cd", area: Areas.AF, country: "Democratic Republic of Congo" }],
                ["cf", { code: "cf", area: Areas.AF, country: "Central African Republic" }],
                ["cg", { code: "cg", area: Areas.AF, country: "Congo" }],
                ["ci", { code: "ci", area: Areas.AF, country: "Côte d'Ivoire" }],
                ["cm", { code: "cm", area: Areas.AF, country: "Cameroon" }],
                ["cv", { code: "cv", area: Areas.AF, country: "Cape Verde" }],
                ["dj", { code: "dj", area: Areas.AF, country: "Djibouti" }],
                ["dz", { code: "dz", area: Areas.AF, country: "Algeria" }],
                ["eg", { code: "eg", area: Areas.AF, country: "Egypt" }],
                ["eh", { code: "eh", area: Areas.AF, country: "Western Sahara" }],
                ["er", { code: "er", area: Areas.AF, country: "Eritrea" }],
                ["et", { code: "et", area: Areas.AF, country: "Ethiopia" }],
                ["ga", { code: "ga", area: Areas.AF, country: "Gabon" }],
                ["gh", { code: "gh", area: Areas.AF, country: "Ghana" }],
                ["gm", { code: "gm", area: Areas.AF, country: "Gambia" }],
                ["gn", { code: "gn", area: Areas.AF, country: "Guinea" }],
                ["gq", { code: "gq", area: Areas.AF, country: "Equatorial Guinea" }],
                ["gw", { code: "gw", area: Areas.AF, country: "Guinea-Bissau" }],
                ["ke", { code: "ke", area: Areas.AF, country: "Kenya" }],
                ["km", { code: "km", area: Areas.AF, country: "Comoros" }],
                ["lr", { code: "lr", area: Areas.AF, country: "Liberia" }],
                ["ls", { code: "ls", area: Areas.AF, country: "Lesotho" }],
                ["ly", { code: "ly", area: Areas.AF, country: "Libya" }],
                ["ma", { code: "ma", area: Areas.AF, country: "Morocco" }],
                ["mg", { code: "mg", area: Areas.AF, country: "Madagascar" }],
                ["ml", { code: "ml", area: Areas.AF, country: "Mali" }],
                ["mu", { code: "mu", area: Areas.AF, country: "Mauritius" }],
                ["mr", { code: "mr", area: Areas.AF, country: "Mauritania" }],
                ["mz", { code: "mz", area: Areas.AF, country: "Mozambique" }],
                ["mw", { code: "mw", area: Areas.AF, country: "Malawi" }],
                ["na", { code: "na", area: Areas.AF, country: "Namibia" }],
                ["ne", { code: "ne", area: Areas.AF, country: "Niger" }],
                ["ng", { code: "ng", area: Areas.AF, country: "Nigeria" }],
                ["re", { code: "re", area: Areas.AF, country: "Réunion" }],
                ["rw", { code: "rw", area: Areas.AF, country: "Rwanda" }],
                ["sc", { code: "sc", area: Areas.AF, country: "Seychelles" }],
                ["sd", { code: "sd", area: Areas.AF, country: "Sudan" }],
                ["sh", { code: "sh", area: Areas.AF, country: "Saint Helena" }],
                ["sl", { code: "sl", area: Areas.AF, country: "Sierra Leone" }],
                ["sn", { code: "sn", area: Areas.AF, country: "Senegal" }],
                ["so", { code: "so", area: Areas.AF, country: "Somalia" }],
                ["ss", { code: "ss", area: Areas.AF, country: "South Sudan" }],
                ["st", { code: "st", area: Areas.AF, country: "Sao Tome and Principe" }],
                ["sz", { code: "sz", area: Areas.AF, country: "Eswatini" }],
                ["td", { code: "td", area: Areas.AF, country: "Chad" }],
                ["tg", { code: "tg", area: Areas.AF, country: "Togo" }],
                ["tn", { code: "tn", area: Areas.AF, country: "Tunisia" }],
                ["tz", { code: "tz", area: Areas.AF, country: "Tanzania" }],
                ["ug", { code: "ug", area: Areas.AF, country: "Uganda" }],
                ["za", { code: "za", area: Areas.AF, country: "South Africa" }],
                ["zm", { code: "zm", area: Areas.AF, country: "Zambia" }],
                ["zw", { code: "zw", area: Areas.AF, country: "Zimbabwe" }],
                ["yt", { code: "yt", area: Areas.AF, country: "Mayotte" }],
                ["mayotte", { code: "mayotte", area: Areas.AF, country: "Mayotte" }],
                ["reunion", { code: "reunion", area: Areas.AF, country: "Reunion" }],

                //AS(ia)
                ["ae", { code: "ae", area: Areas.AS, country: "Dubai" }],
                ["ae-aj", { coce: "ae-aj", area: Areas.AS, country: "United Arab Emirates (Ajman)" }],
                ["ae-az", { coce: "ae-az", area: Areas.AS, country: "United Arab Emirates (Abu Dhabi)" }],
                ["ae-du", { coce: "ae-du", area: Areas.AS, country: "United Arab Emirates (Dubai)" }],
                ["ae-fu", { coce: "ae-fu", area: Areas.AS, country: "United Arab Emirates (Fujairah)" }],
                ["ae-rk", { code: "ae-rk", area: Areas.AS, country: "United Arab Emirates (Ra'S Al Khaymah)" }],
                ["ae-sh", { code: "ae-sh", area: Areas.AS, country: "United Arab Emirates (Sharjah)" }],
                ["ae-uq", { code: "ae-uq", area: Areas.AS, country: "United Arab Emirates (Umm al-Quwain)" }],
                ["af", { code: "af", area: Areas.AS, country: "Afghanistan" }],
                ["am", { code: "am", area: Areas.AS, country: "Armenia" }],
                ["az", { code: "az", area: Areas.AS, country: "Azerbaijan" }],
                ["bd", { code: "bd", area: Areas.AS, country: "Bangladesh" }],
                ["bh", { code: "bh", area: Areas.AS, country: "Bahrain" }],
                ["bn", { code: "bn", area: Areas.AS, country: "Brunei Darussalam" }],
                ["bt", { code: "bt", area: Areas.AS, country: "Bhutan" }],
                ["cn", { code: "cn", area: Areas.AS, country: "China" }],
                ["ge", { code: "ge", area: Areas.AS, country: "Georgia" }],
                ["hk", { code: "hk", area: Areas.AS, country: "Hong Kong" }],
                ["id", { code: "id", area: Areas.AS, country: "Indonesia" }],
                ["in", { code: "in", area: Areas.AS, country: "India" }],
                ["io", { code: "io", area: Areas.AS, country: "British Indian Ocean Territory" }],
                ["jo", { code: "jo", area: Areas.AS, country: "Jordan" }],
                ["jp", { code: "jp", area: Areas.AS, country: "Japan" }],
                ["kg", { code: "kg", area: Areas.AS, country: "Kyrgyzstan" }],
                ["kh", { code: "kh", area: Areas.AS, country: "Cambodia" }],
                ["kp", { code: "kp", area: Areas.AS, country: "North Korea" }],
                ["kr", { code: "kr", area: Areas.AS, country: "South Korea" }],
                ["kw", { code: "kw", area: Areas.AS, country: "Kuwait" }],
                ["kz", { code: "kz", area: Areas.AS, country: "Kazakhstan" }],
                ["la", { code: "la", area: Areas.AS, country: "Laos" }],
                ["lb", { code: "lb", area: Areas.AS, country: "Lebanon" }],
                ["lk", { code: "lk", area: Areas.AS, country: "Sri Lanka" }],
                ["mm", { code: "mm", area: Areas.AS, country: "Myanmar" }],
                ["mn", { code: "mn", area: Areas.AS, country: "Mongolia" }],
                ["mo", { code: "mo", area: Areas.AS, country: "Macau" }],
                ["mp", { code: "mp", area: Areas.AS, country: "Northern Mariana Islands" }],
                ["mv", { code: "mv", area: Areas.AS, country: "Maldives" }],
                ["my", { code: "my", area: Areas.AS, country: "Malaysia" }],
                ["np", { code: "np", area: Areas.AS, country: "Nepal" }],
                ["om", { code: "om", area: Areas.AS, country: "Oman" }],
                ["pf", { code: "pf", area: Areas.AS, country: "Paracel Islands" }],
                ["ph", { code: "ph", area: Areas.AS, country: "Philippines" }],
                ["pk", { code: "pk", area: Areas.AS, country: "Pakistan" }],
                ["ps", { code: "ps", area: Areas.AS, country: "Palestinian Territories" }],
                ["qa", { code: "qa", area: Areas.AS, country: "Qatar" }],
                ["ru", { code: "ru", area: Areas.AS, country: "Russia" }],
                ["sg", { code: "sg", area: Areas.AS, country: "Singapore" }],
                ["sy", { code: "sy", area: Areas.AS, country: "Syria" }],
                ["th", { code: "th", area: Areas.AS, country: "Thailand" }],
                ["tj", { code: "tj", area: Areas.AS, country: "Tajikistan" }],
                ["tl", { code: "tl", area: Areas.AS, country: "Timor Leste" }],
                ["tm", { code: "tm", area: Areas.AS, country: "Turkmenistan" }],
                ["tr", { code: "tr", area: Areas.AS, country: "Turkey" }],
                ["tw", { code: "tw", area: Areas.AS, country: "Taiwan" }],
                ["uz", { code: "uz", area: Areas.AS, country: "Uzbekistan" }],
                ["vn", { code: "vn", area: Areas.AS, country: "Vietnam" }],
                ["xx", { code: "xx", area: Areas.AS, country: "Spratly Islands" }],
                ["ye", { code: "ye", area: Areas.AS, country: "Yemen" }],
                ["united arab emirates", { code: "united arab emirates", area: Areas.AS, country: "United Arab Emirates" }],

                //AM(erica)
                ["ag", { code: "ag", area: Areas.AM, country: "Antigua and Barbuda" }],
                ["ai", { code: "ai", area: Areas.AM, country: "Anguilla" }],
                ["ar", { code: "ar", area: Areas.AM, country: "Argentina" }],
                ["aw", { code: "aw", area: Areas.AM, country: "Aruba" }],
                ["bb", { code: "bb", area: Areas.AM, country: "Barbados" }],
                ["bl", { code: "bl", area: Areas.AM, country: "Saint Barthelemy" }],
                ["bm", { code: "bm", area: Areas.AM, country: "Bermuda" }],
                ["bo", { code: "bo", area: Areas.AM, country: "Bolivia" }],
                ["br", { code: "br", area: Areas.AM, country: "Brazil" }],
                ["bs", { code: "bs", area: Areas.AM, country: "Bahamas" }],
                ["bz", { code: "bz", area: Areas.AM, country: "Belize" }],
                ["ca", { code: "ca", area: Areas.AM, country: "Canada" }],
                ["cl", { code: "cl", area: Areas.AM, country: "Chile" }],
                ["co", { code: "co", area: Areas.AM, country: "Colombia" }],
                ["cr", { code: "cr", area: Areas.AM, country: "Costa Rica" }],
                ["cu", { code: "cu", area: Areas.AM, country: "Cuba" }],
                ["cw", { code: "cw", area: Areas.AM, country: "Curaçao" }],
                ["dm", { code: "dm", area: Areas.AM, country: "Dominica" }],
                ["do", { code: "do", area: Areas.AM, country: "Dominican Republic" }],
                ["ec", { code: "ec", area: Areas.AM, country: "Ecuador" }],
                ["fk", { code: "fk", area: Areas.AM, country: "Falkland Islands" }],
                ["gd", { code: "gd", area: Areas.AM, country: "Grenada" }],
                ["gf", { code: "gf", area: Areas.AM, country: "French Guiana" }],
                ["gl", { code: "gl", area: Areas.AM, country: "Greenland" }],
                ["gp", { code: "gp", area: Areas.AM, country: "Guadeloupe" }],
                ["gt", { code: "gt", area: Areas.AM, country: "Guatemala" }],
                ["gy", { code: "gy", area: Areas.AM, country: "Guyana" }],
                ["hn", { code: "hn", area: Areas.AM, country: "Honduras" }],
                ["ht", { code: "ht", area: Areas.AM, country: "Haiti" }],
                ["jm", { code: "jm", area: Areas.AM, country: "Jamaica" }],
                ["kn", { code: "kn", area: Areas.AM, country: "Saint Kitts and Nevis" }],
                ["ky", { code: "ky", area: Areas.AM, country: "Cayman Islands" }],
                ["lc", { code: "lc", area: Areas.AM, country: "Saint Lucia" }],
                ["mf", { code: "mf", area: Areas.AM, country: "Saint Martin" }],
                ["mq", { code: "mq", area: Areas.AM, country: "Martinique" }],
                ["ms", { code: "ms", area: Areas.AM, country: "Montserrat" }],
                ["mx", { code: "mx", area: Areas.AM, country: "Mexico" }],
                ["ni", { code: "ni", area: Areas.AM, country: "Nicaragua" }],
                ["pa", { code: "pa", area: Areas.AM, country: "Panama" }],
                ["pe", { code: "pe", area: Areas.AM, country: "Peru" }],
                ["pm", { code: "pm", area: Areas.AM, country: "Saint Pierre and Miquelon" }],
                ["pr", { code: "pr", area: Areas.AM, country: "Puerto Rico" }],
                ["py", { code: "py", area: Areas.AM, country: "Paraguay" }],
                ["sr", { code: "sr", area: Areas.AM, country: "Suriname" }],
                ["sv", { code: "sv", area: Areas.AM, country: "El Salvador" }],
                ["sx", { code: "sx", area: Areas.AM, country: "Little Bay, Sint Maarten" }],
                ["tc", { code: "tc", area: Areas.AM, country: "Turks and Caicos" }],
                ["tt", { code: "tt", area: Areas.AM, country: "Trinidad and Tobago" }],
                ["us", { code: "us", area: Areas.AM, country: "United States" }],
                ["uy", { code: "uy", area: Areas.AM, country: "Uruguay" }],
                ["vc", { code: "vc", area: Areas.AM, country: "Saint Vincent and the Grenadines" }],
                ["ve", { code: "ve", area: Areas.AM, country: "Venezuela" }],
                ["vg", { code: "vg", area: Areas.AM, country: "British Virgin Islands" }],
                ["vi", { code: "vi", area: Areas.AM, country: "US Virgin Islands" }],
                ["martinique", { code: "martinique", area: Areas.AM, country: "Martinique" }],

                //Antarctica
                ["aq", { code: "aq", area: Areas.AT, country: "Antarctica" }],
                ["gs", { code: "gs", area: Areas.AT, country: "South Georgia and the South Sandwich Islands" }],
                ["hm", { code: "hm", area: Areas.AT, country: "Heard and McDonald Islands" }],
                ["tf", { code: "tf", area: Areas.AT, country: "French Southern Territories" }],

                //OC(eania)
                ["as", { code: "as", area: Areas.OC, country: "American Samoa" }],
                ["au", { code: "au", area: Areas.OC, country: "Australia" }],
                ["ck", { code: "ck", area: Areas.OC, country: "Cook Islands" }],
                ["fj", { code: "fj", area: Areas.OC, country: "Fiji" }],
                ["fm", { code: "fm", area: Areas.OC, country: "Micronesia" }],
                ["gu", { code: "gu", area: Areas.OC, country: "Guam" }],
                ["ki", { code: "ki", area: Areas.OC, country: "Kiribati" }],
                ["mh", { code: "mh", area: Areas.OC, country: "Marshall Islands" }],
                ["nf", { code: "nf", area: Areas.OC, country: "Norfolk Island" }],
                ["nr", { code: "nr", area: Areas.OC, country: "Nauru" }],
                ["nu", { code: "nu", area: Areas.OC, country: "Niue" }],
                ["nz", { code: "nz", area: Areas.OC, country: "New Zealand" }],
                ["pf", { code: "pf", area: Areas.OC, country: "Polynesia" }],
                ["pg", { code: "pg", area: Areas.OC, country: "Papua New Guinea" }],
                ["pn", { code: "pn", area: Areas.OC, country: "Pitcairn" }],
                ["pw", { code: "pw", area: Areas.OC, country: "Palau" }],
                ["sb", { code: "sb", area: Areas.OC, country: "Solomon Islands" }],
                ["to", { code: "to", area: Areas.OC, country: "Tonga" }],
                ["tv", { code: "tv", area: Areas.OC, country: "Tuvalu" }],
                ["um", { code: "um", area: Areas.OC, country: "US Minor Outlying Islands" }],
                ["vu", { code: "vu", area: Areas.OC, country: "Vanuatu" }],
                ["ws", { code: "ws", area: Areas.OC, country: "Samoa" }],
                ["nc", { code: "nc", area: Areas.OC, country: "New Caledonia" }],
                ["tk", { code: "tk", area: Areas.OC, country: "Tokelau" }],
                ["wf", { code: "wf", area: Areas.OC, country: "Wallis and Futuna" }],
                ["fg", { code: "fg", area: Areas.OC, country: "French Polynesia" }],
            ]);
        }

        isAvailable(object) { return typeof object !== "undefined" && object !== null && object !== ""; };

        tryParseJSON(data) {
            try {
                let result = JSON.parse(data);
                return result;
            }
            catch (e) {
                return data;
            }
        };

        cleanString(input) {
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

        getFormattedTime(getDateToo) {
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

        createDownloadFile(prefix, content) {
            let link = document.createElement('a');
            link.download = `${prefix}-${this.getFormattedTime(true).replaceAll(":", "_")}.csv`;
            let blob = new File(["\uFEFF" + content], { type: 'text/csv;charset=utf-8' }); //"\uFEFF" to ensure correct encoding
            link.href = window.URL.createObjectURL(blob);
            if (confirm("do you want to download the results?")) {
                link.click();
            }
        }

        showCustomToast(severity, message, dismissOthers) {
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

        getCountryAndArea(property) {
            let result = null;
            try {

                let matchingCountry = this.mappings.get(property.country.toLowerCase());
                if (!this.isAvailable(matchingCountry)) {
                    console.warn(`no country data for [${property.country.toLowerCase()}]`, property);

                    let propertyLocationParts = property["location"].split(",");
                    if (propertyLocationParts.length > 0) {
                        let lastLocationPart = propertyLocationParts[propertyLocationParts.length - 1].trim();
                        let matchingCountry = this.mappings.values.filter(m => m.country === lastLocationPart);
                        if (matchingCountry.length > 0) {
                            result = matchingCountry[0];
                        } else {
                            console.log(`no matching country for [${lastLocationPart}]: loc:[${property["location"]}]`, property);
                        }
                    } else {
                        console.log("invalid location", property);
                    }

                } else {
                    result = matchingCountry;
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

        async getUserLandFields() {
            let success = false;
            try {
                let properties = await this.getUserLandFieldsAll();
                success = true;
                return properties;
            } catch (e) {
                console.log("error in [getUserLandFields I]", e);
            }

            if (!success) {
                console.log("method I failed, trying alternative");

                try {
                    let properties = await this.getUserLandFieldsPaged(window.auth0user.id);
                    return properties;
                } catch (e) {
                    console.log("method II failed too", e);
                }
            }
        }

        async getUserLandFieldsAll() {
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
                console.log("fetch error in cacheproperties (getUserLandFields)", error);
            });

            this.setCustomProperties(properties);

            return properties;
        }

        async getUserLandFieldsPaged(userId) {
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

        async getUserLandfieldPage(query, pageNumber, pageCount) {
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

        async getPropertyInfoShort(propertyId) {
            let query = `{
                getLandfieldDetail(landfieldId: "#LANDID#") {
                    id,
                    location,
                    country,
                    tileClass,
                    tileCount,
                    owner {
                        id,
                        username,
                        countryFlag,
                    },
                }
            }`;

            let actualQuery = JSON.stringify({ "query": query.replace("#LANDID#", propertyId) });

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
                    result = parsedData.data.getLandfieldDetail;
                }

                return result;

            }).catch((error) => {
                console.log("fetch error in cacheproperties (getUserLandfieldPage)", error);
            });

            return properties;
        }

        setCustomProperties(properties) {
            properties.forEach(p => {
                let lastTransactionDate = p.transactionSet.map(tr => new Date(tr.time)).sort((a, b) => a < b)[0];
                p.purchasedDate = lastTransactionDate;
                let countryAndArea = helper.getCountryAndArea(p);
                if (helper.isAvailable(countryAndArea)) {
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

    class UIHandler {
        constructor() {
            this.crystalExportSelector = "#crystal-export";
        }

        isResourcesPage() {
            return window.location.hash.includes("resources");
        }

        init() {
            if (this.isResourcesPage()) {
                let divs = Array.from(document.querySelectorAll("div"));
                let inventoryLabel = null;
                for (let i = 0; i < divs.length; i++) {
                    if (divs[i].textContent === "Inventory") {
                        //console.log("inventory found");
                        inventoryLabel = divs[i];
                        break;
                    }
                }
                if (inventoryLabel != null) {
                    let inventory = inventoryLabel.parentElement.parentElement;
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

        async handleExportClick() {
            console.log("export click");

            let api = new E2API();

            let jewels = await api.getAllJewels();
            console.log("jewels: ", jewels);

            if (jewels.length === 0) {
                helper.showCustomToast(MessageSeverity.ERROR, "No jewels in your inventory");
            } else {
                //let userProperties = await api.getUserLandFields();
                //console.log("user properties: ", userProperties);

                let reportItems = [];
                jewels = jewels.filter(j => helper.isAvailable(j));

                let allPropertyIds = [... new Set(jewels.map(m => m.landfield.id))];
                //console.log(`all property ids: `, allPropertyIds);

                let jewelProperties = [];
                for (let i = 0; i < allPropertyIds.length; i++) {
                    let propertyId = allPropertyIds[i];
                    console.log(`processing ${i + 1}/${allPropertyIds.length} related property`);
                    jewelProperties.push(await api.getPropertyInfoShort(propertyId));
                }

                let userProperties = jewelProperties.filter(p => p.owner.id === window.auth0user.id);

                console.log(`related properties: `, { all: jewelProperties, user: userProperties });

                jewels.forEach(jewel => {
                    reportItems.push(new JewelReportItem(jewel, jewelProperties.find(p => p.id === jewel.landfield.id)));
                });
                reportItems = reportItems.sort((a, b) => a.spawnDateTime > b.spawnDateTime ? 1 : -1);
                window.reportItems = reportItems;
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

        constructor(jewel, propertyInfo) {
            this.jewel = jewel;
            this.propertyInfo = propertyInfo;

            this.initDefault();

            this.init();
        }

        initDefault() {
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
            this.center = Strings.NOTAVAILABLE;
            this.ownSpawn = Strings.NOTAVAILABLE;
        }

        init() {

            let jewel = this.jewel;
            if (!helper.isAvailable(jewel)) {
                console.log("jewel is unavailable :| ");
            } else {

                let jewelLandField = this.jewel.landfield;
                if (!helper.isAvailable(jewelLandField)) {
                    console.log("no landfield for jewel: ", this.jewel);
                } else {
                    if (!helper.isAvailable(this.propertyInfo)) {
                        console.warn(`property info empty!, jewel: `, this.jewel)
                    } else {
                        let countryAndArea = helper.getCountryAndArea(this.propertyInfo);
                        if (!helper.isAvailable(countryAndArea)) {
                            console.warn(`No matching area/country for property`, this.propertyInfo);
                        } else {
                            this.area = countryAndArea.area;
                            this.country = countryAndArea.country;
                        }

                        this.ownSpawn = this.propertyInfo.owner.id === window.auth0user.id;
                        this.tileClass = this.propertyInfo.tileClass;
                        this.tileCount = this.propertyInfo.tileCount;
                    }

                    this.propertyId = this.jewel.landfield.id;
                    this.link = `https://app.earth2.io/#propertyInfo/${this.jewel.landfield.id}`;
                    this.description = helper.cleanString(this.jewel.landfield.description);
                    this.location = this.jewel.landfield.location.split(",").map(l => l.trim()).reverse().join(" | ").replace(`${this.country} | `, "");

                    this.color = JewelData.getColorName(this.jewel.color);
                    //this.effect = JewelData.getEffect(this.jewel.size, this.color);
                    this.affectedProduction = JewelData.getResourceName(this.color);

                    this.spawnDateTime = this.jewel.created.replace("T", "|").replace("Z", "");
                    let spawnDateTimeParts = this.spawnDateTime.split("|")
                    this.spawnDate = spawnDateTimeParts[0];
                    this.spawnTime = spawnDateTimeParts[1];

                    this.size = JewelData.getSize(this.jewel.size);
                    this.tier = this.jewel.tier;

                    this.center = this.jewel.landfield.center.replace("(", "").replace(")", "").replace(", ", " ").replace(" ", " | ");

                }
            }
        }

    }

    class ReportExport {
        constructor(reportItems, userProperties) {
            this.reportItems = reportItems;
            this.userProperties = userProperties;
        }

        generateReport(includeSummary, includeSummaryDaily) {
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


            let csvHarvestHeader = `,Nr,Spawned at, Size, Tier, Production, Country, Location, Property description, Class, Tile count,# of jewels, center, link, 3rd party`;

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
                    result += csvHarvestHeader;
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

        getJewelCSVForDate(reportItemsForDate) {
            let result = "";
            reportItemsForDate.forEach((ri, index) => { result += this.getAsCSVString(ri, index, index !== reportItemsForDate.length - 1); });
            return result;
        }

        getAsCSVString(reportItem, index, addNewLine) {
            let jewelData = `${reportItem.spawnDateTime},${reportItem.size},${reportItem.tier},${reportItem.affectedProduction}`;
            let thirdPartyName = reportItem.ownSpawn === false ? reportItem.propertyInfo.owner.username : "";
            let thirdPartyLink = thirdPartyName === "" ? "" : `https://app.earth2.io/#profile/${reportItem.propertyInfo.owner.id}`;
            let thirdParty = `${thirdPartyName},${thirdPartyLink}`;
            let propertyData = `${reportItem.country},${reportItem.location},${helper.cleanString(reportItem.description)},${reportItem.tileClass},${reportItem.tileCount},${reportItem.jewelCount},${reportItem.center},${reportItem.link},${thirdParty}`;
            let result = `,${index + 1},${jewelData},${propertyData}`;
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






