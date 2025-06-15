document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const vcpu = document.getElementById('vcpu').value;
    const ram = document.getElementById('ram').value;
    const concurrency = document.getElementById('concurrency').value;

    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vcpu, ram, concurrency }),
        });

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = 'Error calculating configuration.';
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Recommended PostgreSQL Configuration</h2>
        <p><strong>max_connections:</strong> ${data.max_connections}</p>
        <p><strong>shared_buffers:</strong> ${data.shared_buffers} MB</p>
        <p><strong>work_mem:</strong> ${data.work_mem} MB</p>
        <p><strong>effective_cache_size:</strong> ${data.effective_cache_size} MB</p>
        <p><strong>maintenance_work_mem:</strong> ${data.maintenance_work_mem} MB</p>
    `;
    resultsDiv.classList.add('show');
}