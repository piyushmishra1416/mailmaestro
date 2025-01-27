import { FC } from 'react';
import { FaRobot, FaBrain, FaShieldAlt, FaArrowDown } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

interface LandingSectionProps {
  onGetStarted: () => void;
}

const LandingSection: FC<LandingSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8 space-x-4">
            <MdEmail className="text-5xl sm:text-6xl md:text-7xl text-blue-500" />
            <FaBrain className="text-5xl sm:text-6xl md:text-7xl text-purple-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Smart Email Classifier
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed px-4">
            Automatically organize your emails using AI. Our tool leverages Google's Gemini AI 
            to categorize your emails intelligently, helping you maintain a cleaner inbox.
          </p>
          
          {/* Get Started Button */}
          <button
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl 
            hover:opacity-90 transition-all duration-200 flex items-center gap-2 mx-auto font-medium 
            shadow-lg hover:shadow-blue-500/20"
          >
            Get Started
            <FaArrowDown className="group-hover:translate-y-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="text-3xl lg:text-4xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg lg:text-xl font-semibold mb-3 text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <FaRobot />,
    title: "AI-Powered Classification",
    description: "Advanced email categorization using Google's cutting-edge Gemini AI technology"
  },
  {
    icon: <FaBrain />,
    title: "Smart Organization",
    description: "Intelligent sorting and categorization of emails based on content and context"
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure & Private",
    description: "Your data is processed securely with industry-standard encryption and privacy measures"
  }
];

export default LandingSection; 