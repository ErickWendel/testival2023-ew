# Testival

## Problem

    - wanna do a e2e test on a stateful API
    - Start installing jest
    - install supertest for e2e
    - install portfinder
    - show code
        - show it working

## Solution

    - Use Node test runner
    - In the recent supertest versions it spins up servers in different ports
        - https://github.com/ladjs/supertest#example
    - use fetch for e2e
    - use .listen(0) (thanks to Yoni for the tip)
        # show docs https://nodejs.org/dist/latest-v20.x/docs/api/net.html#serverlistenport-host-backlog-callback

    - show it working
