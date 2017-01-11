'use strict';

module.exports = {
    duration: function (s) {
        var m = Math.floor(s / 60),
            h = Math.floor(m / 60);
        s %= 60;
        m %= 60;
        if (h === 0 && m === 0) return s + ' s';
        if (h === 0) return m + ' min';
        return h + ' h ' + m + ' min';
    },

    imperial: function (m) {
        var mi = m / 1609.344;
        if (mi >= 100) return mi.toFixed(0) + ' mi';
        if (mi >= 10) return mi.toFixed(1) + ' mi';
        if (mi >= 0.1) return mi.toFixed(2) + ' mi';
        return (mi * 5280).toFixed(0) + ' ft';
    },

    metric: function (m) {
        if (m >= 100000) return (m / 1000).toFixed(0) + ' km';
        if (m >= 10000) return (m / 1000).toFixed(1) + ' km';
        if (m >= 100) return (m / 1000).toFixed(2) + ' km';
        return m.toFixed(0) + ' m';
    },

    en: function(m) {
        return m;
    },

    pt: function(m) {
        m = m.replace(/\b(N|n)?(orth)\b/g, "Norte");
        m = m.replace(/\b(N|n)?(ortheast)\b/g, "Nordeste");
        m = m.replace(/\b(N|n)?(orthwest)\b/g, "Nordoeste");
        m = m.replace(/\b(S|s)?(outh)\b/g, "Sul");
        m = m.replace(/\b(S|s)?(outheast)\b/g, "Sudeste");
        m = m.replace(/\b(S|s)?(outhwest)\b/g, "Sudoeste");
        m = m.replace(/\b(E|e)?(ast)\b/g, "Este");
        m = m.replace(/\b(W|w)?(est)\b/g, "Oeste");
        m = m.replace(/\b(O|o)?(nto)\b/g, "para a");
        m = m.replace(/\b(O|o)?(n)\b/g, "na");
        m = m.replace(/\b(H|h)?(ead)\b/g, "Siga para");
        m = m.replace(/Turn right/g, "Vire à direita");
        m = m.replace(/Bear right/g, "Encoste à direita");
        m = m.replace(/Make a sharp right/g, "Curva apertada à direita");
        m = m.replace(/Turn left/g, "Vire à esquerda");
        m = m.replace(/Bear left/g, "Encoste à esquerda");
        m = m.replace(/Make a sharp left/g, "Curva apertada à esquerda");
        m = m.replace(/\bContinue/g, "Continue");
        m = m.replace(/Make a U-turn/g, "Faça inversão de marcha");
        m = m.replace(/Enter the roundabout/g, "Entre na rotunda");
        m = m.replace(/and take the exit/g, "e saia");
        m = m.replace(/You have arrived at your destination/g, "Chegou ao seu destino");
        return m;
    },
};
