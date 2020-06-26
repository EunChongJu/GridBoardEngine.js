//// This is not use GridBoardEngine, Only test for Upgrade and Nice Ideas.

// TEST 1
function sayHello(a) {
	return function(b) {
		console.log(a+b);
	}
}

sayHello('Hello,')('World!');


// TEST 2
function ABC(a) {
	var ab = "AA";
	return function(b) {
		return function(c) {
			console.log(ab + a+b+c);
		}
	}
}

ABC('a')('b')('c');


// TEST 3
