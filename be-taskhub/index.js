const express = require('express');
const app = express();

// run port
app.listen(1000, () => {
    console.log('Server đang chạy trên cổng 1000');
});