import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, HelpCircle, UserRoundCog, ChevronRight, MessageCircle, Phone, Mail, Send, X, Loader2, CheckCircle, AlertCircle, Info, History } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface QueryFormData {
  name: string;
  email: string;
  phone: string;
  telegramId: string;
  queryType: string;
  queryText: string;
}

interface ValidationState {
  isValid: boolean;
  message: string;
  isTouched: boolean;
}

interface FormValidation {
  name: ValidationState;
  email: ValidationState;
  phone: ValidationState;
  telegramId: ValidationState;
  queryText: ValidationState;
}

interface QuerySubmission extends QueryFormData {
  id: string;
  timestamp: number;
  status: 'pending' | 'resolved';
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  telegramId?: string;
  queryType?: string;
  queryText?: string;
}

const queryTypes = [
  "Technical Issue",
  "Billing Query",
  "Feature Request",
  "General Inquiry",
  "Other"
];

const faqData: FAQItem[] = [
  {
    question: "How do I get started?",
    answer: "You can get started by creating an account and following our quick start guide.",
    category: "Getting Started"
  },
  {
    question: "How do I reset my password?",
    answer: "Click on the 'Forgot Password' link on the login page and follow the instructions sent to your email.",
    category: "Account"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI and USDT deposits and withdrawals",
    category: "Billing"
  }
];

const categories = [
  { name: "Getting Started", icon: HelpCircle },
  { name: "Account", icon: MessageCircle },
  { name: "Billing", icon: Mail },
  { name: "Find A Teacher", icon: UserRoundCog },
  { name: "Send Query", icon: Send },
  { name: "Track Query", icon: History }
];

