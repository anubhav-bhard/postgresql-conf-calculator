let currentConfig = null;

document.getElementById('configForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const vcpu = parseInt(document.getElementById('vcpu').value);
    const ram = parseFloat(document.getElementById('ram').value);
    const concurrency = parseInt(document.getElementById('concurrency').value);
    const workload = document.getElementById('workload').value;
    
    // Show loading
    document.getElementById('results').classList.add('show');
    document.getElementById('loading').classList.add('show');
    document.getElementById('configResults').style.display = 'none';
    
    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vcpu, ram, concurrency, workload }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        currentConfig = data;
        
        setTimeout(() => {
            displayResults(currentConfig);
        }, 1000);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').classList.remove('show');
        document.getElementById('configContent').innerHTML = '<p style="color: red;">Error calculating configuration. Please try again.</p>';
        document.getElementById('configResults').style.display = 'block';
    }
});

function displayResults(config) {
    const configGroups = [
        {
            title: 'Connection Settings',
            icon: 'fas fa-plug',
            items: [
                { name: 'max_connections', value: config.max_connections },
                { name: 'superuser_reserved_connections', value: config.superuser_reserved_connections }
            ]
        },
        {
            title: 'Memory Settings',
            icon: 'fas fa-memory',
            items: [
                { name: 'shared_buffers', value: config.shared_buffers },
                { name: 'work_mem', value: config.work_mem },
                { name: 'maintenance_work_mem', value: config.maintenance_work_mem },
                { name: 'effective_cache_size', value: config.effective_cache_size }
            ]
        },
        {
            title: 'WAL and Checkpoint',
            icon: 'fas fa-save',
            items: [
                { name: 'wal_buffers', value: config.wal_buffers },
                { name: 'max_wal_size', value: config.max_wal_size },
                { name: 'min_wal_size', value: config.min_wal_size },
                { name: 'checkpoint_completion_target', value: config.checkpoint_completion_target },
                { name: 'checkpoint_timeout', value: config.checkpoint_timeout }
            ]
        },
        {
            title: 'Parallelism',
            icon: 'fas fa-sitemap',
            items: [
                { name: 'max_worker_processes', value: config.max_worker_processes },
                { name: 'max_parallel_workers', value: config.max_parallel_workers },
                { name: 'max_parallel_workers_per_gather', value: config.max_parallel_workers_per_gather }
            ]
        },
        {
            title: 'Autovacuum',
            icon: 'fas fa-broom',
            items: [
                { name: 'autovacuum', value: config.autovacuum },
                { name: 'autovacuum_max_workers', value: config.autovacuum_max_workers },
                { name: 'autovacuum_naptime', value: config.autovacuum_naptime },
                { name: 'autovacuum_vacuum_cost_limit', value: config.autovacuum_vacuum_cost_limit }
            ]
        }
    ];
    
    let html = '';
    configGroups.forEach(group => {
        html += `
            <div class="config-group">
                <h3><i class="${group.icon}"></i> ${group.title}</h3>
                ${group.items.map(item => `
                    <div class="config-item">
                        <span class="config-name">${item.name}</span>
                        <span class="config-value">${item.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    document.getElementById('configContent').innerHTML = html;
    document.getElementById('loading').classList.remove('show');
    document.getElementById('configResults').style.display = 'block';
}

document.getElementById('downloadBtn').addEventListener('click', function() {
    if (!currentConfig) return;
    
    const csvContent = generateCSV(currentConfig);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'postgresql_config.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

function generateCSV(config) {
    let csv = 'Parameter,Value,Category\n';
    
    const categories = [
        { name: 'Connection', params: ['max_connections', 'superuser_reserved_connections'] },
        { name: 'Memory', params: ['shared_buffers', 'work_mem', 'maintenance_work_mem', 'effective_cache_size'] },
        { name: 'WAL and Checkpoint', params: ['wal_buffers', 'max_wal_size', 'min_wal_size', 'checkpoint_completion_target', 'checkpoint_timeout'] },
        { name: 'Parallelism', params: ['max_worker_processes', 'max_parallel_workers', 'max_parallel_workers_per_gather'] },
        { name: 'Autovacuum', params: ['autovacuum', 'autovacuum_max_workers', 'autovacuum_naptime', 'autovacuum_vacuum_cost_limit'] }
    ];
    
    categories.forEach(category => {
        category.params.forEach(param => {
            if (config[param] !== undefined) {
                csv += `${param},${config[param]},${category.name}\n`;
            }
        });
    });
    
    return csv;
}