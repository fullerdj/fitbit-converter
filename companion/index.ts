import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
const baseURL: string = 'https://api.exchangeratesapi.io/latest';

function updateRate() {
    const target: string = JSON.parse(settingsStorage.getItem('currencycode'))["name"];
    fetch(baseURL + "?symbols=" + target + '&base=USD').then(response => {
        return response.json();
    }).then(rateobj => {
        const factor: number = rateobj.rates[target];
        settingsStorage.setItem('staticfactor', factor.toString());
        messaging.peerSocket.send({ value: factor });
    });
}

messaging.peerSocket.onopen = () => {
    //let factor = parseFloat(JSON.parse(settingsStorage.getItem('staticfactor'))["name"]);
    let factor = settingsStorage.getItem('staticfactor');
    if (!factor) {
        settingsStorage.setItem('staticfactor', "1");
    }
    console.log(JSON.stringify(factor));
    updateRate();
    //messaging.peerSocket.send({ value: factor });
    //console.log('sent ' + factor);
};