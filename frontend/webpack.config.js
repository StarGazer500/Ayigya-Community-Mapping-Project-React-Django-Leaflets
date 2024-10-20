const path = require('path');

module.exports = {
    // Your existing configuration...
    resolve: {
        fallback: {
            // "timers": require.resolve("timers-browserify"),
            "timers": false 
            // You can add more fallbacks here if needed
        },
    },
    // Other configurations...
};
