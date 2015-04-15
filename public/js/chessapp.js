window.onload = function(){
    var socket = io.connect('http://localhost:8080')
    
    /*
    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    */

    var board = new ChessBoard('board','start');
}
