// 보드를 세팅할 때, x는 가로, y는 세로가 되도록 만들어야 한다. 이는 보드 반환하고 콘솔에 출력될 때에 x가 가로되도록 해서 나오도록 해야 한다.

// 시작 인덱스의 값은 이렇게 정한다. true나 false. 그리고 0이 아닌 1이라는 값이나 true, 잘못된 값은 무조건 true로 저장한다.
// 또한 0과 false는 무조건 false로 저장된다.

// 여기서 아이템에 들어갈 값은 숫자나 문자, 문자열, 배열, 오브젝트, 객체, 개체 등 얼마든지 넣을 수 있다.
// 그래서 맵을 탐색하면서 어떠한 것이든 (예를 들어 배열 등) 탐색을 하면서 찾을 수 있도록 설계해보면 좋다.

// 여기서는 임시로 프로토타입을 만들어서 나중에 클래스로 구현할 것이다.
var GridBoardEngine = function() {
	this.board = null;	// 클래스의 핵심이 되는 보드를 저장.
	this.index = false;	// 처음 인덱스 번호를 0으로 할지 1(true)로 할지 설정. (초기값은 0, false부터 시작한다)
	this.init = 0;	// 초기값을 설정하여 이동 등 문제로 인해 아이템이 비워질 때 채우는 용도로 사용됨. (초기값 0)
	this.frameX, this.frameY;	// 보드의 가로 칸과 세로 칸의 길이를 저장 : 이를 프레임 사이즈라 한다.
	
	
	this.newClass = function(index) {
		this.index = this.convertIndexValue(index);
	}
	
	this.newBoard = function(x,y) {	// 그리드 프레임셋을 이용해 새로운 보드를 저장.
		this.setFrameSize(x,y);
		this.setGrid();
	}
	
	this.setGrid = function() {	// 새로운 보드 내 그리드라는 프레임을 세팅.
		this.board = new Array(this.frameY);
		for (var i = 0; i < this.frameY; i++) this.board[i] = new Array(this.frameX);
	}
	
	this.setFrameSize = function(fx,fy) {
		this.frameX = fx, this.frameY = fy;
	}
	
	this.setAllValues = function(val) {			// 그리드의 모든 아이템 값을 하나의 값으로 저장.
		for (var y = 0; y < this.frameY; y++) {	// (야 누가 이거 for in 쓰래 그거 쓰지마 배열 비었다고 오류 일으켜)
			for (var x = 0; x < this.frameX; x++) this.board[y][x] = val;
		}
	}
	
	this.initAllValues = function(val) {	// 그리드의 모든 아이템 값을 초기화. 그러나 아이템이 비워지면, 자동으로 이 값으로 저장.
		this.setinit(val);
		this.setAllValues(val);
	}
	
	this.getBoard = function() {	// 해당 보드 전체를 반환.
		return this.board;
	}
	
	this.getGrid = function() {	// 해당 보드 안의 각자 그리드의 Row마다 출력.
		for (var y in this.board) {
			var arr = new Array();
			for (var x in this.board[y]) arr.push(this.board[y][x]);
			console.log(arr);
		}
	}
	
	this.printGrid = function() {	// 콘솔.테이블을 이용해 보드의 전체를 출력
		console.table(this.board);
	}
	
	/// 필요한 시스템 함수들의 확장판::
	
	// 프레임 사이즈 변경 : 모두 성공하면 true를, 실패하면 false를 반환한다.
	
	// 보드의 프레임 사이즈를 반환. (단 이 함수는 고정값을 사용한다. 그래서 사용시 0으로 시작하면 -1로 계산해주어야 한다)
	this.getFrameSize = function() {
		return this.getIndex(this.frameX, this.frameY);
	}
	
	this.changeFrameSize = function(fx,fy) {	// 보드의 프레임 사이즈를 (x,y)로 변경하여 보드의 그리드를 리셋
		this.setFrameSize(fx,fy);
		
		// 나중에 보드 확대 또는 축소에 의해 보드의 그리드가 바뀌어야 하니, 새로운 함수를 예고하게 될 것임.
	}
	
	this.increaseFrameSize = function() {	// 보드의 프레임 사이즈를 확대(+) : 가로나 세로 각각 계산함
		var fs = this.getFrameSize();
		this.changeFrameSize(fs.x, fs.y);
		
		// 여기서 더하는 것 자체가 양수여야 한다는 조건을 덧붙이면 된다.
	}
	
	this.reduceFrameSize = function() {	// 보드의 프레임 사이즈를 축소(-) : 가로나 세로 각각 계산함
		var fs = this.getFrameSize();
		this.changeFrameSize(fs.x, fs.y);
		
		// 여기서 뺄셈하는 것이 0이나 음수가 되면 이에 따른 처리가 필요함.
	}
	
	this.scaleUpFrameSize = function() {	// 보드의 프레임 사이즈를 비율에 맞게 확대
		var fs = this.getFrameSize();
		var rx = fs.x, ry = fs.y;
		this.changeFrameSize(rx, ry);
		
		// 곱하는 것이 0이 아닌 양수여야 한다는 조건이 필요
	}
	
	this.scaleDownFrameSize = function() {	// 보드의 프레임 사이즈를 비율에 맞게 축소
		var fs = this.getFrameSize();
		var rx = fs.x, ry = fs.y;
		this.changeFrameSize(rx, ry);
		
		// 여기서 비율에 0을 곱하면 안되니, 비율을 따로 구하는 식으로 해서 계산되어야 할 것이다.
	}
	
	// 프레임 사이즈 변경에 따른 보드의 그리드 변경
	// 이 역할은 확장되면 아이템도 확장이 되는지, 그대로 하면서 확장이 되는지 판단하고,
	// 축소되면 아이템이 축소되거나 사이즈 축소에 의해 영역 밖으로 나간 아이템을 어떻게 처리할지
	// 이 함수가 대규모적(?)으로 처리될 것이다.
	// 이 함수 작동에 성공하여 확장 또는 축소가 완료되면 true를, 실패하거나 오류가 나면 false를 반환한다.
	this.resetGrid = function() {
		return true || false;
	}
	
	
	
	
	
	
	
	// 여기에 있는 아래의 함수들은 모두 for에서 y 안에 x 방식으로 탐색한다는 것이다.
	// 여기서 조건이란 판별함수를 파라미터에 대입되어 계산한다는 것이다.
	// 조건의 형식은 다음과 같다. i => i < 0
	
	// 할일 : 아래의 복잡한 것을 간결하게 만들고 기능을 완성시킬 것, 또한 게임을 위해 제대로 작동하기 위한 함수를 개발할 것!
	
	this.indexOf = function(val) {		// 이 값을 찾아 맨 처음의 값의 인덱스를 반환 (없으면 undefine)
		var arr = new Array();
		
		for (var y in this.board) {
			for (var x in this.board[y]) {
				if (this.getIndexItem(x,y) == val) arr.push(this.getIndexItem(x,y));
			}
		}
		
		return arr;
	}
	
	this.findIndex = function(val) {	// 이 값을 찾아 맨 처음의 인덱스를 반환. (없으면 undefine)
		for (var y in this.board) {
			for (var x in this.board[y]) {
				if (this.getIndexItem(x,y) == val) return this.setIndex(x,y);
			}
		}
		return undefined;
	}
	
	this.findAll = function(val) {	// 주어진 값을 모두 찾아 배열로 반환. (없으면 undefine)
		var arr = new Array();
		
		for (var y in this.board) {
			for (var x in this.board[y]) {
				if (this.getIndexItem(x,y) == val) arr.push(this.getIndexItem(x,y));
			}
		}
		if (arr.length == 0) return undefined;
		
		return arr;
	}
	
	this.findIndexAll = function(val) {	// 주어진 값을 모두 찾아 인덱스 배열로 반환. (없으면 undefine)
		var arr = new Array();
		
		for (var y in this.board) {
			for (var x in this.board[y]) {
				if (this.getIndexItem(x,y) == val) arr.push(this.setIndex(x,y));
			}
		}
		if (arr.length == 0) return undefined;
		
		return arr;
	}
	
	this.find = function(opt) {	// 주어진 조건을 만족하는 값의 첫번째 요소의 값을 반환. (없으면 undefine)
		for (var y in this.board) {
			for (var x in this.board[y]) {
				if (opt(this.getIndexItem(x,y))) return this.getIndexItem(x,y);
			}
		}
		return undefined;
	}
	
	// 함수형 자바스크립트 프로그래밍을 참고했으며, 보드 내 각각의 아이템들이 오브젝트일때, 이 오브젝트 내 키 값의 조건을 필터링하여 배열로 반환.
	this.filter = function(opt) {	// 주어진 조건을 만족하는 값을 가진 모든 값을 배열로 반환.
		var arr = [];
		for (var y in this.board) {
			for (var x in this.board[y]) {
				if (opt(this.getIndexItem(x,y))) arr.push(this.getIndexItem(x,y));
			}
		}
		return arr;
	}
	/* // filter 함수의 올바른 사용방법: (보드 내에 있는 조건을 만족하는 모든 값을 )
	var temp_users = [];
	for (var i = 0, len = users.length; i < len; i++) {
		if (users[i].age < 30) temp_users.push(users[i]);
	}
	console.log(temp_users.length); // 4
	
	// 위의 코드를 아래처럼 해야 작동가능하다.
	
	var users_under_30 = filter(function(user) { return user.age < 30 });
	console.log(users_under_30.length);
	*/
	
	// 인덱스가 밖으로 나가는지 검사해야 됨
	
	// 기준 좌표의 변동에 따른 인덱스 값을 계산하여 그 위치의 데이터를 반환함.
	this.getItem = function(x,y) {	// 해당 좌표값의 값을 반환.
		if (!this.validIndex(x,y)) {
			console.error('Index Invalid: The index of Item Can\'t set outside.');
			return;
		}
		return this.getIndexItem(this.convertIndex(x), this.convertIndex(y));
	}
	
	this.setItem = function(x,y,val) { // 해당 좌표값의 값을 저장.
		if (!this.validIndex(x,y)) {
			console.error('Index Invalid: The index of Item Can\'t set outside.');
			return;
		}
		this.setIndexItem(this.convertIndex(x), this.convertIndex(y), val);
	}
	
	// (x,y)의 값을 obj, {x,y} 형태로 반환함.
	this.getIndex = function(x,y) {	// (x,y) 값을 obj 형태로 변환하여 반환.
		return {x: parseInt(x), y: parseInt(y)};	// obj를 저장하면, 문자열로 저장되는 것을 해결함.
	}
	
	this.setIndex = function(ix,iy) {	// 0을 기준으로 인덱스({x,y}) 위치를 계산하여 인덱스의 위치를 obj로 반환.
//		return {x: this.convertIndex(ix), y: this.convertIndex(iy)};
		
		return this.getIndex(this.convertIndex(ix), this.convertIndex(iy));
	}
	
	// 기준 인덱스 값에 따라 인덱스 값을 계산할지 판단하여 각기 인덱스를 반환.
	// 시작 인덱스가 1로 시작할 때, 1을 빼서 반환하고, 0으로 시작한다면, 그대로 반환된다.
	this.convertIndex = function(index) {
		if (this.index) index--;
		return index;
	}
	
	/// 0부터 계산하는 함수나 for 또는 for in을 사용하는 함수를 위한 함수.
	// 시작 인덱스는 0을 기준으로 반환.
	this.getIndexItem = function(x,y) {
		return this.board[y][x];
	}
	
	// 이 인덱스는 시작좌표값에 영향을 받지않고 저장함.
	this.setIndexItem = function(x,y,val) {
		this.board[y][x] = val;
	}
	
	// 이 자리에 초기값 기준으로 비어있는지 확인 (초기값과 일치하면 비어있는 것으로 간주)
	this.isEmptyItem = function(x,y) {
		return this.getItem(x,y) == this.getInit();	// 초기값과 일치하면 true를 반환
	}
	
	// 절대좌표를 기준으로 비어있는지 확인 (초기값과 일치하면 비어있는 것으로 간주)
	this.isEmptyIndexItem = function(x,y) {
		return this.getIndexItem(x,y) == this.getInit();	// 초기값과 일치하면 true를 반환
	}
	
	
	/// 아이템 탐색: 선형탐색, 주변 탐색 등, 경로 탐색은 단지 갈 수 있는 수를 찾기 위함이다.
	// 탐색은 방법이 다른데, 이는 다음과 같다
	// 선형 탐색은 공통적으로 A부터 B까지 탐색을 하는 것이다. 다만 반환값은 방법별로 다르다. 체스에서 퀸이나 룩, 비숍임.
	// 주변 탐색은 A 주위에 둘러싸여있는 아이템을 탐색하는 것이다. 탐색방식마다 다르다. 체스에서 폰이나 킹이다.
	// 특정 탐색이란 특정 좌표로 탐색을 하는 것이다. 나이트 같은 말이 갈 수 있는 곳을 탐색하는 것이다.
	// 경로 탐색이란 특정 값 안에서 A에서 B까지 최적 또는 최선의 경로를 탐색하여 중간점 좌표를 순서대로 배열하여 반환한다.
	
	//{
	
	/// 이 방법은 사용용도로 체스를 둘 때, 말이나 퀸이 배치할 수 있는 좌표 전체를 반환하는 것이고,
	// (이 방법에서 파라미터는 null이나 특정값을 제외할 경우라면 값을 사용하고, 값들이면 배열을 사용)
	
	/// 저 방법은 오목 등에 사용되며, A부터 5(특정 값)칸 이내 탐색하여 A와 같은 값인지 반환하는 것이고,
	
	/// 그 방법은
	
	/// 거 방법은 보드의 바깥이나 특정값에 도달하면, 그 이전 좌표를 반환한다. (슬래시맵 만들기에 쓰인다)
	
	/// 요 방법은 특정값에 도달하면 그 위치의 좌표를 반환한다.
	
	//}
	
	//{
	
	// 선형 탐색 - 가로, 세로, 대각선으로 방향에 따라 탐색한다.
	// 가로, 세로라면 체스의 룩이 갈 수 있는 것이고, 대각선은 비숍, 모든 선형은 퀸이 갈 수 있는 지대를 탐색할 때 쓰인다.
	
	
	// 주변 탐색 - 주변 X나 +, ㅁ처럼 주위를 탐색하는 것이다.
	// 이 위치에서 주변에 무엇이 있는지, 체스에서 폰이나 킹이 갈 수 있는 지대를 탐색하는 것이다.
	
	
	// 특정 탐색 - 체스의 나이트처럼 특정 좌표(주변이나 선형 내에 들어오지 않는 그런 것)를 탐색하는 것이다.
	// 가로, 세로, 대각선 안으로 들어오지 않는 지대에 주로 사용된다.
	
	
	// 경로 탐색 - 계획할 도시게임에 도입될 것으로, 보드 내 도로를 1이라 했을 때,
	// 1이라는 값 위에서 차가 A에서 B까지 갈 수 있는 경로를 탐색하는 것이다. 경로탐색에서 최적 경로와 최선 경로가 있다.
	
	
	//
	
	//}
	
	
	
	
	
	
	/// 아주아주 기본적으로 작동해줄 라이브러리들
	
	// 스택에 저장될 것은 사실 무언가가 변경되었다라고 [예시 -> draw(0,0,3,3) : 선 그리기로 (0,0)부터 (3,3)까지 그린다]
	// 저장을 할 예정이였으나, 이를 위해서는 문자열에 있어서 draw라는 값을 읽거나 괄호 안의 숫자들을
	// 차례대로 분석하여 undo 기능을 충실히 할 계획이였다. 그러나 현재 상황에서는 2.0에 기약할 것이다.
	
	// 여기서 모든 것들과 확장형의 모든것들의 시작. 인덱스는 move, copy등이 처리해줄 것이다.
	// 그 전에 redo 스택에 추가되는 조건은 무언가를 변경하기 전에 실행하여 변경되는 것이다.
	// 그리고 redo는 또 다른 스택을 하나 만들어서, undo를 실행하기 전에 저장한다.
	// redo 스택이 비워져야 할 때가 있는데, 이때는 undo의 스택이 새로 저장되었을 때임.
	// 이로써 설명을 요약하면, redo 스택과 undo 스택이 필요함을 알 수 있다.
	
	// 스택 세이브 메소드가 실행되는 조건은 다음과 같다.
	// 아이템을 새로 배치할 때(단, setItem의 경우 draw 함수에 의해 문제가 생김),
	// draw 함수를 실행했을 때(는 얼만큼의 칸을 그릴 지 계산하여 stackPass에 저장한다),
	// 복사, 이동 등 이 함수를 실행했을 때(마찬가지로 stackPass에 저장한다),
	
	// 아래에 있는 스택 함수들은 스택에 필요한 모든 것을 제대로 작동해줄 것이다.
	// 이처럼 스택은 데이터 타입에 상관없이 저장될 것이며, 용도는 맵의 변동에 대해 저장될 것이다. 
	
	// 스택에 있어서 이 것을 표준으로 정립한다.
	// {x: x, y: y, bd: beforeData, ad:afterData}
	
	// Stack : undoStack, redoStack
	this.undoStack = [];
	this.redoStack = [];
	
	// 스택에 있어서 copy()를 여러번 사용하는 draw()같은 함수를 위한 것으로,
	// 이 문제에 대해 해결하는 방법은: copy()를 통해 스택에 여러번 저장한다.
	// 그전에 스택에 저장할 값으로 몇번을 건너뛰는지 횟수를 저장한다.
	// 그리고 copy()가 여러번 실행되고, 저장이 완료되면 마지막에 몇번 건너뛰었는지 또 저장한다.
	// 이는 undo와 redo를 위한 것임.
	
	
	// 스택에 있어서 새로운 무언가를 실행하기 전에 반드시 저장해야한다.
	this.undoStackSave = function(data) {	// undo Stack push
		this.undoStack.push(data);
	}
	
	this.redoStackSave = function(data) {	// redo Stack push
		this.redoStack.push(data);
	}
	
	// redo나 undo의 데이터 값이 호출되면 데이터를 반환하고, 기록에서 지워진다.
	this.undoStackCall = function() {	// undo Stack pop
		return this.undoStack.pop();
	}
	
	this.redoStackCall = function() {	// redo Stack pop
		return this.redoStack.pop();
	}
	
	// redo나 undo의 데이터값을 호출하되, 지워지지 않는다.
	this.undoStackRead = function() {	// undo Stack peek
		return this.undoStack[this.undoStack.length - 1];
	}
	
	this.redoStackRead = function() {	// redo Stack peek
		return this.redoStack[this.redoStack.length - 1];
	}
	
	// 스택을 초기화한다. (예를 들어 새로 만들기를 시행했을 경우)
	this.undoStackClear = function() {	// undo Stack Clear
		this.undoStack = [];
	}
	
	this.redoStackClear = function() {	// redo Stack Clear
		this.redoStack = [];
	}
	
	// 
	this.undoStackDelete = function(p) {	// undo Stack Data Delete for like Draw function
		
	}
	
	this.redoStackDelete = function(p) {	// 그리기 함수를 지원하는 것으로, p값만큼 패스하는 것이다.
		
	}
	
	// 스택이 비어있는지 반환.
	this.undoStackIsEmpty = function() {	// undo Stack isEmpty
		return this.undoStack.length == 0;
	}
	
	this.redoStackIsEmpty = function() {	// redo Stack isEmpty
		return this.redoStack.length == 0;
	}
	
	// 기록을 출력하는 함수.
	this.undoStackPrint = function() {	// undo Stack Print
		console.table(this.undoStack.toString());
	}
	
	this.redoStackPrint = function() {	// redo Stack Print
		console.table(this.redoStack.toString());
	}
	
	// 
	this.saveHistory = function() {	// undo와 redo를 정상적으로 실행하기 위해 사용하는 것
		
	}
	
	this.removeHistory = function() {	// 기록이 갱신되면 (undo하고 새로 실행하면, redo 리스트는 삭제되고 갱신됨)
		
		
	}
	
	// 스택의 건너뛰는 칸수를 p라 하고, 이 값을 받아 건너뛴 만큼의 데이터들을 옮기는 작업을 한다.
	
	
	// 스택에 저장되는 데이터의 양식에 맞게 변환해준다.
	this.stackDataConversion = function(x,y,bd,ad) {
		return {x: x, y: y, bd: before, ad: data};	// bd는 이전의 데이터, ad는 새로운 데이터
	}
	
	// 새로운 값 추가나 실행 등이 발생하면 작동되는 함수. redo, undo의 기능이 실행되기 위해서는 반드시 필요함.(상대좌표)
	this.save = function(x,y,data) {
		var before = this.getItem(x,y);
		var index = this.setIndex(x,y);
		
		var stackData = this.stackDataConversion(index.x, index.y, before, data);
		
		this.undoStackSave(stackData);
		
		if (!this.redoStackIsEmpty()) {	// 만약 redo 스택에 값이 하나라도 있다면 초기화시킨다.
			this.redoStackClear();
		}
	}
	
	// 스택상 데이터 복원 방법은 데이터를 읽고 이 값을 바탕으로 복원하는 것이다.
	// 
	// undo: x,y값을 읽고 그 위치에 bd데이터를 복원시키는 것이다. 여기서 절대 copy나 set을 쓰면 안된다.
	// redo: x,y값을 읽고 그 위치에 ad데이터를 복원시킴. 마찬가지로 이걸 쓰면 안된다.
	// undo를 복원시킬 때 redo 저장이 실행되어야 하며, redo를 실행하면 undo를 저장해야 한다.
	// 그러나 뒤로 가서 새로운 스택이 저장되면, redo 스택이 비워진다.
	// 보드가 새로 만들거나 새로 시작하거나 리셋 실행시, 모든 스택이 삭제된다.
	// 
	// 여기서 서녕그리기 같은경우, 패스데이터라 하는 것을 사용하여 
	// 사각형(네모)그리기나 선형그리기 함수 사용할 경우, 이 데이터를 읽어서 몇만큼 처리하는지 파악하고
	// 특정함수가 처리하여 그리는 만큼의 스택을 통째로 이전할 수 있게 할 것이다.
	// 스택이므로 하나씩 데이터를 읽고 redo->undo 또는 undo->redo로 이전시킨다. 물론 패스데이터도 저장된다.
	
	
	// 이동이나 복사, 값 변경 등을 했다면, 이를 되돌림. (Ctrl+Z)
	this.undo = function() {
		var data = this.undoStackCall();
		
		if (data.bd == 'pass') {	// 만약 bd 값이 pass이면, 패스 처리가 발생한다. 여기서 ad만큼 패스하는 것이다.
			data.ad;
		}
		this.board[data.x][data.y] = data.bd;
		this.redoStackSave(data);
	}
	
	// 실행 취소한 것을 다시 되돌림. (Ctrl+Y)
	this.redo = function() {				// 이 함수는 ad를 bd로 저장하게 하면 됨. ad하고 bd자리는 안바뀜.
		var data = this.redoStackCall();
		
	}
	
	// (ax,ay)의 값을 (bx,by)로 이동. (Ctrl+X, Ctrl+V)
	this.move = function(ax,ay,bx,by) {
		var tmp = this.getItem(ax,ay);
		var init = this.getInit();
		
		this.setItem(bx,by,tmp);
		this.setItem(ax,ay,init);
	}
	
	this.copy = function(ax,ay,bx,by) {		// (ax,ay)의 값을 (bx,by)로 복사. (Ctrl+C, Ctrl+V)
		var tmp = this.getItem(ax,ay);
		this.setItem(bx,by,tmp);
	}
	
	
	/// 이동에 있어서 여러가지 게임을 고려하여 라이브러리를 만듬
	
	// 여기서 A부터 B까지의 위치에 선형 계산 및 유효성 검사 후, 그린다. 그리고 선에 맞지 않다면, 에러 출력한다
	this.draw = function(ax,ay,bx,by) {	
		if (this.validHorizontal(ax,ay,bx,by)) {this.drawLinearHorizon(ax,bx,ay); return;}
		if (this.validVertical(ax,ay,bx,by)) {this.drawLinearVertical(ay,by,ax); return;}
		if (this.validDiagonal(ax,ay,bx,by)) {this.drawLinearDiagonal(ax,ay,bx,by); return;}
		console.error("draw() Method: It's not matched Linear Type");
	}
	
	// 선형유효검사는 draw가 해결.
	this.drawLinearHorizon = function(ax,bx,aby) {
		if (this.validHorizontal(ax,aby,bx,aby)) {
			var x = this.setMinAndMax(ax,bx);
			for (var fx = x.min; fx <= x.max; fx++) this.copy(x.min,aby,fx,aby);
		}
		else console.error("drawLinearHorizon() Method: invalid Horizon Linear");
	}
	// 이 에러콘솔이 보기 싫으면 따로 만드는 방법도 있다.
	
	this.drawLinearVertical = function(ay,by,abx) {
		if (this.validVertical(abx,ay,abx,by)) {
			var y = this.setMinAndMax(ay,by);
			for (var fy = y.min; fy <= y.max; fy++) this.copy(abx,y.min,abx,fy);
		}
		else console.error("drawLinearVertical() Method: invalid Vertical Linear");
	}
	
	// 대각선에 맞지 않는 좌표가 계산되는 버그 수정 필요.
	this.drawLinearDiagonal = function(ax,ay,bx,by) {
		if (this.validDiagonal(ax,ay,bx,by)) {
			var x = this.setMinAndMax(ax,bx);
			var y = this.setMinAndMax(ay,by);

			if (this.validIndex(ax,ay) && this.validIndex(bx,by)) {
				if (this.validDiagonalType(x,y,ax,ay)) this.drawLinearDiagonalDown(x,y,ax,ay);
				else this.drawLinearDiagonalUp(x,y,ax,ay);
			}
			else console.error("drawLinearDiagonal() Method: invalid index");
		}
		else console.error("drawLinearDiagonal() Method: invalid Diagonal Linear");
	}
	
	this.drawLinearDiagonalDown = function(x,y,ax,ay) {	// draw -> \
		for (var i = 0; i <= x.max - x.min; i++) this.copy(ax,ay,(x.min+i),(y.max-i));
	}
	
	this.drawLinearDiagonalUp = function(x,y,ax,ay) {	// draw -> /
		for (var i = 0; i <= x.max - x.min; i++) this.copy(ax,ay,(x.min+i),(y.min+i));
	}
	
	this.validDiagonalType = function(x,y,ax,ay) {
		return ((x.min == ax)||(y.min == ay))&&!((x.min == ax)&&(y.min == ay));
	}
	
	// A부터 B까지 사각형으로 A의 값으로 채움.
	this.drawRect = function(ax,ay,bx,by) {
		var x = this.setMinAndMax(ax,bx);
		var y = this.setMinAndMax(ay,by);
		
		for (var fx = x.min; fx <= x.max; fx++) {
			for (var fy = y.min; fy <= y.max; fy++) {
				this.copy(ax,ay,fx,fy);
			}
		}
	}
	
	// 최댓값과 최솟값을 계산하여 반환.
	this.setMinAndMax = function(a,b) {
		var min = a;
		var max = b;
		if (a > b) {
			var tmp = min;
			min = max;
			max = tmp;
		}
		return {min: min, max: max};
	}
	
	
	// (Ax,Ay)를 [가로, 세로, 대각선]형으로 방향(dir)쪽 몇 칸만큼(block) 이동.
	// 방향 [1:N, 2:W, 3:S, 4:E, 5:NW, 6:SW, 7:SE, 8:NE]
	// 몇 칸만큼이란, OXOOOO를 오른쪽으로 2칸 이동 시 -> OOOXOO가 되는 것이다.
	this.moveLinear = function(dir,interval,ax,ay) {
		var dc = interval;
		switch(dir) {
			case 1:	// N
				this.moveVertical(ax,ay,ax,ax-dc);
				break;
			case 2:	// W
				this.moveHorizontal(ax,ay,ax-dc,ay);
				break;
			case 3:	// S
				this.moveVertical(ax,ay,ax,ay+dc);
				break;
			case 4:	// E
				this.moveHorizontal(ax,ay,ax+dc,ay);
				break;
			case 5:	// NW
				this.moveDiagonal(ax,ay,ax-dc,ay-dc);
				break;
			case 6:	// SW
				this.moveDiagonal(ax,ay,ax-dc,ay+dc);
				break;
			case 7:	// SE
				this.moveDiagonal(ax,ay,ax+dc,ay+dc);
				break;
			case 8:	// NE
				this.moveDiagonal(ax,ay,ax+dc,ay-dc);
				break;
			default:
				console.error('moveLinear() Method: invalid dir');
				return false;
		}
		return true;	// default가 작동되지 않는 한, true를 반환
	}
	
	this.moveHorizontal = function(ax,ay,bx,by) {
		if (this.validHorizontal(ax,ay,bx,by)) this.move(ax,ay,bx,by);
	}
	
	this.moveVertical = function(ax,ay,bx,by) {
		if (this.validVertical(ax,ay,bx,by)) this.move(ax,ay,bx,by);
	}
	
	this.moveDiagonal = function(ax,ay,bx,by) {
		if (this.validVertical) this.move(ax,ay,bx,by);
	}
	
	// A부터 B까지 이 지점이 가로인지 세로인지 아니면 대각선인지 체크하여 반환 (가로: 1, 세로: 2, 대각선: 3, 해당없음: 0)
	this.derivationLineType = function(ax,ay,bx,by) {
		if (this.validHorizontal(ax,ay,bx,by)) return 1;
		if (this.validVertical(ax,ay,bx,by)) return 2;
		if (this.validDiagonal(ax,ay,bx,by)) return 3;
		return 0;
	}
	
	// Horizontal, vertical, diagonal 유효성 검사. (A부터 B까지)
	this.validHorizontal = function(ax,ay,bx,by) {	// 가로 : 수평선 유효 검사.
		var pX = Math.abs(ax - bx);	// 가로는 양수가 되고
		var pY = Math.abs(ay - by);	// 세로는 0이여야 함
		return (pY == 0) && (pX > 0);
	}
	
	this.validVertical = function(ax,ay,bx,by) {	// 세로 : 수직선 유효 검사.
		var pX = Math.abs(ax - bx);	// 가로는 0이고
		var pY = Math.abs(ay - by);	// 세로는 양수여야 함
		return (pX == 0) && (pY > 0);
	}
	
	this.validDiagonal = function(ax,ay,bx,by) {	// 대각선 유효 검사.
		var pX = Math.abs(ax - bx);	// 뺀 값의 절댓값 가로와
		var pY = Math.abs(bx - by);	// 뺀 값의 절댓값 세로의 값이
		return (pX == pY) && (pX > 0) && (pY > 0);	// 같아야 대각선으로 볼 수 있다.
	}
	
	
	/// 이 함수들은 이것을 위한 것이다.
	/*
	이것이란, 아래처럼 만드는 것이다. 이렇게 만들어준다.
	1 2 3 4		7 6 5 4
	2 3 4 5		6 5 4 3
	3 4 5 6		5 4 3 2
	4 5 6 7		4 3 2 1
	*/
	
	// 그전에 작동방식은 방향을 파악한 후, 방향에 따라서 숫자를 증가시켜 저장한다.
	// --->|
	//     |
	//     V
	// 그다음, 대각선으로 (4,1)이면 (1,4)까지 그린다.
	// 그러면 이것을 위한 함수 작동방식은 끝난다.
	
	// type= 1: NW->SE, 2: SE->NW, 3: NE->SW, 4: SW->NE
	
	// 가로나 세로의 길이가 일치하지 않을 가능성에 염두에 두고 만든다.
	// 타입은 진행방향을, add는 증가 수 만큼 값을 증가시켜 아이템에 삽입.
	// 아마 이걸 만들어야 할 것이다. 시작값을 파라미터에. 그러나 시작값은 1로 정했다!
	// 빗금 맵을 만듦 (시작은 1,2,3,4)
	this.setSlashMap = this.setSolidusMap = function(type,add) {
		switch(type) {
			case 1:
				this.setSlashMapObjFirst(add);
				break;
			case 2:
				this.setSlashMapObjSecond(add);
				break;
			case 3:
				this.setSlashMapObjThird(add);
				break;
			case 4:
				this.setSlashMapObjFourth(add);
				break;
			default:
				console.error('setSlashMap() Method: There is no such type');
		}
	}
	
	this.setSlashMapObjFirst = function(add) {	// ++
		var startIndex = 0;	
		var endIndex = this.getFrameSize();	// 절댓값 기준임
		
		var data = 1;
		
		for (var x = startIndex; x < endIndex.x; x++) {
			this.setIndexItem(x,0,data);
			this.drawSlash(x,0);
			data+=add;
		}
		for (var y = startIndex+1; y < endIndex.y; y++) {
			this.setIndexItem(endIndex.x-1,y,data);
			this.drawSlash(endIndex.x-1,y);
			data+=add;
		}
	}
	
	this.setSlashMapObjSecond = function(add) {	// --
		var startIndex = 0;
		var endIndex = this.getFrameSize();
		
		var data = 1;
		
		for (var y = endIndex.y-1; y > startIndex; y--) {
			this.setIndexItem(endIndex.x-1,y,data);
			this.drawSlash(endIndex.x-1,y);
			data+=add;
		}
		for (var x = endIndex.x-1; x >= startIndex; x--) {
			this.setIndexItem(x,startIndex,data);
			this.drawSlash(x,startIndex);
			data+=add;
		}
	}
	
	this.setSlashMapObjThird = function(add) {	// -+
		var startIndex = 0;
		var endIndex = this.getFrameSize();
		
		var data = 1;
		
		for (var x = endIndex.x-1; x > startIndex; x--) {
			this.setIndexItem(x,startIndex,data);
			this.drawSlash(x,startIndex);
			data+=add;
		}
		for (var y = startIndex; y < endIndex.y; y++) {
			this.setIndexItem(startIndex,y,data);
			this.drawSlash(startIndex,y);
			data+=add;
		}
	}
	
	this.setSlashMapObjFourth = function(add) {	// +-
		var startIndex = 0;
		var endIndex = this.getFrameSize();
		
		var data = 1;
		
		for (var y = endIndex.y-1; y > startIndex; y--) {
			this.setIndexItem(startIndex,y,data);
			this.drawSlash(startIndex,y);
			data+=add;
		}
		for (var x = startIndex; x < endIndex.x; x++) {
			this.setIndexItem(x,startIndex,data);
			this.drawSlash(x,startIndex);
			data+=add;
		}
	}
	
	// 슬래시 맵에 대각선을 그릴 차례인데, 그리기 전에 정사각형이면 편하겠지만,
	// 직사각형일 경우도 대비해야 한다.
	// 직사각형일 경우 대각선을 그리는 방법은 있는데 
	// 일단 시작점 부분은 (0,5)이면 (5,0)까지 그리는 방식으로 간다.
	// 만약 높이가 더 긴 직사각형이라면,
	// 또는 만약 너비가 더 긴 직사각형이라면,
	
	// 아니면 길이가 작은 변을 정사각형의 한변처럼 대각선을 그리면, 긴 쪽으로 다시 대각선을 그린다.
	
	// 현재 위치(A)에서 대각선 대칭 반대 위치 좌표(B)까지 대각선을 그린다. 이건 슬래시맵 전용이다
	this.drawSlash = function(ax,ay,d) {
		var bx, by;
		
		// 여기서 알아서 좌표값을 계산한다. 계산방법은 간단하다 선형탐색하면서 끝에 도달하면 그 값을 반환한다.
		
		
		// d는 진행방향이다. 2가지가 있음
		
		// 그리고, 얻은 좌표값으로 대각선을 그린다.
		this.drawLinearDiagonal(ax,ay,bx,by);
	}
	
	
	/// 아주 중요한 핵심인데, 간단한 함수이면서도 중요한 라이브러리 모음
	
	// 시작 인덱스와 프레임 크기를 확인하고 인덱스 유효여부를 반환. (밖으로 나가는지 검사)
	this.validIndex = function(ix,iy) {
		var startIndex = this.getStartIndex();
		var endIndex = this.getFrameSize();
		var x = ix - startIndex, y = iy - startIndex;	// 파라미터의 좌표값이 시작인덱스에 따라 변환하여 계산
		
		if (((0 > x) || (0 > y)) || ((endIndex.x-1 < x) || (endIndex.y-1 < y))) return false;
		else return true;
	}
	
	// 인덱스가 true나 1 이상이면 true, false나 0이면 false 반환.
	this.convertIndexValue = function(index) {
		return (((parseInt(index) == 0) || index == false) ? false : true);
	}
	
	// 저장된 시작 인덱스 값을 확인하고 반환.
	this.getStartIndex = function() {
		return (this.index ? 1 : 0);
	}
	
	// 1을 0으로 변환하거나, 0을 1로 변환하고 싶을 때.
	this.setStartIndex = function(index) {
		this.index = this.convertIndexValue(index);
	}
	
	// 시작 인덱스 값을 자동으로 0 -> 1이나 1 -> 0로 바꾸고 싶을 때.
	this.autosetStartIndex = function() {
		this.index = !this.index;
	}
	
	// 아이템이 이동 등의 이유로 비워질 때, 대비해서 빈 아이템을 채울 초기값을 저장.
	this.setinit = function(val) {
		this.init = val;
	}
	
	// 초기값을 소환. 비워짐이 발생하면 초기값을 불러와 채우는 용도임.
	this.getInit = function() {
		return this.init;
	}
	
	
	/// 에러 처리에 대한 함수
	// 함수 내 에러에 대해 에러 콘솔을 하나로 관리한다.
	this.methodError = function(method,script) {	// method Name, error script
		console.error(method+"() method: "+script);
	}
	
	// 위의 모든 에러콘솔을 하나로 관리하기 위한 시스템 - 따로 테이블을 만들 것임. 이에 준수해 함수를 만들거임
	this.errorCode = function(num) {	// int형 타입이지만, 
		var script = "";
		switch(num) {
			case 0:
				script = "A";
				break;
			case 1:
				script = "A";
				break;
			case 2:
				script = "A";
				break;
			case 3:
				script = "A";
				break;
			case 4:
				script = "A";
				break;
				
			default:
				script = "A";
				break;
		}
		return script;
	}
	
}



