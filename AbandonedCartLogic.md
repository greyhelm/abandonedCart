# Implementation Logic

## Requirements

- Abandoned carts should be tracked
- Customer should be informed with a popup one hour later
- Customer should receive a reminder email one day later
- If the customer hasn't completed the purchase after one week,
  send the cart and customer details to the third-party loyalty integration.
***

## Considerations

- Using SFCC
- There are two main flows
  - Authenticated User
  - Anonymous / Guest User

## Implementation

#### New Custom Attributes
- Profile
    - `abandondedCartToken (String)`
    - `hasAbandonedCart (boolean)`
- Session
    - `sessionHasAbandonedCart (boolean)`
    - `timeOfAbandonment (Date)`

#### New Custom Object
- `AbandonedCart`
    - Customer details
    - List of products in Cart at abandonment
    - `timeOfAbandonment (Date)`
    - `isAbandonedCartEmailSent (boolean)`

### Tracking Abandoned Cart

#### Flag Abandoned Cart
- Flag that cart is abandoned when:
  - `session` expires
  - Frontend Event trigger/handler when user goes back from checkout page 
  - Backend, look at last time of customer login and if they have a `currentBasket`
- When flagged
  - `session.custom.sessionHasAbandonedCart = true` 
  - `session.custom.timeOfAbandonment = Date.now`

#### Store Abandoned Cart
- Create `abandonedCartToken` 
    - Write Function 
      - take product uuid's and generate unique token 
      - can use token to retrieve list of products and populate cart
    - Use `Basket.ProductLineItems` for token in custom attr for `customer.profile`
    - **Must** handle `ProductLineItem`, `BonusDiscountLineItem`, `GiftCertificateLineItem`

- Create new `AbandonedCart` Custom Object
  - Customer details and Products
  - `timeOfAbandonment`

### Popup Trigger 1 hour after being flagged
- Check if current `Session` has `timeOfAbandonment`
- Set `sessionHasAbandonedCart` if needed
- Check `session.custom.sessionHasAbandonedCart`
  - Frontend trigger for pop up to be shown

### Reminder Email and 3rd Party Integration

#### Create new Custom Job
- Create job to run every 12-24 Hours
  - Loop through all `AbandonedCart` CustomObjects
  - Basic check against the `timeOfAbandonment` and `now`
    - Check `isAbandonedCartEmailSent == false`
      - Trigger email
      - Set `isAbandonedCartEmailSent = true`
    
    - If `timeOfAbandonment` is greater than a week and `isAbandonedCartEmailSent == true`
      - Prepare data in JSON for sending to 3rd Party API using `AbandonedCart` Custom Object
      - Delete Custom Object (?)
        - Set up job that cleans `AbandonedCart` objects if older than 1 month

### On Successful Checkout
- Add additional logic after successful checkout
  - All custom preferences associated to `Profile` are reset
  - All `AbandonedCart` objects linked to that customer are deleted

### Additional 3rd Party Integration
- Create Pipeline/Controller/Endpoint/etc
  - Takes `abandonedCartToken` provided to 3rd Party API to populate cart with products