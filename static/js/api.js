const pywebviewReady = new Promise(resolve => {
    if (window.pywebview) {
        resolve();
    } else {
        window.addEventListener('pywebviewready', resolve, { once: true });
    }
});

const callApi = async (method, ...args) => {
    await pywebviewReady;
    return pywebview.api[method](...args);
};

window.getBasicTrackerValue = (() => {
    let cachedTrackers = null;
    return async (id) => {
        if (cachedTrackers) return cachedTrackers.get(id);
        let rawData = await callApi('get_basic_trackers');
        cachedTrackers = new Map(Object.entries(rawData));
        return cachedTrackers.get(id);
    };
})();

window.setBasicTrackerValue = async (id, value) => {
    await callApi('update_basic_tracker', id, value);
};

window.getLifeStats = async () => {
    return await callApi('get_life_stats');
};

window.applyHealthDamage = async (amount, isHeavy, halve) => {
    return await callApi('apply_damage', amount, isHeavy, halve);
};

window.applyWillpowerDamage = async (amount, isHeavy, halve) => {
    return await callApi('apply_stress', amount, isHeavy, halve);
};

window.updateTextField = async (id, value) => {
    return await callApi('update_text_field', id, value);
};

window.getDisciplineDetails = async (disciplineName) => {
    return await callApi('get_discipline_details', disciplineName);
};

window.getPowerDetails = async (powerName) => {
    return await callApi('get_power_details', powerName);
};

window.getAllDisciplines = async () => {
    return await callApi('get_all_disciplines');
};

window.getDisciplinePowers = async (disciplineName, currentLevel) => {
    return await callApi('get_discipline_powers', disciplineName, currentLevel);
};

window.getAdvantagesData = async () => {
    return await callApi('get_advantages');
};

window.addAdvantage = async (newName) => {
    return await callApi('add_advantage', newName);
};

window.removeAdvantage = async (name) => {
    return await callApi('remove_advantage', name);
};

window.setAdvantageValue = async (name, value) => {
    return await callApi('update_advantage', name, value);
};

window.renameAdvantage = async (oldName, newName) => {
    return await callApi('rename_advantage', oldName, newName);
};

window.updateAdvantage = async (name, value) => {
    return await callApi('update_advantage', name, value);
};

window.getCharacterDisciplines = async () => {
    return await callApi('get_character_disciplines');
};

window.addDiscipline = async (disciplineName) => {
    return await callApi('add_discipline_to_character', disciplineName);
};

window.getDiscipline = async (disciplineName) => {
    return await callApi('get_discipline_details', disciplineName);
}

window.removeDiscipline = async (disciplineName) => {
    return await callApi('remove_discipline_from_character', disciplineName);
};

window.addPower = async (disciplineName, powerName) => {
    return await callApi('add_power_to_character', disciplineName, powerName);
};

window.removePower = async (disciplineName, powerName) => {
    return await callApi('remove_power_from_character', disciplineName, powerName);
};

window.getClansList = async () => {
    return await callApi('get_clans_list');
};

window.getCharacterClan = async () => {
    return await callApi('get_character_clan');
};

window.setCharacterClan = async (clanName) => {
    return await callApi('set_character_clan', clanName);
};

window.getClanBane = async (clanName) => {
    return await callApi('get_clan_bane', clanName);
};

window.getClanDetails = async (clanName) => {
    return await callApi('get_clan_details', clanName);
};

window.getBloodStats = async () => {
    return await callApi('get_blood_stats');
};

window.updateDisplay = async () => {
    return await callApi('update_display');
};
