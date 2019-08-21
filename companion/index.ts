import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
const baseURL: string = 'https://api.exchangeratesapi.io/latest';

function getSetting(key: string, def: string): string {
    let ret: string = settingsStorage.getItem(key);
    try {
        ret = JSON.parse(ret)['name'];
    } catch (e) {
        ret = ret ? ret : def;
    }
    return ret;
}

let baseCurrency: string = getSetting('convertfrom', 'USD');
let targetCurrency: string = getSetting('convertto', 'EUR');

function updateRate(): void {
    fetch(baseURL + '?base=' + baseCurrency).then(response => {
        return response.json();
    }).then(rateobj => {
        messaging.peerSocket.send({
             base: baseCurrency,
             target: targetCurrency,
             rates: rateobj.rates
        });
    });
}

function updateBase(newBase: string | undefined): void {
    if (!newBase || newBase === baseCurrency)
        return;
    baseCurrency = newBase;
    settingsStorage.setItem('convertfrom', newBase);
    updateRate();
}

function updateTarget(newTarget: string | undefined): void {
    if (!newTarget || newTarget === targetCurrency)
        return;
    targetCurrency = newTarget;
    settingsStorage.setItem('convertto', newTarget);
}

messaging.peerSocket.onmessage = m => {
    console.log(JSON.stringify(m.data));
    let update: any = m.data;
    if (update.base) updateBase(update.base);
    if (update.target) updateTarget(update.target);
    if (update.wakeup) updateRate();
}