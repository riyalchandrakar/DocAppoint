import { Calendar, Clipboard, Cog, DollarSign, HeartPulse, Hospital, Shield, User, Users, Clock, ChartBar, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, primary, onClick, ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
      primary
        ? 'text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-teal-500/30'
        : 'text-teal-700 bg-white hover:bg-gray-50 border border-teal-600'
    }`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ icon: Icon, title, description, primary }) => (
  <div className={`rounded-xl p-8 transition-all duration-300 hover:shadow-lg ${
    primary 
      ? 'bg-white shadow-md hover:border-teal-300 border border-white' 
      : 'bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-teal-200'
  }`}>
    <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-teal-600" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Section = ({ children, bg, height, className }) => (
  <section className={`${height || 'py-20'} ${bg || 'bg-white'} ${className || ''}`}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      {children}
    </div>
  </section>
);

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = (route) => {
    navigate(route);
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Hospital className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">DocAppoint</span>
            </div>
            <nav className="flex items-center gap-4">
              <Button onClick={() => handleButtonClick('/login')}>Login</Button>
              <Button primary onClick={() => handleButtonClick('/signup')}>Sign Up</Button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <Section bg="bg-gradient-to-r from-teal-600 to-teal-500" height="min-h-[32rem] md:min-h-[40rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-12">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transforming Healthcare <br className="hidden lg:block"/> Management
              </h1>
              <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto lg:mx-0">
                Optimize patient care, streamline operations, and enhance efficiency with our comprehensive hospital management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button primary onClick={() => handleButtonClick('/login')}>Get Started</Button>
                <Button onClick={() => handleButtonClick('/login')}>Book Appointment</Button>
              </div>
            </div>
            <div className="relative h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-teal-400 rounded-3xl opacity-20 -rotate-6 scale-95"></div>
              <div className="relative w-full h-80 md:h-96 bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Healthcare professionals" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Features Section */}
        <Section className="relative -mt-16 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: User, title: "Patient Management", description: "Comprehensive tools to manage patient records, appointments, and medical history with ease." },
              { icon: Hospital, title: "Doctor Management", description: "Efficiently organize doctor profiles, schedules, and patient assignments." },
              { icon: Calendar, title: "Appointment System", description: "Seamless booking and management of appointments for better patient experience." }
            ].map((card, index) => (
              <Card key={index} {...card} primary />
            ))}
          </div>
        </Section>

        {/* About Section */}
        <Section bg="bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-last lg:order-first">
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Modern hospital" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-teal-100 text-teal-800 rounded-full mb-4">Innovation</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Modern Healthcare Solutions</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform is designed to meet the evolving needs of healthcare providers, combining cutting-edge technology with intuitive design to revolutionize hospital operations.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Reduced administrative burden",
                  "Enhanced patient experience",
                  "Real-time data analytics",
                  "Secure cloud-based platform"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button primary onClick={() => handleButtonClick('/login')}>Learn More</Button>
            </div>
          </div>
        </Section>

        {/* Benefits Section */}
        <Section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose DocAppoint?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our hospital management system delivers tangible benefits that improve both patient care and operational efficiency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Clipboard, title: "Operational Efficiency", description: "Streamline administrative workflows and reduce paperwork with our automated solutions." },
              { icon: Users, title: "Patient Satisfaction", description: "Enhance the patient experience with seamless appointment scheduling and communication tools." },
              { icon: DollarSign, title: "Cost Reduction", description: "Optimize resource allocation and reduce operational costs with intelligent analytics." },
              { icon: HeartPulse, title: "Quality Care", description: "Empower your staff to focus on patient care by minimizing administrative tasks." },
              { icon: Shield, title: "Data Security", description: "Enterprise-grade security protocols to protect sensitive patient information." },
              { icon: Cog, title: "Custom Workflows", description: "Adaptable platform that molds to your hospital's unique processes and requirements." }
            ].map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </div>
        </Section>

        {/* Stats Section */}
        <Section bg="bg-gradient-to-r from-teal-600 to-teal-500" className="text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "95%", label: "Patient Satisfaction" },
              { value: "40%", label: "Time Savings" },
              { value: "100+", label: "Hospitals Trust Us" }
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-5xl font-bold mb-3">{stat.value}</div>
                <div className="text-xl font-medium text-teal-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Additional Features */}
        <Section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Comprehensive Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your healthcare facility effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Time Management", description: "Automate routine tasks to give your staff more time for patient care." },
              { icon: ChartBar, title: "Performance Analytics", description: "Track key metrics and gain insights to improve hospital performance." },
              { icon: Globe, title: "Multi-location Support", description: "Manage multiple facilities from a single, unified platform." }
            ].map((card, index) => (
              <Card key={index} {...card} primary />
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section bg="bg-gray-50">
          <div className="max-w-4xl mx-auto text-center p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to Transform Your Hospital?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join hundreds of healthcare providers who trust DocAppoint to streamline their operations and enhance patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button primary onClick={() => handleButtonClick('/signup')}>Get Started Today</Button>
              <Button onClick={() => handleButtonClick('/login')}>Schedule a Demo</Button>
            </div>
          </div>
        </Section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hospital className="w-6 h-6 text-teal-400" />
                <span className="text-xl font-bold">DocAppoint</span>
              </div>
              <p className="text-gray-400">
                Empowering healthcare providers with innovative management solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><button onClick={(e) => handleNavigation(e, '/features')} className="text-gray-400 hover:text-white transition">Features</button></li>
                <li><button onClick={(e) => handleNavigation(e, '/pricing')} className="text-gray-400 hover:text-white transition">Pricing</button></li>
                <li><button onClick={(e) => handleNavigation(e, '/demo')} className="text-gray-400 hover:text-white transition">Demo</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button onClick={(e) => handleNavigation(e, '/about')} className="text-gray-400 hover:text-white transition">About Us</button></li>
                <li><button onClick={(e) => handleNavigation(e, '/careers')} className="text-gray-400 hover:text-white transition">Careers</button></li>
                <li><button onClick={(e) => handleNavigation(e, '/contact')} className="text-gray-400 hover:text-white transition">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><button onClick={(e) => handleNavigation(e, '/privacy')} className="text-gray-400 hover:text-white transition">Privacy</button></li>
                <li><button onClick={(e) => handleNavigation(e, '/terms')} className="text-gray-400 hover:text-white transition">Terms</button></li>
                <li><button onClick={(e) => handleNavigation(e, '/security')} className="text-gray-400 hover:text-white transition">Security</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DocAppoint. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;