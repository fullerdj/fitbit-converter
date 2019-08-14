import document from 'document';
import { me } from 'appbit';
import * as messaging from 'messaging';

let textbox: any = document.getElementById("textbox");
let factor: number = 1;

messaging.peerSocket.onmessage = e => {
    factor = e.data['value'];
    console.log(JSON.stringify(e));
};

messaging.peerSocket.onopen = e => messaging.peerSocket.send('foo');

function typeChar(c: string) {
    return (_: any) => textbox.text += c;
}

document.getElementsByClassName("button").forEach(e => {
    e.onactivate = typeChar(e.id);
});

document.onkeypress = e => {
    messaging.peerSocket.send("foo");
    if (e.key === 'up') {
        textbox.text = (parseFloat(textbox.text) * factor)
            .toFixed(4).toString();
    } else if (e.key === 'down') {
        textbox.text = (parseFloat(textbox.text) / factor)
            .toFixed(4).toString();
    } else {
        e.preventDefault();
        if (textbox.text === '') {
            me.exit();
        } else {
            textbox.text = "";
        }
    }
};