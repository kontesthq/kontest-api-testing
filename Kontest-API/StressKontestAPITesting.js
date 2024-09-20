import http from 'k6/http';
import { check, sleep } from 'k6';

const TIME_UNIT = 's';  // You can change this to 's' for seconds or 'm' for minutes

// should be minutes instead of seconds
export const options = {
    stages: [
        { duration: `1${TIME_UNIT}`, target: 200 }, // ramp up to 200 VUs
        { duration: `5${TIME_UNIT}`, target: 200 }, // stable at 200 VUs for 5 seconds
        { duration: `1${TIME_UNIT}`, target: 800 }, // ramp up to 800 VUs
        { duration: `5${TIME_UNIT}`, target: 800 }, // stable at 800 VUs for 5 seconds
        { duration: `1${TIME_UNIT}`, target: 1000 }, // ramp up to 1000 VUs
        { duration: `5${TIME_UNIT}`, target: 1000 }, // stable at 1000 VUs for 5 seconds
        { duration: `1${TIME_UNIT}`, target: 0 }, // ramp down to 0 VUs
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