# dice


# Javascript

The Javascript part is a REST API in NodeJS using Express.
To start the server be sure to have Node already installed.
Once installed use `npm install express` to download the service. Then in the terminal execute `node index.js` to start the server.
 > By default the listening port is `8080`. If you want to change it go to your `config.json` and set the port to your convenience at the field `TBD`.
## Routes
- `POST: /roll` :
  - Request :
    ```json
    {
        "roll": "[number of dice]d[dice value][+ or -][number to add]"
    }
    ```
  - Response :
    ```json
    {
        "success": boolean,
        "data": {
            "result": number,
            "nativeResult": number,
            "modifier": string
        },
        "error": {
            "code": number,
            "msg": string
        }
    }
    ```
- `POST: /average` :
- `POST: /median` :
- `POST: /lowerRoll` :
- `POST: /higherRoll` :
  - Request :
    ```json
    {
        "roll": "[number of dice]d[dice value][+ or -][number to add]",
        "level": 0, // number
        "repetition": 1, // number 
    }
    ```
  - Response :
    ```json
    {
        "success": boolean,
        "data": {
            "result": number,
            "nativeResult": number,
            "repetition": number,
            "rolls": [
                // roll response object
            ]
        },
        "error": {
            "code": number,
            "msg": string,
        }
    }
    ```   

# Python