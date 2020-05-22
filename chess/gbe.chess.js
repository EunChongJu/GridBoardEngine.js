
/// Chess Making function

// chess set chessman in board [King:10, Queen:9, Rook:5, Knight:4, Bishop:3, Pawn:1], empty:0
function setChessman(v) {
	v.setItem(1,2,[0,1]);
	v.draw(1,2,8,2);
	
	v.setItem(1,7,[1,1]);	// before and after the more better how to.
	v.draw(1,7,8,7);
	
	v.setItem(1,1,[0,5]);	// black Rook
	v.setItem(8,1,[0,5]);
	v.setItem(1,8,[1,5]);	// white Rook
	v.setItem(8,8,[1,5]);
	
	v.setItem(2,1,[0,4]);	// black Knight
	v.setItem(7,1,[0,4]);
	v.setItem(2,8,[0,4]);	// white Knight
	v.setItem(7,8,[0,4]);
	
	v.setItem(3,1,[0,3]);	// black Bishop
	v.setItem(6,1,[0,3]);
	v.setItem(3,8,[1,3]);	// white Bishop
	v.setItem(6,8,[1,3]);
	
	v.setItem(4,1,[0,9]);	// black Queen
	v.setItem(5,1,[0,10]);	// black King
	
	v.setItem(4,8,[1,9]);	// white Queen
	v.setItem(5,8,[1,10]);	// white King
}


/// Chess Making test
console.dir("::Chess Test Start::");

// set New Board
var chess = new GridBoardEngine();
chess.newClass(1);
chess.newBoard(8,8);

// set Board value and init val: 0 and set start index:1
chess.initAllValues(0);
chess.setStartIndex(1);

// chess set chessman in board
setChessman(chess);

// chess check
chess.printGrid();
console.dir(chess.getItem(5,8));





console.dir("::Chess Test End::");

