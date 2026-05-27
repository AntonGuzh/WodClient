document.addEventListener('alpine:init', () => {
    Alpine.data('advantagesList', () => ({
        advantageList: null,
        _baseName: 'Новое преимущество',
        keyCounter: 0,
        _loading: true,

        async init() {
            let data = await window.getAdvantagesData();

            console.log(data);

            this.advantageList = data.map(item => ({
                name: item.name,
                value: item.value,
                _key: this.keyCounter++,
                _previousName: item.name
            }));
            this._loading = false;
        },

        savePreviousName(item) {
            item._previousName = item.name;
        },

        async addItem() {
            if (!this.advantageList) {
                console.log('[addItem] Need to init firstly');
                return;
            }

            let newName = `${this._baseName} ${Date.now()}`;

            let isAdded = await window.addAdvantage(newName)
            if (!isAdded) {
                console.log('Can\'t add new advantage');
                return;
            }
            
            this.advantageList.push({
                name: newName,
                value: 0,
                _key: this.keyCounter++,
                _previousName: newName,
            });
        },

        async renameItem(item) {
            if (!this.advantageList) {
                console.log('[renameItem] Need to init firstly');
                return;
            }

            const oldName = item._previousName;
            const newName = item.name.trim();
            if (oldName === newName) {
                return;
            }

            let isRenamed = await window.renameAdvantage(oldName, newName);
            if (!isRenamed) {
                console.log('Can\'t rename advantage');
                return;
            }

            item._previousName = newName;
        },

        async removeItem(item) {
            if (!this.advantageList) {
                console.log('[removeItem] Need to init firstly');
                return;
            }

            let isRemoved = await window.removeAdvantage(item.name)
            if (!isRemoved) {
                console.log('Can\'t remove advantage');
                return;
            }

            const index = this.advantageList.findIndex(i => i._key === item._key);
            if (index > -1) {
                this.advantageList.splice(index, 1);
            }
        },

        async getAdvantageValue(name) {
            if (!this.advantageList) {
                console.log('[getAdvantageValue] Need to init firstly');
                return;
            }

            const index = this.advantageList.findIndex(i => i.name === name);
            return this.advantageList[index].value;
        },

        async setAdvantageValue(name, value) {
            await updateAdvantage(name, value);
        },

        render() {
            if (this._loading) {
                return `
                    <h3>Преимущества и недостатки</h3>
                    <p>Загрузка...</p>
                `;
            }
            return `
                <h3>Преимущества и недостатки</h3>
                <div class="advantages-list" id="advantages_container">
                    <template x-for="item in advantageList" :key="item._key">
                        <div class="advantage-item">
                            <input type="text" x-model="item.name" @focus="savePreviousName(item)" @blur="renameItem(item)" placeholder="Название">
                            <div x-data="mutableTracker(item.name, 5, 'dots', 'dot', (name) => getAdvantageValue(name), (name, val) => setAdvantageValue(name, val))" x-html="render()"></div>
                            <span class="power-remove" @click="removeItem(item)">❌</span>
                        </div>
                    </template>
                </div>
                <button class="add-advantage-btn" @click="addItem()">+ Добавить преимущество/недостаток</button>
            `
        }
    }));
});
