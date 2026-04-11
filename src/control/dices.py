from copy import deepcopy
import random
from typing import Tuple, List
from enum import Enum

class Result(Enum):
    FAILURE = 0
    BESTIAL_FAILURE = 1
    BLOOD_FAILURE = 2
    SUCCESS = 3
    BLOOD_SUCCESS = 4
    CRITICAL_SUCCESS = 5
    MESSY_CRITICAL = 6


def roll_dices(
        overall_count: int,
        hanger_count: int
) -> Tuple[int, List[Result], Tuple[Result, Result]]:
    results: List[Result] = []
    successes: int = 0
    crits: int = 0

    for i in range(overall_count):
        dice_result = random.randint(1, 10)
        if i < hanger_count:
            if dice_result == 1:
                results.append(Result.BESTIAL_FAILURE)
            elif dice_result <= 5:
                results.append(Result.BLOOD_FAILURE)
            elif dice_result <= 9:
                results.append(Result.BLOOD_SUCCESS)
                successes += 1
            elif dice_result == 10:
                results.append(Result.MESSY_CRITICAL)
                crits += 1
        else:
            if dice_result <= 5:
                results.append(Result.FAILURE)
            elif dice_result <= 9:
                results.append(Result.SUCCESS)
                successes += 1
            elif dice_result == 10:
                results.append(Result.CRITICAL_SUCCESS)
                crits += 1

    crit_pairs = crits // 2
    successes += crit_pairs * 4
    successes += crits % 2

    return (
        successes,
        results,
        (
            Result.BESTIAL_FAILURE if Result.BESTIAL_FAILURE in results else Result.FAILURE,
            (Result.MESSY_CRITICAL if Result.MESSY_CRITICAL in results else Result.CRITICAL_SUCCESS) if crits >= 2 else Result.SUCCESS,
        ),
    )

def reroll_dices(
        overall_count: int,
        hanger_count: int,
        previous_results: List[Result],
        rerolling_indexes: List[int]
) -> Tuple[int, List[Result], Tuple[Result, Result]]:
    results: List[Result] = deepcopy(previous_results)
    successes: int = 0
    crits: int = 0
    for idx in rerolling_indexes:
        if idx < hanger_count:
            assert 0, "Can't reroll blood dices"

        dice_result = random.randint(1, 10)
        if dice_result <= 5:
            results[idx] = Result.FAILURE
        elif dice_result <= 9:
            results[idx] = Result.SUCCESS
        elif dice_result == 10:
            results[idx] = Result.CRITICAL_SUCCESS

    for dice_result in results:
        if dice_result in (Result.BLOOD_SUCCESS, Result.SUCCESS):
            successes += 1
        elif dice_result in (Result.MESSY_CRITICAL, Result.CRITICAL_SUCCESS):
            crits += 1

    crit_pairs = crits // 2
    successes += crit_pairs * 4
    successes += crits % 2

    return (
        successes,
        results,
        (
            Result.BESTIAL_FAILURE if Result.BESTIAL_FAILURE in results else Result.FAILURE,
            Result.MESSY_CRITICAL if Result.MESSY_CRITICAL in results and crits >= 2 else Result.SUCCESS,
        ),
    )
