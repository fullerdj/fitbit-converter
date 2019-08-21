import document from 'document';
import { me } from 'appbit';
import * as messaging from 'messaging';

interface TileInfo extends VirtualTileListItemInfo {
    type: string;
    index: number;
}

interface Rates {
    [currencyCode: string]: number;
}

let textbox: TextElement = document.getElementById('textbox') as TextElement;
let currencyChooser: any = document.getElementById('currency-select');
let currencyList: VirtualTileList<TileInfo> =
    document.getElementById('currency-list') as VirtualTileList<TileInfo>;
let current: TextElement = document.getElementById('current') as TextElement;
let convertFrom: Element = document.getElementById('convert-from');
let convertTo: Element = document.getElementById('convert-to');

let currencies: string[] = [];
let rates: Rates = {};
let baseCurrency: string = '';
let targetCurrency: string = '';

convertFrom.onactivate = (e: ActivateEvent) => {
    buildChooser(arg => setBaseCurrency(arg));
};
convertTo.onactivate = (e: ActivateEvent) => {
    buildChooser(arg => setTargetCurrency(arg));
};
document.getElementsByClassName('button').forEach((e: Element) => {
    e.onactivate = typeChar(e.id);
});
document.getElementById('convert').onactivate = (e: ActivateEvent) => convert();
document.onkeypress = (e: KeyboardEvent) => {
    if (e.key === 'back') {
        e.preventDefault();
        if (textbox.text === '') {
            me.exit();
        } else {
            textbox.text = '';
        }
    }
};
messaging.peerSocket.onopen = (e: messaging.MessageEvent) => {
     messaging.peerSocket.send({ wakeup: true });
};
messaging.peerSocket.onmessage = (e: messaging.MessageEvent) => {
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
        getTileInfo: (index: number): TileInfo => {
            return {
                type: 'tile-pool',
                index: index
            };
        },
        configureTile: (tile: Element, info: TileInfo) => {
            if (info.type === 'tile-pool') {
                tile.getElementById('text').text = currencies[info.index];
                let touch: Element = tile.getElementById('tile-activate');
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

function typeChar(c: string): (_: Event) => void {
    return (_: Event) => textbox.text += c;
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