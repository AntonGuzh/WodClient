document.addEventListener('alpine:init', () => {
    Alpine.data('disciplinesList', () => ({
        disciplinesList: null,
        _loading: true,

        async init() {
            let data = await window.getCharacterDisciplines();

            this.disciplinesList = data;
            this._loading = false;
            window.disciplinesList = this;
        },

        async addDiscipline(discName) {
            if (!this.disciplinesList) {
                console.log('[addDiscipline] Need to init firstly');
                return;
            }

            let isAdded = await window.addDiscipline(discName);
            if (!isAdded) {
                console.log('Can\'t add discipline');
                return;
            }

            let discInfo = await window.getDiscipline(discName);

            this.disciplinesList.push({
                name: discName,
                info: discInfo,
                level: 0,
                powers: []
            });
        },

        async removeDiscipline(discName) {
            if (!this.disciplinesList) {
                console.log('[removeDiscipline] Need to init firstly');
                return;
            }

            let isRemoved = await window.removeDiscipline(discName)
            if (!isRemoved) {
                console.log('Can\'t remove discipline');
                return;
            }

            const index = this.disciplinesList.findIndex(i => i.name === discName);
            if (index > -1) {
                this.disciplinesList.splice(index, 1);
            }
        },

        async addPower(discName, powerName) {
            if (!this.disciplinesList) {
                console.log('[addPower] Need to init firstly');
                return;
            }

            let isAdded = await window.addPower(discName, powerName);
            if (!isAdded) {
                console.log('Can\'t add power');
                return;
            }

            const discIndex = this.disciplinesList.findIndex(i => i.name === discName);
            if (discIndex > -1) {
                this.disciplinesList[discIndex].powers.push(powerName);
                this.disciplinesList[discIndex].level += 1;
            }
        },

        async removePower(discName, powerName) {
            if (!this.disciplinesList) {
                console.log('[removePower] Need to init firstly');
                return;
            }

            let isRemoved = await window.removePower(discName, powerName)
            if (!isRemoved) {
                console.log('Can\'t remove power');
                return;
            }

            const discIndex = this.disciplinesList.findIndex(i => i.name === discName);
            if (discIndex > -1) {
                const powerIndex = this.disciplinesList[discIndex].powers.findIndex(i => i === powerName);
                if (powerIndex > -1) {
                    this.disciplinesList[discIndex].powers.splice(powerIndex, 1);
                    this.disciplinesList[discIndex].level -= 1;
                }
            }
        },

        render() {
            if (this._loading) {
                return `
                    <h2>ДИСЦИПЛИНЫ</h2>
                    <p>Загрузка...</p>
                `;
            }

            return `
                <h2>ДИСЦИПЛИНЫ</h2>
                <div class="disciplines-container" id="disciplines_container">
                    <div class="add-discipline-btn" @click="window.modalManager.open('addDisciplineModal', {wide: true})">
                        <span>+ Добавить дисциплину</span>
                    </div>
                    <template x-for="discData in disciplinesList" :key="discData.name">
                        <div class="discipline-card">
                            <div class="discipline-header">
                                <div class="discipline-info" @click="window.modalManager.open('disciplineDetailsModal', {wide: true, disciplineName: discData.name})">
                                    <img :src="discData.info.icon" class="discipline-icon">
                                    <span class="discipline-title" x-text="discData.name"></span>
                                    <div class="discipline-level">
                                        <template x-for="i in 5" :key="i">
                                            <span class="dot not-clickable" :class="{ filled: i <= discData.level }"></span>
                                        </template>
                                    </div>
                                </div>
                                <div class="discipline-actions">
                                    <button @click="window.modalManager.open('addPowerModal', {wide: true, disciplineName: discData.name, currentLevel: discData.level})">➕</button>
                                    <button @click="removeDiscipline(discData.name)">❌</button>
                                </div>
                            </div>
                            <div class="discipline-powers">
                                <template x-for="powerName in discData.powers" :key="powerName">
                                    <div class="power-item" @click="window.modalManager.open('powerDetailsModal', {wide: true, powerName: powerName})">
                                        <span class="power-name" x-text="powerName"></span>
                                        <span class="power-remove" @click.stop="removePower(discData.name, powerName)">❌</span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            `;
        }
    }));
});
