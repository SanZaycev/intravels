export const ALERT = {
    time: 5000,
    container: null,
    position: {
        top: 0,
        right: 0,
    },
    init: function(data){
        if(!this.container){ this._createContainer(); }
        setTimeout(function(){ ALERT._getAlert(data.condition, data.message); }, 50);
    },
    _createContainer: function(){
        this.container = document.createElement('div');
        this.container.style.top = this.position.top;
        this.container.style.right = this.position.right;
        this.container.className = 'alert-container';
        document.body.appendChild(this.container);
    },
    _removeContainer: function(){
        if(this.container && !this.container.children.length){ this.container.remove(); this.container = null; }
    },
    _getAlert: function(type, message){
        let msg = document.createElement('div');
        msg.className = 'alert-box alert-notification';
        msg.innerHTML = '<div class="alert-' + type + '">' + message + '</div><button class="alert-remove" type="button"><span class="icon icon-times"></span></button>';
        if (this.container){
            this.container.prepend(msg);
            let removeBtn = msg.lastElementChild;

            removeBtn.addEventListener('click', function(){
                this.parentNode.remove();
                ALERT._removeContainer();
            });
            setTimeout(function(){
                msg.remove();
                ALERT._removeContainer();
            }, ALERT.time);
        }
    }
}
