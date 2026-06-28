document.addEventListener('alpine:init', () => {
    Alpine.data('skillSpecializations', (skillId) => ({
        skillId,
        specializations: [],
        _loading: true,

        async init() {
            const data = await window.getSkillSpecializations(this.skillId);
            this.specializations = data.map(item => ({
                id: item.id,
                name: item.name ?? '',
                _lastSavedName: item.name ?? '',
            }));
            this._loading = false;
        },

        async addItem() {
            const item = await window.addSkillSpecialization(this.skillId);
            if (!item?.id) {
                console.log(`Can't add specialization for ${this.skillId}`);
                return;
            }

            this.specializations.push({
                id: item.id,
                name: item.name ?? '',
                _lastSavedName: item.name ?? '',
            });
        },

        async saveItem(item) {
            if (item.name === item._lastSavedName) {
                return;
            }

            const isUpdated = await window.updateSkillSpecialization(
                this.skillId,
                item.id,
                item.name
            );

            if (!isUpdated) {
                console.log(`Can't update specialization ${item.id}`);
                item.name = item._lastSavedName;
                return;
            }

            item._lastSavedName = item.name;
        },

        async removeItem(item) {
            const isRemoved = await window.removeSkillSpecialization(this.skillId, item.id);
            if (!isRemoved) {
                console.log(`Can't remove specialization ${item.id}`);
                return;
            }

            const index = this.specializations.findIndex(currentItem => currentItem.id === item.id);
            if (index > -1) {
                this.specializations.splice(index, 1);
            }
        },

        blurOnEnter(event) {
            if (event.key === 'Enter') {
                event.target.blur();
            }
        },

        render() {
            if (this._loading) {
                return '';
            }

            return `
                <div class="skill-specializations-list">
                    <template x-for="item in specializations" :key="item.id">
                        <div class="skill-specialization">
                            <button type="button" class="skill-specialization-remove" @click="removeItem(item)" title="Удалить специализацию">&times;</button>
                            <input
                                type="text"
                                x-model="item.name"
                                @blur="saveItem(item)"
                                @keydown="blurOnEnter($event)"
                                placeholder="Специализация"
                            >
                        </div>
                    </template>
                    <div class="skill-specialization">
                        <button type="button" class="skill-specialization-add" @click="addItem()" title="Добавить специализацию">+</button>
                    </div>
                </div>
            `;
        }
    }));
});
