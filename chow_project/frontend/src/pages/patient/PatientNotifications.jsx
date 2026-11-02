import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../services/notificationApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const PatientNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const data = await notificationApi.getNotifications(user?.id || 201);
        setNotifications(data);
      } catch (err) {
        setError('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (e) {
      // ignore
    }
  };

  const filteredNotifs = activeTab === 'All'
    ? notifications
    : notifications.filter(n => n.type.toLowerCase() === activeTab.toLowerCase());

  const getBadgeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'emergency': return 'bg-danger';
      case 'token': return 'bg-warning text-dark';
      case 'queue': return 'bg-info text-white';
      case 'appointment': default: return 'bg-primary';
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Notifications & Alerts</h3>
            <p className="text-muted">Stay updated on your appointment status, token calls, and queue updates</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {/* Filter Tabs */}
          <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
            {['All', 'Appointment', 'Queue', 'Token', 'Emergency'].map(tab => (
              <button
                key={tab}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} Alerts
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching notifications..." />
          ) : (
            <div className="d-flex flex-column gap-3">
              {filteredNotifs.length > 0 ? (
                filteredNotifs.map(n => (
                  <div key={n.id} className={`card card-custom p-3 ${n.unread ? 'border-start border-4 border-primary bg-light-subtle' : ''}`}>
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="d-flex gap-3">
                        <span className={`badge ${getBadgeClass(n.type)} align-self-start mt-1`}>{n.type}</span>
                        <div>
                          <h6 className="fw-bold text-dark mb-1">{n.title}</h6>
                          <p className="text-secondary small mb-1">{n.message}</p>
                          <small className="text-muted"><i className="bi bi-clock me-1"></i>{n.time}</small>
                        </div>
                      </div>
                      {n.unread && (
                        <button
                          className="btn btn-sm btn-link text-primary text-decoration-none"
                          onClick={() => handleMarkAsRead(n.id)}
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center py-4 bg-white rounded border">No {activeTab} notifications found.</p>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PatientNotifications;
