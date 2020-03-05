function url2Object(URL){
  return new Promise((s, f)=>{
    if(!document.getElementById('locationFrame'))document.body.append((i=document.createElement('iframe'), i.id='locationFrame', i.style.display='none', i));
    var i =  document.getElementById('locationFrame');
    try{
      i.onload=()=>{
        i.onload=(e)=>{
          x=new XMLHttpRequest();
          x.open('GET', i.contentWindow.location.href);
          x.onreadystatechange=()=>{
            if(x.readyState==4){
              switch(x.status){
                case 200:
                case 304:
                  s(i.contentWindow.location);
                break;
                default:
                  i.onload=()=>{
                    x=new XMLHttpRequest();
                    x.open('GET', i.contentWindow.location.href);
                    x.onreadystatechange=()=>{
                      if(x.readyState==4){
                        switch(x.status){
                          case 200:
                          case 304:
                            s(i.contentWindow.location);
                          break;
                          default:
                            f(x);
                          break;
                        }
                      }
                    };
                  };
                  i.src='https://'+URL;
                break;
              }
            }
          };
          x.send();
        };
        i.src=URL;
      };
      i.src=location.href;
    }catch(e){f(e);}
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
