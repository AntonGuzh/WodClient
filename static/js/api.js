window.addEventListener('pywebviewready', () => {
    window.getBasicTrackerValue = (() => {
        let cachedTrackers = null;
        return async (id) => {
            if (cachedTrackers) return cachedTrackers.get(id);
            let rawData = await pywebview.api.get_basic_trackers()
            cachedTrackers = new Map(Object.entries(rawData));
            return cachedTrackers.get(id);
        };
    })();

    window.setBasicTrackerValue = (id, value) => {
        pywebview.api.update_basic_tracker(id, value);
    };

    window.getAdvantageValue = (() => {
        let cachedAdvantages = null;
        return async (id) => {
            if (cachedAdvantages) return cachedAdvantages.get(id);
            let rawData = await pywebview.api.get_advantages()
            cachedAdvantages = new Map(Object.entries(rawData));
            return cachedAdvantages.get(id);
        };
    })();

    window.setAdvantageValue = (id, value) => {
        pywebview.api.update_advantage(id, value);
    };

    window.dispatchEvent(new Event('apiReady'));
});
