export const FETCHING = {
    loader: null,
    busy: false,
    loop: false,
    container_height: 0,
    svg: 'balls.svg',
    element: 'div',
    assets_url: '/static/assets/',
    loader_url: null,
    classes: {
        container: 'fetching-balls',
        mask: 'fetching-balls-mask',
        loader: 'is-fetching',
        insert_in: 'fetching',
        align: 'initial',
    },
    initialize(props){
        if (typeof props === "object"){
            if (props.assets_url){ this.assets_url = props.assets_url; }
        }
        this.loader_url = this.assets_url + 'svg/' + this.svg;
    },
    start(insert_in){
        if (!FETCHING.busy && insert_in){
            FETCHING.busy = true;
            insert_in.classList.add(this.classes.insert_in);
            let fpk = 'fetch-' + insert_in.dataset.fetch;
            FETCHING.container_height = insert_in.getBoundingClientRect().height + "px";
            insert_in.append(FETCHING._build(fpk));
            if (this.loop){
                insert_in.classList.remove(this.classes.insert_in);
                FETCHING.busy = false;
            }
        }
    },
    done(insert_in){
        if (insert_in){
            let loader = document.getElementById('fetch-' + insert_in.dataset.fetch);
            if (!loader){
                if (insert_in.lastElementChild && insert_in.lastElementChild.classList.contains('is-fetching')){ loader = insert_in.lastElementChild; }
            }
            if (loader){ loader.remove(); }
            insert_in.classList.remove(this.classes.insert_in);
            FETCHING.busy = false;
        }
    },
    setTimeout(insert_in, timeout){
        this.start(insert_in);
        setTimeout(()=>FETCHING.done(insert_in), timeout);
    },
    _build(fpk){
        let loader = document.createElement(this.element);
        loader.id = fpk;
        loader.className = this.classes.loader;
        loader.innerHTML = `
            <div class="${this.classes.container} ${this.classes.align}" style="height: ${this.container_height}">
                <span class="preloader" style="background-image: url(${this.loader_url});"></span>
            </div>
            <div class="${this.classes.mask}"></div>`;
        return loader;
    }
}
