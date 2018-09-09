'use strict';

const fsmChart = (function () {
    let diagram = null
       ,logic = null
       ,plan = {}
       ,width = 640
       ,height = 480
       ,fills = [
        '#884EA0',
        '#CB4335',
        '#2471A3',
        '#F4D03F',
        '#138D75',
        '#E67E22',
        '#5DADE2'
        ]
       ,shiftdown = []
       ,shiftup = []
       ,evcount = 0

    const svg = require('buildSVG')
        .width(width)
        .height(height);

    function countTrans2State(arr) {
        var counts = {}
        arr.forEach(function(x) { counts[x] = (counts[x] || 0)+1; })
        return counts
    }
    function getStateIndx(statekey) {
        let indx = 0
        for(let key of Object.keys(logic.states)) {
            if (key === statekey)
                return indx
            else
                indx++
        }
    }
    function calcPlan(logic) {
        plan.numQuadrans = logic.countstates
        plan.offset = 10
        plan.quadran = {
            width : (width-plan.offset) / plan.numQuadrans,
            height: (height-plan.offset) / plan.numQuadrans
        }
        console.log(plan)
        diagram = svg
            .text({
                x: plan.quadran.width*2,
                y: plan.quadran.height/2,
                'font-family': 'helvetica',
                'font-size': 25,
                stroke : '#aaa',
                fill: '#000'
            }, logic.prj+logic.id).render();
    }
    function listStateAction(state,tag) {
        let list = '<b>'+tag+':</b><br>'
        if (state.hasOwnProperty(tag)) {
            state[tag].forEach(action => {
                list += action.name + '<br>'
            })
            return list;
        } else {
            return '';
        }
    }
    function listTrans2Go(state,event,trans,nstate) {
        let list = event+'<br>'
        if (state.hasOwnProperty('exits')) {
            state['exits'].forEach(action => {
                list += action.name + '<br>'
            })
        }
        if (trans.hasOwnProperty("effects")) {
            trans.effects.forEach(effect => {
                list += effect.name + '<br>'
            })
        }
        if (nstate.hasOwnProperty("entries")) {
            nstate.entries.forEach(action => {
                list += action.name + '<br>'
            })
        }
        return list;
    }
    function buildTriangle(x,y,dx,dy) {
        return x+','+y+' '+(x+dx)+','+(y-dy)+' '+(x+dx)+','+(y+dy)
    }
    function  drawState(state,indx) {
        let x = plan.offset+indx*plan.quadran.width + plan.quadran.width/2
           ,y = plan.offset+indx*plan.quadran.height + plan.quadran.height/2
           ,radius = 20, fill = 'none'
        console.log(`draw state[${state.key}]=${x},${y}`)
        switch (state.key) {
            case 'init':
                fill = fills[indx]
                break;
            case 'final':
                fill = '#aaa'
                break;
            default:
                radius = 40
                fill = fills[indx]
                break;
        }
        diagram = svg
            .circle({
                id: state.key,
                entry: listStateAction(state,'entries'),
                stay: listStateAction(state,'stays'),
                exit: listStateAction(state,'exits'),
                r: radius,
                fill: fill,
                'stroke-width': 2,
                stroke: '#000',
                cx: x,
                cy: y,
/*
                onmouseover: "this.style.stroke = '#ffc700'; this.style['stroke-width'] = 3; top.showTooltip(evt, this.getAttribute('entry')+this.getAttribute('stay')+this.getAttribute('exit'));",
                onmouseout: "this.style.stroke = '#000000'; this.style['stroke-width'] = 2; top.hideTooltip();"
*/
                //,onclick: "top.stateSelect(this)"
            }).text({
                x: x + radius,
                y: y + radius,
                'font-family': 'helvetica',
                'font-size': 15,
                stroke : '#aaa',
                fill: '#000'
            }, state.key).render();
    }
    function drawTransition(state,trans) {

        let nindx = getStateIndx(trans.nextstatename)
           ,oindx = getStateIndx(state.key)
           ,x1 = plan.offset+oindx*plan.quadran.width + plan.quadran.width/2
           ,y1 = plan.offset+oindx*plan.quadran.height + plan.quadran.height/2
           ,x2 = plan.offset+nindx*plan.quadran.width + plan.quadran.width/2
           ,y2 = plan.offset+nindx*plan.quadran.height + plan.quadran.height/2
           ,radius = 40, dublicate = 0, shift = 6, self = 50

        console.log(`Transition ${state.key}[${x1},${y1}] => ${trans.nextstatename}[${x2},${y2}]`)

        if (x2 > x1) {
            shiftdown.push(nindx)
            dublicate = countTrans2State(shiftdown)[nindx]
            console.log(`Down: ${oindx} -> ${nindx}: ${dublicate}`)
            diagram = svg.line({
                x1: x1,
                y1: y1+radius,
                x2: x1,
                y2: y2-dublicate*shift,
                stroke: fills[oindx],
                'stroke-width': 2
            }).line({
                x1: x1,
                y1: y2-dublicate*shift,
                x2: x2-radius,
                y2: y2-dublicate*shift,
                stroke: fills[oindx],
                'stroke-width': 2
            }).polygon({
                id: state.key+'1'+trans.nextstatename,
                points: buildTriangle(x2-radius-5,y2-dublicate*shift,-10,7),
                style: 'stroke:#000; fill:'+fills[oindx]+';',
                'stroke-width': 2
            }).render();

        } else {
            if (x2 === x1) {
                console.log(`In Out in same state: ${state.key}[${x1},${y1}] => ${trans.nextstatename}[${x2},${y2}]`)
                diagram = svg.line({
                    x1: x1,
                    y1: y1 - radius,
                    x2: x1,
                    y2: y1 - radius - self,
                    stroke: fills[oindx],
                    'stroke-width': 2
                }).line({
                    x1: x1,
                    y1: y1 - radius - self,
                    x2: x1 + radius + self,
                    y2: y1 - radius - self,
                    stroke: fills[oindx],
                    'stroke-width': 2
                }).line({
                    x1: x1 + radius + self,
                    y1: y1 - radius - self,
                    x2: x1 + radius + self,
                    y2: y1,
                    stroke: fills[oindx],
                    'stroke-width': 2
                }).line({
                    x1: x1 + radius + self,
                    y1: y1,
                    x2: x1 + radius,
                    y2: y1,
                    stroke: fills[oindx],
                    'stroke-width': 2
                }).polygon({
                    id: state.key + '1' + trans.nextstatename,
                    points: buildTriangle(x1 + radius + 5, y1, 10, 7),
                    style: 'stroke:#000; fill:' + fills[oindx] + ';',
                    'stroke-width': 2
                }).render();
            } else {
                shiftup.push(nindx)
                dublicate = countTrans2State(shiftup)[nindx]
                console.log(`Up: ${nindx} <- ${oindx}: ${dublicate}`)
                diagram = svg.line({
                    x1: x1,
                    y1: y1 - radius,
                    x2: x1,
                    y2: y2 - dublicate * shift,
                    stroke: fills[oindx],
                    'stroke-width': 2
                }).line({
                    x1: x1,
                    y1: y2 - dublicate * shift,
                    x2: x2 + radius,
                    y2: y2 - dublicate * shift,
                    stroke: fills[oindx],
                    'stroke-width': 2
                }).polygon({
                    id: state.key + '1' + trans.nextstatename,
                    points: buildTriangle(x2 + radius + 5, y2 - dublicate * shift, 10, 7),
                    style: 'stroke:#000; fill:' + fills[oindx] + ';',
                    'stroke-width': 2
                }).render();
            }
        }
    }
    function drawStateExits(state,indx,actname) {

    }
    function drawStateStays(state,indx,actname) {

    }
    function drawStateEntries(state,indx,actname) {

    }
    function drawStateTranTrig(state,indx,trans,trigname,nextstate) {
        let ofx = 100
           ,ofy = 50
           ,sx = width - ofx
           ,sy = ofy + evcount*ofy
           ,w = 70
           ,h = 30
        diagram = svg
            .rect({
                id: trigname,
                master: state.key,
                goto: trans.nextstatename,
                listgo: listTrans2Go(state,trigname,trans,nextstate),
                x: sx,
                y: sy,
                width: w,
                height: h,
                fill: fills[indx],
                'stroke-width': 2,
                stroke: '#000',
                onmouseover: "this.style.stroke = '#ffc700'; this.style['stroke-width'] = 3; top.showTooltip(evt, this.id);",
                onmouseout: "this.style.stroke = '#000000'; this.style['stroke-width'] = 2; top.hideTooltip();"
               ,onclick: " top.trans2Goto(this)"
            }).animate({
                'xlink:href': '#'+state.key,
                attributeName: "fill",
                from: '#000000',
                to: '#FFFFFF',
                additive: "sum",
                repeatCount: "3",
/*
                calcMode: "spline",
                keyTimes: "0;1",
                keySplines: ".42 0 1 1",
*/
                dur: "3s",
                begin: trigname+".click + 0.3s",
                fill: "remove",
                id: state.key+'2'+trans.nextstatename
            }).animate({
                'xlink:href': '#'+state.key+'1'+trans.nextstatename,
                attributeName: "fill",
                from: '#000000',
                to: '#FFFFFF',
                additive: "sum",
                repeatCount: "3",
                dur: "3s",
                begin: state.key+'2'+trans.nextstatename+'.begin + 0.5s',
                fill: "remove"
            }).animate({
                'xlink:href': '#'+trans.nextstatename,
                attributeName: "fill",
                from: '#000000',
                to: '#FFFFFF',
                additive: "sum",
                repeatCount: "3",
                dur: "3s",
                begin: state.key+'2'+trans.nextstatename+'.begin + 1s',
                fill: "remove"
            }).render();
        evcount++
    }
    function drawStateTranEffect(state,indx,trans,effname) {
    }

    return {
        draw: function(fsm,w,h) {
            logic = fsm
            shiftdown = []
            shiftup   = []
            evcount   = 0

            if (w || h) {
                width = w
                height= h
                svg.width(width)
                   .height(height);
            }
            
            diagram = svg
                .rect({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    fill: 'white',
                    'stroke-width': 2,
                    stroke: '#000',
                }).render();
            try {
                let indx = 0
                calcPlan(logic)
                for(let key of Object.keys(logic.states)) {
                    let state = logic.states[key];
                    drawState(state,indx)
                    if (state.hasOwnProperty("exits")) {
                        state.exits.forEach(action => {
                            drawStateExits(state,indx,action.name)
                        })
                    }
                    if (state.hasOwnProperty("stays")) {
                        state.stays.forEach(action => {
                            drawStateStays(state,indx,action.name)
                        })
                    }
                    if (state.hasOwnProperty("entries")) {
                        state.entries.forEach(action => {
                            drawStateEntries(state,indx,action.name)
                        })
                    }
                    if (state.hasOwnProperty("transitions")) {
                        state.transitions.forEach(trans => {
                            let nextstate = logic.states[trans.nextstatename]
                            drawTransition(state,trans)
                            if (trans.hasOwnProperty("triggers")) {
                                trans.triggers.forEach(trig => {
                                    drawStateTranTrig(state,indx,trans,trig.name,nextstate)
                                })
                            }
                            if (trans.hasOwnProperty("effects")) {
                                trans.effects.forEach(effect => {
                                    drawStateTranEffect(state,indx,trans,effect.name)
                                })
                            }
                        })
                    }
                    indx++
                }
            } catch(e) {
                console.error('Error: ' + e.name + ":" + e.message + "\n" + e.stack);
            } finally {
                /*
                diagram += '<script>\n'+
                    'function stateSelect(elem) {\n'+
                    '  alert(elem.id)\n'+
                    '}\n'+
                    '</script>'
                 */
                return diagram;
            }
        }
    }
})()

module.exports = fsmChart