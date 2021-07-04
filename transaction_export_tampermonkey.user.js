// ==UserScript==
// @name         Transaction export for earth2.io
// @namespace    http://earth2.io/
// @version      0.2.1
// @description  Adds a button on your #transactions page and lets you download your transaction data in csv format.
// @author       Mihaly Szolnoki -> E2: MihajA414 - MSZY5BLXAP -> discord: mihaj
// @match        https://app.earth2.io/
// @grant        none
// @license MIT
// @currentversion	0.2.1 : Changed querying yet again to use the new API. 3rd party link is still removed
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

        let result = `${hours}:${minute}:${seconds}.${millisecs}`;
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

    let exportTransactionsCSV = async () => {
        let itemsPerPage = 100;

        window.getTransactionPage = async (pageNumber) => {
			
			let offset = (pageNumber - 1) * itemsPerPage;
			let url = `api/v2/my/balance_changes/?limit=${itemsPerPage}&offset=${offset}`;
			const data = await fetch(url).then(r => r.json()).then(r => r);
			//console.log(`data [${pageNumber}]: `, data);
			
			return data;
        }

        let firstPage = await window.getTransactionPage(1);

        if(firstPage == ""){
            //console.log("script fail");
            updateTransactionExportButtonText("script fail :( contact dev");
        } else {
			console.log("[Tr.Ex] first page: ",firstPage);
			
            window.transactions = firstPage.results;

            let totalCount = firstPage.count;
            let pageCount = Math.ceil(totalCount / itemsPerPage);
            
			console.log("[Tr.Ex] total "+totalCount+" pages: "+pageCount);
			
			let failedPages = [];
            for(let i = 1; i < pageCount; i++){

                let pageNumber = i+1;

                updateTransactionExportButtonText(`query page ${pageNumber-1} / ${pageCount}   ${getFormattedTime()}`);
                let pageData = await window.getTransactionPage(pageNumber);
                if( typeof(pageData) !== "string") {
                    window.transactions = window.transactions.concat(pageData.results);
					console.log(` transactions at page [${i}]`,pageData.results);
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
						window.transactions = window.transactions.concat(pageData.results);
						
						retryCount = 0;
						failedPages.shift();
					} else {
						retryCount++;
					}
				}
			}
			
			await createCSV();
			
			createDownloadFile("transactions", window.allTransactionsCSV);
			updateTransactionExportButtonText("script finish");
			
        }
        
        setTimeout(() => { updateTransactionExportButtonText(exportButtonText); },2000);
    }
	
	let createCSV = async () => {
		//let currentUserId = await getCurrentUserId();
		
		let allTransactions = window.transactions.map(t => {

			let loc = "";
			let desc = "";
			let link = ""
			let thirdPartyName = "";
			let thirdPartyLink = "";
			if(isAvailable(t.linked_object)){
				if(isAvailable(t.linked_object.location)){
					loc = cleanString(t.linked_object.location.replaceAll(","," | "));
				}
				if(isAvailable(t.linked_object.description)){
					desc = cleanString(t.linked_object.description.replaceAll(","," | "));
				}
				if(isAvailable(t.linked_object.id)){
					link = `https://app.earth2.io/#propertyInfo/${t.linked_object.id}`;
				}
				// if(isAvailable(t.landfield.owner)){
					
					// if(t.landfield.owner.id !== currentUserId){
					
						// thirdPartyName = cleanString(t.landfield.owner.username);
						// thirdPartyLink = `https://app.earth2.io/#profile/${t.landfield.owner.id}`;
						
					// }
				// } else {
					// console.log("no landfield for :",t);
				// }
			} else {
				//Credit?
				//console.log("unavailable landfield: ", t);
			}
			
			return `${t.created_display},${t.balance_change_type_display},${t.amount},${t.balance_before},${t.balance_after},${loc},${desc},${link}`;
		});

		window.allTransactionsCSV = "If you want to thank me -> use my code -->MSZY5BLXAP (or tip me Paypal: csimbum@gmail.com)\r\nCreated on,Change Type,Amount,Balance before,Balance after,Location,Description,Link\r\n" + allTransactions.join("\r\n");
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
