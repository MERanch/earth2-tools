//How to change location for your property (I wouldn't try something like "Heaven" )
//the actual script looks like this:

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


query = query
    .replace("#DESCRIPTION#", "DESCRIPTION_HERE")
    .replace("#LOCATION#", "LOCATION_HERE")
    .replace("#FORSALEPRICE#", "500000.0")
    .replace("#FORSALE#", "false")
    .replace("#PROPERTYID#", "PROPERTY_ID_HERE");
let actualQuery = JSON.stringify({ "query": query });

let csrfToken = await cookieStore.get('csrftoken').then(r => r);

let result = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "X-CSRFToken": csrfToken },
    body: actualQuery
}).then(r => { return r.text(); }).then(data => {
    console.log("data: ",data);
}).catch((error) => {
    console.log("fetch error in handleEditSellClick", error);
});

// Step 0) Go and view the property on the map
// Step 1) Copy the script above into notepad
// Step 2) Get a correct location string. For that simply click a tile next to your property, and copy the location (like "Leopoldstadt, Vienna, Austria"), above replace LOCATION_HERE with that.
// Fill out the other values (DESCRIPTION_HERE,PROPERTY_ID_HERE using the current values). You can change the for sale price, flag for forsale as you want :)
// Open your dev.console, copy paste the modified script and press enter.
// Refresh the page to see if the results are okay :)
