const mongoose = require('mongoose');
const aCService = require('../services/abandonCartService');

// define schema, save customer details and cart details
const abandonedCartSchema = mongoose.Schema({
    customerID : {
        type: { String },
        required: true,
        default: aCService.abandonCartService().customerID
    },
    profile : {
        email : {
            type: { String },
            required: true,
            default: "test@email.com"
        },
        firstName : {
            type: { String },
            default: "firstName"
        },
        lastName : {
            type: { String },
            default: "lastName"
        },
        abandonedCartToken : {
            type: {String},
            required: true,
            default: aCService.abandonCartService().abandonCartTokenID
        }
    },
    basket : {
        lineItems: [{
            productLineItem: [{
                name: {
                    type: { String },
                    default: "ProductName"
                },
                id: {
                    type: { String },
                    required: true,
                    default: "001"
                },
                price: {
                    type: { Number },
                    required: true,
                    default: 100
                }
            }]
            //giftCertificateLineItem:{}
        }]
    }
});

module.exports = mongoose.model('AbandonedCart', abandonedCartSchema);