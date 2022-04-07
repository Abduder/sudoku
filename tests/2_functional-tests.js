const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function(){
  this.timeout(5000);
  suite("solve tests ",()=>{
    test("valid puzzle string",(done)=>{
      chai
      .request(server)
      .post("/api/solve")
      .send({puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        done();
      });
    });
    test("missing puzzle string",(done)=>{
      chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err,res)=>{
        assert.equal(res.status,200);
        assert.deepEqual(res.body,{ error: 'Required field missing' });
        done();
      })

    })
    test("invalid character",(done)=>{
      chai
      .request(server)
      .post("/api/solve")
      .send({puzzle:"..a..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
      .end((err,res)=>{
        assert.equal(res.status,200);
        assert.deepEqual(res.body,{ error: 'Invalid characters in puzzle' });
        done();
      })
    })
    test("incorrect length",(done)=>{
      chai
      .request(server)
      .post("/api/solve")
      .send({puzzle:"...5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
      .end((err,res)=>{
        assert.equal(res.status,200);
        assert.deepEqual(res.body,{ error: 'Expected puzzle to be 81 characters long' });
        done();
      });
    });
    test("invalid puzzle string",(done)=>{
      chai
      .request(server)
      .post("/api/solve")
      .send({puzzle:"9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
    });
  })
  suite('check test',()=>{
    test("check with all field",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate:"A1", value:"7"})
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        done();
      })
    })
    test("one palcement conflict",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate:"A1", value:"2"})
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isNotTrue(res.body.valid);
        assert.equal(res.body.conflict.length,1);
        done();
      })
    })
    test("multi placement conflict",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate:"A1", value:"9"})
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isNotTrue(res.body.valid);
        assert.equal(res.body.conflict.length,2);
        done();
      })
    })
    test("all placement conflict",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate:"A1", 
        value:"5"
        })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isNotTrue(res.body.valid);
        assert.equal(res.body.conflict.length,3);
        done();
      })
    })
    test("missing required field",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate:"A1"
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.deepEqual(res.body,{ error: 'Required field(s) missing' });
        done();
      })
    })
  })
  test("invalid character",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:"..A..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate:"A1", 
        value:"5"
        })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
        done();
      })
    })
    test("incorrect length",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate:"A1", 
        value:"5"
        })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.deepEqual(res.body,{ error: 'Expected puzzle to be 81 characters long' })
        done();
      })
    })
    test("invalid coordinate",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate:"l1", 
        value:"5"
        })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid coordinate'})
        done();
      })
    })
    test("invalid value",(done)=>{
      chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate:"A1", 
        value:"e"
        })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
    });

});

