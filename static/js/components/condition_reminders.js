document.addEventListener('alpine:init', () => {
    Alpine.data('conditionReminders', (mode = 'overlay') => ({
        mode,
        stats: null,

        async init() {
            window.conditionReminderComponents = window.conditionReminderComponents || [];
            window.conditionReminderComponents.push(this);

            if (window.lifeStatsData) {
                this.setStats(window.lifeStatsData);
                return;
            }

            const data = await window.getLifeStats();
            this.setStats(data);
        },

        setStats(data) {
            this.stats = data || {};
        },

        destroy() {
            if (!window.conditionReminderComponents) {
                return;
            }

            window.conditionReminderComponents = window.conditionReminderComponents.filter(component => component !== this);
        },

        activeConditions() {
            const stats = this.stats || {};
            return [
                {
                    title: 'Физическое изнурение',
                    penalty: '-2d10 ко всем физическим проверкам',
                    active: Boolean(stats.health_exhausted),
                },
                {
                    title: 'Ментальное изнурение',
                    penalty: '-2d10 ко всем социальным и ментальным проверкам',
                    active: Boolean(stats.willpower_exhausted),
                },
                {
                    title: 'Муки совести',
                    penalty: '-2d10 ко всем проверкам',
                    active: Boolean(stats.humanity_exhausted),
                },
            ].filter(condition => condition.active);
        },

        renderOverlay() {
            const conditions = this.activeConditions();
            if (!conditions.length) {
                return '';
            }

            return `
                <div class="condition-floating-list">
                    ${conditions.map(condition => `
                        <div class="condition-floating-card">
                            <strong>${condition.title}</strong>
                            <span>${condition.penalty}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        renderDiceReminder() {
            const conditions = this.activeConditions();
            if (!conditions.length) {
                return '';
            }

            return `
                <div class="dice-conditions-reminder">
                    <div class="dice-conditions-title">Активные штрафы</div>
                    <ul>
                        ${conditions.map(condition => `
                            <li><strong>${condition.title}:</strong> ${condition.penalty}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        },

        render() {
            return this.mode === 'dice' ? this.renderDiceReminder() : this.renderOverlay();
        },
    }));
});
