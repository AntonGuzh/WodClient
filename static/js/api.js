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
