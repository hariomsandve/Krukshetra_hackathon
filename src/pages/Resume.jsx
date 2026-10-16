import { motion } from 'framer-motion';
import { FileText, Award, FolderPlus, ChevronsUp } from 'lucide-react';
import './Resume.css';

const Resume = () => {
    return (
        <div className="resume-container container">
            <motion.div
                className="resume-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Resume & Portfolio Builder</h1>
                <p>Stand out with a professional profile that employers love.</p>
            </motion.div>

            <div className="guidance-grid">
                <GuidanceCard
                    icon={<FileText size={40} />}
                    title="Resume Essentials"
                    tips={[
                        "Keep it to 1 page if you have < 5 years experience.",
                        "Use action verbs (Built, Led, Designed).",
                        "Quantify achievements (e.g., 'Increased efficiency by 20%').",
                        "Tailor keywords to the job description."
                    ]}
                    color="blue"
                />

                <GuidanceCard
                    icon={<FolderPlus size={40} />}
                    title="Portfolio Must-Haves"
                    tips={[
                        "Showcase 3-5 of your best projects.",
                        "Include case studies: Problem -> Solution -> Result.",
                        "Make it visually appealing and easy to navigate.",
                        "Link to live demos and GitHub/Behance."
                    ]}
                    color="purple"
                />

                <GuidanceCard
                    icon={<Award size={40} />}
                    title="Soft Skills & Bio"
                    tips={[
                        "Write a concise summary (2-3 sentences).",
                        "Highlight teamwork and communication.",
                        "Mention relevant hobbies or volunteering.",
                        "Keep the tone professional yet authentic."
                    ]}
                    color="green"
                />
            </div>

            <motion.div
                className="tips-section glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="tips-header">
                    <ChevronsUp className="tips-icon" />
                    <h3>Pro Tip of the Day</h3>
                </div>
                <p>
                    "Recruiters spend an average of 6 seconds on a resume. Make your headings clear
                    and your contact info easy to find!"
                </p>
            </motion.div>
        </div>
    );
};

const GuidanceCard = ({ icon, title, tips, color }) => (
    <motion.div
        className={`guidance-card glass-card ${color}`}
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
    >
        <div className="card-icon-wrapper">{icon}</div>
        <h3>{title}</h3>
        <ul className="tips-list">
            {tips.map((tip, i) => (
                <li key={i}>{tip}</li>
            ))}
        </ul>
    </motion.div>
);

export default Resume;
