import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react';
import './Trends.css';

const trendsData = [
    {
        id: 1,
        role: "AI & Machine Learning Engineer",
        growth: "+40%",
        salary: "$150k",
        demand: "Very High",
        description: "Building the future of intelligence."
    },
    {
        id: 2,
        role: "Data Scientist",
        growth: "+35%",
        salary: "$130k",
        demand: "High",
        description: "Turning data into actionable insights."
    },
    {
        id: 3,
        role: "Cybersecurity Analyst",
        growth: "+32%",
        salary: "$115k",
        demand: "Critical",
        description: "Protecting digital assets from threats."
    },
    {
        id: 4,
        role: "Renewable Energy Tech",
        growth: "+28%",
        salary: "$85k",
        demand: "Rising",
        description: "Powering a sustainable future."
    }
];

const Trends = () => {
    return (
        <div className="trends-container container">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="trends-header"
            >
                <h1>Career Trends 2026</h1>
                <p>Explore the fastest growing jobs and salary insights.</p>
            </motion.div>

            <div className="stats-row">
                <StatCard icon={<TrendingUp />} label="Top Growth Sector" value="Tech & AI" color="blue" />
                <StatCard icon={<DollarSign />} label="Highest Avg Salary" value="$145k" color="green" />
                <StatCard icon={<Users />} label="Most Remote Jobs" value="Software Dev" color="purple" />
            </div>

            <div className="trends-grid">
                {trendsData.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="trend-card glass-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="trend-role">
                            <div className="role-icon"><Briefcase size={20} /></div>
                            <h3>{item.role}</h3>
                        </div>

                        <p className="trend-desc">{item.description}</p>

                        <div className="trend-metrics">
                            <div className="metric">
                                <span className="metric-label">Growth</span>
                                <span className="metric-value positive">{item.growth}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Avg Salary</span>
                                <span className="metric-value">{item.salary}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Demand</span>
                                <span className="metric-value">{item.demand}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <motion.div
        className={`stat-card glass-card ${color}`}
        whileHover={{ y: -5 }}
    >
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
        </div>
    </motion.div>
);

export default Trends;
