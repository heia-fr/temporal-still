import Lexer from '../../js/models/analysers/Lexer';

function TestData(nbTok, expr) {
   this.nbTokens = nbTok;
   this.expression = expr;
}

var dataList = [new TestData(0, ""), new TestData(1, "a"),
      new TestData(3, "(b)"), new TestData(3, "c+d"), new TestData(5, "t.u+w"),
      new TestData(5, " e  . f+ g"), new TestData(5, "h  *iW k "),
      new TestData(10, "(([](<>(l)"), new TestData(7, "(! (m)))"),
      new TestData(6, "aannbb .!o + p"), new TestData(11, "q+q+q+q+q+q"),
      new TestData(22, "r    = 10110  1 0 1 0 0101/101001")];

function testLexicalAnalyzer(expr) {
   var lex = new Lexer(expr);
   var count = 0;
   var str = "";
   lex.goToNextToken();
   var t = lex.getCurrentToken();
   while (t !== "") {
      count++;
      str += t;
      lex.goToNextToken();
      t = lex.getCurrentToken();
   }
   return new TestData(count, str);
}

function trimSpaces(s) {
   var res = "";
   var space = /\s/;
   for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (!space.test(c)) res += c;
   }
   return res;
}

describe('testing Lexer constructor', function() {
   dataList.forEach(function(data) {
      var res = testLexicalAnalyzer(data.expression);
      var exprWithoutSpaces = trimSpaces(data.expression);
      it("'" + res.expression + "' should be '" + exprWithoutSpaces + "'",
                  function() {
                     expect(res.expression).toBe(exprWithoutSpaces);
                     expect(res.nbTokens).toBe(data.nbTokens);
                  });
   });
});
