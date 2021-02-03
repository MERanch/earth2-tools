// ==UserScript==
// @name         Property export for earth2.io
// @namespace    http://earth2.io/
// @version      0.1.9
// @description  Adds a button on your profile page and lets you download your properties data in csv format.
// @author       Mihaly Szolnoki -> E2: MihajA414 - MSZY5BLXAP -> discord: mihaj
// @match        https://app.earth2.io/
// @grant        none
// @license MIT
// @currentversion	0.1.9 : Added fix for larger profiles (more than 1K properties)
// ==/UserScript==

/* jshint esversion: 8 */
(function() {
    'use strict';

    class CountryMapping{
        constructor(){
            let mappings = [
                { code: "__", country: "other (international)?" },
                
                { code: "ad", country: "Andorra" },
                { code: "ae", country: "Dubai" },
                { code: "af", country: "Afghanistan" },
                { code: "ag", country: "Antigua and Barbuda" },
                { code: "ai", country: "Anguilla" },
                { code: "al", country: "Albania" },
                { code: "am", country: "Armenia" },
                { code: "ao", country: "Angola" },
                { code: "aq", country: "Antarctica" },
                { code: "ar", country: "Argentina" },
                { code: "as", country: "American Samoa" },
                { code: "at", country: "Austria" },
                { code: "au", country: "Australia" },
                { code: "aw", country: "Aruba"}, 
                { code: "az", country: "Azerbaijan" },
                
                { code: "ba", country: "Bosnia Herzegovina" },
                { code: "bb", country: "Barbados" },
                { code: "bd", country: "Bangladesh" },
                { code: "be", country: "Belgium" },
                { code: "bf", country: "Burkina Faso" },
                { code: "bg", country: "Bulgaria" },
                { code: "bh", country: "Bahrain" },
                { code: "bi", country: "Burundi" },
                { code: "bj", country: "Benin" },
                { code: "bl", country: "Saint Barthelemy" },
                { code: "bm", country: "Bermuda" },
                { code: "bn", country: "Brunei Darussalam" },
                { code: "bo", country: "Bolivia" },
                { code: "br", country: "Brazil" },
                { code: "bs", country: "Bahamas" },
                { code: "bt", country: "Bhutan" },
                { code: "bw", country: "Botswana" },
                { code: "by", country: "Belarus" },
                { code: "bz", country: "Belize" },
                
                { code: "ca", country: "Canada" },
                { code: "cd", country: "Democratic Republic of Congo" },
                { code: "cf", country: "Central African Republic" },
                { code: "cg", country: "Congo" },
                { code: "ch", country: "Switzerland" },
                { code: "ci", country: "Côte d'Ivoire" },
                { code: "ck", country: "Cook Islands" },
                { code: "cl", country: "Chile" },
                { code: "cm", country: "Cameroon" },
                { code: "cn", country: "China" },
                { code: "co", country: "Colombia" },
                { code: "cr", country: "Costa Rica" },
                { code: "cu", country: "Cuba" },
                { code: "cv", country: "Cape Verde" },
                { code: "cw", country: "Curaçao" },
                { code: "cy", country: "Cyprus" },
                { code: "cz", country: "Czech Republic" },
                
                { code: "de", country: "Germany" },
                { code: "dj", country: "Djibouti" },
                { code: "dk", country: "Denmark" },
                { code: "dm", country: "Dominica" },
                { code: "do", country: "Dominican Republic" },
                { code: "dz", country: "Algeria" },
                
                { code: "ec", country: "Ecuador" },
                { code: "ee", country: "Estonia" },
                { code: "eg", country: "Egypt" },
                { code: "eh", country: "Western Sahara" },
                { code: "er", country: "Eritrea" },
                { code: "es", country: "Spain" },
                { code: "et", country: "Ethiopia" },
                
                { code: "fi", country: "Finland" },
                { code: "fj", country: "Fiji" },
                { code: "fk", country: "Falkland Islands" },
                { code: "fm", country: "Micronesia" },
                { code: "fo", country: "Faroe" },
                { code: "fr", country: "France" },
                
                { code: "ga", country: "Gabon" },
                { code: "gb", country: "United Kingdom" },{ code: "gd", country: "Grenada" },{ code: "ge", country: "Georgia" },{ code: "gg", country: "Guernsey" },{ code: "gh", country: "Ghana" },{ code: "gi", country: "Gibraltar" },{ code: "gl", country: "Greenland" },{ code: "gm", country: "Gambia" },{ code: "gn", country: "Guinea" },{ code: "gq", country: "Equatorial Guinea" },{ code: "gr", country: "Greece" },{ code: "gs", country: "South Georgia and the South Sandwich Islands" },{ code: "gt", country: "Guatemala" }, {code:"gu", country: "Guam"} ,{ code: "gw", country: "Guinea-Bissau" },{ code: "gy", country: "Guyana" },
                
                { code: "hk", country: "Hong Kong" },{ code: "hm", country: "Heard and McDonald Islands" },{ code: "hn", country: "Honduras" },{ code: "hr", country: "Croatia" },{ code: "ht", country: "Haiti" },{ code: "hu", country: "Hungary" },
                
                { code: "id", country: "Indonesia" },{ code: "ie", country: "Ireland" },{ code: "im", country: "Isle of Man" },{ code: "in", country: "India" },{ code: "io", country: "British Indian Ocean Territory" },{ code: "is", country: "Iceland" },{ code: "it", country: "Italy" },
                
                { code: "je", country: "Jersey" },{ code: "jm", country: "Jamaica" },{ code: "jo", country: "Jordan" },{ code: "jp", country: "Japan" },
                
                { code: "ke", country: "Kenya" },{ code: "kg", country: "Kyrgyzstan" },{ code: "kh", country: "Cambodia" },{ code: "ki", country: "Kiribati" },{ code: "km", country: "Comoros" },{ code: "kn", country: "Saint Kitts and Nevis" },{ code: "kp", country: "North Korea" },{ code: "kr", country: "South Korea" },{ code: "kw", country: "Kuwait" },{ code: "ky", country: "Cayman Islands" },{ code: "kz", country: "Kazakhstan" },
                
                { code: "la", country: "Laos" },{ code: "lb", country: "Lebanon" },{ code: "lc", country: "Saint Lucia" },{ code: "li", country: "Liechtenstein" },{ code: "lk", country: "Sri Lanka" },{ code: "lr", country: "Liberia" },{ code: "ls", country: "Lesotho" },{ code: "lt", country: "Lithuania" },{ code: "lu", country: "Luxembourg" },{ code: "lv", country: "Latvia" },{ code: "ly", country: "Libya" },
                
                { code: "ma", country: "Morocco" },{ code: "mc", country: "Monaco" },{ code: "md", country: "Moldova" },{ code: "me", country: "Montenegro" }, {code:"mf", country: "Saint Martin"}, { code: "mg", country: "Madagascar" },{ code: "mh", country: "Marshall Islands" },{ code: "mk", country: "North Macedonia" },{ code: "ml", country: "Mali" },{ code: "mm", country: "Myanmar" },{ code: "mn", country: "Mongolia" },{ code: "mo", country: "Macau" }, { code: "mp", country: "Northern Mariana Islands"} ,{ code: "mr", country: "Mauritania" },{ code: "ms", country: "Montserrat" },{ code: "mt", country: "Malta" },{ code: "mu", country: "Mauritius" },{ code: "mv", country: "Maldives" },{ code: "mw", country: "Malawi" },{ code: "mx", country: "Mexico" },{ code: "my", country: "Malaysia" },{ code: "mz", country: "Mozambique" },
                
                { code: "na", country: "Namibia" },{ code: "ne", country: "Niger" },{ code: "nf", country: "Norfolk Island" },{ code: "ng", country: "Nigeria" },{ code: "ni", country: "Nicaragua" },{ code: "nl", country: "Netherlands" },{ code: "no", country: "Norway" },{ code: "np", country: "Nepal" },{ code: "nr", country: "Nauru" },{ code: "nu", country: "Niue" },{ code: "nz", country: "New Zealand" },
                
                { code: "om", country: "Oman" },
                
                { code: "pa", country: "Panama" },{ code: "pe", country: "Peru" },{ code: "pf", country: "Polynesia" },{ code: "pg", country: "Papua New Guinea" },{ code: "ph", country: "Philippines" },{ code: "pk", country: "Pakistan" },{ code: "pl", country: "Poland" },{ code: "pn", country: "Pitcairn" },{ code: "pr", country: "Puerto Rico" },{ code: "ps", country: "Palestinian Territories" },{ code: "pt", country: "Portugal" },{ code: "pw", country: "Palau" },{ code: "py", country: "Paraguay" },
                
                { code: "qa", country: "Qatar" },
                
                { code: "ro", country: "Mordor" },{ code: "rs", country: "Serbia" },{ code: "ru", country: "Russia" },{ code: "rw", country: "Rwanda" },
                
                { code: "sb", country: "Solomon Islands" },{ code: "sc", country: "Seychelles" },{ code: "sd", country: "Sudan" },{ code: "se", country: "Sweden" },{ code: "sg", country: "Singapore" },{ code: "sh", country: "Saint Helena" },{ code: "si", country: "Slovenia" },{ code: "sj", country: "Svalbard and Jan Mayen"},{ code: "sk", country: "Slovakia" },{ code: "sl", country: "Sierra Leone" },{ code: "sm", country: "San Marino" },{ code: "sn", country: "Senegal" },{ code: "so", country: "Somalia" },{ code: "sr", country: "Suriname" },{ code: "ss", country: "South Sudan" },{ code: "st", country: "Sao Tome and Principe" },{ code: "sv", country: "El Salvador" }, {code: "sx", country: "Little Bay, Sint Maarten"} ,{ code: "sy", country: "Syria" },{ code: "sz", country: "Eswatini" },
                
                { code: "tc", country: "Turks and Caicos" },{ code: "td", country: "Chad" }, {code: "tf", country: "French Southern Territories"} ,{ code: "tg", country: "Togo" },{ code: "th", country: "Thailand" },{ code: "tj", country: "Tajikistan" },
                { code: "tl", country: "Timor Leste" },{ code: "tm", country: "Turkmenistan" },{ code: "tn", country: "Tunisia" },{ code: "to", country: "Tonga" },{ code: "tr", country: "Turkey" },{ code: "tt", country: "Trinidad and Tobago" },{ code: "tv", country: "Tuvalu" },{ code: "tw", country: "Taiwan" },{ code: "tz", country: "Tanzania" },
                
                { code: "ua", country: "Ukraine" },{ code: "ug", country: "Uganda" },{ code: "us", country: "United States" }, {code: "um", country: "US Minor Outlying Islands"} ,{ code: "uy", country: "Uruguay" },{ code: "uz", country: "Uzbekistan" },
                
                { code: "va", country: "Vatican City" },{ code: "vc", country: "Saint Vincent and the Grenadines" },{ code: "ve", country: "Venezuela" },{ code: "vg", country: "British Virgin Islands" },{ code: "vi", country: "US Virgin Islands" },{ code: "vn", country: "Vietnam" },{ code: "vu", country: "Vanuatu" },
                
                { code: "ws", country: "Samoa" },
                
                { code: "xx", country: "Spratly Islands" },{ code: "xy", country: "Sovereign Base Areas of Akrotiri and Dhekelia" },
                
                { code: "ye", country: "Yemen" },
                
                { code: "za", country: "South Africa" },{ code: "zm", country: "Zambia" },{ code: "zw", country: "Zimbabwe" },
        
            ];

            this.countryMapping = new Map();
            mappings.forEach(m => {
                //window.countryMapping[m.code] = m.country;
                this.countryMapping.set(m.code, m.country);
            });
        }

        getCountry(code){
            return this.countryMapping.get(code);
        }
    }

	class Helper{

        constructor(){

        }

        tryParseJSON(data) {
            try{
                let result = JSON.parse(data);
                return result;
            } catch(e){
                return data;
            }
        };

        isAvailable(object) {
            return typeof object !== "undefined" && object !== null && object !== "";
        };

        getFormattedTime(getDateToo) {
			let now = new Date();

			let hours = now.getHours().toString().padStart(2, '0');
			let minute = now.getMinutes().toString().padStart(2, '0');
			let seconds = now.getSeconds().toString().padStart(2, '0');
			let millisecs = now.getMilliseconds().toString().padStart(3, '0');

			let result = `${hours}:${minute}:${seconds}::${millisecs}`;
			if(getDateToo){
				let year = now.getFullYear().toString();
				let month = (now.getMonth()+1).toString().padStart(2,'0');
				let day = now.getDate().toString().padStart(2,'0');
				result = `${year}-${month}-${day}::`+ result;
			}
			return result;
	    };

	    cleanString(input) {
            let output = "";
            if(this.isAvailable(input)){
                for (var i=0; i<input.length; i++) {
                    if (input.charCodeAt(i) <= 255) {
                        output += input.charAt(i);
                    }
                }
            }
			return output;
        };

        createDownloadFile(prefix, content) {
            let link = document.createElement('a');
            link.download = `${prefix}-${this.getFormattedTime(true).replaceAll(":","_")}.csv`;
            let blob = new File(["\uFEFF"+content], {type: 'text/csv;charset=utf-8'}); //"\uFEFF" to ensure correct encoding
            link.href = window.URL.createObjectURL(blob);
            if(confirm("do you want to download the results?")){
                link.click();
            }
        }
        
        isUserPropertiesPage() {
			return window.location.hash.includes("#profile") && window.location.hash.replace("#profile/","") === riot.auth0user.id;
        };
        
        
    }
    
    class PropertyExportMain{
        constructor(helperInstance){
            this.helper = helperInstance;
            
            this.countryMap = new CountryMapping();
            this.dataGet = new PropertyExportDataGet(this.helper, this.countryMap);

            this.propertyExportButtonName = "property_export_button";
	        this.propertyExportButtonSelector = `.settings-header .content #${this.propertyExportButtonName}`;
	        this.propertyExportButtonText = "click here to export your properties";
        }

        checkPropertyExportButton() {
            if(this.helper.isUserPropertiesPage()){
                let exportButton = document.querySelector(`.settings-header #${this.propertyExportButtonName}`);
    
                if(!this.helper.isAvailable(exportButton)){
                    this.addPropertyExportButton();
                }
            } 
        };

        addPropertyExportButton() {

			let exportButtonTag = `
			<div class="extra-bits" id=${this.propertyExportButtonName}>
			<button type="button" style="margin-right: 20px;"><span style="padding-left: 10px;padding-right: 10px;color: #a0a;">${this.propertyExportButtonText}</span></button>
			</div>
			`;

			setTimeout(() => {
				window.exportButtonDisabled = false;
				document.querySelector('.settings-header .content').insertAdjacentHTML("afterbegin",exportButtonTag);

				document.querySelector(this.propertyExportButtonSelector).addEventListener("click", async () => {
					
					if(window.exportButtonDisabled === false){
						window.exportButtonDisabled = true;
						document.querySelector(this.propertyExportButtonSelector).disabled = true;
						this.updatePropertyExportButtonText("Please wait...");

						await this.exportPropertiesCSV();

						this.updatePropertyExportButtonText(this.propertyExportButtonText);
						document.querySelector(this.propertyExportButtonSelector).disabled = false;
						window.exportButtonDisabled = false;
					}
					
				}, false);
			}, 1500);
        };
        
        updatePropertyExportButtonText = (text) => {
			document.querySelector(`${this.propertyExportButtonSelector} span`).textContent = text;
	    };

        exportPropertiesCSV(){
            ;(async () => {
                let properties = await this.dataGet.getProperties();
                if(properties === ""){
                    this.updatePropertyExportButtonText("Export failed, reload page and try again.");
                } else {
                    this.helper.createDownloadFile("properties", this.getPropertiesAsCSV(properties));
                }
            })();
        }

        getPropertiesAsCSV(properties){
            let allProperties = properties.map(p => {
				let country = this.countryMap.getCountry(p.country);
				
				let loc = "";
				if(this.helper.isAvailable(p["location"])){
					loc = this.helper.cleanString(p.location.replaceAll(","," | ").replace(" |  "+p.countryName,""));
					if(loc.startsWith(" |  ")){
						loc = loc.slice(4);
					}
				}
				let desc = "";
				if(this.helper.isAvailable(p.description)){
					desc = this.helper.cleanString(p.description.replaceAll(","," | "));
				}
				
				let	link = `https://app.earth2.io/#propertyInfo/${p.id}`;
				
				let forSale = "No";
				let forSaleValue = "";
				let forSaleVsNewLandPrice = "";
				let forSaleVsPricePaid = "";
				if(p.forSale){
					forSale = "Yes";
					forSaleValue = p.price;
					
					let forSaleVsNewLand = (p.price/p.currentValue)*100 - 100;
					forSaleVsNewLandPrice = `${(forSaleVsNewLand).toFixed(2)}%`;
					
					let forSaleVsPaid = (p.price/p.purchaseValue)*100 - 100;
					forSaleVsPricePaid = `${(forSaleVsPaid).toFixed(2)}%`;
				}
				
				let increase = `${((p.currentValue/p.purchaseValue)*100).toFixed(2)}%`;
				
				let for100profit = p.purchaseValue*2.05;
				let for200profit = p.purchaseValue*3.05;
				let for300profit = p.purchaseValue*4.05;
				let for400profit = p.purchaseValue*5.05;
				let for500profit = p.purchaseValue*6.05;
				
				if(this.helper.isAvailable(p.center)){
					let latlng = p.center.split(" ");
					
					p.latitude = latlng[1];
					p.longitude = latlng[0];
				} else {
					p.latitude = "";
					p.longitude = "";
                }
                
                let purchasedDate = p.purchasedDate;
                if(this.helper.isAvailable(purchasedDate)){
                    let year = purchasedDate.getFullYear().toString();
                    let month = (purchasedDate.getMonth()+1).toString().padStart(2,'0');
                    let day = purchasedDate.getDate().toString().padStart(2,'0');
                    let hours = purchasedDate.getHours().toString().padStart(2, '0');
                    let minute = purchasedDate.getMinutes().toString().padStart(2, '0');
                    let seconds = purchasedDate.getSeconds().toString().padStart(2, '0');
                    
                    purchasedDate = `${year}-${month}-${day} | ${hours}:${minute}:${seconds}`;
                }
                
				let result = `${country},${loc},${desc},${forSale},${p.tileCount},${p.tileClass}` 
					+	`,${purchasedDate},${p.purchaseValue},${p.currentValue},${increase},${forSaleValue},${forSaleVsNewLandPrice},${forSaleVsPricePaid},${link}`
					+	`,${for100profit},${for200profit},${for300profit},${for400profit},${for500profit}`
					+	`,${p.latitude},${p.longitude}`
					;
					
				return result;
			});
			
			window.allPropertiesCSV = "If you want to thank me -> use my code -->MSZY5BLXAP or tip (Paypal: csimbum@gmail.com)\r\n"
				+ "Country,Location,Description,For sale?,Tile count, Tile class,Purchase date,Price paid,Current value,Value %,For Sale Value,Sale vs New Land, Sale vs Price Paid,Link"
				+ ",Price for 100% profit,200% profit,300% profit,400% profit,500% profit"
				+ ",Latitude,Longitude"
				+"\r\n"
                + allProperties.join("\r\n");
                
            return window.allPropertiesCSV;
        }
    }

    class PropertyExportDataGet{
        constructor(helperInstance, countryMapInstance){
            this.helper = helperInstance;

            this.countryMap = countryMapInstance;
        }

        async getProperties(){
            let userProperties = await this.getUserProperties();
            if(userProperties === ""){
                //retry in case of failure
                let maxRetry = 10;
                let retryCount = 1;
                while(retryCount <= maxRetry){
                    userProperties = await this.getUserProperties();
                    if(userProperties === ""){
                        retryCount++;
                    } else {
                        break;
                    }
                }
            }

            if(userProperties !== ""){
                console.log(`properties length : [${userProperties.length}]`);
            }

            return userProperties;
        }   
        
        async getUserProperties() {
            let query = `{
                getMyLandfields {
                    id, forSale, description, location, center, country, tileCount, tileClass, purchasedStr, purchaseValue, currentValue, tradingValue, price, transactionSet{
                        price, time
                    }
                }
            }`;

            let actualQuery = JSON.stringify({ "query": query });
        
            let properties = await fetch('/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "X-CSRFToken": Cookies.get('csrftoken') },
                body: actualQuery
            }).then(r => {
                return r.text();
            }).then(data => {
                let parsedData = this.helper.tryParseJSON(data);
    
                if (!this.helper.isAvailable(parsedData) 
                    || !this.helper.isAvailable(parsedData.data) 
                    || !this.helper.isAvailable(parsedData.data.getMyLandfields)) {
                    console.log("data and parsed: ", {data, parsedData});
                    return "";
                }
    
                return parsedData.data.getMyLandfields;
            }).catch((error) => {
                console.log("fetch error in getUserProperties",error);
                return "";
            });
    
            if(this.helper.isAvailable(properties) && properties !== ""){
                properties.forEach(p => {
                    let lastTransactionDate = p.transactionSet.map(tr => new Date(tr.time)).sort().reverse()[0];
                    p.purchasedDate = lastTransactionDate;

                    p.countryName = this.countryMap.getCountry(p.country);
                });

                return properties;
            }
            
            return "";
        }
    }

    let propertyExportMain = new PropertyExportMain(new Helper());

    propertyExportMain.checkPropertyExportButton();
	window.addEventListener("hashchange", () => { propertyExportMain.checkPropertyExportButton(); }, false);
	
})();
