export const metadata = {
  title: "About Onligro",
  description:
    "Onligro is a time-saving salon appointment booking platform for students, working professionals, and anyone who values their time.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            About <span className="text-indigo-600">Onligro</span>
          </h1>
          <div className="w-24 h-1.5 bg-indigo-500 mx-auto rounded-full mb-8"></div>
          <p className="text-xl md:text-2xl font-medium text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing salon appointments for the modern, time-conscious individual
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-16 border border-gray-100">
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-xl mr-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Onligro is a time-saving salon appointment booking platform built for
                students, working professionals, and anyone who values their time.
                We eliminate the uncertainty of waiting and streamline the booking
                process for both customers and salon owners.
              </p>
            </div>
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                The Problem We Solve
              </h3>
              <p className="text-gray-700 leading-relaxed">
                In many local salons, customers wait unpredictably while salon owners
                struggle to manage rush during peak hours. This leads to frustration,
                wasted time, and lost business opportunities for small salon owners.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Our Solution
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Onligro addresses this gap by enabling simple, time-based bookings
                without adding complexity for small salon owners. We focus on
                intuitive design that works for both tech-savvy and traditional users.
              </p>
            </div>
          </div>
        </div>

        {/* Founders Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Meet Our Founders</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Founder 1 */}
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-md">
                  <span className="text-3xl font-bold text-white">AR</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Ahmad Raja</h3>
                <p className="text-lg font-medium text-indigo-600 mt-1">Founder</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <span className="font-medium text-gray-800">Product & Vision</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Drives the product strategy and long-term vision of Onligro, focusing on creating a seamless user experience.
                </p>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-md">
                  <span className="text-3xl font-bold text-white">AN</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Azam Nuri</h3>
                <p className="text-lg font-medium text-blue-600 mt-1">Co-Founder</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="font-medium text-gray-800">Operations & Field Execution</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Manages on-ground operations, partner relations, and ensures the platform works seamlessly in real-world scenarios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Focus */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Current Focus</h2>
          
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
            <div className="flex items-center mb-8">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Real-World Testing Phase</h3>
            </div>
            
            <p className="text-lg mb-8 leading-relaxed">
              The platform is currently in a real-world testing phase to understand
              user behavior, no-show patterns, and on-ground operational challenges
              before scaling. We believe in learning directly from users and
              refining our approach based on actual usage data.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">01</div>
                <h4 className="font-bold text-lg mb-2">Reduce Waiting Time</h4>
                <p className="text-sm opacity-90">Eliminate unpredictable waits at local salons</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">02</div>
                <h4 className="font-bold text-lg mb-2">Simplify for Owners</h4>
                <p className="text-sm opacity-90">Keep the system intuitive for salon owners</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">03</div>
                <h4 className="font-bold text-lg mb-2">Learn Before Scaling</h4>
                <p className="text-sm opacity-90">Understand real usage patterns before expansion</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Join Us in Revolutionizing Salon Bookings</h3>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Whether you're a busy professional, a student, or a salon owner looking to streamline operations, 
            Onligro is designed with you in mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-300 shadow-md hover:shadow-lg">
              Learn More About Our Platform
            </button>
            <button className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-xl border border-indigo-300 hover:bg-indigo-50 transition-colors duration-300">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}