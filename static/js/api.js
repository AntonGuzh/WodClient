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
    cachedTrackers = null;
};

window.getAdvantageValue = async (id) => {
    const rawData = await callApi('get_advantages');
    advantages = new Map(Object.entries(rawData));
    return advantages.get(id);
};

window.setAdvantageValue = async (id, value) => {
    await callApi('update_advantage', id, value);
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
    console.log('get_discipline_powers');
    return await callApi('get_discipline_powers', disciplineName, currentLevel + 1)
};
