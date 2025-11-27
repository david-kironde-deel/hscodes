import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../config/axios';

const ClassificationForm = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    destination_country: '',
    estimated_value: 1000
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const countries = [
    // { code: 'US', name: 'United States' },
    // { code: 'CA', name: 'Canada' },
    // { code: 'GB', name: 'United Kingdom' },
    // { code: 'DE', name: 'Germany' },
    // { code: 'FR', name: 'France' },
    // { code: 'AU', name: 'Australia' },
    // { code: 'JP', name: 'Japan' },
    // { code: 'CN', name: 'China' },
    // { code: 'MX', name: 'Mexico' },
    // { code: 'BR', name: 'Brazil' },
    // { code: 'IN', name: 'India' }
    { code: 'KE', name: 'Kenya' },
    { code: 'UG', name: 'Uganda' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'BI', name: 'Burundi' },
    // { code: 'SS', name: 'South Sudan' },
    // { code: 'ET', name: 'Ethiopia' },
    // { code: 'ER', name: 'Eritrea' },
    // { code: 'DJ', name: 'Djibouti' },
    // { code: 'SO', name: 'Somalia' },
    // { code: 'MG', name: 'Madagascar' },
    // { code: 'MU', name: 'Mauritius' },
    // { code: 'SC', name: 'Seychelles' },
    // { code: 'KM', name: 'Comoros' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/api/classify', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during classification');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getConfidenceText = (score) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">HS Code Classification</h1>
        <p className="page-subtitle">
          Classify your products with the correct Harmonized System codes and get duty estimates for international trade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Classification Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Product Information</h2>
            <p className="card-subtitle">Enter your product details for classification</p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="product_name" className="form-label">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Cotton T-Shirt"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="product_description" className="form-label">
                  Product Description
                </label>
                <textarea
                  id="product_description"
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                  placeholder="Provide detailed description of the product, materials, use case, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="destination_country" className="form-label">
                  Destination Country *
                </label>
                <select
                  id="destination_country"
                  name="destination_country"
                  value={formData.destination_country}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="estimated_value" className="form-label">
                  Estimated Value (USD)
                </label>
                <input
                  type="number"
                  id="estimated_value"
                  name="estimated_value"
                  value={formData.estimated_value}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="1000"
                  min="0"
                  step="0.01"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading"></div>
                    Classifying...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Classify Product
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {result && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Classification Results</h2>
                <p className="card-subtitle">
                  {result.data.destination_country} • {new Date(result.data.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Product Details</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{result.data.product_name}</p>
                      {result.data.product_description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {result.data.product_description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">HS Code Classification</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {result.data.classification.hs_code}
                        </span>
                        <span className={`badge badge-${getConfidenceColor(result.data.classification.confidence_score)}`}>
                          {getConfidenceText(result.data.classification.confidence_score)} Confidence
                        </span>
                      </div>
                      <p className="text-gray-700">{result.data.classification.description}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Confidence Score: {result.data.classification.confidence_score}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Duty Information</h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Duty Rate</p>
                          <p className="text-xl font-bold text-green-600">
                            {result.data.classification.duty_rate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Duty</p>
                          <p className="text-xl font-bold text-green-600">
                            ${result.data.classification.estimated_duty}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Based on estimated value: ${result.data.classification.estimated_value}
                      </p>
                    </div>
                  </div>

                  {result.data.classification.cached && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Result from cache</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="card">
              <div className="card-body text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Classify</h3>
                <p className="text-gray-600">
                  Fill out the form on the left to get started with HS code classification.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassificationForm;
