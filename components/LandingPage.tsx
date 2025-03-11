'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaLinkedin, FaTwitter, FaGithub, FaEnvelope, FaMapMarkerAlt, FaBars, FaTimes } from 'react-icons/fa';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const newsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const newsItems = [
    { title: "Breakthrough in AI-Driven Medical Diagnostics", date: "March 05, 2025" },
    { title: "Centre Researchers Win International Data Science Challenge", date: "March 06, 2025" },
    { title: "New Environmental Monitoring System Deployed in Queensland", date: "March 06, 2025" },
    { title: "AI Ethics Framework Adopted by Global Tech Leaders", date: "March 05, 2025" },
    { title: "Wildlife Conservation Project Uses Computer Vision Innovations", date: "March 03, 2025" },
    { title: "Cybersecurity Breakthrough Presented at International Conference", date: "February 28, 2025" },
    { title: "Centre Announces New Industry Partnerships", date: "February 27, 2025" },
  ];

  const stats = [
    { number: "24+", text: "Research Projects" },
    { number: "15+", text: "International Partnerships" },
    { number: "45+", text: "Affiliated Researchers" },
    { number: "12+", text: "Industry Collaborations" },
  ];

  const thematicAreas = [
    { 
      title: "Health & Medicine", 
      description: "Leveraging AI for precise diagnostics, personalized treatment plans, and healthcare optimization.", 
      icon: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    { 
      title: "Energy & Environment", 
      description: "Creating sustainable solutions through smart grid optimization and environmental monitoring systems.", 
      icon: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    { 
      title: "Cybersecurity", 
      description: "Developing advanced threat detection systems and privacy-preserving machine learning techniques.", 
      icon: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    { 
      title: "Behavioral Science", 
      description: "Understanding human behavior through data-driven insights and ethical AI interactions.", 
      icon: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    { 
      title: "Sustainable Infrastructure", 
      description: "Building smart cities with AI-powered systems for traffic, waste management, and urban planning.", 
      icon: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    { 
      title: "Smart Agriculture", 
      description: "Enhancing crop yields and reducing resource usage through precision farming and predictive analytics.", 
      icon: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
  ];

  const fundingPrograms = [
    {
      title: "Joint PhD Program",
      description:
        "Thapar Institute and University of Queensland's joint PhD program begins in 2025, supporting 5 computer science students. Students spend 3 years at Thapar, 1 year at Queensland, with joint supervision and plans to expand to other disciplines.",
      icon: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Seed Funding for Research Projects",
      description:
        "In February 2025, the Centre will call for seed funding proposals in five focus areas, supporting up to 3 years of research with TIET-UQ collaboration, funding staff, equipment, travel, data, and software.",
      icon: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Centre PhD Travel Scholarships",
      description:
        "In February 2025, the centre will offer 5 annual PhD travel scholarships for students from any branch, funding travel between Thapar and Queensland, living costs, and joint supervision.",
      icon: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Industry Collaborative Research Projects",
      description:
        "In February 2025, the Centre will invite proposals to solve applied problems with industry partners, involving TIET, UQ, and industry. Industry partners must provide matched funding or in-kind support.",
      icon: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Prashant Singh Rana",
      role: "Assistant Professor of Computer Science, TIET",
      description:
        "Dr. Rana is a leading researcher in machine learning and data science at TIET. His work focuses on developing novel ML algorithms and their applications in real-world problems.",
      image: '/ranasir.png',
    },
    {
      name: "Mr. Tathagat",
      role: "Director of PYOB and Bragfit | Founder of Tech Stockerzz",
      description: 
        "A serial entrepreneur with 8+ years of experience in digital innovation, affiliate marketing and brand building. Mentor at IEEE Student Branch and Entrepreneurship-Cell, delivered sessions at 50+ colleges and featured in 11+ news websites.",
      image: "/tathagat.png",
    },
   
  ];

  return (
    <>
      <Head>
        <title>Centre of Excellence | Data Science & Artificial Intelligence</title>
        <meta name="description" content="TIET-UQ Centre of Excellence in Data Science and AI" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style jsx global>{`
          body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Space Grotesk', sans-serif;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-white text-gray-800">
        {/* Navigation */}
       
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-sm shadow-lg py-3' : 'bg-transparent py-5'}`}>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
    {/* Logo Section */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex items-center"
    >
      <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${scrollY > 50 ? 'text-blue-900' : 'text-white'}`}>
        TIET-UQ <span className="text-blue-500">CoE</span>
      </h1>
    </motion.div>

    {/* Mobile Menu Button */}
    <div className="md:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${scrollY > 50 ? 'text-blue-900' : 'text-white'}`}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex items-center space-x-8">
      {['Home', 'About', 'People', 'Research', 'Programs', 'Contact'].map((item) => (
        <Link
          key={item}
          href={`#${item.toLowerCase()}`}
          className={`relative font-medium transition-all duration-300 group ${
            scrollY > 50 ? 'text-gray-800' : 'text-white'
          }`}
        >
          <span className="group-hover:text-blue-500">{item}</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
        </Link>
      ))}
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
        Join Us
      </button>
    </div>
  </div>

  {/* Mobile Navigation */}
  <AnimatePresence>
    {isMenuOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-100"
      >
        <div className="px-4 py-4 space-y-2">
          {['Home', 'About', 'People', 'Research', 'Programs', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-gray-800 hover:text-blue-500 transition-colors py-3 px-2 rounded-md hover:bg-gray-100 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg mt-2">
            Join Us
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</nav>

        {/* Hero Section */}
       
<section id="home" className="relative min-h-screen flex items-center justify-center py-28 md:py-0">
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
    <img 
      src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80" 
      alt="AI Background" 
      className="w-full h-full object-cover"
    />
  </div>
  <div className="container mx-auto px-8 relative z-10">
    <div className="flex flex-col md:flex-row items-center md:gap-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="md:w-1/2 text-white mb-16 md:mb-0"
      >
        <motion.h2 variants={fadeInUp} className="text-xl md:text-2xl font-medium mb-3 text-blue-300">
          CENTRE OF EXCELLENCE
        </motion.h2>
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-8">
          DATA SCIENCE <span className="text-blue-400">&</span> AI
        </motion.h1>
        <motion.p variants={fadeInUp} className="text-lg md:text-xl mb-10 max-w-lg text-blue-100 leading-relaxed">
          Pioneering research and innovation at the intersection of AI, data science, and real-world applications across India and Australia.
        </motion.p>
        <motion.div variants={fadeInUp} className="flex space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Our Research
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white hover:bg-white/15 text-white px-8 py-4 rounded-md font-medium transition-all"
          >
            Join Our Team
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2"
        ref={newsRef}
      >
        <div className="relative h-80 md:h-96 bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20 transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 py-4 px-6 text-white">
            <h3 className="font-semibold text-lg">Latest News & Insights</h3>
          </div>
          <div className="pt-16 p-8 h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white"
              >
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{newsItems[activeSlide].title}</h3>
                <p className="text-sm text-blue-200 mb-3">{newsItems[activeSlide].date}</p>
                <button className="mt-6 text-blue-300 hover:text-blue-100 flex items-center text-sm font-medium group">
                  Read more <FaArrowRight className="ml-2 group-hover:ml-3 transition-all" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeSlide === index ? 'bg-blue-400 scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
    <FaArrowRight className="rotate-90" size={24} />
  </div>
</section>

        {/* Stats Section */}
       
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-8">
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={staggerChildren}
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-all"
        >
          <h3 className="text-4xl font-bold text-blue-600 mb-3">{stat.number}</h3>
          <p className="text-gray-700 font-medium">{stat.text}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

        {/* About Section */}
       
<section id="about" className="py-28 bg-white">
  <div className="container mx-auto px-8">
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <h2 className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-3">About Us</h2>
      <h3 className="text-3xl md:text-4xl font-bold mb-5">Center of Excellence</h3>
      <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
    </motion.div>
    <div className="flex flex-col md:flex-row items-center gap-16">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="md:w-1/2"
      >
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Researchers collaborating" 
            className="rounded-lg shadow-xl"
          />
          <div className="absolute -bottom-6 -right-6 bg-blue-500 text-white p-5 rounded-lg shadow-lg">
            <p className="font-bold text-xl">Est. 2025</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="md:w-1/2"
      >
        <h3 className="text-2xl font-bold text-blue-900 mb-6">Bridging Research Across Continents</h3>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          The TIET-UQ Centre of Excellence in Data Science and AI is a cross-disciplinary research powerhouse jointly operated by Thapar Institute of Engineering & Technology in Patiala, India, and The University of Queensland in Brisbane, Australia.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-10">
          Our unique collaboration transcends both national and disciplinary boundaries, bringing together experts in computer science, engineering, behavioral science, health, agriculture, and environmental studies to develop innovative solutions for complex global challenges.
        </p>
        <div className="space-y-5">
          <div className="flex items-start">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-5 flex-shrink-0 shadow-md">
              1
            </div>
            <p className="text-gray-700 text-lg">Foster next-generation AI talent through innovative research and industry partnerships</p>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-5 flex-shrink-0 shadow-md">
              2
            </div>
            <p className="text-gray-700 text-lg">Drive impactful AI innovations through global collaboration and knowledge exchange</p>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-5 flex-shrink-0 shadow-md">
              3
            </div>
            <p className="text-gray-700 text-lg">Advance responsible AI solutions to enhance human capabilities and improve quality of life</p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

        {/* Vision & Mission Section */}
        
<section className="py-28 bg-blue-900 text-white">
  <div className="container mx-auto px-8">
    <div className="text-center mb-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision & Mission</h2>
      <div className="w-24 h-1 bg-blue-400 mx-auto"></div>
    </div>
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-2xl md:text-3xl italic font-light mb-16 text-blue-200">
        "Transforming industries and lives in India and Australia via innovation-led Data Science and AI"
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white/10 rounded-lg p-10 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all transform hover:-translate-y-1 duration-300">
          <h3 className="text-xl font-bold mb-5 text-blue-300">Research Excellence</h3>
          <p className="text-blue-100 leading-relaxed">
            We're committed to pioneering research that pushes the boundaries of what's possible in AI and data science, creating knowledge with real-world impact.
          </p>
        </div>
        <div className="bg-white/10 rounded-lg p-10 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all transform hover:-translate-y-1 duration-300">
          <h3 className="text-xl font-bold mb-5 text-blue-300">Ethical Innovation</h3>
          <p className="text-blue-100 leading-relaxed">
            We develop AI systems that prioritize human well-being, privacy, and fairness, ensuring technology serves humanity's best interests.
          </p>
        </div>
        <div className="bg-white/10 rounded-lg p-10 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all transform hover:-translate-y-1 duration-300">
          <h3 className="text-xl font-bold mb-5 text-blue-300">Global Collaboration</h3>
          <p className="text-blue-100 leading-relaxed">
            We foster international partnerships between researchers, industry leaders, and communities to tackle the world's most pressing challenges.
          </p>
        </div>
        <div className="bg-white/10 rounded-lg p-10 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all transform hover:-translate-y-1 duration-300">
          <h3 className="text-xl font-bold mb-5 text-blue-300">Talent Development</h3>
          <p className="text-blue-100 leading-relaxed">
            We nurture the next generation of data scientists and AI researchers through innovative education and hands-on research opportunities.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* People Section */}
       
<section id="people" className="py-28 bg-white">
  <div className="container mx-auto px-8">
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <h2 className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-3">Our Team</h2>
      <h3 className="text-3xl md:text-4xl font-bold mb-5">Leadership & Expertise</h3>
      <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
    </motion.div>
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={staggerChildren}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
    >
      {teamMembers.map((person, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="relative h-72 overflow-hidden">
            <img src={person.image} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex space-x-5 justify-center">
                <a href="#" className="text-white hover:text-blue-300 transition-colors transform hover:scale-110">
                  <FaLinkedin size={24} />
                </a>
                <a href="#" className="text-white hover:text-blue-300 transition-colors transform hover:scale-110">
                  <FaTwitter size={24} />
                </a>
                <a href="#" className="text-white hover:text-blue-300 transition-colors transform hover:scale-110">
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-3">{person.name}</h3>
            <p className="text-blue-600 font-medium mb-5">{person.role}</p>
            <p className="text-gray-700 leading-relaxed">{person.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
    <div className="text-center mt-16">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-10 py-4 rounded-md font-medium transition-colors shadow-md"
      >
        Meet Our Full Team <FaArrowRight className="ml-2 inline" />
      </motion.button>
    </div>
  </div>
</section>

        {/* Research Themes Section */}
       
<section id="research" className="py-28 bg-gray-50">
  <div className="container mx-auto px-8">
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <h2 className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-3">Our Focus</h2>
      <h3 className="text-3xl md:text-4xl font-bold mb-5">Research Themes</h3>
      <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
      <p className="max-w-2xl mx-auto text-gray-700 text-lg">
        Our interdisciplinary research addresses complex challenges across multiple domains, integrating cutting-edge AI and data science approaches.
      </p>
    </motion.div>
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={staggerChildren}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      {thematicAreas.map((area, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
        >
          <div className="relative h-52 overflow-hidden">
            <img src={area.icon} alt={area.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-70"></div>
            <h3 className="absolute bottom-5 left-6 text-white text-xl font-bold">{area.title}</h3>
          </div>
          <div className="p-8">
            <p className="text-gray-700 leading-relaxed mb-4">{area.description}</p>
            <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium group">
              Explore research <FaArrowRight className="ml-2 group-hover:ml-3 transition-all" />
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>
  
          {/* Programs Section */}
          
<section id="programs" className="py-28 bg-white">
  <div className="container mx-auto px-8">
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <h2 className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-3">Opportunities</h2>
      <h3 className="text-3xl md:text-4xl font-bold mb-5">Funding Programs</h3>
      <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
      <p className="max-w-2xl mx-auto text-gray-700 text-lg">
        We offer various funding opportunities to support research, student development, and collaborative projects.
      </p>
    </motion.div>
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-center space-x-6 mb-8">
        {[1, 2, 3, 4].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-full transition-all ${
              activeTab === tab
                ? 'bg-blue-500 text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Program {tab}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:w-2/5 relative h-72 md:h-auto">
                <img
                  src={fundingPrograms[activeTab - 1].icon}
                  alt={fundingPrograms[activeTab - 1].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent opacity-70"></div>
              </div>
              <div className="p-10 md:w-3/5">
                <h3 className="text-2xl font-bold text-blue-900 mb-5">{fundingPrograms[activeTab - 1].title}</h3>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  {fundingPrograms[activeTab - 1].description}
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md font-medium transition-all shadow-md hover:shadow-lg inline-flex items-center">
                  Apply Now <FaArrowRight className="ml-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
</section>
  
          {/* Contact Section */}
         
<section id="contact" className="py-28 bg-gray-900 text-white">
  <div className="container mx-auto px-8">
    <div className="text-center mb-20">
      <h2 className="text-sm text-blue-400 font-semibold uppercase tracking-wide mb-3">Get In Touch</h2>
      <h3 className="text-3xl md:text-4xl font-bold mb-5">Contact Us</h3>
      <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
    </div>
    <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
      <div className="md:w-1/2">
        <div className="bg-white/5 backdrop-blur-sm p-10 rounded-xl border border-white/10">
          <h4 className="text-2xl font-bold mb-8">Send Us a Message</h4>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-white/10 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Your Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-white/10 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 bg-white/10 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Your message subject"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md font-medium transition-all shadow-md hover:shadow-lg w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <div className="md:w-1/2">
        <div className="bg-white/5 backdrop-blur-sm p-10 rounded-xl border border-white/10 mb-10 h-auto md:h-3/5">
          <h4 className="text-2xl font-bold mb-8">India Campus</h4>
          <div className="space-y-6">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-blue-400 text-2xl mt-1 mr-5" />
              <p className="text-lg">Thapar Institute of Engineering & Technology, Patiala, Punjab, India - 147004</p>
            </div>
            <div className="flex items-start">
              <FaEnvelope className="text-blue-400 text-2xl mt-1 mr-5" />
              <p className="text-lg">coe-datasci@thapar.edu</p>
                      </div>
                    </div>
                  </div>
                 
                  <div className="mt-8 flex justify-center space-x-6">
                    <a href="#" className="text-white hover:text-blue-400 transition-colors">
                      <FaTwitter size={24} />
                    </a>
                    <a href="#" className="text-white hover:text-blue-400 transition-colors">
                      <FaLinkedin size={24} />
                    </a>
                    <a href="#" className="text-white hover:text-blue-400 transition-colors">
                      <FaGithub size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Footer */}
          <footer className="bg-gray-950 text-white py-12">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <h1 className="text-2xl font-bold">
                    TIET-UQ <span className="text-blue-500">CoE</span>
                  </h1>
                  <p className="text-gray-400 mt-2">Pioneering the future through AI and Data Science</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                  {['Home', 'About', 'People', 'Research', 'Programs', 'Contact'].map((item) => (
                    <Link
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
              <hr className="border-gray-800 my-8" />
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-500">© 2025 TIET-UQ Centre of Excellence in Data Science and AI. All rights reserved.</p>
                <p className="text-gray-500 mt-4 md:mt-0">
                  <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link> | 
                  <Link href="#" className="hover:text-white transition-colors ml-2">Terms of Service</Link>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </>
    );
  }