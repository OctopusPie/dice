import statistics
import random

def roll (operation : str):

    opResult = 0
    if 'd' in operation:
        opDice = operation.split("d")
        if '+' in opDice[1]:
            opBonus = opDice[1].split("+")
        elif '-' in opDice[1]:
            opBonus = opDice[1].split("-")
            opBonus[1] = int(opBonus[1])*-1
        else:
            opBonus = [opDice[1], 0]


        if (opDice[0] == ''):
            opDice[0] = "1"
        for i in range(0, int(opDice[0])) :
            opResult = opResult + random.randint(1, int(opBonus[0]))
        opResult = opResult + int(opBonus[1])
    else :
        print("No d (o_O) ?")

    return opResult

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
    return statistics.mean(multiRoll(operation, avantageLevel, iteration))

def multiRoll (operation : str, avantageLevel : int, iteration : int) :
    RollTable = []

    for i in range(0, iteration):
        RollTable.append(advRoll(operation, avantageLevel))

    return RollTable

def medianRoll (operation : str, avantageLevel : int, iteration : int) :
    return statistics.median(multiRoll(operation, avantageLevel, iteration))

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