window.key='';window.__defineGetter__('key', ()=>{return ((("QWERTYUIOPASDFGHJKLZXCVBNM".split('')).reduce((a,v)=>a.splice(Math.floor(Math.random() * a.length), 0, v) && a, []).join('')).split('')).reduce((a,v)=>a.splice(Math.floor(Math.random() * a.length), 0, v) && a, []).join('');});
var basicKey = "QlUgUEUgU0QgUkMgSlo6SlogSEwgVFcgWE4gRFYgR1EgS1UgQlAgUkEgSU0gU0YgT1kgRUM6WklOUUtET1dBTFRVSEdGVkNCTVBTWFlSSkU+MTcmOSYxMyYyMCYxOSYxIVpVVFFGQ0RTUktKQk9IV0dWTU5MRVBJQVlYPjImNSYxNCYyJjEmNSFRSVBXVU1IWExCWUFEWkNFVk9KS1JTR05URj4zJjYhR0RFU1ZaT0tXUkpCWENZTlRQRlFBTFVNSUg+MTEmMjImMiYxNiYxJjE4JjI0JjE4JjIwIUNaRE1VV0JPWVNWUFJJS05RTEVIR1hURkFKPjQmNSYxMCYzJjE1JjExIUpRUFVLQ0RCR1dIU09BTk1GVExZUlZYRUlaPjgmMTYhRUtaT1dBRExSUElIQ1FKVlRTWEJGTU5HWVU+NiYxMiYyNSYyMCYxIVVDQkRKWVJNWklGTEVWSEdOWE9UQVBTV1FLPjEwJjEyJjIxIURZSlVNUENFTFhTV09HRlJUTlpCSEtRQUlWPjIyJjE5JjExJjEyJjIyIUJMUVlWVENNSUdXREFSU0VaRk5QSkhLT1hVPjIwJjIzJjExIVFHWldPWFZVQ0ZNSlJIQkVMVEFQWVNJTkRLPjYmMTAmMyY3IUJOS01TV1lFTERBSk9GWFBVR1FIWlRDSVZSPjghUVBWV0dDUkxUSUhLREpNWFVORU9CQVpTRlk+MjEmMjUhREZMQlhaV0pLTkVST1ZVSElZUE1HQVNUUUM+MTQmMTYmNyY1JjMmMjUmMiYxJjE1JjE4JjQmMjMhQ1dKRFhQTlNBRU1VR1lLWlZJTEhGT0JRVFI+NCYxNSYxMyYyNjpBUlVDUlVLRlFTQVRQSVpL";
function genKey(){
    var randint = Math.floor(Math.random()*13)+1, plugboard = (window.key).replace(/(\w\w)/gi, '$1 ').trim().split(' ').splice(Math.floor(Math.random()*(13-randint)), randint).join(' ');
    var reflector = (window.key).replace(/(\w\w)/gi, '$1 ').trim();
    var rotors = [], startPos_s = [(window.key)[Math.round(Math.random()*26)]];
    do{
        var pins = [];
        do{
            pins.push(1+Math.floor(Math.random()*26));
        }while(Math.random()<0.75);
        rotors.push(window.key+'>'+pins.join('&'));
        startPos_s.push((window.key)[Math.round(Math.random()*26)]);
    }while(Math.random()<0.75);
    rotors = rotors.join('!'), startPos_s = startPos_s.join('');
    return btoa(plugboard+':'+reflector+':'+rotors+':'+startPos_s);
}
function isUpperCase(char) {
    return char==char.toUpperCase();
}
function Enigma(setupKey) {
    this.rotors = [];
    this.reflector = null;
    this.plugboard = null;

    /*setup*/
    if (setupKey) {
        try {
            setupKey = atob(setupKey);
            var parts = setupKey.toUpperCase().split(':');
            this.plugboard = new Enigma.Plugboard(parts[0].split(' '));
            switch (parts[1]) {
                default: this.reflector = new Enigma.Reflector(parts[1].split(' ')); break;
            }
            var rotors = parts[2].split('!'), rotations = parts[3].split('');
            for (var i = 0; i < rotors.length; i++) { this.rotors.push(new Enigma.Rotor(rotors[i].split('>')[0], rotations[i], rotors[i].split('>')[1].split('&'))); }
        } catch (e) { throw new Error("Invalid setup KEY: " + e.message); }
    }
    /*end setup*/
}
Enigma.prototype.encode = function (message) {
    var retval = {encoded:"", capMap:[]};
    message+='?encoded=true';
    message = btoa(message);
    var encode = (function(enigma){
        return function encode(char){
            char=enigma.plugboard.encode(char);
            for(var i=enigma.rotors.length-1;i>=0;i--){
                char=enigma.rotors[i].encode(char, 'left', i);
            }
            char=enigma.reflector.encode(char);
            for(var i=0;i<enigma.rotors.length;i++){
                char=enigma.rotors[i].encode(char, 'right', i);
            }
            char=enigma.plugboard.encode(char);
            return char;
        }
    })(this);
    for(var i=0;i<message.length;i++){
        var char = message.split('')[i];
        retval.capMap.push(isUpperCase(char));
        retval.encoded+=("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(char.toUpperCase())?(encodded=encode(char), this.spin(), encodded):char);
    }
    retval.encoded = atob(retval.encoded);
    return Enigma.stringify(retval);
}
Enigma.prototype.decode = function (encoded) {
    encoded = Enigma.parse(encoded);
    var message = btoa(encoded.encoded), capmap = encoded.capMap;
    var retval = "";
    var encode = (function(enigma){
        return function encode(char){
            char=enigma.plugboard.encode(char);
            for(var i=enigma.rotors.length-1;i>=0;i--){
                char=enigma.rotors[i].encode(char, 'left', i);
            }
            char=enigma.reflector.encode(char);
            for(var i=0;i<enigma.rotors.length;i++){
                char=enigma.rotors[i].encode(char, 'right', i);
            }
            char=enigma.plugboard.encode(char);
            return char;
        }
    })(this);
    for(var i=0;i<message.length;i++){
        var char = message.split('')[i];;
        retval+=("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(char.toUpperCase())?(encodded=encode(char), this.spin(!0), encodded):char);
    }
    retval = retval.split('');
    for(var i=0;i<Math.min(capmap.length, retval.length);i++){
        if(capmap[i]){retval[i] = retval[i].toUpperCase();}else{retval[i] = retval[i].toLowerCase();}
    }
    //retval = atob(retval.join(''));
    //retval = (retval=retval.split('?'), retval.pop(), retval).join('?');
    return retval;
}
Enigma.prototype.spin = function (x) {
    this.rotors[this.rotors.length-1].spin((this.rotors.length-1)%2);
    for(var i=this.rotors.length-1;i>0;i--){
        if(this.rotors[i].needsUpdate){
            this.rotors[i-1].spin((i-1)%2);
            this.rotors[i].needsUpdate = false;
        }
    }
}
Enigma.prototype.reset = function() {
    for(var i=0;i<this.rotors.length;i++){
        this.rotors[i].reset();
    }
}
Enigma.Rotor = function (wiringMaze, rotation, pins) {
    for(var i=0;i<pins.length;i++){pins[i] = parseInt(pins[i]);}
    this.wiringMaze = wiringMaze;
    rotation = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").indexOf(rotation);
    this.rotation = ( rotation>=0 ? rotation : 0 );
    this.defaultPosition = this.rotation;
    this.pins = pins;
    this.needsUpdate = false;
}
Enigma.Rotor.prototype.reset = function() {
    this.rotation = this.defaultPosition;
}
Enigma.Rotor.prototype.spin = function (odd) {
    var num = (odd?-1:1);
    this.rotation += num;
    this.rotation%=26;
    while(this.rotation<0){this.rotation+=26;}
    if(this.pins.includes(this.rotation+1))this.needsUpdate = true;
}
Enigma.Rotor.prototype.encode = function (char, lr, de) {
    var wiringMaze = this.wiringMaze, rotation = this.rotation;
    function alphaCycle(char, rot){
        var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if(alpha.includes(char.toUpperCase())){
            var num = alpha.indexOf(char.toUpperCase()), newnum = (rot + num)%26;
            while(newnum<0){newnum+=26;}
            return alpha[newnum];
        }
        return false;
    }
    function into(char){
        if(wiringMaze.includes(char.toUpperCase())){
            var num = (wiringMaze.indexOf(char.toUpperCase())+1)%26;
            return wiringMaze[num];
        }
        return false;
    }
    function outof(char){
        if(wiringMaze.includes(char.toUpperCase())){
            var num = (wiringMaze.indexOf(char.toUpperCase())-1)%26;
            while(num<0){num+=26;}
            return wiringMaze[num];
        }
        return false;
    }
    var retval;
    switch(lr){
        case 'left':
            retval = alphaCycle(into(alphaCycle(char, rotation)), rotation);
        break;
        case 'right':
            retval = alphaCycle(outof(alphaCycle(char, -rotation)), -rotation);
        break;
        default:retval = char;break;
    }
    return retval;
}
Enigma.Plugboard = function (connections) {
    this.connections = [];
    this.plugin(connections);
}
Enigma.Plugboard.prototype.encode = function (char) {
    var retval = char.toUpperCase();
    for (var i = 0; i < this.connections.length; i++) {
        switch (this.connections[i].indexOf(char.toUpperCase())) {
            case 0: retval = this.connections[i].split('')[1]; break;
            case 1: retval = this.connections[i].split('')[0]; break;
            default: break;
        }
    }
    return retval;
}
Enigma.Plugboard.prototype.unplug = function (cables) {
    for (var i = 0; i < cables.length; i++) { if (this.connections.includes(cables[i])) { this.connections.splice(this.connections.indexOf(cables[i]), 1); } }
}
Enigma.Plugboard.prototype.plugin = function (cables) {
    for (var i = 0; i < cables.length; i++) { if (!this.connections.includes(cables[i])) { this.connections.push(cables[i]) } }
}
Enigma.Plugboard.prototype.setPlugboard = function (cables) { this.connections = cables; }

Enigma.Reflector = function (connections) {
    if (connections.length < 13) { throw { message: 'not enough connections in the Reflector' }; }
    this.connections = connections;
}
Enigma.Reflector.prototype.encode = function (char) {
    var retval = char.toUpperCase();
    for (var i = 0; i < this.connections.length; i++) {
        switch (this.connections[i].indexOf(char.toUpperCase())) {
            case 0: retval = this.connections[i].split('')[1]; break;
            case 1: retval = this.connections[i].split('')[0]; break;
            default: break;
        }
    }
    return retval;
}
Enigma.stringify = function(obj){
    var result = '';
    result+=obj.encoded+';';
    for(var i=0;i<obj.capMap.length;i++){result+=(obj.capMap[i]?1:0)}
    return result;
}
Enigma.parse = function(str){
    var result = {encoded:'', capMap:[]};
    var parts = str.split(';'), caps = parts.pop();
    result.encoded = parts.join(';');
    for(var i=0;i<caps.length;i++){result.capMap.push((caps[i]=='1'?!0:!1));}
    return result;
}
/* AB CD EF GH:AB CD EF GH:[ROTOR]![ROTOR]:FM   *\
|  |_________| |_________| |_____________| ||   |
|   PLUGBOARD   REFLECTOR      ROTORS      ||   |
|                     ROTOR START ROTATIONS_/   |
|                                               |
|  [ROTOR]                                      |
|  AZBYCXDWEVFU...                              |
|  |_____________|                              |
|    WIRING MAZE                                |
|  -----------------------                      |
|  German Enigma III                            |
|  |_______________|                            |
\*  VALID ROTOR NAME                           */
