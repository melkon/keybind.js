;; This buffer is for notes you don't want to save, and for Lisp evaluation.
;; If you want to create a file, visit that file with C-x C-f,
;; then enter the text in that file's own buffer.

function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
    obj.attachEvent( 'on'+type, obj[type+fn] );
  } else
    obj.addEventListener( type, fn, false );
}

function removeEvent( obj, type, fn ) {
  if ( obj.detachEvent ) {
    obj.detachEvent( 'on'+type, obj[type+fn] );
    obj[type+fn] = null;
  } else
    obj.removeEventListener( type, fn, false );
}

addEvent(window, 'keydown', Keybind.onKeydown);
addEvent(window, 'keyup', Keybind.onKeyup);

Keybind.clear();

Keybind.add('Ctrl-x s', function() {console.log('save');});
Keybind.add('Ctrl-x b', function() {console.log('switch buffer');});
Keybind.add('Ctrl-c s', function() {console.log('show symbols');});
Keybind.add('Ctrl-x f', function() {console.log('find file');});

Keybind.add('Ctrl s', function() { console.log('proper save'); });

a('C'); => 67
a('x'); => 120
a('s'); => 115
a('f'); => 102
a('b'); => 98
a('c'); => 99
