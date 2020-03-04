function url2Object(URL){
  return new Promise((s, f)=>{
    if(!document.getElementById('locationFrame'))document.body.append((i=document.createElement('iframe'), i.id='locationFrame', i.style.display='none', i));
    var i =  document.getElementById('locationFrame');
    i.onload=()=>{
      i.onload=(e)=>{
        x=new XMLHttpRequest();
        x.open("GET", i.contentWindow.location.href);
        x.onreadystatechange=()=>{
          if(x.readyState==4){
            if(x.status==200||x.status==304){
              s(i.contentWindow.location);
            }else{
              i.onload=(e)=>{
                console.log(e, i);
              };
              i.src='https://'+URL;
            }
          }
        };
      };
      try{
        i.src=URL;
      }catch(e){
        try{
          i.src='https://'+URL;
        }catch(e){
          f(e);
        }
      }
    };
    i.src=location.href;
  });
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
