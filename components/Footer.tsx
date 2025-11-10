import React from 'react';
import { type View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold">FRESHPODD</h3>
            <p className="text-sm text-gray-400">Solar Cold Storage Solutions</p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="mailto:support@freshpodd.com" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Email</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.485 2.525c.636-.247 1.363-.416 2.427-.465C9.93 2.013 10.284 2 12.315 2zm-1.003 3.636c-1.03.042-1.634.21-2.145.41a3.076 3.076 0 00-1.12 1.12c-.2.51-.368 1.115-.41 2.145-.048 1.068-.06 1.368-.06 3.69s.012 2.623.06 3.69c.042 1.03.21 1.634.41 2.145a3.076 3.076 0 001.12 1.12c.51.2.115.368 2.145.41 1.068.048 1.368.06 3.69.06s2.623-.012 3.69-.06c1.03-.042 1.634-.21 2.145-.41a3.076 3.076 0 001.12-1.12c.2-.51.368-1.115.41-2.145.048-1.068.06-1.368.06-3.69s-.012-2.623-.06-3.69c-.042-1.03-.21-1.634-.41-2.145a3.076 3.076 0 00-1.12-1.12c-.51-.2-1.115-.368-2.145-.41-1.068-.048-1.368-.06-3.69-.06s-2.623.012-3.69.06zM12 8.468c-2.012 0-3.638 1.626-3.638 3.638s1.626 3.638 3.638 3.638 3.638-1.626 3.638-3.638-1.626-3.638-3.638-3.638zm0 5.888a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zm4.095-6.883a.96.96 0 100-1.92.96.96 0 000 1.92z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('contact')}} className="hover:text-white transition-colors">Contact Us</a>
            <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('returns')}} className="hover:text-white transition-colors">Return Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} FreshPodd Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;