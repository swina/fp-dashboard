export function setCSS(el,prop,value){
  let css = el + '{ ' + prop + ':' + value + ';}'
  return css
}
export function stylesheet(css){
  var sheet = document.createElement('style')
  sheet.innerHTML = css
  document.body.appendChild(sheet);
}

