import React, { useState, useEffect } from 'react';
import { History, Clock, TrendingUp, Globe } from 'lucide-react';
import api from '../config/axios';

const RecentSearches = () => {
  const [searches, setSearches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [searchesRes, statsRes] = await Promise.all([
        api.get('/api/searches/recent?limit=20'),
        api.get('/api/searches/stats')
      ]);

      setSearches(searchesRes.data.data.searches);
      setStats(statsRes.data.data);
    } catch (err) {
      setError('Failed to load recent searches');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">Recent Searches</h1>
          <p className="page-subtitle">View your classification history and statistics</p>
        </div>
        <div className="text-center">
          <div className="loading mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recent searches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">Recent Searches</h1>
          <p className="page-subtitle">View your classification history and statistics</p>
        </div>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Recent Searches</h1>
        <p className="page-subtitle">View your classification history and statistics</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'recent'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Recent Searches
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'stats'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Statistics
        </button>
      </div>

      {activeTab === 'recent' && (
        <div className="space-y-4">
          {searches.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No searches yet</h3>
                <p className="text-gray-600">
                  Start classifying products to see your search history here.
                </p>
              </div>
            </div>
          ) : (
            searches.map((search) => (
              <div key={search.id} className="card">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{search.product_name}</h3>
                        <span className="badge badge-info">{search.destination_country}</span>
                        <span className={`badge badge-${getConfidenceColor(search.classification.confidence_score)}`}>
                          {search.classification.confidence_score}% Confidence
                        </span>
                      </div>

                      {search.product_description && (
                        <p className="text-gray-600 mb-3">{search.product_description}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">HS Code</p>
                          <p className="text-lg font-bold text-blue-600">
                            {search.classification.hs_code}
                          </p>
                          <p className="text-sm text-gray-600">
                            {search.classification.description}
                          </p>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Duty Rate</p>
                          <p className="text-lg font-bold text-green-600">
                            {search.classification.duty_rate}%
                          </p>
                          <p className="text-sm text-gray-600">
                            Est. Duty: ${search.classification.estimated_duty}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Searched</p>
                          <p className="text-sm font-medium">
                            {formatDate(search.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Searches */}
          <div className="card">
            <div className="card-body text-center">
              <History className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">{stats.total_searches}</h3>
              <p className="text-gray-600">Total Searches</p>
            </div>
          </div>

          {/* Average Confidence */}
          <div className="card">
            <div className="card-body text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">
                {Math.round(stats.average_confidence * 100)}%
              </h3>
              <p className="text-gray-600">Avg. Confidence</p>
            </div>
          </div>

          {/* Top Country */}
          <div className="card">
            <div className="card-body text-center">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.searches_by_country[0]?.count || 0}
              </h3>
              <p className="text-gray-600">
                {stats.searches_by_country[0]?.destination_country || 'N/A'}
              </p>
            </div>
          </div>

          {/* Most Common HS Code */}
          <div className="card">
            <div className="card-body text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-orange-600 font-bold text-sm">HS</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {stats.most_common_hs_codes[0]?.hs_code || 'N/A'}
              </h3>
              <p className="text-gray-600 text-sm">
                {stats.most_common_hs_codes[0]?.count || 0} searches
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Searches by Country */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Searches by Country</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {stats.searches_by_country.slice(0, 10).map((country, index) => (
                  <div key={country.destination_country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{country.destination_country}</span>
                    </div>
                    <span className="badge badge-info">{country.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Most Common HS Codes */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Most Common HS Codes</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {stats.most_common_hs_codes.slice(0, 10).map((hsCode, index) => (
                  <div key={hsCode.hs_code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div>
                        <span className="font-medium">{hsCode.hs_code}</span>
                        <p className="text-sm text-gray-600">{hsCode.hs_description}</p>
                      </div>
                    </div>
                    <span className="badge badge-info">{hsCode.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
