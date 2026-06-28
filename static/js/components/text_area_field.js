document.addEventListener('alpine:init', () => {
    Alpine.data('textAreaField', (id) => ({
        id,
        value: '',
        _lastSavedValue: '',

        init() {
            window.textAreaFields = window.textAreaFields || {};
            window.textAreaFields[this.id] = this;

            if (window.textAreaFieldValues?.[this.id] !== undefined) {
                this.setValue(window.textAreaFieldValues[this.id]);
            }

            this.$watch('value', () => {
                this.$nextTick(() => this.resize());
            });
        },

        setValue(value) {
            this.value = value ?? '';
            this._lastSavedValue = this.value;
            this.$nextTick(() => this.resize());
        },

        async save() {
            if (this.value === this._lastSavedValue) {
                return;
            }

            await window.updateTextField(this.id, this.value);
            this._lastSavedValue = this.value;
            console.log(`Автосохранение: ${this.id}`);
        },

        resize() {
            this.$el.style.height = 'auto';
            this.$el.style.height = `${this.$el.scrollHeight}px`;
        },
    }));
});
