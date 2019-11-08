How to make transparent buildings

```javascript
// Make buildings roofs transparent
Object.keys(a("03f4982a")).forEach(function(index) {

  if( a("03f4982a")[index].ceiling ) {

    if( a("03f4982a")[index].ceiling.imgs ) {
      Object.keys(a("03f4982a")[index].ceiling.imgs).forEach( function(item) {
        a("03f4982a")[index].ceiling.imgs[item].alpha = 0.5;
      });
    }
  }
});
```
