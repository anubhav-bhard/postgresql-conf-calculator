const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to calculate PostgreSQL configuration
app.post('/calculate', (req, res) => {
    const { vcpu, ram, concurrency } = req.body;

    // Convert RAM from GB to MB
    const ramMB = ram * 1024;

    // Calculate PostgreSQL configuration parameters
    const max_connections = Math.min(parseInt(concurrency) + 20, 1000); // Buffer of 20, cap at 1000
    const shared_buffers = Math.floor(ramMB * 0.25); // 25% of RAM
    const effective_cache_size = Math.floor(ramMB * 0.75); // 75% of RAM
    const maintenance_work_mem = Math.floor(ramMB * 0.05); // 5% of RAM
    const work_mem = Math.floor((ramMB - shared_buffers) / max_connections); // Simplified

    // Return the calculated configuration
    res.json({
        max_connections,
        shared_buffers,
        work_mem,
        effective_cache_size,
        maintenance_work_mem,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});