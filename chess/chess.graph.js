


function setBoard() {
	var code = stringCodeSetBoard();
	document.getElementById('chessBoard').innerHTML = code;
	
}

function setChessmen() {	// 2,3,4,...
	
}

function setChessman() {	// 1
	
}

// [King:10, Queen:9, Rook:5, Knight:4, Bishop:3, Pawn:1], empty:0
function getChessman(d,c) {
	return ((d==0) ? 0 : (getChessmanCode(d) + getChessmanColor(c)));
}

function getChessmanCode(d) {
	switch(d) {
		case 1:
			return 'P';
		case 3:
			return 'B';
		case 4:
			return 'N';
		case 5:
			return 'R';
		case 9:
			return 'Q';
		case 10:
			return 'K';
	}
}

function getChessmanColor(c) {	// c:0->black, c:1->white
	return c?'w':'b';
}

function set(x,y,d) {
	if (d == 0) return;
	
	document.getElementById('c-'+x+y).innerHTML = '<img src="">';
}
function get(x,y) {
	var data = "";	// get return data on DOM
	return;
}
function call(x,y) {
	var data = get(x,y);
	set(x,y,data);
	return data;
}

function move(ax,ay,bx,by) {
	set(bx,by,call(ax,ay));
}

function stringCodeSetBoard() {
	var script = '';
	for (var i = 1; i <= 8; i++) {
		script += '<div class="board-row">';
		for (var j = 1; j <= 8; j++) script += '<div class="board-cell" id="c-'+j+i+'"> </div>';
		script += '</div>';
	}
	return script;
}




