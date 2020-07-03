<p style="text-align: center;">
    <img src="https://res.cloudinary.com/hino-2/image/upload/c_scale,w_300/v1593787222/logos/RP-logo.png"/><br/>
    <font size="16px">ru-post-api</font>
</p>
<p>
    This is a simple wrapper for the Russian Post API. <br/>
    <br/>
    It includes 4 modules:
    <ul>
        <li>
            otpravka
        </li>
        <li>
            tariff
        </li>
        <li>
            delivery
        </li>
        <li>
            tracking
        </li>
    </ul>
</p>

## Installation

```
npm install ru-post-api
```

## Usage

### 1. otpravka

https://otpravka.pochta.ru/  
Official Russian Post spec: https://otpravka.pochta.ru/specification#/main

This module allows you to manage delivery orders. With it you can:

-   create/modify/delete new orders
-   create/modify/delete batches of orders
-   download all documents you need to ship goods
-   get information about post offices (TBD)
-   manage user settings (TBD)
-   normalize address, name and phone number (TBD)
-   check unreliable recipients (TBD)

In order to use _otpravka_ module you need authorization token and key. If you don't have them check these spec pages:

-   https://otpravka.pochta.ru/specification#/authorization-token
-   https://otpravka.pochta.ru/specification#/authorization-key

Then you need to call _otpravka.auth_ method with them as arguments:

```
otpravka.auth('mytoken', 'mykey')
```

You can use _otpravka_ module now.

Every method call returns a promise. On resolve it will return an object with two fields: error and data. One of them will always be null. The other one contains the result.

Example:

```
const otpravka = require("ru-post-api").otpravka;

otpravka.auth('mytoken', 'mykey');

(async () => {
    console.log(await otpravka.moveBatchFromArchive(["99"]));
})();

// will move specified batch from archive and print: { error: null, data: [ { 'batch-name': '99' } ] }
```

### 2. tariff

https://tariff.pochta.ru/  
Official Russian Post spec: https://tariff.pochta.ru/TariffAPI.pdf

This module allows you to calculate price of delivery. This is an open API so you don't need and authorization.

Every method call returns a promise. On resolve it will return an object with two fields: error and data. One of them will always be null. The other one contains the result.

Example:

```
const tariff = require("ru-post-api").tariff;

(async () => {
    console.log(
		await tariff.calc({
			object: 47030,
			from: 620961,
			to: 102321,
			weight: 1000,
		})
	);
})();

// will print:
// {
//     error: null,
//     data: {
//         version: '1.13.5.396',
//         place: 'C5-8',
//         id: 47030,
//         name: 'Посылка 1 класса',
//         ground: { val: 36833, valnds: 44200 },
//         pay: 36833,
//         paynds: 44200,
//         ndsrate: 20,
//         nds: 7367,
//         ...
//     }
// }
```

### 3. delivery

https://delivery.pochta.ru/  
Official Russian Post spec: https://delivery.pochta.ru/delivery_api.pdf

This module allows you to get delivery period. This is an open API so you don't need and authorization.

Every method call returns a promise. On resolve it will return an object with two fields: error and data. One of them will always be null. The other one contains the result.

Example:

```
const delivery = require("ru-post-api").delivery;

(async () => {
    console.log(
		await delivery.calc({
			object: 47030,
			from: 620961,
			to: 102321,
		})
	);
})();

// will print:
// {
//    error: null,
//    data: {
//        version: '1.13.5.396',
//        place: 'D_21',
//        id: 47030,
//        name: 'Посылка 1 класса',
//        delivery: { min: 4, max: 6, deadline: '20200709T000100' },
//        ...
//    }
// }
```

### 4. tracking

https://tracking.pochta.ru/  
Official Russian Post spec: https://tracking.pochta.ru/specification

This module allows you to get tracking and C.O.D. information.

In order to use this module you need to get a login and a password. You can get them [here](https://tracking.pochta.ru/).
Once you got them you need to pass them with every method call.

Every method call returns a promise. On resolve it will return an object with two fields: error and data. One of them will always be null. The other one contains the result.

Example:

```
const tracking = require("ru-post-api").tracking;

(async () => {
	console.log(
		await tracking.getOperationHistory({
			barCode: "EF124083719RU",
			login: "mylogin",
			password: "mypassword",
		})
	);
})();

// will print:
// {
//     error: null,
//     data: [
//         {
//             AddressParameters: [Object],
//             FinanceParameters: [Object],
//             ...
//         }
//     ]
// }
```
