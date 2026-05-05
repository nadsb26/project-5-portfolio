// creates a draggable mac-style popup window
// each window has the following attributes: id, title, x, y, width, bodyContent, titleBarColor
function createWindow(opts) {

    // toggle: if already open, close it
    const existing = document.getElementById(opts.id);
    if (existing) { 
        existing.remove(); 
        return; 
    }

    // build window structure
    const win = document.createElement('div');
    win.className = 'popup-window';
    win.id = opts.id;
    win.style.cssText = `left:${opts.x}px; top:${opts.y}px; width:${opts.width}px;`;

    const bar = document.createElement('div');
    bar.className = 'popup-titlebar';
    if (opts.titleBarColor) bar.style.background = opts.titleBarColor;
    bar.innerHTML = `
        <div class="popup-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
        </div>
        <span class="popup-title">${opts.title}</span>`;

    const body = document.createElement('div');
    body.className = 'popup-body';
    body.appendChild(opts.bodyContent);

    win.appendChild(bar);
    win.appendChild(body);
    document.getElementById('desktop').appendChild(win);

    // close when red dot is pressed
    bar.querySelector('.dot-red').addEventListener('click', () => win.remove());

    // whole window is draggable
    makeDraggable(win);
}

// drag handler
function makeDraggable(el) {
    let startX, startY, origLeft, origTop;

    el.addEventListener('mousedown', e => {
        // don't interfere with buttons, links, or the close dot
        if (e.target.closest('button, a, input, .dot')) 
            return;

        startX   = e.clientX;
        startY   = e.clientY;
        origLeft = parseInt(el.style.left);
        origTop  = parseInt(el.style.top);

        const onMove = e => {
            el.style.left = (origLeft + e.clientX - startX) + 'px';
            el.style.top  = (origTop  + e.clientY - startY) + 'px';
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMove), { once: true });
    });
}

// clones a <template> by id and returns the content node
function fromTemplate(id) {
    return document.getElementById(id).content.cloneNode(true);
}

// ------------------------------------
// about me windows
document.getElementById('center-folder').addEventListener('click', () => {
    createWindow({ id: 'win-photo',   title: 'photo.jpg',   x: 70,  y: 70,  width: 300, bodyContent: fromTemplate('tpl-photo') });
    createWindow({ id: 'win-code',    title: 'nada.cpp',    x: 400, y: 55,  width: 370, titleBarColor: '#1e1e2e', bodyContent: fromTemplate('tpl-code') });

    createWindow({ id: 'win-hobbies', title: 'hobbies.txt', x: 190, y: 350, width: 260, titleBarColor: '#5a7a5a', bodyContent: fromTemplate('tpl-hobbies') });
});

// ------------------------------------
// app icons popups
const appInfo = {
    'app-ps': { title: 'Adobe Photoshop',   color: '#001d26', icon: '🖼',  text: 'Used for photo editing and retouching in Project 2!'},
    'app-ai': { title: 'Adobe Illustrator', color: '#1a0a00', icon: '✏️', text: 'Used vector illustration and pen tool in Project 2!'},
    'app-pr': { title: 'Premiere Pro',      color: '#0a001a', icon: '🎬', text: 'Used for video editing and audio syncing in Project 4!' },
    'app-au': { title: 'Audacity',          color: '#00001a', icon: '🎙', text: 'Used audio editing for audio recordings in Project 3!' },
    'app-vs': { title: 'VS Code',           color: '#001226', icon: '💻', text: 'The main editor that I used for all projects. Used extensions, Git, and the integrated terminal throughout the semester.' }
};

let appCascade = 0;

Object.entries(appInfo).forEach(([id, info]) => {
    document.getElementById(id)?.addEventListener('click', () => {
        const offset = appCascade * 28;
        appCascade++;

        const body = document.createElement('div');
        body.innerHTML = `<div class="app-icon-large">${info.icon}</div><p class="app-text">${info.text}</p>`;

        createWindow({
            id: 'win-' + id,
            title: info.title,
            x: 280 + offset, y: 180 + offset,
            width: 280,
            titleBarColor: info.color,
            bodyContent: body
        });

        // decrement cascade when this window is closed
        document.getElementById('win-' + id)
            ?.querySelector('.dot-red')
            .addEventListener('click', () => appCascade = Math.max(0, appCascade - 1));
    });
});

// ------------------------------------
const projectInfo = {
    'f-blue':   { title: 'Project 01', color: '#c45c4a', url: 'https://nadsb26.github.io/project1-Nada-Beltagui/', img: 'assets/project1.png', desc: 'The website presents the 90-second film The Inconvenient Trip to the Convenience Store in an interactive way. Its design is based on a cash register theme to match the convenience store concept, with pages for the video, characters, and filming locations.' },
    'f-pink':   { title: 'Project 02', color: '#b04a70', url: 'https://rbashokov.github.io/project2-the-switch/', img: 'assets/project2.jpg', desc: 'The website presents an interactive comic called The Switch, about two NYUAD students from different majors who magically swap bodies after an argument. Through animated panels, speech bubbles, buttons, quizzes, and scroll effects, users follow the characters through their challenges.' },
    'f-yellow': { title: 'Project 03', color: '#a07020', url: 'https://nadsb26.github.io/commslab-project3/', img: 'assets/project3.jpg', desc: 'The website is an interactive story set in a coffee shop from the perspective of a barista. Users click on different characters to hear dialogue and move the story forward, eventually uncovering a proposal storyline.' },
    'f-purple': { title: 'Project 04', color: '#7f65a6', url: 'https://nadsb26.github.io/commslab-project4/', img: 'assets/project4.png', desc: 'The website is a gamified exam-preparation experience where users make choices throughout the week before an exam. Each choice plays a first-person video, and at the end the website calculates a grade based on the user’s decisions, with some unexpected outcomes. ' }
};

let projCascade = 0;

Object.entries(projectInfo).forEach(([id, info]) => {
    document.getElementById(id)?.addEventListener('click', () => {
        const offset = projCascade * 28;
        projCascade++;

        // Description window body
        const body = document.createElement('div');
        body.innerHTML = `<p class="proj-desc">${info.desc}</p><button class="popup-btn" id="btn-preview-${id}">Preview →</button>`;

        createWindow({
            id: 'win-' + id,
            title: info.title,
            x: 230 + offset, y: 130 + offset,
            width: 320,
            titleBarColor: info.color,
            bodyContent: body
        });

        document.getElementById('win-' + id)
            ?.querySelector('.dot-red')
            .addEventListener('click', () => projCascade = Math.max(0, projCascade - 1));

        // preview button opens a second window with screenshot or link placeholder
        document.getElementById('btn-preview-' + id)?.addEventListener('click', () => {
            const previewBody = document.createElement('div');
            previewBody.className = 'preview-wrap';
            previewBody.innerHTML = info.img
                ? `<img src="${info.img}" alt="${info.title}" class="preview-img" onclick="window.open('${info.url}','_blank')">`
                : `<div class="preview-link" onclick="window.open('${info.url}','_blank')"><span>🔗</span><span>open ${info.title}</span></div>`;
            previewBody.innerHTML += `<p class="preview-hint">(press on image to open)</p>`;

            createWindow({
                id: 'win-' + id + '-preview',
                title: 'preview',
                x: 370, y: 170, width: 360,
                bodyContent: previewBody
            });
        });
    });
});