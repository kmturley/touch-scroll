/* 
 * create timer animation
 */
let timerAnimation = document.createElement("div");
timerAnimation.id = "countdown";
let svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
let circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
circle.setAttributeNS(null, 'r', 18);
circle.setAttributeNS(null, 'cx', 20);
circle.setAttributeNS(null, 'cy', 20);
svg.appendChild(circle);
timerAnimation.appendChild(svg);

/* 
 * init imgages for drag and drop (dnd)
 */
let list = document.getElementById("carousel-draggable");
let imgs = list.getElementsByTagName("img");
let deg = -50;
for (const img of imgs) {
    // flag to identify dnd items in events
    img.selectable = true;

    img.draggable = false;
    img.onmousedown = onMouseDown;
    img.onmouseup = onMouseUp;
    img.onmousemove = onMouseMove;

    img.ondragstart = onDragStart;
    img.ondragend = onDragEnd;
    img.ondragover = onDragOver;
    img.ondrop = onDragDrop;

    // for demo individually recolor imgs  
    img.style.filter = `hue-rotate(${deg}deg)`;
    deg = deg + 50;
}

/* 
 * event handler for dnd 
 */
let currDrag = null;

function onMouseDown(e) {
    if (!this.selectable) return;

    if (!this.draggable) {
        // enable drag and drop when timeout reached and not canceled
        const delay = 1000;
        this.dragTimeOut = setTimeout(() => {
                this.draggable = true;
                this.classList.add("select")
            }, delay)
            // set off timer animation for ux
        setTimeout(() => this.parentElement.appendChild(timerAnimation), 25);
    } else if (!currDrag) {
        this.dragTimeOut = setTimeout(() => {
            this.draggable = false;
            this.classList.remove("select")
        }, 200);
    }
}

function onMouseUp(e) {
    if (!this.selectable) return;

    // cancel dnd on mouse release when timeout not reached
    if (!this.draggable || currDrag) {
        clearTimeout(this.dragTimeOut);
    }

    if (this.parentElement.contains(timerAnimation)) {
        this.parentElement.removeChild(timerAnimation);
    }
}

function onMouseMove(e) {
    if (!this.selectable) return;

    // cancel dnd on hold and move
    if (!this.draggable || currDrag) {
        clearTimeout(this.dragTimeOut);
    }

    if (this.parentElement.contains(timerAnimation)) {
        this.parentElement.removeChild(timerAnimation);
    }
}

function onDragStart(e) {
    if (!this.selectable) return;

    setTimeout(() => this.classList.add("invisible"), 0);
    currDrag = this;
}

function onDragEnd(e) {
    e.preventDefault();
    if (!this.selectable) return;

    currDrag = null;
    setTimeout(() => this.classList.remove("invisible"), 0);
}

function onDragDrop(e) {
    e.preventDefault();
    // swap images
    if (currDrag) {
        let prevParent = currDrag.parentElement;
        let newParent = this.parentElement;
        prevParent.insertBefore(this, prevParent.children[0]);
        newParent.insertBefore(currDrag, newParent.children[0]);

        currDrag.draggable = false;
        currDrag.classList.remove("select")
    }
}

function onDragOver(e) {
    if (!this.selectable) return;
    // without this drop event won't be emitted
    e.preventDefault()
}