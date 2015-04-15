/*
 * This is the client-side code
 */

window.onload = function(){
    var socket = io.connect('http://localhost:8080');
    var board, game = new Chess();
    var currentfen = 'start';

    // do not pick up pieces if the game is over
    // only pick up pieces for White

    var onDragStart = function(source, piece, position, orientation) {
        if (game.in_checkmate() === true || game.in_draw() === true ||
                piece.search(/^b/) !== -1) {
            return false;
        }
    };

    var onDrop = function(source, target, piece, newPos, oldPos, orientation) {

        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback';
        // make random legal move for black
        window.setTimeout(makeRandomMove, 250);
    };

    var makeRandomMove = function() {
        var possibleMoves = game.moves();
        // game over
        if (possibleMoves.length === 0) return;

        var randomIndex = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIndex]);
        board.position(game.fen());
    };

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    var onSnapEnd = function() {
        board.position(game.fen());
        console.log(game.fen());
    };

    var onChange = function(){
        socket.emit('updateBoardFromClient',game.fen());
    }

    socket.on('updateBoard',function(data){
        board.position(data);
    });

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        onChange: onChange
    };
    board = new ChessBoard('board', cfg);
}
