document.addEventListener('alpine:init', () => {
    Alpine.data('iconInfoSelector', (config) => ({
        label: config.label ?? '',
        placeholder: config.placeholder ?? 'Выберите значение',
        itemsSource: config.items ?? [],
        valueSource: config.value ?? '',
        disabledSource: config.disabled ?? false,
        localValue: typeof config.value === 'function' ? '' : config.value ?? '',
        valueField: config.valueField ?? 'name',
        labelField: config.labelField ?? 'name',
        iconField: config.iconField ?? 'icon',
        onSelect: config.onSelect,
        onInfo: config.onInfo,
        open: false,

        get items() {
            return typeof this.itemsSource === 'function' ? this.itemsSource() : this.itemsSource;
        },

        get value() {
            return typeof this.valueSource === 'function' ? this.valueSource() : this.localValue;
        },

        set value(value) {
            this.localValue = value;
        },

        get disabled() {
            return typeof this.disabledSource === 'function' ? this.disabledSource() : this.disabledSource;
        },

        get selectedItem() {
            return (this.items ?? []).find(item => this.getValue(item) === this.value) ?? null;
        },

        getValue(item) {
            return item?.[this.valueField] ?? '';
        },

        getLabel(item) {
            return item?.[this.labelField] ?? '';
        },

        getIcon(item) {
            return item?.[this.iconField] ?? '';
        },

        async select(value) {
            if (value === this.value) {
                this.open = false;
                return;
            }

            this.value = value;
            this.open = false;

            if (this.onSelect) {
                await this.onSelect(value);
            }
        },

        showInfo(value) {
            this.open = false;

            if (this.onInfo) {
                this.onInfo(value);
            }
        },

        handleIconError(event) {
            event.target.style.display = 'none';
            if (event.target.nextElementSibling) {
                event.target.nextElementSibling.style.display = 'inline-flex';
            }
        },

        escapeHtml(value) {
            const div = document.createElement('div');
            div.textContent = value ?? '';
            return div.innerHTML;
        },

        escapeAttribute(value) {
            return this.escapeHtml(value).replaceAll('"', '&quot;');
        },

        renderIcon(item) {
            const label = this.getLabel(item) || '?';
            const fallback = this.escapeHtml(label.charAt(0));
            const icon = this.getIcon(item);

            if (!icon) {
                return `<span class="icon-info-selector-fallback">${fallback}</span>`;
            }

            return `
                <img src="${this.escapeAttribute(icon)}" class="icon-info-selector-icon" @error="handleIconError($event)">
                <span class="icon-info-selector-fallback" style="display: none;">${fallback}</span>
            `;
        },

        renderOption(item) {
            const label = this.escapeHtml(this.getLabel(item));
            const value = this.escapeAttribute(this.getValue(item));
            const selected = this.getValue(item) === this.value ? ' selected' : '';

            return `
                <div class="icon-info-selector-option${selected}">
                    <button type="button" class="icon-info-selector-option-main" @click="select($event.currentTarget.dataset.value)" data-value="${value}">
                        ${this.renderIcon(item)}
                        <span>${label}</span>
                    </button>
                    <button type="button" class="icon-info-selector-info" title="Информация" @click.stop="showInfo($event.currentTarget.dataset.value)" data-value="${value}">&#9432;</button>
                </div>
            `;
        },

        render() {
            const selectedItem = this.selectedItem;
            const selectedLabel = selectedItem ? this.escapeHtml(this.getLabel(selectedItem)) : this.escapeHtml(this.placeholder);
            const selectedValue = selectedItem ? this.escapeAttribute(this.getValue(selectedItem)) : '';
            const selectedIcon = selectedItem ? this.renderIcon(selectedItem) : '<span class="icon-info-selector-fallback">?</span>';
            const options = (this.items ?? []).map(item => this.renderOption(item)).join('');
            const infoButton = selectedItem ? `
                <button type="button" class="icon-info-selector-info" title="Информация" @click.stop="showInfo($event.currentTarget.dataset.value)" data-value="${selectedValue}">&#9432;</button>
            ` : '';

            return `
                <div class="icon-info-selector" @click.outside="open = false">
                    <label>${this.escapeHtml(this.label)}</label>
                    <div class="icon-info-selector-control">
                        <button type="button" class="icon-info-selector-trigger" @click="open = !open" ${this.disabled ? 'disabled' : ''}>
                            ${selectedIcon}
                            <span class="${selectedItem ? '' : 'icon-info-selector-placeholder'}">${selectedLabel}</span>
                        </button>
                        ${infoButton}
                    </div>
                    <div class="icon-info-selector-menu ${this.open ? 'open' : ''}">
                        ${options}
                    </div>
                </div>
            `;
        },
    }));
});
