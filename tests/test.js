let chai = require('chai');
chai.should();

describe('Content module acos-jsparsons-custom', () => {

  function hasEachOnce(selectors) {
    selectors.forEach(selector => {
      let matches = $$(selector);
      matches.should.have.lengthOf(1);
      matches[0].isDisplayed().should.be.true;
    });
  }

  function dragAndDropNear(source, target, x, y) {
    var loc = source.getLocation();
    let sourceX = parseInt(loc.x + 5);
    let sourceY = parseInt(loc.y + 5);
    loc = target.getLocation();
    let targetX = parseInt(loc.x + x) - sourceX;
    let targetY = parseInt(loc.y + y) - sourceY;
    browser.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'mouse' },
      actions: [
        { type: 'pointerMove', duration: 0, x: sourceX, y: sourceY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 10 },
        { type: 'pointerMove', duration: 100, origin: 'pointer', x: targetX, y: targetY },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
  }

  describe('URL exercises', () => {

    it('should load an exercise from GET parameters', () => {
      browser.url('/html/jsparsons/jsparsons-python-custom/exercise?name=Test&initial=if%20True%3A%5Cn%20%20print(%5C%22Test%20succeeded%5C%22)&instructions=Instructions%20for%20test%20exercise&description=Testing%20exercise');
      hasEachOnce(['#ul-sortableTrash', '#sortable']);
    });

    it('first line added to solution should yield incorrect', () => {
      dragAndDropNear($('#sortablecodeline0'), $('#ul-sortable'), 10, 10);
      $('#feedbackLink').click();
      browser.acceptAlert();
      $('#ul-sortable').getAttribute('class').should.contain('incorrect');
    });

    it('second line added to solution should yield correct', () => {
      dragAndDropNear($('#sortablecodeline1'), $('#ul-sortable'), 60, 40);
      $('#feedbackLink').click();
      let cls = $('#ul-sortable').getAttribute('class');
      cls.should.not.contain('incorrect');
      cls.should.contain('correct');
    });

  });

  describe('JSON exercises', () => {
    var server = null;

    it('should start test service to provide json', () => {
      let http = require('http');
      //var fs = require('fs');
      let jsonContent = JSON.stringify({
        "name": "Name",
        "description": "Example Description",
        "instructions": "Example instructions",
        "initial": "print(\"Hello\")\nprint(\"World\")"
      });
      function handleRequest(request, response){ //always return example.json
          response.end(jsonContent);
      }
      server = http.createServer((request, response) => {
        response.end(jsonContent);
      });
      server.listen(8011, () => {});
    });

    it('should load an exercise from JSON resource', () => {
      browser.url('/html/jsparsons/jsparsons-python-custom/exercise?url=http://localhost:8011/example.json');
      hasEachOnce(['#ul-sortableTrash', '#sortable']);
    });

    it('first line added to solution should yield incorrect', () => {
      dragAndDropNear($('#sortablecodeline0'), $('#ul-sortable'), 10, 10);
      $('#feedbackLink').click();
      browser.acceptAlert();
      $('#ul-sortable').getAttribute('class').should.contain('incorrect');
    });

    it('second line added to solution should yield correct', () => {
      dragAndDropNear($('#sortablecodeline1'), $('#ul-sortable'), 10, 40);
      $('#feedbackLink').click();
      let cls = $('#ul-sortable').getAttribute('class');
      cls.should.not.contain('incorrect');
      cls.should.contain('correct');
    });

    it('should stop test service', () => {
      server.close();
    });

  });

});
