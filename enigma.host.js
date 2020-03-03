importURL('enigma.min.js', {runJSCode:true}).catch(function(e){throw e;});
importURL('enigma-keys.txt').then((e)=>{window.keys = e.result;});
function add(key){}
function get(key, keyID, destKeyID){}