export const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const [validation, setValidation] = useState<FormValidation>({
    name: { isValid: false, message: '', isTouched: false },
    email: { isValid: false, message: '', isTouched: false },
    phone: { isValid: false, message: '', isTouched: false },
    telegramId: { isValid: false, message: '', isTouched: false },
    queryText: { isValid: false, message: '', isTouched: false }
  });

  
  const [queryFormData, setQueryFormData] = useState<QueryFormData>({
    name: '',
    email: '',
    phone: '',
    telegramId: '',
    queryType: queryTypes[0],
    queryText: ''
  });



  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
        return '';
      
      case 'telegramId':
        if (!value.trim()) return 'Telegram ID is required';
        if (value.trim().length < 3) return 'Telegram ID must be at least 3 characters';
        return '';
      
      case 'queryText':
        if (!value.trim()) return 'Query message is required';
        if (value.trim().length < 10) return 'Query must be at least 10 characters';
        return '';
      
      case 'queryType':
        if (!value.trim()) return 'Query type is required';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQueryFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field and update errors immediately
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined // Only set error if there is one
    }));
  };

  const handleBlur = (name: string) => {
    const value = queryFormData[name as keyof QueryFormData];
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationErrors = {
      name: validateField('name', queryFormData.name),
      email: validateField('email', queryFormData.email),
      phone: validateField('phone', queryFormData.phone),
      telegramId: validateField('telegramId', queryFormData.telegramId),
      queryType: validateField('queryType', queryFormData.queryType),
      queryText: validateField('queryText', queryFormData.queryText)
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setIsLoading(true);
    try {
    
      localStorage.setItem('queries', JSON.stringify(queryFormData));

      setShowSuccess(true);
  
        setTimeout(() => {
          setShowSuccess(false);
        setIsQueryModalOpen(false);
        setQueryFormData({
          name: '',
          email: '',
          phone: '',
          telegramId: '',
          queryType: queryTypes[0],
          queryText: ''
        });
        setErrors({});
      
        }, 1000);
    } catch (error) {
      console.error('Error storing query:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0F0F19]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#1A1A2E]/95 backdrop-blur-lg border-b border-purple-500/10 z-50">
        <div className="max-w-[1400px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 rounded-lg bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-white">Help Center</h1>
          </div>
        </div>
      </header>

      {/* Query Modal */}
      {isQueryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#252547] rounded-2xl p-4 md:p-6 w-full max-w-lg my-4 relative">
            {showSuccess && (
              <div className="absolute inset-0 bg-[#1A1A2E]/95 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center p-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-white text-lg font-medium">Query Submitted!</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Send Query</h2>
              <button 
                onClick={() => setIsQueryModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleQuerySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={queryFormData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-4 py-2.5 bg-[#252547]/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-white placeholder-gray-500 ${
                    errors.name ? 'border-red-500/50' : 'border-purple-500/20'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={queryFormData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-2.5 bg-[#252547]/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-white placeholder-gray-500 ${
                    errors.email ? 'border-red-500/50' : 'border-purple-500/20'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone *</label>
                <input
                  type="number"
                  name="phone"
                  value={queryFormData.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full px-4 py-2.5 bg-[#252547]/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-white placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    errors.phone ? 'border-red-500/50' : 'border-purple-500/20'
                  }`}
                  placeholder="Enter phone number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Telegram ID *</label>
                <input
                  type="text"
                  name="telegramId"
                  value={queryFormData.telegramId}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('telegramId')}
                  className={`w-full px-4 py-2.5 bg-[#252547]/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-white placeholder-gray-500 ${
                    errors.telegramId ? 'border-red-500/50' : 'border-purple-500/20'
                  }`}
                  placeholder="Enter your Telegram ID"
                />
                {errors.telegramId && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.telegramId}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Query Type *</label>
                <select
                  name="queryType"
                  value={queryFormData.queryType}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('queryType')}
                  className="w-full px-4 py-2.5 bg-[#252547]/50 border border-purple-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-white appearance-none"
                >
                  <option value="">Select Query Type</option>
                  {queryTypes.map(type => (
                    <option key={type} value={type} className="bg-[#1A1A2E]">{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Your Query *</label>
                <textarea
                  name="queryText"
                  value={queryFormData.queryText}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('queryText')}
                  rows={3}
                  className={`w-full px-4 py-2.5 bg-[#252547]/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-white placeholder-gray-500 resize-none ${
                    errors.queryText ? 'border-red-500/50' : 'border-purple-500/20'
                  }`}
                  placeholder="Describe your query..."
                ></textarea>
                {errors.queryText && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.queryText}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Query'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 pt-24 md:pt-28 pb-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#1A1A2E] to-[#252547] rounded-2xl p-6 md:p-12 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative text-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-[2px] mb-8 transform hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-2xl bg-[#1A1A2E] flex items-center justify-center">
                <HelpCircle className="w-10 h-10 md:w-12 md:h-12 text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              How can we help you?
            </h1>
            <p className="text-lg md:text-xl text-gray-400">
              Search our help center or browse categories below
            </p>
          </div>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-[#252547]/50 backdrop-blur-sm border border-purple-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent text-white placeholder-gray-400 transition duration-150 ease-in-out"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#252547] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Categories
              </h2>
              <div className="flex flex-wrap lg:flex-col gap-3">
                {categories.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => {
                      if (name === "Send Query" || name === "Find A Teacher") {
                        setIsQueryModalOpen(true);
                      } else {
                        setSelectedCategory(name === selectedCategory ? null : name);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
                      selectedCategory === name
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20'
                        : 'hover:bg-[#252547] border border-transparent hover:border-purple-500/20'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      selectedCategory === name ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
                    }`} />
                    <span className={`flex-1 ${
                      selectedCategory === name ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {name}
                    </span>
                    <ChevronRight className={`w-4 h-4 transform transition-transform ${
                      selectedCategory === name ? 'rotate-90 text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#252547] rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              {filteredFAQs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <div
                      key={index}
                      className={`bg-[#252547]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 transition-all duration-300 ${
                        expandedFAQ === index ? 'p-6' : 'p-4 hover:border-purple-500/20'
                      }`}
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    >
                      <div className="flex items-start gap-4 cursor-pointer">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {faq.question}
                          </h3>
                          <div className={`overflow-hidden transition-all duration-300 ${
                            expandedFAQ === index ? 'max-h-96' : 'max-h-0'
                          }`}>
                            <p className="text-gray-400 mb-4">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-purple-400 transform transition-transform ${
                          expandedFAQ === index ? 'rotate-90' : ''
                        }`} />
                      </div>
                      <div className={`mt-4 ${expandedFAQ === index ? 'block' : 'hidden'}`}>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600/20 text-purple-400">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#252547]/30 rounded-xl border border-purple-500/10">
                  <HelpCircle className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2 text-lg">
                    No matching questions found
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or browse different categories
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        {/* <div className="mt-8">
          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#252547] rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Still Need Help?
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Our support team is available 24/7 to assist you with any questions
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 rounded-xl bg-[#252547]/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                  <MessageCircle className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="block text-white font-medium">Live Chat</span>
                </button>
                <button className="p-4 rounded-xl bg-[#252547]/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                  <Mail className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="block text-white font-medium">Email Support</span>
                </button>
                <button className="p-4 rounded-xl bg-[#252547]/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                  <Phone className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="block text-white font-medium">Phone Support</span>
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}; 