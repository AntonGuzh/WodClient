(function () {
    let currentBaseDiceRoll = null;

    function rollD10Values(count) {
        return Array.from({ length: count }, () => Math.floor(Math.random() * 10) + 1);
    }

    function createDiceRollDetails(count, hungerCount) {
        return Array.from({ length: count }, (_, index) => ({
            is_hunger: index < hungerCount,
        }));
    }

    function showDiceRollingState() {
        document.getElementById('diceInputSection').style.display = 'none';
        document.getElementById('diceResultSection').style.display = 'block';
        document.getElementById('successCount').textContent = '...';
        document.getElementById('specialResults').innerHTML = '';
        setWillpowerRerollSelection(false);
        updateWillpowerRerollButton();
    }

    async function rollAnimatedDiceValues(count, hungerCount) {
        const rollerContainer = document.getElementById('diceRoller3D');
        if (!rollerContainer || !window.diceRoller3D) {
            return rollD10Values(count).map((rawValue, index) => ({
                raw_value: rawValue,
                is_hunger: index < hungerCount,
            }));
        }

        const rolledDice = await window.diceRoller3D.roll(rollerContainer, createDiceRollDetails(count, hungerCount));
        if (Array.isArray(rolledDice)) {
            return rolledDice;
        }

        return rollD10Values(count).map((rawValue, index) => ({
            raw_value: rawValue,
            is_hunger: index < hungerCount,
        }));
    }

    async function rerollAnimatedDiceIndexes(selectedIndexes) {
        const rollerContainer = document.getElementById('diceRoller3D');
        if (!rollerContainer || !window.diceRoller3D?.rerollIndexes) {
            return null;
        }

        const rolledDice = await window.diceRoller3D.rerollIndexes(rollerContainer, selectedIndexes);
        return Array.isArray(rolledDice) ? rolledDice : null;
    }

    async function evaluateDiceValues(diceValueDetails, hungerCount) {
        const diceValues = diceValueDetails.map(detail => detail.raw_value);
        const result = await window.evaluateDiceValues(diceValues, hungerCount);
        return result;
    }

    function renderSpecialResults(specialTuple, message = '', showTypes = true) {
        const specialDiv = document.getElementById('specialResults');
        specialDiv.innerHTML = '';

        const messageHtml = message ? `<div>${message}</div>` : '';

        if (!showTypes) {
            specialDiv.innerHTML = messageHtml
                ? `<div style="padding: 10px; background: #f0f0f0; border-radius: 5px;">${messageHtml}</div>`
                : '';
            return;
        }

        const [failureNum, successNum] = specialTuple;
        const failureDescriptions = {
            0: 'Провал',
            1: 'Звериный провал',
        };
        const successDescriptions = {
            3: 'Успех',
            5: 'Триумф',
            6: 'Кровавый триумф',
        };
        const failureDesc = failureDescriptions[failureNum] || 'Провал';
        const successDesc = successDescriptions[successNum] || 'Успех';

        specialDiv.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 5px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                ${messageHtml}
                <div><strong>Тип провала:</strong> ${failureDesc}</div>
                <div><strong>Тип успеха:</strong> ${successDesc}</div>
            </div>
        `;
    }

    function showDiceResult(result, message = '', showTypes = true) {
        const successes = result[0];
        const specialTuple = result[2];

        document.getElementById('successCount').textContent = successes;
        renderSpecialResults(specialTuple, message, showTypes);

        document.getElementById('diceInputSection').style.display = 'none';
        document.getElementById('diceResultSection').style.display = 'block';
    }

    function setWillpowerRerollSelection(enabled) {
        const rollerContainer = document.getElementById('diceRoller3D');
        if (!rollerContainer || !window.diceRoller3D) {
            return;
        }

        if (!enabled || !currentBaseDiceRoll?.canReroll) {
            window.diceRoller3D.setSelection(rollerContainer, { enabled: false });
            return;
        }

        window.diceRoller3D.setSelection(rollerContainer, {
            enabled: true,
            max: 3,
            selectedIndexes: currentBaseDiceRoll.selectedIndexes,
            selectableIndexes: currentBaseDiceRoll.normalDiceIndexes,
            onChange: selectedIndexes => {
                currentBaseDiceRoll.selectedIndexes = new Set(selectedIndexes);
                updateWillpowerRerollButton();
            },
        });
    }

    function updateWillpowerRerollButton() {
        const button = document.getElementById('willpowerRerollButton');
        if (!button) {
            return;
        }

        button.disabled = !currentBaseDiceRoll?.canReroll || currentBaseDiceRoll.selectedIndexes.size === 0;
    }

    async function rollBaseDice() {
        const count = parseInt(document.getElementById('diceCount').value);

        if (!count || count < 1) {
            alert('Введите корректное количество кубиков');
            return;
        }

        const hunger = parseInt(await window.getBasicTrackerValue('hunger')) || 0;
        const hungerCount = Math.min(count, hunger);

        currentBaseDiceRoll = {
            count,
            hungerCount,
            diceValues: [],
            diceDetails: [],
            normalDiceIndexes: [],
            selectedIndexes: new Set(),
            canReroll: true,
        };

        showDiceRollingState();
        const rolledDice = await rollAnimatedDiceValues(count, hungerCount);
        const result = await evaluateDiceValues(rolledDice, hungerCount);
        currentBaseDiceRoll.diceValues = rolledDice.map(detail => detail.raw_value);
        currentBaseDiceRoll.diceDetails = result[1];
        currentBaseDiceRoll.normalDiceIndexes = result[1]
            .map((detail, index) => detail.is_hunger ? null : index)
            .filter(index => index !== null);
        showDiceResult(result);
        setWillpowerRerollSelection(true);
        updateWillpowerRerollButton();
    }

    async function rerollSelectedDice() {
        if (!currentBaseDiceRoll?.canReroll || currentBaseDiceRoll.selectedIndexes.size === 0) {
            return;
        }

        const selectedIndexes = Array.from(currentBaseDiceRoll.selectedIndexes);
        currentBaseDiceRoll.canReroll = false;
        setWillpowerRerollSelection(false);
        updateWillpowerRerollButton();

        showDiceRollingState();
        const rolledDice = await rerollAnimatedDiceIndexes(selectedIndexes);
        if (rolledDice) {
            currentBaseDiceRoll.diceValues = rolledDice.map(detail => detail.raw_value);
        } else {
            const fallbackDice = rollD10Values(selectedIndexes.length);
            fallbackDice.forEach((rawValue, index) => {
                currentBaseDiceRoll.diceValues[selectedIndexes[index]] = rawValue;
            });
        }

        const result = await evaluateDiceValues(
            currentBaseDiceRoll.diceValues.map((rawValue, index) => ({
                raw_value: rawValue,
                is_hunger: index < currentBaseDiceRoll.hungerCount,
            })),
            currentBaseDiceRoll.hungerCount,
        );

        currentBaseDiceRoll.diceDetails = result[1];
        currentBaseDiceRoll.selectedIndexes = new Set();
        showDiceResult(result);
        updateWillpowerRerollButton();
    }

    async function rollRouseCheck() {
        currentBaseDiceRoll = null;
        showDiceRollingState();

        const rolledDice = await rollAnimatedDiceValues(1, 1);
        const result = await evaluateDiceValues(rolledDice, 1);
        const message = result[0] >= 1
            ? 'Ваш голод не изменился'
            : 'Ваш голод увеличивается';

        showDiceResult(result, message, false);
    }

    async function getCurrentLifeStats() {
        if (window.lifeStatsData) {
            return window.lifeStatsData;
        }

        const data = await window.getLifeStats();
        window.lifeStatsData = data;
        return data;
    }

    async function rollFrenzyTest() {
        currentBaseDiceRoll = null;
        const count = await getFrenzyDiceCount();

        showDiceRollingState();
        const rolledDice = await rollAnimatedDiceValues(count, 0);
        const result = await evaluateDiceValues(rolledDice, 0);
        showDiceResult(result);
    }

    async function getFrenzyDiceCount() {
        const stats = await getCurrentLifeStats();
        const availableWillpower = Math.max(0, (stats?.max_willpower ?? 0) - (stats?.hard_willpower_damage ?? 0) - (stats?.light_willpower_damage ?? 0));
        const humanityBonus = Math.floor((stats?.humanity ?? 0) / 3);
        return availableWillpower + humanityBonus;
    }

    async function rollRemorse() {
        currentBaseDiceRoll = null;
        const count = await getRemorseDiceCount();

        showDiceRollingState();
        const rolledDice = await rollAnimatedDiceValues(count, 0);
        const result = await evaluateDiceValues(rolledDice, 0);
        const message = result[0] >= 1
            ? 'Ваши пятна могут быть стерты'
            : 'Ваша человечность уменьшается';

        showDiceResult(result, message, false);
    }

    async function getRemorseDiceCount() {
        const stats = await getCurrentLifeStats();
        const maxHumanity = stats?.max_humanity ?? 10;
        const humanity = stats?.humanity ?? 0;
        const stains = stats?.stains_humanity ?? 0;
        return Math.max(1, maxHumanity - humanity - stains);
    }

    function resetDiceModal() {
        document.getElementById('diceInputSection').style.display = 'block';
        document.getElementById('diceResultSection').style.display = 'none';
        document.getElementById('successCount').textContent = '0';
        document.getElementById('specialResults').innerHTML = '';

        const rollerContainer = document.getElementById('diceRoller3D');
        if (rollerContainer && window.diceRoller3D) {
            window.diceRoller3D.clear(rollerContainer);
        }

        currentBaseDiceRoll = null;
        updateWillpowerRerollButton();
    }

    window.rollBaseDice = rollBaseDice;
    window.rerollSelectedDice = rerollSelectedDice;
    window.rollRouseCheck = rollRouseCheck;
    window.rollFrenzyTest = rollFrenzyTest;
    window.getFrenzyDiceCount = getFrenzyDiceCount;
    window.rollRemorse = rollRemorse;
    window.getRemorseDiceCount = getRemorseDiceCount;
    window.resetDiceModal = resetDiceModal;
})();
