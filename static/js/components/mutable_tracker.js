document.addEventListener('alpine:init', () => {
    Alpine.data('mutable_tracker', (
        id,
        total,
        containerType,
        itemType,
        getterName,
        setterName
    ) => ({
        id, containerType, itemType, total,
        value: 0,
        async init() {
            this.$watch('value', () => {});

            const getter = window[getterName];
            if (getter) {
                if (typeof getter === 'function') {
                    this.value = await getter(this.id) || 0;
                }
            }

            window.addEventListener('apiReady', async () => {
                const getter = window[getterName];
                if (typeof getter === 'function') {
                    this.value = await getter(this.id) || 0;
                }
            });
        },
        setValue(index) {
            this.value = (index + 1 === this.value) ? 0 : index + 1;
            
            const setter = window[setterName];
            if (typeof setter === 'function') {
                setter(this.id, this.value);
            }
        },
        render() {
            let html = `<div class="${this.containerType}">`;
            for (let i = 0; i < this.total; i++) {
                const filled = i < this.value ? 'filled' : '';
                html += `<span class="${this.itemType} ${filled}" @click="setValue(${i})"></span>`;
            }
            html += `</div>`;
            return html;
        }
    }));
});
