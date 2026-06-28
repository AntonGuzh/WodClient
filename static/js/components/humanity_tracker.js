document.addEventListener('alpine:init', () => {
    Alpine.data('humanityTracker', () => ({
        total: 10,
        humanity: 0,
        stains: 0,
        _hasStats: false,

        async init() {
            window.humanityTracker = this;

            if (window.lifeStatsData) {
                this.setStats(window.lifeStatsData);
                return;
            }

            const data = await window.getLifeStats();
            this.setStats(data);
        },

        setStats(data) {
            this.humanity = data?.humanity ?? data?.max_humanity ?? 0;
            this.stains = data?.stains_humanity ?? 0;
            this._hasStats = true;
        },

        boxClass(index) {
            if (!this._hasStats) {
                return 'not-clickable';
            }

            if (index < this.humanity) {
                return 'filled not-clickable';
            }

            if (index < this.humanity + this.stains) {
                return 'hard';
            }

            return '';
        },

        async toggleStain(index) {
            if (!this._hasStats || index < this.humanity) {
                return;
            }

            if (index < this.humanity + this.stains) {
                await window.applyHumanityDamage(-1);
                return;
            }

            await window.applyHumanityDamage(1);
        },

        render() {
            return `
                <h3>Человечность</h3>
                <div class="boxes" id="humanity-boxes">
                    <template x-for="index in total" :key="index">
                        <span class="box" :class="boxClass(index - 1)" @click="toggleStain(index - 1)"></span>
                    </template>
                </div>
            `;
        },
    }));
});
