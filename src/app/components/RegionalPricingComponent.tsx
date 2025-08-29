import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Globe } from 'lucide-react';

// Regional Pricing Component that automatically detects user's region
// Usage: <RegionalPricingComponent isDark={isDark} />

interface PricingData {
  currency: string;
  price: string;
  region: string;
  message: string;
  buttonText: string;
}

interface RegionalPricingProps {
  isDark?: boolean;
}

const RegionalPricingComponent: React.FC<RegionalPricingProps> = ({ isDark = false }) => {
  const [isIndia, setIsIndia] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate region detection (in production, you'd use IP geolocation)
  useEffect(() => {
    const detectRegion = async () => {
      try {
        // In a real implementation, you'd use a service like:
        // const response = await fetch('https://ipapi.co/json/');
        // const data = await response.json();
        // setIsIndia(data.country_code === 'IN');
        
        // For demo purposes, we'll simulate detection
        setTimeout(() => {
          // You can change this to test different regions
          setIsIndia(true); // Set to false to test international version
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error detecting region:', error);
        setIsIndia(false); // Default to international
        setIsLoading(false);
      }
    };

    detectRegion();
  }, []);

  const getPricingData = (): PricingData => {
    if (isIndia) {
      return {
        currency: '₹',
        price: '95',
        region: 'India',
        message: 'A small investment today. A lifetime of clarity tomorrow.',
        buttonText: 'Unlock My Career Path →'
      };
    } else {
      return {
        currency: '$',
        price: '5',
        region: 'Other Countries',
        message: 'One small step today. A lifetime of career clarity tomorrow.',
        buttonText: 'Start Your Assessment →'
      };
    }
  };

  const pricingData = getPricingData();



  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Detecting your region...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>


      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-12">
        {/* Region Indicator */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            {isIndia ? <MapPin className="w-4 h-4 mr-2 text-orange-500" /> : <Globe className="w-4 h-4 mr-2 text-blue-500" />}
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Pricing for: {pricingData.region}
            </span>
          </div>
        </div>

        {/* Pricing Card */}
        <div className={`rounded-3xl overflow-hidden shadow-2xl ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700' 
            : 'bg-white border-gray-100'
        } border`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-8 text-center">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">💰 Assessment Package</h2>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold">{pricingData.currency}{pricingData.price}</span>
                <span className="text-xl ml-2 opacity-90">Only</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="p-8">
            <div className="space-y-4 mb-8">
              <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-2xl mr-3">📋</span>
                <span className="text-lg font-semibold">55 Curated Questions</span>
              </div>
              
              <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-2xl mr-3">⏱️</span>
                <span className="text-lg font-semibold">35 Minutes to complete</span>
              </div>
              
              <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-2xl mr-3">🔍</span>
                <span className="text-lg font-semibold">15 Deep Insights into your strengths & fit</span>
              </div>
              
              <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-2xl mr-3">🎯</span>
                <span className="text-lg font-semibold">5 Tailored Career Recommendations</span>
              </div>
            </div>

            {/* Value Proposition */}
            <div className={`text-center p-6 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-r from-purple-900/30 to-teal-900/30 border-purple-500/30' 
                : 'bg-gradient-to-r from-purple-50 to-teal-50 border-purple-200/50'
            } border mb-8`}>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                👉 <em>{pricingData.message}</em>
              </p>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white text-xl font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center group">
              {pricingData.buttonText}
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-8 space-y-4">
          <div className={`flex items-center justify-center space-x-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center">
              <span className="text-green-500 mr-1">🔒</span>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-1">⭐</span>
              <span className="text-sm">4.9/5 Rating</span>
            </div>
            <div className="flex items-center">
              <span className="text-purple-500 mr-1">👥</span>
              <span className="text-sm">10K+ Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalPricingComponent;