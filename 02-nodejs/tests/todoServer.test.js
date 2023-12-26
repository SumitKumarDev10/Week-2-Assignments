const https = require('https'); // Use 'https' instead of 'http'
const { v4: uuidv4 } = require('uuid');
const server = require('../todoServer');
const port = 3000;
const baseUrl = `http://localhost:3001/`;

describe('Todo API', () => {
  let createdTodoId;
  let globalServer;

  beforeAll((done) => {
    if (globalServer) {
      globalServer.close(() => {
        globalServer = server.listen(port, done);
      });
    } else {
      globalServer = server.listen(port, done);
    }
  });

  afterAll((done) => {
    globalServer.close(() => {
      done();
    });
  });

  const todo = {
    title: 'New Todo',
    description: 'A new todo item',
  };

  test('should create a new todo item', (done) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(`${baseUrl}/todos`, options, (res) => {
      expect(res.statusCode).toBe(201);
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        expect(response.id).toBeTruthy();
        createdTodoId = response.id;
        done();
      });
    });

    req.write(JSON.stringify(todo));
    req.end();
  });

  // Other test cases...

  // Ensure that the server is closed after all tests
  afterAll((done) => {
    globalServer.close(done);
  });
});
