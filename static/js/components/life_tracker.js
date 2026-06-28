document.addEventListener('alpine:init', () => {
    Alpine.data('lifeTracker', (id, label, statKeys) => ({
        id,
        label,
        statKeys,
        total: 10,
        maxValue: 0,
        hardDamage: 0,
        lightDamage: 0,
        _hasStats: false,

        async init() {
            window.lifeTrackers = window.lifeTrackers || {};
            window.lifeTrackers[this.id] = this;

            if (window.lifeStatsData) {
                this.setStats(window.lifeStatsData);
                return;
            }

            const data = await window.getLifeStats();
            this.setStats(data);
        },

        setStats(data) {
            this.maxValue = data?.[this.statKeys.max] || 0;
            this.hardDamage = data?.[this.statKeys.hard] || 0;
            this.lightDamage = data?.[this.statKeys.light] || 0;
            this._hasStats = true;
        },

        boxClass(index) {
            if (!this._hasStats) {
                return 'not-clickable';
            }

            if (index < this.hardDamage) {
                return 'hard';
            }

            if (index < this.hardDamage + this.lightDamage) {
                return 'light';
            }

            if (index < this.maxValue) {
                return 'not-clickable';
            }

            return 'filled not-clickable';
        },

        async heal(index) {
            if (index < this.hardDamage) {
                await this.healDamage(true);
                return;
            }

            if (index < this.hardDamage + this.lightDamage) {
                await this.healDamage(false);
            }
        },

        async healDamage(isHeavy) {
            if (this.id === 'health') {
                await window.applyHealthDamage(-1, isHeavy, false);
            }

            if (this.id === 'willpower') {
                await window.applyWillpowerDamage(-1, isHeavy, false);
            }
        },

        render() {
            return `
                <h3>${this.label}</h3>
                <div class="boxes" id="${this.id}-boxes">
                    <template x-for="index in total" :key="index">
                        <span class="box" :class="boxClass(index - 1)" @click="heal(index - 1)"></span>
                    </template>
                </div>
            `;
        },
    }));
});
