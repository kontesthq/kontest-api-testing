import http from 'k6/http';
import { check, sleep } from 'k6';

import { KONTEST_API_BASE_URL } from './config.js';

const totalUsers = 1000;  // Total number of users to simulate

// target will be average number of users
export const options = {
    stages: [
        { duration: '5m', target: totalUsers }, // ramp up
        { duration: '8h', target: totalUsers }, // stable
        { duration: '5m', target: 0 }, // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(99)<500'], // 99% of requests must complete below 500ms
    },
};

export default () => {
    
    const url = `${KONTEST_API_BASE_URL}/kontests?page=1&per_page=1000`; // URL of the API

    // Sending the GET request
    const res = http.get(url);

    // Log the response status and body if the status is not 200
    if (res.status !== 200) {
        console.log(`Response status: ${res.status}`);
        console.log(`Response body: ${res.body}`);
    }

    // Checking if the response status is 200
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500, // Check for response time
    });

    sleep(1);  // Wait for 1 second before the next iteration
};