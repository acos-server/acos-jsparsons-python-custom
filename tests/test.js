describe('acos-jsparsons-custom', function() {

	describe('URL exercises', function() {
  	it('should load and solve an exercise from GET parameters', function() {
  		return browser
  			.url('/html/jsparsons/jsparsons-python-custom/exercise?name=Test&initial=if%20True%3A%5Cn%20%20print(%5C%22Test%20succeeded%5C%22)&instructions=Instructions%20for%20test%20exercise&description=Testing%20exercise')
  			.isVisible('#ul-sortableTrash').then(function(vis) {
  				vis.should.be.equal(true);
  			})
        .isVisible('#sortable').then(function(vis) {
          vis.should.be.equal(true);
        })
        .moveToObject('#sortablecodeline0', 15,15)
        .buttonDown()
        .moveToObject('#ul-sortable', 35, 5)
        .buttonUp()
        .click('#feedbackLink')
        .alertAccept().then(function(a) {
          a.state.should.be.equal('success');
        })
        .getAttribute('#ul-sortable', 'class').then(function(classes) {
          classes.should.contain('incorrect');
        })
        .moveToObject('#sortablecodeline1', 15,15)
        .buttonDown()
        .moveToObject('#ul-sortable', 75, 25)
        .buttonUp()
        .click('#feedbackLink')
        .getAttribute('#ul-sortable', 'class').then(function(classes) {
          classes.should.contain('correct');
          classes.should.not.contain('incorrect');
        });
  	});
	});

  describe('JSON exercises', function() {
    var http = require('http');
    var fs = require('fs');
    var jsonContent = JSON.stringify({
      "name": "Name",
      "description": "Example Description",
      "instructions": "Example instructions",
      "initial": "print(\"Hello\")\n  print(\"World2)"
    });
    function handleRequest(request, response){ //always return example.json
        response.end(jsonContent);
    }
    var server = http.createServer(handleRequest);
    server.listen(8011, function(){ });

    it('should load an exercise from an external .json file ', function() {
      return browser
        .url('/html/jsparsons/jsparsons-python-custom/exercise?url=http://localhost:8011/example.json')
        .isVisible('#ul-sortableTrash').then(function(vis) {
          vis.should.be.equal(true);
        })
        .isVisible('#sortable').then(function(vis) {
          vis.should.be.equal(true);
        })
        .moveToObject('#sortablecodeline0', 15,15)
        .buttonDown()
        .moveToObject('#ul-sortable', 35, 5)
        .buttonUp()
        .click('#feedbackLink')
        .alertAccept().then(function(a) {
          a.state.should.be.equal('success');
        })
        .getAttribute('#ul-sortable', 'class').then(function(classes) {
          classes.should.contain('incorrect');
        })
        .moveToObject('#sortablecodeline1', 15,15)
        .buttonDown()
        .moveToObject('#ul-sortable', 75, 25)
        .buttonUp()
        .click('#feedbackLink')
        .getAttribute('#ul-sortable', 'class').then(function(classes) {
          classes.should.contain('correct');
          classes.should.not.contain('incorrect');
        }).then(function() {
          server.close();
        });
    });      

  });  
});