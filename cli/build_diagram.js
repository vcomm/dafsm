'use strict';

const fs = require('fs')
const open = require('open')

let injson  = null
let outsvg  = null

process.argv.forEach(function (val, index, array) {
    switch (index)  {
        case 2:
            injson = val
            console.info(`Type: ${injson}`)
            break;
        case 3:
            outsvg = val
            console.info(`Library: ${outsvg}`)
            break;
    }
});

const chart = require('./primitives/fsm')
let logo =  chart.draw(require(injson))

fs.writeFile(outsvg, logo,
    function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        open(outsvg,'safari')
        setTimeout(() => { process.exit(1); },1000)
});

