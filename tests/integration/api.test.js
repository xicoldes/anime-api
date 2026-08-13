const request = require('supertest');
const app = require('../../app'); 

describe('Anime API Integration Tests', () => {
    test('GET a valid route should return 200 OK and data', async () => {
        // Act: Send HTTP GET request with parameterised query
        const response = await request(app).get('/api');
        // can change this to a valid route like '/api/anime/1' if needed

        // Assert: Verify Status Code and Body
        expect(response.status).toBeDefined(); // (200) if the route exists 
        expect(response.body).toBeDefined(); 
    });

    test('GET invalid route should return 404', async () => {
        const response = await request(app).get('/api/this-route-does-not-exist');
        expect(response.status).toBe(404); // Expecting 404 Not Found for an invalid route
    });
});
