from statistics import (
    mean,
    median,
)
from random import randint

def roll (operation : str):
    opParsed = parser(operation)
    opResult = 0
    if (opParsed[0] == ''):
        opParsed[0] = "1"
    for i in range(0, int(opParsed[0])) :
        opResult = opResult + randint(1, int(opParsed[1]))
    opResult = opResult + int(opParsed[2])

    return opResult

def parser(operation : str):
    if 'd' in operation:
        opDice = operation.split("d")
        if '+' in opDice[1]:
            opValues = opDice[1].split("+")
        elif '-' in opDice[1]:
            opValues = opDice[1].split("-")
            opValues[1] = int(opValues[1])*-1
        else:
            opValues = [opDice[1], 0]
        opValues.insert(0, opDice[0])
        return opValues
    else :
        print("\nBad format, dice operations should be written like this : [number of dice]d[dice value][+ or -][number to add]\n")


def advRoll (operation : str, avantageLevel : int):

    avantage = {"level":1, "type":"neutral"}
    if (avantageLevel > 0):
        avantage["level"] = avantageLevel
        avantage["type"] = "avantage"
    elif (avantageLevel< 0):
        avantage["level"] = avantageLevel*-1
        avantage["type"] = "disavantage"

    if (avantage["type"] == "neutral"):
        return roll(operation)
    else :
        rollTable = []
        for i in range(0, avantage.get("level")):
            rollTable.append(roll(operation))
        if (avantage["type"] == "avantage"):
            return max(rollTable)
        elif (avantage["type"] == "disavantage"):
            return min(rollTable)
            

def averageRoll (operation : str, avantageLevel : int, iteration : int) :
    return mean(multiRoll(operation, avantageLevel, iteration))

def multiRoll (operation : str, avantageLevel : int, iteration : int) :
    RollTable = []

    for i in range(0, iteration):
        RollTable.append(advRoll(operation, avantageLevel))

    return RollTable

def medianRoll (operation : str, avantageLevel : int, iteration : int) :
    return median(multiRoll(operation, avantageLevel, iteration))

def removeLowerRoll (operation : str, avantageLevel : int, howManyDice : int, toRemove : int) :
    if (howManyDice <= toRemove) :
        print ("No more dice !")
    
    RollTable = multiRoll(operation, avantageLevel, howManyDice)

    for i in range(0, toRemove):
        RollTable.remove(min(RollTable))

    return RollTable

def removeHigherRoll (operation : str, avantageLevel : int, howManyDice : int, toRemove : int) :
    if (howManyDice <= toRemove) :
        print ("No more dice !")
    RollTable = multiRoll(operation, avantageLevel, howManyDice)
    for i in range(0, toRemove):
        RollTable.remove(max(RollTable))
    return RollTable