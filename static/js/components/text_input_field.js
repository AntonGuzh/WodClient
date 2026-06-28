document.addEventListener('alpine:init', () => {
    Alpine.data('textInputField', (id) => ({
        id,
        value: '',
        _lastSavedValue: '',

        init() {
            window.textInputFields = window.textInputFields || {};
            window.textInputFields[this.id] = this;

            if (window.textInputFieldValues?.[this.id] !== undefined) {
                this.setValue(window.textInputFieldValues[this.id]);
            }
        },

        setValue(value) {
            this.value = value ?? '';
            this._lastSavedValue = this.value;
        },

        async save() {
            if (this.value === this._lastSavedValue) {
                return;
            }

            await window.updateTextField(this.id, this.value);
            this._lastSavedValue = this.value;
            console.log(`Автосохранение: ${this.id}`);
        },

        blurOnEnter(event) {
            if (event.key === 'Enter') {
                event.target.blur();
            }
        },
    }));
});
