var wins = [ 	(1 << 0 | 1 << 1 | 1 << 2), 
				(1 << 3 | 1 << 4 | 1 << 5), 
				(1 << 6 | 1 << 7 | 1 << 8),
				(1 << 0 | 1 << 3 | 1 << 6),
				(1 << 1 | 1 << 4 | 1 << 7),
				(1 << 2 | 1 << 5 | 1 << 8),
				(1 << 0 | 1 << 4 | 1 << 8),
				(1 << 2 | 1 << 4 | 1 << 6)
			];

var player = [ 0x0, 0x0 ]; 
var turn = 0;
var locked = false;

function resetboard() {
	if( window.location.protocol == "file:" && navigator.userAgent.toLowerCase().search('msie') != -1)
		alert("Der Internet Explorer kann diese Webseite nicht korrekt darstellen, wenn sie lokal aufgerufen wird. Laden Sie sie bitte vom Webserver oder verwenden Sie einen anderen Browser.");


	var cells = document.getElementById('ttt-table').getElementsByTagName('td');
	var caption = document.getElementById('ttt-table').getElementsByTagName('caption')[0];
	
	var i; var len = cells.length;
	for ( i = 0; i < len; i++ ) {
		cells[i].innerHTML = "";
	}
	caption.innerHTML = "Spieler 1 ist dran (<span class='red'>X</span>)";
	player = [ 0x0, 0x0 ]; 
	turn = 0;
	locked = false;
}

function tableClick(idx) {
	if ( ((player[0] | player[1]) & (1 << idx)) != 0 || locked ) return; // Feld schon voll
	if (locked) return; // Spiel beendet
	
	var cells = document.getElementById('ttt-table').getElementsByTagName('td');
	var caption = document.getElementById('ttt-table').getElementsByTagName('caption')[0];
	if (turn == 0){
		cells[idx].innerHTML = "<span class='red'>X</span>";
		caption.innerHTML = "Spieler 2 ist dran (<span class='blue'>O</span>)";
	} else { 		
		cells[idx].innerHTML = "<span class='blue'>O</span>";
		caption.innerHTML = "Spieler 1 ist dran (<span class='red'>X</span>)";
	}
	player[turn] |= (1 << idx); // Bit in Feld platzieren
	
	if (checkWin()) {
		caption.innerHTML = "<span class='" + (turn==0?"red":"blue") + "'>Spieler " + (turn==0?"1":"2") + "</span> hat gewonnen!";
		return;
	}
	if (checkFull()) {
		caption.innerHTML = "Spiel unentschieden.";
		return;
	}
	
	turn ^= 1;
	if (turn == 1) computerMove();
}

function computerMove() {
	var i;
	for (i = 0; i < 9; i++) {
		if ( (~(player[0] | player[1])) & (1 << i)) // zelle belegt?
		{
			tableClick(i);
			break;
		}
	}
}

function checkWin() {
	var i;
	for ( i=0; i < wins.length; i++ ) {
		if ( (player[turn] & wins[i]) == wins[i] ) {
			// Der aktuelle Spieler (turn) hat gewonnen
			locked = true;
			return true;
		}
	}
	return false;
}

function checkFull() {
	if ((player[0] | player[1]) == 0x1FF)  { // alles voll
		locked = true;
		return true;
	}
	
	return false;
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

resetboard();