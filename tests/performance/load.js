import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 20, // Simulate 20 Virtual Users
    duration: '10s', // Run the test for 10 seconds
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete under 500ms
    },
};

export default function () {
    // Make sure your frontend is running, and k6 will ping it!
    const res = http.get('http://localhost:5173'); 
    
    check(res, {
        'is status 200 OK': (r) => r.status === 200,
    });
    
    sleep(1); // Wait 1 second between requests per user
}