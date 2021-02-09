// ==UserScript==
// @name         Transaction export for earth2.io
// @namespace    http://earth2.io/
// @version      0.1.7
// @description  Adds a button on your #transactions page and lets you download your transaction data in csv format.
// @author       Mihaly Szolnoki -> E2: MihajA414 - MSZY5BLXAP -> discord: mihaj
// @match        https://app.earth2.io/
// @grant        none
// @license MIT
// @currentversion	0.1.7 : Added debug logs for troubleshooting
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
    'use strict';
	
	console.log("[Tr.Ex.] init");

    window.transactionExportButtonName = "transaction_export_button";
    let exportButtonText = "click here to export your transactions";

    let isAvailable = (object) => {
        return typeof object !== "undefined" && object !== null && object !== "";
    }

    let getFormattedTime = (getDateToo) => {
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
    }

    window.tryParseJSON = (data) =>{
        try{
            let result = JSON.parse(data);
            return result;
        } catch(e){
            return data;
        }
    }
	
	let cleanString = (input) => {
		let output = "";
		for (var i=0; i<input.length; i++) {
			if (input.charCodeAt(i) <= 255) {
				output += input.charAt(i);
			}
		}
		return output;
	}

    //----

    let isTransactionsPage = () => {
        return window.location.hash.includes("#transactions");
    }

    let checkTransactionExportButton = () => {
        if(isTransactionsPage()){
            let exportButton = document.querySelector(`.settings-header a#${window.transactionExportButtonName}`);

            if(!isAvailable(exportButton)){
                //console.log("tr. export button not present");
                addTransactionExportButton();
            } else {
				console.log("[Tr.Ex.] button already present");
			}
        } else {
			console.log("[Tr.Ex.] not transactions page");
		}
    }

    let transactionExportButtonSelector = `.settings-header .content #${window.transactionExportButtonName}`;

    let updateTransactionExportButtonText = (text) => {
        document.querySelector(`${transactionExportButtonSelector} span`).textContent = text;
    }

    let addTransactionExportButton = () => {
		
		console.log("[Tr.Ex.] add button");

        let exportButtonTag = `
		<div class="extra-bits" id=${window.transactionExportButtonName}>
		<button type="button" style="margin-right: 20px;"><span style="padding-left: 10px;padding-right: 10px;color: #a0a;">${exportButtonText}</span></button>
		</div>
		`;

        setTimeout(() => {
            window.exportButtonDisabled = false;
            document.querySelector('.settings-header .content').insertAdjacentHTML("afterbegin",exportButtonTag);

            document.querySelector(transactionExportButtonSelector).addEventListener("click", async () => {
                if(window.exportButtonDisabled === false){
                    window.exportButtonDisabled = true;
                    document.querySelector(transactionExportButtonSelector).disabled = true;
                    updateTransactionExportButtonText("Please wait...");

                    await exportTransactionsCSV();

                    updateTransactionExportButtonText(exportButtonText);
                    document.querySelector(`.settings-header #${window.transactionExportButtonName}`).disabled = false;
                    window.exportButtonDisabled = false;
                }
            }, false);
        }, 1500);
    }

    checkTransactionExportButton(); //check immediately
	
	let getCurrentUserId = async () => {
		let query = `{
                getMyLandfields {
                    owner { id }
                }
            }`;
		let currentUserId = await fetch('/graphql', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "X-CSRFToken": Cookies.get('csrftoken') },
			body: JSON.stringify({ "query" : query})
		}).then(r => {
			return r.text();
		}).then(data => {
			let parsedData = window.tryParseJSON(data);
			
			if(typeof(parsedData) === "string") {
				//console.log("failed to get data (maintenance?)",{parsedData: parsedData});
				return "";
			}

			
			console.log("parsedData: ",parsedData.data.getMyLandfields[0]);
			if(parsedData.data.getMyLandfields.length > 0){
				return parsedData.data.getMyLandfields[0].owner.id;
			} else {
				return "";
			}
			
		});

		return currentUserId;
	}

    let exportTransactionsCSV = async () => {
        let itemsPerPage = 1024;

        let query = `{ getBalanceChanges(items: ${itemsPerPage}, page: #) { 
				count, balanceChanges { 
					id, description, balanceChangeTypeDisplay, amount, createdDisplay, countryFlag, balanceBefore, balanceAfter, landfield { description, tileCount, location, id, owner{ id, username } } 
					} 
				} 
			}`;

        window.getTransactionPage = async (pageNumber) => {
            let pageData = await fetch('/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "X-CSRFToken": Cookies.get('csrftoken') },
                body: JSON.stringify({"query": query.replace("#",pageNumber)})
            }).then(r => {
                return r.text();
            }).then(data => {
                let parsedData = window.tryParseJSON(data);

                if(typeof(parsedData) === "string") {
                    //console.log("failed to get data (maintenance?)",{parsedData: parsedData});
                    return "";
                }
				
				//console.log("parsedData", parsedData);

                let keys = Object.keys(parsedData.data);
                if (keys && keys.length > 0) {
                    return { transactions : parsedData.data[keys[0]] };
                }
            });

            return pageData;
        }

        let firstPage = await window.getTransactionPage(1);

        if(firstPage == ""){
            //console.log("script fail");
            updateTransactionExportButtonText("script fail :( contact dev");
        } else {
			console.log("[Tr.Ex] first page: ",firstPage);
			
            window.transactions = firstPage.transactions.balanceChanges;

            let totalCount = firstPage.transactions.count;
            let pageCount = Math.ceil(totalCount / itemsPerPage);
            
			console.log("[Tr.Ex] total "+totalCount+" pages: "+pageCount);
			
			let failedPages = [];
            for(let i = 1; i < pageCount; i++){

                let pageNumber = i+1;

                updateTransactionExportButtonText(`query page ${pageNumber-1} / ${pageCount}   ${getFormattedTime()}`);
                let pageData = await window.getTransactionPage(pageNumber);
                if( typeof(pageData) !== "string") {
                    window.transactions = window.transactions.concat(pageData.transactions.balanceChanges);
                } else {
                    failedPages.push(pageNumber);
                }
            }
			if(failedPages.length > 0){
				//console.log("failed pages: ", failedPages.join(","));
				const maxRetry = 30;
				let retryCount = 0;
				while(retryCount < maxRetry && failedPages.length > 0){
					let currentPage = failedPages[0];
					updateTransactionExportButtonText(` retry ${retryCount+1}/${maxRetry} for page ${currentPage} / ${pageCount}`);
					
					let pageData = await window.getTransactionPage(currentPage);
					if(typeof(pageData) !== "string"){
						window.transactions = window.transactions.concat(pageData.transactions.balanceChanges);
						
						retryCount = 0;
						failedPages.shift();
					} else {
						retryCount++;
					}
				}
			}
			
			let temp = [];
			window.transactions.forEach(t => {
				if(!temp.some(tr => 
					tr.createdDisplay === t.createdDisplay 
					&& tr.balanceBefore === t.balanceBefore 
					&& tr.balanceAfter === t.balanceAfter 
					&& tr.amount === t.amount
					&& tr.id === t.id
					)){
					temp.push(t);
				}
			});
			window.transactions = temp;
			
			await createCSV();
			
			createDownloadFile("transactions", window.allTransactionsCSV);
			updateTransactionExportButtonText("script finish");
			
        }
        
        setTimeout(() => { updateTransactionExportButtonText(exportButtonText); },2000);
    }
	
	let createCSV = async () => {
		let currentUserId = await getCurrentUserId();
		
		let allTransactions = window.transactions.map(t => {

			let loc = "";
			let desc = "";
			let link = ""
			let thirdPartyName = "";
			let thirdPartyLink = "";
			if(isAvailable(t.landfield)){
				if(isAvailable(t.landfield["location"])){
					loc = cleanString(t.landfield["location"].replaceAll(","," | "));
				}
				if(isAvailable(t.landfield.description)){
					desc = cleanString(t.landfield.description.replaceAll(","," | "));
				}
				if(isAvailable(t.landfield.id)){
					link = `https://app.earth2.io/#propertyInfo/${t.landfield.id}`;
				}
				if(isAvailable(t.landfield.owner)){
					
					if(t.landfield.owner.id !== currentUserId){
					
						thirdPartyName = cleanString(t.landfield.owner.username);
						thirdPartyLink = `https://app.earth2.io/#profile/${t.landfield.owner.id}`;
						
					}
				}
			}
			
			return `${t.createdDisplay},${t.balanceChangeTypeDisplay},${t.amount},${t.balanceBefore},${t.balanceAfter},${loc},${desc},${link},${thirdPartyName},${thirdPartyLink}`;
		});

		window.allTransactionsCSV = "If you want to thank me -> use my code -->MSZY5BLXAP (or tip me Paypal: csimbum@gmail.com)\r\nCreated on,Change Type,Amount,Balance before,Balance after,Location,Description,Link,3rd party,3rd party link\r\n" + allTransactions.join("\r\n");
	}

    let createDownloadFile = (prefix, content) => {
        let link = document.createElement('a');
        link.download = `${prefix}-${getFormattedTime(true).replaceAll(":","_")}.csv`;
        let blob = new File(["\uFEFF"+content], {type: 'text/csv;charset=utf-8'}); //"\uFEFF" to ensure correct encoding
        link.href = window.URL.createObjectURL(blob);
		if(confirm("do you want to download the results?")){
			link.click();
		}
    }


    window.addEventListener("hashchange", () => { checkTransactionExportButton(); }, false);
})();
