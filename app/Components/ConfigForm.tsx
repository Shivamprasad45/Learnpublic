import { ConfigFormData } from '@/type';
import { useState } from 'react';
interface ConfigFormProps {
  initialData?: Partial<ConfigFormData>;
  onSubmit: (data: ConfigFormData) => Promise<void>;
}

export default function ConfigForm({ initialData, onSubmit }: ConfigFormProps) {

  const [formData, setFormData] = useState<ConfigFormData>({
    USER_ID: '',
    GITHUB_TOKEN: initialData?.GITHUB_TOKEN || '',
    GITHUB_WEBHOOK_SECRET: initialData?.GITHUB_WEBHOOK_SECRET || '',
    GITHUB_USERNAME: initialData?.GITHUB_USERNAME || '',
    GITHUB_REPO: initialData?.GITHUB_REPO || '',
    TWITTER_API_KEY: initialData?.TWITTER_API_KEY || '',
    TWITTER_API_SECRET: initialData?.TWITTER_API_SECRET || '',
    TWITTER_ACCESS_TOKEN: initialData?.TWITTER_ACCESS_TOKEN || '',
    TWITTER_ACCESS_SECRET: initialData?.TWITTER_ACCESS_SECRET || '',
  });

  console.log(formData ,"==================================================")
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* GitHub Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">GitHub Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="GITHUB_TOKEN" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Token *
            </label>
            <input
              type="password"
              id="GITHUB_TOKEN"
              name="GITHUB_TOKEN"
              value={formData.GITHUB_TOKEN}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your GitHub personal access token"
            />
          </div>

          <div>
            <label htmlFor="GITHUB_WEBHOOK_SECRET" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Webhook Secret
            </label>
            <input
              type="text"
              id="GITHUB_WEBHOOK_SECRET"
              name="GITHUB_WEBHOOK_SECRET"
              value={formData.GITHUB_WEBHOOK_SECRET}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="shimmering-cat-1234"
            />
          </div>

          <div>
            <label htmlFor="GITHUB_USERNAME" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Username *
            </label>
            <input
              type="text"
              id="GITHUB_USERNAME"
              name="GITHUB_USERNAME"
              value={formData.GITHUB_USERNAME}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Shivamprasad45"
            />
          </div>

          <div>
            <label htmlFor="GITHUB_REPO" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository
            </label>
            <input
              type="text"
              id="GITHUB_REPO"
              name="GITHUB_REPO"
              value={formData.GITHUB_REPO}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username/repo-name"
            />
          </div>
        </div>
      </div>

      {/* Twitter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Twitter Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="TWITTER_API_KEY" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter API Key *
            </label>
            <input
              type="password"
              id="TWITTER_API_KEY"
              name="TWITTER_API_KEY"
              value={formData.TWITTER_API_KEY}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="xxxxxxxxxxxxx"
            />
          </div>

          <div>
            <label htmlFor="TWITTER_API_SECRET" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter API Secret *
            </label>
            <input
              type="password"
              id="TWITTER_API_SECRET"
              name="TWITTER_API_SECRET"
              value={formData.TWITTER_API_SECRET}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="xxxxxxxxxxxxx"
            />
          </div>

          <div>
            <label htmlFor="TWITTER_ACCESS_TOKEN" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter Access Token *
            </label>
            <input
              type="password"
              id="TWITTER_ACCESS_TOKEN"
              name="TWITTER_ACCESS_TOKEN"
              value={formData.TWITTER_ACCESS_TOKEN}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="xxxxxxxxxxxxx"
            />
          </div>

          <div>
            <label htmlFor="TWITTER_ACCESS_SECRET" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter Access Secret *
            </label>
            <input
              type="password"
              id="TWITTER_ACCESS_SECRET"
              name="TWITTER_ACCESS_SECRET"
              value={formData.TWITTER_ACCESS_SECRET}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="xxxxxxxxxxxxx"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}