import document from 'document';
import { me } from 'appbit';
import * as messaging from 'messaging';

let textbox: any = document.getElementById('textbox');
let currencyChooser: any = document.getElementById('currency-select');
let currencyList: any = document.getElementById('currency-list');
let current: any = document.getElementById('current');
let convertFrom: any = document.getElementById('convert-from');
let convertTo: any = document.getElementById('convert-to');

let currencies: string[] = [];
let rates: any = {};
let baseCurrency: string = '';
let targetCurrency: string = '';

convertFrom.onactivate = (e: any) => buildChooser(arg => setBaseCurrency(arg));
convertTo.onactivate = (e: any) => buildChooser(arg => setTargetCurrency(arg));
document.getElementsByClassName('button').forEach(e => {
    e.onactivate = typeChar(e.id);
});
document.getElementById('convert').onactivate = e => convert();
document.onkeypress = e => {
    if (e.key === 'back') {
        e.preventDefault();
        if (textbox.text === '') {
            me.exit();
        } else {
            textbox.text = '';
        }
    }
};

messaging.peerSocket.onopen = e => messaging.peerSocket.send({ wakeup: true });
messaging.peerSocket.onmessage = e => {
    console.log(JSON.stringify(e));
    rates = e.data['rates'];
    setBaseCurrency(e.data['base']);
    setTargetCurrency(e.data['target']);
    for (let r in rates) {
        currencies.push(r);
    }
};

function buildChooser(f: (arg: string) => void): void {
    currencyList.delegate = {
        getTileInfo: (index: number) => {
            return {
                type: 'tile-pool',
                value: 'Menu item',
                index: index
            };
        },
        configureTile: (tile: Element, info: any) => {
            if (info.type === 'tile-pool') {
                tile.getElementById('text').text = currencies[info.index];
                let touch = tile.getElementById('tile-activate');
                touch.onclick = e => {
                    f(currencies[info.index]);
                    currencyChooser.style.display = 'none';
                };
            }
        }
    };
    currencyList.length = currencies.length;
    currencyChooser.style.display = 'inline';
}

function setBaseCurrency(arg: string): void {
    if (baseCurrency === arg) {
        return;
    }
    baseCurrency = current.text = convertFrom.text = arg;
    messaging.peerSocket.send({ base: arg });
}

function setTargetCurrency(arg: string): void {
    if (targetCurrency === arg)
        return;
    if (current.text === targetCurrency)
        convert();

    targetCurrency = convertTo.text = arg;
    messaging.peerSocket.send({ target: arg });
}

function typeChar(c: string) {
    return (_: any) => textbox.text += c;
}

function updateTextbox(f: (x: number) => number): void {
    let x: number = parseFloat(textbox.text);
    if (!x) return;
    textbox.text = f(x).toFixed(4).toString();
}

function convert(): void {
    if (current.text === baseCurrency) {
        updateTextbox(x => x * rates[targetCurrency]);
        current.text = targetCurrency;
    } else {
        updateTextbox(x => x / rates[targetCurrency]);
        current.text = baseCurrency;
    }
}
