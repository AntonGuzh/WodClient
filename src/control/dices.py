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


def evaluate_dices(
        dice_values: List[int],
        hanger_count: int
) -> Tuple[int, List[Result], Tuple[Result, Result]]:
    results: List[Result] = []
    successes: int = 0
    crits: int = 0

    for i, dice_result in enumerate(dice_values):
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
