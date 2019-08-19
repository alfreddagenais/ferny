const rgbToRgbaString = require(__dirname + '/../../rgbToRgbaString.js');

const TextNotification = require(__dirname + '/TextNotification.js');

class ZoomNotification extends TextNotification {
    constructor(id, autoClose, text) {
        super(id, autoClose, text);

        let img = document.createElement('img');
        img.classList.add('notif-icon', 'theme-icon');
        img.name = 'search-16';
        super.getNode().appendChild(img);

        super.getNode().getElementsByClassName('notif-container')[0].style.backgroundColor = rgbToRgbaString("rgb(15, 188, 249)");

        super.getNode().getElementsByClassName('notif-body')[0].innerHTML += `
            <hr>
            <button class="nav-btn" onclick="zoomIn()">
                <img class="nav-btn-icon theme-icon" name="zoom-in-16">
                <label class="nav-btn-label">Zoom in</label>
            </button>
            <button class="nav-btn" onclick="zoomOut()">
                <img class="nav-btn-icon theme-icon" name="zoom-out-16">
                <label class="nav-btn-label">Zoom out</label>
            </button>
        `;
    }
}

module.exports = ZoomNotification;