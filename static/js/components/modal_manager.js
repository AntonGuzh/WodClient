document.addEventListener('alpine:init', () => {
    Alpine.data('modalManager', () => ({
        // Стек идентификаторов открытых модальных окон (последний – текущее)
        stack: [],
        
        init() {
            window.modalManager = this;
        },
        
        // Открыть модальное окно по id. Можно передать params, которые будут доступны через событие
        async open(id, params = {}) {
            console.log('look 1', id);
            if (this.stack.includes(id)) return; // уже открыто
            console.log('look 2', id);
            
            this.stack.push({id, params});
            console.log('look 2', this.stack);
            this._updateDisplay();
        },

        get currentModal() { return this.stack[this.stack.length - 1]; },
        
        // Закрыть все окна
        close() {
            if (this.stack.length === 0) return;
            this.stack.length = 0;
            this._updateDisplay();
        },
        
        // Вернуться назад (закрыть текущее, показать предыдущее)
        back() {
            if (this.stack.length < 2) return;

            // закроет текущее, предыдущее станет видимым
            this.stack.pop();
            this._updateDisplay();
        },
        
        // Проверка, нужно ли показывать кнопку "назад"
        hasBack() {
            return this.stack.length > 1;
        },
        
        // Приватный метод обновления видимости окон
        _updateDisplay() {
            // Показать или скрыть модальное 
            if (this.stack.length > 0) {
                document.getElementById('globalModal').style.display = 'block';
            } else {
                document.getElementById('globalModal').style.display = 'none';
            }
        }
    }));
});
