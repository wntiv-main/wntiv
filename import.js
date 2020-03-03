function url2Object(URL){
  if(!document.getElementById('locationFrame'))document.body.append((i=document.createElement('iframe'), i.src=URL, i.id='locationFrame', i.style.display='none', i));
}
function importURL(URL, options){
  options=options?options:{};
  var prom = new Promise((function(URL, options){return function(resolve, reject){
    var result = {URL:url2Object(URL), options:options};
    xhr=new XMLHttpRequest(), xhr.onreadystatechange=(function(xhr, resolve, reject, result, options){
      if(xhr.readyState==4&&xhr.status==200){
        switch(this.URL.fileext){
          case '.js':
            if(options.runJSCode)this.response = (new Function(xhr.response)).bind(window)();else this.response = xhr.response;
          break;
          default:
            this.response = xhr.response;
          break;
        }
        resolve(result);
      }else if(xhr.readyState==4){
        reject(result);
      }
    }).bind(result, xhr, resolve, reject, result, options), xhr.open("GET", result.URL.href), xhr.send();
    result.xhr=xhr;
  };})(URL, options));
  return prom;
}
