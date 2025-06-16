const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Enhanced endpoint to calculate PostgreSQL configuration
app.post('/calculate', (req, res) => {
    const { vcpu, ram, concurrency, workload = 'mixed' } = req.body;

    // Convert inputs to numbers
    const vCPU = parseInt(vcpu);
    const ramGB = parseFloat(ram);
    const ramMB = ramGB * 1024;
    const expectedConcurrency = parseInt(concurrency);

    // Get workload-specific multipliers
    const workloadMultiplier = getWorkloadMultiplier(workload);

    try {
        // Connection settings
        const max_connections = Math.min(expectedConcurrency + 20, 1000);
        const superuser_reserved_connections = Math.max(3, Math.min(10, Math.floor(max_connections * 0.1)));
        
        // Memory settings
        const shared_buffers = Math.floor(ramMB * workloadMultiplier.shared_buffers);
        const work_mem = Math.max(4, Math.floor((ramMB * 0.25) / max_connections));
        const maintenance_work_mem = Math.floor(ramMB * workloadMultiplier.maintenance_work_mem);
        const effective_cache_size = Math.floor(ramMB * 0.75);
        
        // WAL and Checkpoint settings
        const wal_buffers = Math.min(64, Math.max(16, Math.floor(shared_buffers / 32)));
        const max_wal_size = Math.max(1024, Math.floor(ramMB * 0.1));
        const min_wal_size = Math.floor(max_wal_size / 4);
        const checkpoint_completion_target = workloadMultiplier.checkpoint_target;
        const checkpoint_timeout = workloadMultiplier.checkpoint_timeout;
        
        // Parallelism settings
        const max_worker_processes = Math.min(vCPU * 2, 64);
        const max_parallel_workers = Math.min(vCPU, max_worker_processes);
        const max_parallel_workers_per_gather = Math.min(Math.floor(vCPU / 2), 16);
        
        // Autovacuum settings
        const autovacuum = workloadMultiplier.autovacuum;
        const autovacuum_max_workers = Math.min(10, Math.max(3, Math.floor(vCPU / 2)));
        const autovacuum_naptime = workloadMultiplier.autovacuum_naptime;
        const autovacuum_vacuum_cost_limit = workloadMultiplier.vacuum_cost_limit;

        // Return the calculated configuration
        res.json({
            // Connection
            max_connections,
            superuser_reserved_connections,
            
            // Memory
            shared_buffers: `${shared_buffers}MB`,
            work_mem: `${work_mem}MB`,
            maintenance_work_mem: `${maintenance_work_mem}MB`,
            effective_cache_size: `${effective_cache_size}MB`,
            
            // WAL and Checkpoint
            wal_buffers: `${wal_buffers}MB`,
            max_wal_size: `${max_wal_size}MB`,
            min_wal_size: `${min_wal_size}MB`,
            checkpoint_completion_target,
            checkpoint_timeout,
            
            // Parallelism
            max_worker_processes,
            max_parallel_workers,
            max_parallel_workers_per_gather,
            
            // Autovacuum
            autovacuum,
            autovacuum_max_workers,
            autovacuum_naptime,
            autovacuum_vacuum_cost_limit
        });
    } catch (error) {
        res.status(500).json({ error: 'Error calculating configuration' });
    }
});

// Helper function to get workload-specific multipliers
function getWorkloadMultiplier(workload) {
    const multipliers = {
        mixed: {
            shared_buffers: 0.25,
            maintenance_work_mem: 0.05,
            checkpoint_target: 0.9,
            checkpoint_timeout: '15min',
            autovacuum: 'on',
            autovacuum_naptime: '1min',
            vacuum_cost_limit: 200
        },
        oltp: {
            shared_buffers: 0.2,
            maintenance_work_mem: 0.03,
            checkpoint_target: 0.7,
            checkpoint_timeout: '5min',
            autovacuum: 'on',
            autovacuum_naptime: '30s',
            vacuum_cost_limit: 400
        },
        analytics: {
            shared_buffers: 0.4,
            maintenance_work_mem: 0.1,
            checkpoint_target: 0.9,
            checkpoint_timeout: '30min',
            autovacuum: 'off',
            autovacuum_naptime: '10min',
            vacuum_cost_limit: 2000
        },
        web: {
            shared_buffers: 0.25,
            maintenance_work_mem: 0.04,
            checkpoint_target: 0.8,
            checkpoint_timeout: '10min',
            autovacuum: 'on',
            autovacuum_naptime: '1min',
            vacuum_cost_limit: 300
        }
    };
    
    return multipliers[workload] || multipliers.mixed;
}

// Start the server
app.listen(port, () => {
    console.log(`PostgreSQL Config Calculator running at http://localhost:${port}`);
});