# PostgreSQL Configuration Calculator

A modern, responsive web application that generates optimized PostgreSQL configuration settings based on your server specifications.

## 🌟 Features

- **Smart Configuration Generation**: Calculates optimal PostgreSQL settings based on CPU, RAM, and expected concurrency
- **Workload-Specific Optimization**: Tailored settings for different workload types (OLTP, Analytics, Web, Mixed)
- **Comprehensive Parameters**: Covers all major PostgreSQL configuration categories
- **CSV Export**: Download your configuration as a CSV file for easy implementation
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Client-Side Processing**: No server required, works entirely in your browser

## 🚀 Live Demo

Visit the live application: [PostgreSQL Config Calculator](https://yourusername.github.io/postgresql-config-calculator/)

## 📋 Configuration Parameters

The calculator generates settings for:

### Connection Settings
- `max_connections`
- `superuser_reserved_connections`

### Memory Settings
- `shared_buffers`
- `work_mem`
- `maintenance_work_mem`
- `effective_cache_size`

### WAL and Checkpoint
- `wal_buffers`
- `max_wal_size`
- `min_wal_size`
- `checkpoint_completion_target`
- `checkpoint_timeout`

### Parallelism
- `max_worker_processes`
- `max_parallel_workers`
- `max_parallel_workers_per_gather`

### Autovacuum
- `autovacuum`
- `autovacuum_max_workers`
- `autovacuum_naptime`
- `autovacuum_vacuum_cost_limit`

## 🔧 How to Use

1. **Enter Server Specifications**:
   - vCPU Count
   - RAM in GB
   - Expected Concurrency
   - Workload Type

2. **Generate Configuration**:
   - Click "Calculate Configuration"
   - Review the optimized settings

3. **Export Settings**:
   - Click "Download as CSV"
   - Import into your PostgreSQL configuration

## 🎨 Workload Types

- **Mixed (OLTP + Analytics)**: Balanced settings for diverse workloads
- **OLTP (High Concurrency)**: Optimized for transactional workloads
- **Analytics (Data Warehouse)**: Tuned for complex queries and reporting
- **Web Application**: Ideal for web-based applications

## 🛠️ Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with Flexbox/Grid
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **No Dependencies**: Pure vanilla JavaScript

## 📱 Responsive Design

The calculator works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This tool provides recommendations based on general best practices. Always test configurations in a development environment before applying to production systems. Consider consulting with a PostgreSQL DBA for mission-critical deployments.

## 🙏 Acknowledgments

- PostgreSQL community for documentation and best practices
- Font Awesome for icons
- Google Fonts for typography