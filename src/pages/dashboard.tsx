import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDropzone } from 'react-dropzone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Modal from '@/components/Modal';

const MOCK_DATA = [
  { name: 'Housing', value: 30, color: '#0088FE', frequency: 1, avgAmount: 1500, frequentDay: '1st of month' },
  { name: 'Food & Groceries', value: 15, color: '#00C49F', frequency: 5, avgAmount: 60, frequentDay: 'Saturday' },
  { name: 'Savings', value: 15, color: '#FFBB28', frequency: 1, avgAmount: 750, frequentDay: '1st of month' },
  { name: 'Utilities', value: 10, color: '#FF8042', frequency: 1, avgAmount: 500, frequentDay: '15th of month' },
  { name: 'Transportation', value: 10, color: '#8884d8', frequency: 7, avgAmount: 28.57, frequentDay: 'Monday' },
  { name: 'Entertainment', value: 10, color: '#82ca9d', frequency: 3, avgAmount: 66.67, frequentDay: 'Friday' },
  { name: 'Healthcare', value: 5, color: '#ffc658', frequency: 1, avgAmount: 250, frequentDay: 'Wednesday' },
  { name: 'Shopping', value: 5, color: '#ff7300', frequency: 2, avgAmount: 50, frequentDay: 'Saturday' },
];

const MOCK_SUBSCRIPTIONS = [
  { 
    id: 1,
    name: 'Netflix',
    cost: 15.99,
    billingDate: '15th',
    category: 'Entertainment',
    logo: '🎬',
    status: 'active'
  },
  {
    id: 2,
    name: 'Spotify Premium',
    cost: 9.99,
    billingDate: '1st',
    category: 'Entertainment',
    logo: '🎵',
    status: 'active'
  },
  {
    id: 3,
    name: 'Amazon Prime',
    cost: 14.99,
    billingDate: '5th',
    category: 'Shopping',
    logo: '📦',
    status: 'active'
  },
  {
    id: 4,
    name: 'Gym Membership',
    cost: 49.99,
    billingDate: '1st',
    category: 'Health',
    logo: '💪',
    status: 'active'
  },
  {
    id: 5,
    name: 'Cloud Storage',
    cost: 9.99,
    billingDate: '10th',
    category: 'Technology',
    logo: '☁️',
    status: 'active'
  }
];

const RECOMMENDED_QUESTIONS = [
  "How can I reduce my monthly expenses?",
  "What's the best way to start saving for retirement?",
  "Should I pay off debt or invest?",
  "How much should I save for an emergency fund?",
  "Is my spending on entertainment too high?"
];

const AI_GREETING: Message = {
  message: "Hi dear! I'm your Financial Mom, here to help you make smart money decisions. What would you like to know?",
  sender: 'ai'
};

interface Message {
  message: string;
  sender: 'user' | 'ai';
}

