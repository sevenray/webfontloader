var DomHelperTest = TestCase('DomHelperTest');

DomHelperTest.prototype.setUp = function() {
  this.domHelper_ = new webfont.DomHelper(document, new webfont.UserAgent("name", "version",
      "engine", "engineVersion", "platform", true));
};

DomHelperTest.prototype.testCreateElementNoAttr = function() {
  var span = this.domHelper_.createElement('span');

  assertNotNull(span);
};

DomHelperTest.prototype.testCreateElementEmptyAttrInnerHtml = function() {
  var span = this.domHelper_.createElement('span', {}, 'moo');

  assertNotNull(span);
  assertEquals('moo', span.innerHTML);
};

DomHelperTest.prototype.testCreateElementWithAttrInnerHtml = function() {
  var span = this.domHelper_.createElement('span', { style: 'font-size: 42px',
      id: 'mySpan' }, 'hello');

  assertNotNull(span);
  assertEquals('mySpan', span.id);
  assertEquals('42px', span.style.fontSize);
  assertEquals('hello', span.innerHTML);
};

DomHelperTest.prototype.testCreateElementWithPrototypeAugments = function(){

  Object.prototype.extrastuff = function(){ return 'I am a troublemaker.'; }

  var span = this.domHelper_.createElement('span', { id : "augmented" });
  var spanPar = this.domHelper_.createElement('div', { id : "augmentedpar" });
  spanPar.appendChild(span);


  assertNotNull(span);
  assertSame(false,!!span.getAttribute('extrastuff'));
  assertSame(-1,spanPar.innerHTML.indexOf('extrastuff'))


  delete Object.prototype.extrastuff;
  span = spanPar = undefined;
}

DomHelperTest.prototype.testCreateCssLink = function() {
  var cssLink = this.domHelper_.createCssLink('http://moo/somecss.css');

  assertEquals('stylesheet', cssLink.rel);
  assertEquals('http://moo/somecss.css', cssLink.href);
};

DomHelperTest.prototype.testCreateScriptSrc = function() {
  var cssLink = this.domHelper_.createScriptSrc('http://moo/somescript.js');

  assertEquals('http://moo/somescript.js', cssLink.src);
};

DomHelperTest.prototype.testAppendAndRemoveClassNames = function() {
  var div = this.domHelper_.createElement('div');

  this.domHelper_.appendClassName(div, 'moo');
  assertEquals('moo', div.className);
  this.domHelper_.appendClassName(div, 'meuh');
  assertEquals('moo meuh', div.className);
  this.domHelper_.removeClassName(div, 'moo');
  assertEquals('meuh', div.className);

  this.domHelper_.removeClassName(div, 'meuh');
  this.domHelper_.appendClassName(div, 'spaces and	tabs');

  this.domHelper_.removeClassName(div, 'and');
  assertEquals('spaces tabs', div.className);
  this.domHelper_.removeClassName(div, 'spaces');
  this.domHelper_.removeClassName(div, 'tabs');
  assertEquals('', div.className);

};
