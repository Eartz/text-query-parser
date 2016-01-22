
function Parser(str) {
    this.index = 0;
    this.string = str;
    this.state = {
      quotes: false, // is true if the current Index is in a string enclosed by double quotes
      flagsPos: false, // is true if the next characters are positives flags
      flagsNeg: false // is false if the next characters are negatives flags
    };

    this.output = {
      substrings: [],
      flags: {
        positives: [],
        negatives: []
      }
    };
    this.currentSubString = "";
}
Parser.prototype.next = function() {
  // returns the next character or false
  return getWholeChar(this.string, (this.index + 1)) || false;
};
Parser.prototype.cur = function() {
  // returns the character at the current index or false if it doesn't exist
  return getWholeChar(this.string, this.index) || false;
};
Parser.prototype.prev = function() {
  // returns the previous character or false if it doesn't exist
  return getWholeChar(this.string, (this.index - 1)) || false;
};
Parser.prototype.saveCurrentSubString = function() {
  if (this.currentSubString !== "") {
    this.output.substrings.push(this.currentSubString);
    this.currentSubString = "";
  }
};
Parser.prototype.parse = function() {
  var s = "";
  var cont = true;
  var f = {
    "+": "flagsPos",
    "-": "flagsNeg"
  };
  var nf = {
    "+": "flagsNeg",
    "-": "flagsPos"
  };
  while (this.index < this.string.length) {
    s = this.cur();
    
    if (!!this.state.quotes) {
      // entre quotes
      if (s === '"' && this.prev() !== '\\') {
        // fin de full chaine
        this.saveCurrentSubString();
        this.state.quotes = false;
      } else {
        this.currentSubString += s;
      }
    } else {
      // pas entre quotes
      if ((s === "+" || s === "-") && (this.prev() === " " || this.prev() === false)) {
        // debut flags d'un certain signe,
        this.state[f[s]] = true;
        // fin flags de l'autre signe
        this.state[nf[s]] = false;
        // enregistrer substring
        this.saveCurrentSubString();
      } else if (s === " ") {
        // fin substring, ou fin flags
        if (!! this.state.flagsNeg) {
          this.state.flagsNeg = false;
        }
        if (!! this.state.flagsPos) {
          this.state.flagsPos = false;
        }
        this.saveCurrentSubString();
      } else {
        // caractere normal
        if (!!this.state.flagsNeg) {
          // ajouter aux flags
          this.output.flags.negatives.push(s);
        } else if (!!this.state.flagsPos) {
          this.output.flags.positives.push(s);
        } else if (s === '"' && this.prev() !== '\\') {
          this.saveCurrentSubString();
          // debut full string
          this.state.quotes = true;
        } else if (s !== '\\') {
          this.currentSubString += s;
        }
      }
    }
    this.index++;
  }
  
  this.saveCurrentSubString();
  return this.output;
};

  
// taken from https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/charAt
function getWholeChar(str, i) {
  var code = str.charCodeAt(i);     
 
  if (isNaN(code)) {
    return ''; // la position n'a pas pu être trouvée
  }
  if (code < 0xD800 || code > 0xDFFF) {
    return str.charAt(i);
  }
  if (0xD800 <= code && code <= 0xDBFF) { 
    if (str.length <= (i+1))  {
      throw 'le demi-codet supérieur n\'est pas suivi par un demi-codet inférieur';
    }
    var next = str.charCodeAt(i+1);
      if (0xDC00 > next || next > 0xDFFF) {
        throw 'le demi-codet supérieur n\'est pas suivi par un demi-codet inférieur';
      }
      return str.charAt(i)+str.charAt(i+1);
  }
  if (i === 0) {
    throw 'le demi-codet inférieur n\'est pas précédé d\'un demi-codet supérieur';
  }
  var prev = str.charCodeAt(i-1);
  
  if (0xD800 > prev || prev > 0xDBFF) { 
    throw 'le demi-codet inférieur n\'est pas précédé d\'un demi-codet supérieur';
  }
  return false; 
}
  
module.exports = function(str) {
  return new Parser(str).parse();
};