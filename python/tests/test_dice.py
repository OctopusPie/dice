
from python.src import dice


def test_parser():
    assert dice.parser("5d4-2") == [5, 4, -2]

def test_roll():
    assert isinstance(dice.roll("5d4-2"), int) == True

def test_advRoll():
    assert dice.advRoll("1d20", 2) < 21

def test_multiRoll():
    assert isinstance(dice.multiRoll("1d4+2", 2, 10), list) == True