import http from 'k6/http';
import { check, sleep } from 'k6';

const TIME_UNIT = 's';  // You can change this to 's' for seconds or 'm' for minutes

const totalUsers = 1000;  // Total number of users to simulate

// should be minutes instead of seconds
export const options = {
    stages: [
        { duration: `5${TIME_UNIT}`, target: totalUsers }, // ramp up to 200 VUs
        { duration: `20${TIME_UNIT}`, target: totalUsers }, // stay at 200 VUs for 20 seconds
        { duration: `5${TIME_UNIT}`, target: 0 }, // ramp down to 0 VUs
    ],
    thresholds: {
        http_req_duration: ['p(99)<4000'], // 99% of requests must complete below 4000ms
    },
};

export default () => {
    // const url = 'https://kontest-api.ayushsinghal.tech/kontests/api/v1/get_kontests?page=1&limit=10'; // URL of the API
    const url = 'http://localhost:5151/kontests?page=1&per_page=1000'; // URL of the API

    // Sending the GET request
    const res = http.get(url);

    // Log the response status and body
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