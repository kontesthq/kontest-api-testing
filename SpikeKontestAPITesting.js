import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 2000 }, // ramp up
        { duration: '2m', target: 2000 }, // stable
        { duration: '30s', target: 0 }, // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(99)<500'], // 99% of requests must complete below 500ms
    },
};

export default () => {
    const url = 'http://localhost:5151/api/v1/get_kontests?page=1&limit=1000'; // URL of the API

    // Sending the GET request
    const res = http.get(url);

    // Checking if the response status is 200
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500, // Check for response time
    });

    sleep(1);  // Wait for 1 second before the next iteration
};