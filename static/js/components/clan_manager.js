document.addEventListener('alpine:init', () => {
    Alpine.data('clanManager', () => ({
        clans: [],
        clanName: '',
        bane: '',
        _loading: true,

        async init() {
            window.clanManager = this;

            const [clans, currentClan] = await Promise.all([
                window.getClansList(),
                window.getCharacterClan(),
            ]);

            this.clans = clans ?? [];
            this.clanName = currentClan ?? '';
            this._loading = false;
            await this.refreshClanBane();
        },

        async saveClan() {
            await window.setCharacterClan(this.clanName);
            await window.updateDisplay();
            await this.refreshClanBane();
        },

        async selectClan(clanName) {
            if (this.clanName === clanName) {
                return;
            }

            this.clanName = clanName;
            await this.saveClan();
        },

        openClanInfo(clanName) {
            if (!clanName) {
                return;
            }

            window.modalManager.open('clanDetailsModal', {wide: true, clanName});
        },

        async refreshClanBane() {
            if (!this.clanName) {
                this.bane = '';
                return;
            }

            const [baneTemplate, bloodStats] = await Promise.all([
                window.getClanBane(this.clanName),
                window.getBloodStats(),
            ]);

            this.bane = (baneTemplate ?? '').replaceAll('{bane_severity}', bloodStats?.bane_severity ?? '');
        },

        setClan(value) {
            const nextClanName = value ?? '';
            if (this.clanName === nextClanName) {
                return;
            }

            this.clanName = nextClanName;
            this.refreshClanBane();
        },

        render(part) {
            if (part === 'selector') {
                return `
                    <div x-data="iconInfoSelector({
                        label: 'Клан',
                        placeholder: 'Выберите клан',
                        items: () => clans,
                        value: () => clanName,
                        disabled: () => _loading,
                        onSelect: selectClan.bind($data),
                        onInfo: openClanInfo.bind($data),
                    })" x-html="render()"></div>
                `;
            }

            if (part === 'bane') {
                return `
                    <h3>Клановый изъян</h3>
                    <p class="autofilled_text" id="clan_bane">${this.bane}</p>
                `;
            }

            return '';
        },
    }));
});
