/**
 * 
 * @param {object} params Content of the POST
 * @returns object
 */
exports.roll = (params) => {
    if(isEmpty(params)) {
        return {
            data: {},
            success: false,
            error: {
                code: 1,
                msg: 'POST is empty'
            }
        };
    }
    if(isMissing(params, 'roll')) {
        return {
            data: {},
            success: false,
            error: {
                code: 1,
                msg: 'POST is missing roll key'
            }
        };
    }

    // const types = ['string'];
    // if(!isValid(params, types)) {
    //     return {
    //         success: false,
    //         error: `data in key roll does not match any of the following [${types.join(',')}]`
    //     };
    // }

    return parsing(params.roll);
};

/**
 * Function that calculate the average of the POST data
 * 
 * values expected [roll, level, repetition]
 * 
 * @param {object} params Content of the POST
 * @returns object
 */
exports.average = (params) => {
    if(isEmpty(params)) {
        return {
            data: {},
            success: false,
            error: {
                code: 1,
                msg: 'POST is empty'
            }
        };
    }
    if(isMissing(params, 'roll')) {
        return {
            data: {},
            success: false,
            error: {
                code: 1,
                msg: 'POST is missing roll key'
            }
        };
    }
    if(isMissing(params, 'level')) {
        return {
            data: {},
            success: false,
            error: {
                code: 1,
                msg: 'POST is missing roll key'
            }
        };
    }
    if(isMissing(params, 'repetition')) {
        return {
            data: {},
            success: false,
            error: {
                code: 1,
                msg: 'POST is missing roll key'
            }
        };
    }

    let rollsResult = [];
    for(let i = 0; i < params.repetition; i++) {
        rollsResult.push(parsing(params.roll));
    }

    return rollsResult;
}

/**
 * Function that parse the string to try to make the calculations
 * @param {string} roll String that contains the roll
 * @returns object
 */
function parsing(roll) {
    if(roll.length === 0) {
        return {
            data: {},
            success: false,
            error: {
                code: 10,
                msg: 'roll value must not have a length of 0'
            }
        };
    }

    const dices = roll.split('d');
    console.log('dices ' + dices);    
    if(dices === undefined || dices.length < 2) {
        return {
            data: {},
            success: false,
            error: {
                code: 20,
                msg: 'wrong format should look like this : [number of dice]d[dice value][+ or -][number to add]'
            }
        };
    }

    const diceResult = rollDice(dices[0], dices[1]);

    return {
        success: true,
        data: {
            result: diceResult.result,
            nativeResult: diceResult.nativeResult,
            modifier:  diceResult.delta,
        },
        error: {
            code: 0,
            msg: ''
        }
    };
}

/**
 * 
 * @param {string} repetition Number of dice
 * @param {string} dice Value of the Dice and delta if added
 * @returns {object}
 */
function rollDice(repetition, dice) {
    /**
     * sign :   -1  = negative delta
     *           0  = nothing
     *           1  = positive delta
     */
     let sign = 0;
     let delta = 0;
     if(dice.includes('+')) {
         sign = 1;
 
         const tmp_dice = dice.split('+');
         dice = tmp_dice[0];
         delta = parseInt(tmp_dice[1]);
     } else if (dice.includes('-')) {
         sign = -1;
 
         const tmp_dice = dice.split('-');
         dice = tmp_dice[0];
         delta = parseInt(tmp_dice[1]);
     }

    let result = 0;
    for(let i = 0; i < repetition; i++) {
        result += (Math.floor(Math.random() * dice) + 1);
    }
    const nativeResult = result;
    if(sign === 1) {
        result += delta;
    } else if(sign === -1) {
        result -= delta;
    }

    return {
        nativeResult: nativeResult,
        result: result,
        delta: (sign === 1 ? '+' : sign === -1 ? '-' : '') + delta
    };
}

/**
 * Test if data is one of the type asked
 * @param {any} data Roll that can be in different type
 * @param {Array<string>} type Array of type that data must match
 * @returns boolean
 */
function isValid(data, type) {
    type.forEach(e => {
        switch(e) {
            case 'string':
                if(typeof data !== e) { return false; }
                break;
            case 'array':
                if(!Array.isArray(data)) { return false; }
                break;
            // TODO check if other types are needed otherwise refactor the code
        }
    });
    return true;
}

/**
 * Test if POST is empty
 * @param {object} obj POST object
 * @returns boolean
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Test if POST has the key
 * @param {object} obj POST object
 * @returns boolean
 */
function isMissing(obj, key) {
    return !obj.hasOwnProperty(key);
}