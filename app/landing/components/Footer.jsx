import Link from "next/link";
export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SalonFlow
              </span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-md">
              Revolutionizing salon management with AI-powered booking, smart scheduling, and business analytics.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { name: 'Twitter', icon: '𝕏', url: '#' },
                { name: 'LinkedIn', icon: 'in', url: '#' },
                { name: 'Instagram', icon: '📷', url: '#' },
                { name: 'YouTube', icon: '▶️', url: '#' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  aria-label={social.name}
                >
                  <span className="text-gray-300 group-hover:text-white text-sm font-medium">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              Product
            </h3>
           <div className="space-y-4">
  <Link
    href="/about"
    className="block text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
  >
    About
  </Link>

  {['Features', 'Pricing', 'Case Studies', 'API Docs', 'Changelog'].map((item) => (
    <a
      key={item}
      href="#"
      className="block text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
    >
      {item}
    </a>
  ))}
</div>

          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Solutions
            </h3>
            <div className="space-y-4">
              {['For Salons', 'For Spas', 'Enterprise', 'Beauty Chains', 'Startups'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Support
            </h3>
            <div className="space-y-4">
              {['Help Center', 'Contact Sales', 'Community', 'Status', 'Training'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Newsletter Section - Full Width */}
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 md:p-8 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Updated with SalonFlow
              </h3>
              <p className="text-gray-400 text-lg">
                Get the latest features, updates, and beauty industry insights delivered to your inbox.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="flex flex-col sm:flex-row gap-3 min-w-[300px]">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200"
              />
              <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap min-w-[120px]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SalonFlow Technologies. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-sm">
             <Link
  href="/about"
  className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
>
  About
</Link>

{['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security', 'Compliance'].map((item) => (
  <a
    key={item}
    href="#"
    className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
  >
    {item}
  </a>
))}

            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>🔒 SSL Secured</span>
              <span>•</span>
              <span>🌍 Global</span>
              <span>•</span>
              <span>⭐ 4.9/5 Rating</span>
            </div>
          </div>
        </div>

      </div>

      {/* Gradient Ornaments */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
    </footer>
  );
}