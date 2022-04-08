/**
 * 
 * @param {object} params Content of the POST
 * @returns object
 */
exports.roll = (params) => {
    const checking = checkPOSTObject(params, ['roll']);

    if(!checking.success) {
        return checking.response;
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
    const checking = checkPOSTObject(params, ['roll', 'level', 'repetition']);

    if(!checking) {
        return checking.response;
    }

    let rollsResult = [];
    let avg = 0;
    for(let i = 0; i < params.repetition; i++) {
        const roll = parsing(params.roll);
        rollsResult.push(roll);
        avg += roll.data.result;
    }

    return {
        success: true,
        data: {
            result: parseFloat(avg/params.repetition),
            nativeRoll: params.roll,
            repetition:  params.repetition,
            rolls: rollsResult,
        },
        error: {
            code: 0,
            msg: ''
        }
    };
}

/**
 * Function that calculate the median vlaue of the POST data
 * 
 * values expected [roll, level, repetition]
 * 
 * @param {object} params Content of the POST
 * @returns object
 */
exports.median = (params) => {
    const checking = checkPOSTObject(params, ['roll', 'level', 'repetition']);
    if(!checking) {
        return checking.response;
    }

    let rollsResult = [];
    let median = [];
    for(let i = 0; i < params.repetition; i++) {
        const roll = parsing(params.roll);
        rollsResult.push(roll);
        median.push(roll.data.result);
    }
    median.sort((a, b) => a - b);

    let results = null;
    if(median.length % 2 === 0) {
        median[median.length / 2];
        results = (median[median.length / 2] + median[(median.length / 2) - 1]) / 2;
    } else {
        results = median[parseInt(median.length / 2)];
    }

    return {
        success: true,
        data: {
            result: results ?? 'An error happened',
            nativeRoll: params.roll,
            repetition:  params.repetition,
            rolls: rollsResult,
        },
        error: {
            code: 0,
            msg: ''
        }
    };
}

/**
 * Function that returns the lowest roll of all
 * 
 * values expected [roll, level, repetition, minus]
 * 
 * @param {object} params 
 * @param {boolean} order true : greatest, false : lowest
 * @returns object
 */
exports.targetRoll = (params, order) => { //TODO integrate minus param
    const checking = checkPOSTObject(params, ['roll', 'level', 'repetition', 'minus']);
    if(!checking.success) {
        return checking.response;
    }

    let rollsResult = [];
    let targetValue = null;
    for(let i = 0; i < params.repetition; i++) {
        const roll = parsing(params.roll);
        rollsResult.push(roll);

        if(order) {
            if(targetValue === null || targetValue.data.result < roll.data.result) {
                targetValue = roll;
            }
        } else {
            if(targetValue === null || targetValue.data.result >= roll.data.result) {
                targetValue = roll;
            }
        }
    }

    return {
        success: true,
        data: {
            result: targetValue ?? 'An error happened',
            nativeRoll: params.roll,
            repetition:  params.repetition,
            rolls: rollsResult,
        },
        error: {
            code: 0,
            msg: ''
        }
    };
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
 * 
 * @param {object} params   Content of the POST
 * @param {array}  targets  Array of key to look for in the object
 * @returns object
 */
function checkPOSTObject(params, targets) {
    let response = {};
    let success = true;
    if(isEmpty(params)) {
        success = false;
        response = {
            data: {},
            success: false,
            error: {
                code: 1,
                msg: 'POST is empty'
            }
        };
    }

    if(success) {
        targets.forEach(key => {
            if(success && isMissing(params, key)) {
                success = false;
                response = {
                    data: {},
                    success: false,
                    error: {
                        code: 1,
                        msg: `POST is missing ${key} key and/or value`
                    }
                };
                console.log(`ERROR : POST is missing ${key} key and/or value`);
            }
        });
    }

    return {
        success: success,
        response: response
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
    if(!obj.hasOwnProperty(key)) {return true;}
    if(key === undefined || key === null) {return true;}
    return false;
}