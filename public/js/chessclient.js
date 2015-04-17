/*
 * This is the client-side code
 */

window.onload = function(){
    var socket = io.connect('http://localhost:8080');
    var board, game = new Chess();
    var clientfen = 'start';

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
        updateServerGame();
    };

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    var onSnapEnd = function() {
        updateServerGame();
    };

    //only updates clients game, not server
    function updateClientGame(updateFen){
        clientfen = updateFen;
        game.load(clientfen);
        board.position(clientfen);
    };

    //updates client game as well
    function updateServerGame(){
        updateClientGame(game.fen());
        socket.emit('clientUpdateRequest', clientfen);
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
