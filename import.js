function url2Object(URL){
  var urlObject = {href:URL};
  if(URL.includes('?')){
    urlObject.search = '?'+(a=URL.split('?'), a.shift(), a.join('?'));
  }else urlObject.search='';
  if(URL.includes('#')){
    urlObject.hash = '#'+(a=URL.split('#'), a.shift(), a.join('#'));
  }else urlObject.hash='';
  if(!urlObject.search&&!urlObject.hash){
    urlObject.search = location.search;
    urlObject.hash = location.hash;
  }
  if(URL.includes('//')){
    b=URL.split('//');
    urlObject.protocol = b[0];
    urlObject.host = b[1].split('/')[0];
    urlObject.pathname = (c=b[1].split('/'), c.shift(), c=c.join('/'), c.split('?')[0].split('#')[0]);
  }else{
    urlObject.host = URL.split('/')[0];
    if(!urlObject.host){
      urlObject.host = location.host;
      urlObject.protocol = location.protocol;
      urlObject.pathname = (c=location.pathname + URL, c.split('?')[0].split('#')[0]);
    }else{
      urlObject.protocol = 'https:';
      urlObject.pathname = '/'+(c=URL.split('/'), c.shift(), c=c.join('/'), c.split('?')[0].split('#')[0]);
    }
  }
  if(urlObject.host){
    urlObject.hostname = urlObject.host;
    urlObject.origin = urlObject.protocol + '//' + urlObject.host;
  }else{
    urlObject.hostname = urlObject.origin = '';
  }
  urlObject.port = '';
  urlObject.href = urlObject.protocol+'//'+urlObject.host+urlObject.pathname+(urlObject.search?urlObject.search:urlObject.hash);
  if(urlObject.pathname.split('/')[urlObject.pathname.split('/').length-1].includes('.')){
    urlObject.fileext = '.'+urlObject.pathname.split('/')[urlObject.pathname.split('/').length-1].split('.').pop();
  }else urlObject.fileext = undefined;
  return urlObject;
}
function import(URL, callback){
  if(typeof callback!='function')callback=(()=>{});
  var result = {URL:url2Object(URL)};
  xhr=new XMLHttpRequest(), xhr.onreadystatechange=(function(xhr, callback){
    if(xhr.readyState==4&&xhr.status==200){
      this.response = xhr.response;
      switch(this.URL.fileext){
        case '.js':
          callback((new Function(xhr.response)).bind({})());
        break;
        default:
          callback(xhr.result);
        break;
      }
    }
  }).bind(result, xhr, callback), xhr.open("GET", URL), xhr.send();
  result.xhr=xhr;
  return result;
}