export default function Dashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<typeof MOCK_SUBSCRIPTIONS[0] | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([AI_GREETING]);
  const [newMessage, setNewMessage] = useState('');

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }
      
      // Add files to recent uploads
      setRecentFiles(prev => [...acceptedFiles.map(f => f.name), ...prev].slice(0, 5));
      setIsModalOpen(false); // Close modal after successful upload
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  });

  const handleCancelSubscription = (subscription: typeof MOCK_SUBSCRIPTIONS[0]) => {
    setSelectedSubscription(subscription);
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    if (selectedSubscription) {
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === selectedSubscription.id 
            ? { ...sub, status: 'cancelled' } 
            : sub
        )
      );
      setShowCancelModal(false);
      setSelectedSubscription(null);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { message, sender: 'user' }]);
    setNewMessage('');
    setShowChatModal(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        message: `Thanks for asking! Based on your financial data, ${message.toLowerCase().includes('saving') 
          ? 'I recommend setting aside 20% of your income for savings and investments.' 
          : 'I suggest reviewing your spending patterns and creating a budget that aligns with your goals.'}`,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Chat Field */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(newMessage);
                  }
                }}
                placeholder="Talk to your Financial Mom..."
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
              />
              <button
                onClick={() => handleSendMessage(newMessage)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-purple-600 hover:text-purple-700"
              >
                <svg
                  className="h-5 w-5 transform rotate-45"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <span>Upload Statement</span>
          </button>
        </div>

        {/* AI Insights */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium text-gray-800">Spending Alert</h3>
                  <p className="text-gray-600 mt-1">
                    Your entertainment spending is 5% higher than last month. Consider reducing eating out to save $150 monthly.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      handleSendMessage("Tell me more about my entertainment spending and how I can reduce it");
                    }}
                    className="w-full sm:w-auto px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tell me more
                  </button>
                  <button
                    onClick={() => {
                      alert("Setting up entertainment spending limit of $300...");
                    }}
                    className="w-full sm:w-auto px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Set Budget Limit
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium text-gray-800">Savings Opportunity</h3>
                  <p className="text-gray-600 mt-1">
                    You could save an additional $200 monthly by reducing transportation costs. Consider carpooling or public transit.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      handleSendMessage("Tell me more about transportation savings and carpooling options");
                    }}
                    className="w-full sm:w-auto px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tell me more
                  </button>
                  <button
                    onClick={() => {
                      alert("Opening nearby carpooling options...");
                    }}
                    className="w-full sm:w-auto px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Find Carpool
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Modal */}
        <Modal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          title="Chat with Your Financial Mom"
        >
          <div className="flex flex-col h-[80vh] sm:h-[600px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2 sm:px-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2 flex-shrink-0">
                      👩
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Recommended Questions */}
            {messages.length === 1 && (
              <div className="border-t border-gray-200 pt-4 px-2 sm:px-0">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Recommended Questions:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {RECOMMENDED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-200 pt-4 mt-4 px-2 sm:px-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(newMessage);
                    }
                  }}
                  placeholder="Ask me anything about your finances..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => handleSendMessage(newMessage)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Upload Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Upload Financial Statement"
        >
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center
              transition-colors cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            `}
          >
            <input {...getInputProps()} />
            
            {isUploading ? (
              <div className="space-y-4">
                <p className="text-gray-600">Uploading... {uploadProgress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <p className="text-gray-600 text-lg">
                  {isDragActive
                    ? "Drop your files here"
                    : "Drag and drop your financial statements, or click to select files"}
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, CSV, XLS, XLSX
                </p>
              </div>
            )}
          </div>

          {recentFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Uploads</h3>
              <ul className="space-y-2">
                {recentFiles.map((file, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-4 w-4 mr-2 text-green-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Spending</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">$5,240</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Biggest Expense</h3>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">Housing</p>
            <p className="text-sm text-gray-500 mt-1">30% of total</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Savings Rate</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">15%</p>
            <p className="text-sm text-gray-500 mt-1">Of monthly income</p>
          </div>
        </div>

        {/* Spending Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Spending Distribution</h2>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('chart')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Chart
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Table
              </button>
            </div>
          </div>
          
          {viewMode === 'chart' ? (
            <div className="h-[300px] sm:h-[400px] -mx-4 sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius="90%"
                    innerRadius="0%"
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {MOCK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="-mx-4 sm:mx-0 overflow-x-auto">
              <div className="min-w-[800px] sm:min-w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Spent
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weekly Frequency
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Amount per Use
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Most Frequent Day
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {MOCK_DATA.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(item.value * 50).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.frequency}x
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.avgAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.frequentDay}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Subscriptions Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold">Active Subscriptions</h2>
            <p className="text-sm text-gray-500">
              Total Monthly: ${subscriptions
                .filter(sub => sub.status === 'active')
                .reduce((acc, sub) => acc + sub.cost, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map(subscription => (
              <div 
                key={subscription.id}
                className={`p-4 rounded-lg border ${
                  subscription.status === 'active' 
                    ? 'border-gray-200' 
                    : 'border-gray-200 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{subscription.logo}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{subscription.name}</h3>
                      <p className="text-sm text-gray-500">Bills on the {subscription.billingDate}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${subscription.cost.toFixed(2)}/mo
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-sm ${
                    subscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleCancelSubscription(subscription)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel Subscription Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedSubscription(null);
          }}
          title="Cancel Subscription"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to cancel your subscription to{' '}
              <span className="font-medium text-gray-900">
                {selectedSubscription?.name}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500">
              You will continue to have access until the end of your current billing period.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedSubscription(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
} 