document.addEventListener('alpine:init', () => {
    Alpine.data('mutable_tracker', (
        id,
        total,
        containerType,
        itemType,
        getter,
        setter
    ) => ({
        id, containerType, itemType, total,
        value: 0,
        async init() {
            this.$watch('value', () => {});

            this.value = await getter(this.id) || 0;
        },
        async setValue(index) {
            this.value = (index + 1 === this.value) ? 0 : index + 1;
            
            await setter(this.id, this.value);
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
