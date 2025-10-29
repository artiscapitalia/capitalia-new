'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface HeaderProps {
  id?: string;
  className?: string;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
  logo?: {
    desktop: string;
    mobile: string;
    alt: string;
  };
  navigation?: NavigationItem[];
  languages?: Array<{
    code: string;
    label: string;
    href: string;
  }>;
  currentLanguage?: string;
  contactInfo?: {
    phone: string;
    email: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  id = 'capitalia-header',
  className = 'mb-12',
  editable: _editable = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  onEdit: _onEdit, // eslint-disable-line @typescript-eslint/no-unused-vars
  logo = {
    desktop: '/images/capitalia-logo.png',
    mobile: '/images/capitalia-logo.png',
    alt: 'Capitalia'
  },
  navigation = [
    { label: 'Uzņēmumiem', href: '/lv/finansejums/' },
    { label: 'Investoriem', href: '/lv/ieguldit/' },
    {
      label: 'Resursi',
      href: '/lv/resursi/',
      children: [
        { label: 'Biznesa izaugsmei', href: '/lv/resursi/biznesa-rokasgramata/' },
        { label: 'Sekmīgiem ieguldījumiem', href: '/lv/resursi/investiciju-rokasgramata/' }
      ]
    },
    {
      label: 'Par mums',
      href: '/lv/par-uznemumu/',
      children: [
        { label: 'Par uzņēmumu', href: '/lv/par-uznemumu/uznemums/' },
        { label: 'Jaunumi', href: '/lv/jaunumi/' },
        { label: 'Karjera', href: '/lv/par-uznemumu/karjera/' },
        { label: 'Kontakti', href: '/lv/par-uznemumu/kontakti/' }
      ]
    }
  ],
  languages = [
    { code: 'lv', label: 'Latviešu', href: '/lv' },
    { code: 'en', label: 'Angļu', href: '/en' },
    { code: 'lt', label: 'Lietuviešu', href: '/lt' },
    { code: 'ee', label: 'Igauņu', href: '/ee' },
    { code: 'fi', label: 'Somu', href: '/fi' }
  ],
  currentLanguage = 'lv',
  contactInfo = {
    phone: '+371 2880 0880',
    email: 'info@capitalia.com'
  }
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <header 
      id={id}
      className={`sticky top-0 z-50 bg-white ${className}`}
      data-component-type="header"
    >
      <div className="mx-auto px-4 max-w-screen-xl">
        <div className="flex items-center justify-between py-6">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 w-48">
            <div className="flex items-center">
              <Link href="/lv" className="block">
                <Image
                  src={logo.desktop}
                  alt={logo.alt}
                  width={200}
                  height={0}
                  className="sm:block w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center">
              <ul className="flex items-center space-x-8">
                {navigation.map((item) => (
                  <li 
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link 
                      href={item.href}
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium py-2"
                    >
                      <span>{item.label}</span>
                      {item.children && (
                        <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </Link>
                    
                    {item.children && activeDropdown === item.label && (
                      <ul className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md min-w-48 py-2 z-50">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link 
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Desktop Login Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                href="/lv/apply"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Kļūt par klientu
              </Link>
              <Link 
                href="/lv/login"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Mans konts
              </Link>
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2"
              >
                <span className="text-sm font-medium">{currentLang.label}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM13 2.049s3 3.95 3 9.951-3 9.951-3 9.951M11 21.951S8 18.001 8 12.001 11 2.049 11 2.049M2.63 15.5h18.74M2.63 8.5h18.74" />
                </svg>
              </button>
              
              {isLanguageDropdownOpen && (
                <ul className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md min-w-32 py-2 z-50">
                  {languages.map((lang) => (
                    <li key={lang.code}>
                      <Link 
                        href={lang.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setIsLanguageDropdownOpen(false)}
                      >
                        {lang.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contact Info (Mobile) */}
            <div className="md:hidden flex items-center space-x-3">
              <Link href={`tel:${contactInfo.phone}`}>
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 473.806 473.806">
                  <path d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5c-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4c-3.6-1.8-7-3.5-9.9-5.3c-29.6-18.8-56.5-43.3-82.3-75c-12.5-15.8-20.9-29.1-27-42.6c8.2-7.5,15.8-15.3,23.2-22.8c2.8-2.8,5.6-5.7,8.4-8.5c21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5c-6-6.2-12.3-12.6-18.8-18.6c-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7c-0.1,0.1-0.1,0.1-0.2,0.2l-34,34.3c-12.8,12.8-20.1,28.4-21.7,46.5c-2.4,29.2,6.2,56.4,12.8,74.2c16.2,43.7,40.4,84.2,76.5,127.6c43.8,52.3,96.5,93.6,156.7,122.7c23,10.9,53.7,23.8,88,26c2.1,0.1,4.3,0.2,6.3,0.2c23.1,0,42.5-8.3,57.7-24.8c0.1-0.2,0.3-0.3,0.4-0.5c5.2-6.3,11.2-12,17.5-18.1c4.3-4.1,8.7-8.4,13-12.9c9.9-10.3,15.1-22.3,15.1-34.6c0-12.4-5.3-24.3-15.4-34.3L374.456,293.506z"/>
                </svg>
              </Link>
              <Link href={`mailto:${contactInfo.email}`}>
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M510.746,110.361c-2.128-10.754-6.926-20.918-13.926-29.463c-1.422-1.794-2.909-3.39-4.535-5.009c-12.454-12.52-29.778-19.701-47.531-19.701H67.244c-17.951,0-34.834,7-47.539,19.708c-1.608,1.604-3.099,3.216-4.575,5.067c-6.97,8.509-11.747,18.659-13.824,29.428C0.438,114.62,0,119.002,0,123.435v265.137c0,9.224,1.874,18.206,5.589,26.745c3.215,7.583,8.093,14.772,14.112,20.788c1.516,1.509,3.022,2.901,4.63,4.258c12.034,9.966,27.272,15.45,42.913,15.45h377.51c15.742,0,30.965-5.505,42.967-15.56c1.604-1.298,3.091-2.661,4.578-4.148c5.818-5.812,10.442-12.49,13.766-19.854l0.438-1.05c3.646-8.377,5.497-17.33,5.497-26.628V123.435C512,119.06,511.578,114.649,510.746,110.361z M34.823,99.104c0.951-1.392,2.165-2.821,3.714-4.382c7.689-7.685,17.886-11.914,28.706-11.914h377.51c10.915,0,21.115,4.236,28.719,11.929c1.313,1.327,2.567,2.8,3.661,4.272l2.887,3.88l-201.5,175.616c-6.212,5.446-14.21,8.443-22.523,8.443c-8.231,0-16.222-2.99-22.508-8.436L32.19,102.939L34.823,99.104z M26.755,390.913c-0.109-0.722-0.134-1.524-0.134-2.341V128.925l156.37,136.411L28.199,400.297L26.755,390.913z M464.899,423.84c-6.052,3.492-13.022,5.344-20.145,5.344H67.244c-7.127,0-14.094-1.852-20.142-5.344l-6.328-3.668l159.936-139.379l17.528,15.246c10.514,9.128,23.922,14.16,37.761,14.16c13.89,0,27.32-5.032,37.827-14.16l17.521-15.253L471.228,420.18L464.899,423.84z M485.372,388.572c0,0.803-0.015,1.597-0.116,2.304l-1.386,9.472L329.012,265.409l156.36-136.418V388.572z"/>
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-4">
              {navigation.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <Link 
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="p-1 text-gray-500"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {item.children && activeDropdown === item.label && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <Link 
                          key={child.label}
                          href={child.href}
                          className="block text-sm text-gray-600 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Login Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link 
                  href="/lv/apply"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kļūt par klientu
                </Link>
                <Link 
                  href="/lv/login"
                  className="block w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-center font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mans konts
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
