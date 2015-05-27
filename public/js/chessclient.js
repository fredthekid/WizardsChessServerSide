/*
 * this is the client-side code
 */
window.onload = function(){
    var socket = io.connect('192.168.1.136:3030');
    var board, game = new Chess();
    var clientfen = 'start';
    var lastMove;
	
	//New DragStart
	var onDragStart = function(source, piece, position, orientation) {
	  if (game.game_over() === true ||
		  (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
		  (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
		return false;
	  }
	};
	
	var onDrop = function(source, target) {
	  // see if the move is legal
	  var move = game.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	  });
	  lastMove = move;
	  // illegal move
	  if (move === null) return 'snapback';

	};

    var onSnapEnd = function() {
        updateServerGame();
    };

    //only updates clients game, not server
    function updateClientGame(updateFen){
        clientfen = updateFen;
        game.load(clientfen);
        board.position(clientfen);
    };

    //updates server game as well
    function updateServerGame(){
        updateClientGame(game.fen());
        socket.emit('clientUpdateRequest', clientfen, lastMove);
    };

    socket.on('updateGameFromServer',function(data){
        updateClientGame(data);
    });

    socket.on('initBoard', function(data){
        var cfg = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        board = new ChessBoard('board', cfg);
        updateClientGame(data);    
    });
}
