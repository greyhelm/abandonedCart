const nanoid = require("nanoid");
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';

// basic services function for handling data in requests
function abandonCartService(){
    let customerID = genID(12);
    let abandonCartTokenID = genID(16);

    function genID(size) {
        // using nanoId for random ids
        const nanoid = require('nanoid');
        const id = nanoid.customAlphabet(alphabet, size);
        return id();
    }

    return {
        customerID: customerID,
        abandonCartTokenID: abandonCartTokenID
    };
}

function handleJSON( body ){
    let abandonedCart = {
        customerID : body.customerID,
        profile : {
            email : body.profile.email,
            firstName : body.profile.firstName,
            lastName : body.profile.lastName,
            abandonedCartToken : body.profile.abandonedCartToken
        },
        basket :{
            lineItems: [{
                productLineItem: [{}]
            }]
        }
    };

    // loop through and populate product data
    let liLen = body.basket.lineItems.length;
    for(let i = 0; i < liLen; i++) {

        let pliLen = body.basket.lineItems[i].productLineItem.length;
        for (let j = 0; j < pliLen; j++) {

            let pli = {
                name: body.basket.lineItems[i].productLineItem[j].name,
                id: body.basket.lineItems[i].productLineItem[j].id,
                price: body.basket.lineItems[i].productLineItem[j].price
            };

            abandonedCart.basket.lineItems[i].productLineItem[j] = pli;
        }
    }
    //console.log("\n\nabandonedCartJSON\n\n" + JSON.stringify(abandonedCart));
    return abandonedCart;
}

module.exports = {
    abandonCartService,
    handleJSON
};