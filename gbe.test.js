
/*
// TEST ZONE
var gbe = new GridBoardEngine();
gbe.newClass(1);	// 0이나 1만 저장되는데, true나 false도 가능하도록 숫자 변환이 필요하다.
gbe.newBoard(5,6);
//gbe.setAllValues(79);
gbe.initAllValues(79);

// 테스트 완료 : 기본 함수 작동 확인.
gbe.setItem(2,3,5);
console.log(gbe.getItem(2,3));

//console.log(gbe.getBoard());
//gbe.getGrid();
gbe.printGrid();

gbe.setStartIndex(0);
console.log(gbe.index);

gbe.setItem(2,3,6);
console.log(gbe.getItem(2,3));

//console.log(gbe.getBoard());
//gbe.getGrid();
gbe.printGrid();
// 얜 주석 처리 안한 이유는 없으면 허전해서
*/

/*
// 이동, 복사 테스트 => 정상적 작동 확인 완료
gbe.copy(2,3,0,0);
gbe.printGrid();

gbe.move(0,0,3,3);	// 여기서 한정된 보드 밖으로 나가면 에러를 일으켜야 함.
gbe.printGrid();
*/

/*
// 인덱스 밖으로 나가는 오류를 처리 검사 완료.
gbe.setItem(0,1,1);
gbe.drawLinearDiagonal(0,1,0,-1);
gbe.drawLinearDiagonal(0,1,5,6);
gbe.printGrid();
*/

/*
// 대각선 유효 검사 완료
gbe.setItem(1,1,3);
gbe.printGrid();

gbe.drawLinearDiagonal(1,1,2,5);
gbe.printGrid();
*/

/*
// 슬래시 정상작동 확인 완료
gbe.setStartIndex(0);
*/

/*
gbe.setSlashMap(1,3);	// NW->SE 방향으로 1씩 증가시켜 슬래시 맵을 만든다
gbe.printGrid();
gbe.setSlashMap(2,1);	// NW->SE 방향으로 1씩 증가시켜 슬래시 맵을 만든다
gbe.printGrid();
gbe.setSlashMap(3,1);	// NW->SE 방향으로 1씩 증가시켜 슬래시 맵을 만든다
gbe.printGrid();
gbe.setSlashMap(4,1);	// NW->SE 방향으로 1씩 증가시켜 슬래시 맵을 만든다
gbe.printGrid();
*/

/*
console.clear();
console.count();
console.debug();
console.trace('Stack OK! Stack successfuly Active!');
console.warn('Stack can Have MAX: 1,800 turns, you have don\'t go over MAX.');
console.log("success Active a GridBoardEngine.js! You can use a Engine System.");
console.warn("Then, you have don't touching Board Memory and Board System!");
*/

/* // 테스트 완료
gbe.setStartIndex(true);
console.log('Index : '+gbe.getStartIndex());
gbe.setStartIndex(0);
console.log('Index : '+gbe.getStartIndex());

console.log(gbe.convertIndexValue(0));
console.log(gbe.convertIndexValue(1));
console.log(gbe.convertIndexValue(3));
console.log(gbe.convertIndexValue(-1));
console.log(gbe.convertIndexValue(true));
console.log(gbe.convertIndexValue(false));


console.log(gbe.indexOf(5));
console.log(gbe.findIndex(6));
console.log(gbe.findAll(79));
console.log(gbe.findIndexAll(79));

console.log(gbe.validIndex(1,1));
console.log(gbe.validIndex(0,0));

//gbe.setStartIndex(1);
gbe.autosetStartIndex();

console.log(gbe.validIndex(1,1));
console.log(gbe.validIndex(0,0));

console.log('validDiagonalType');
//console.log(gbe.validDiagonalType(x,y,ax,ay));
console.log(gbe.validDiagonalType({min:1,max:3},{min:1,max:3},1,3));
console.log(gbe.validDiagonalType({min:1,max:3},{min:1,max:3},1,1));

console.log(gbe.filter(function(item) { return item < 8 }));
console.log(gbe.find(function(item) { return item < 8 }));
*/










