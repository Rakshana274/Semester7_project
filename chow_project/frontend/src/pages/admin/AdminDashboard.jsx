import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { appointmentApi } from '../../services/appointmentApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DashboardCard from '../../components/common/DashboardCard';
import ChartCard from '../../components/common/ChartCard';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPatients: 240,
    totalDoctors: 22,
    departmentsCount: 6,
    todaysAppointments: 104,
    highPriority: 32,
    mediumPriority: 44,
    lowPriority: 20,
    availableCapacity: 64
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const depts = await adminApi.getDepartments();
        const docs = await adminApi.getDoctors();
        const apts = await appointmentApi.getAppointments();
        const cap = await adminApi.getCapacityConfig();

        const high = apts.filter(a => a.priority === 'High' || a.priority === 'Emergency').length;
        const med = apts.filter(a => a.priority === 'Medium').length;
        const low = apts.filter(a => a.priority === 'Low').length;

        setStats({
          totalPatients: 240,
          totalDoctors: docs.length,
          departmentsCount: depts.length,
          todaysAppointments: apts.length,
          highPriority: high,
          mediumPriority: med,
          lowPriority: low,
          availableCapacity: cap.totalCapacity - cap.currentBookedNormal - cap.currentBookedWalkin
        });
      } catch (err) {
        setError('Failed to fetch admin stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h3 className="fw-bold text-dark mb-1">Admin Operations Center</h3>
              <p className="text-muted mb-0">Master control dashboard & real-time OPD metrics</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger btn-sm" onClick={() => navigate('/admin/settings')}>
                <i className="bi bi-gear me-1"></i> System Settings
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => navigate('/admin/statistics')}>
                <i className="bi bi-bar-chart me-1"></i> Full Statistics
              </button>
            </div>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Loading master dashboard analytics..." />
          ) : (
            <>
              {/* Required 8 Metric Cards */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Total Patients"
                    value={stats.totalPatients}
                    subtitle="Registered in system"
                    icon="bi-people"
                    color="primary"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Total Doctors"
                    value={stats.totalDoctors}
                    subtitle="Active OPD specialists"
                    icon="bi-heart-pulse"
                    color="success"
                    onClick={() => navigate('/admin/doctors')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Departments"
                    value={stats.departmentsCount}
                    subtitle="Hospital OPD units"
                    icon="bi-building"
                    color="info"
                    onClick={() => navigate('/admin/departments')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Today's Appointments"
                    value={stats.todaysAppointments}
                    subtitle="Total scheduled & walk-in"
                    icon="bi-calendar-check"
                    color="warning"
                  />
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="High Priority"
                    value={stats.highPriority}
                    subtitle="Triage Score > 75"
                    icon="bi-exclamation-triangle"
                    color="danger"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Medium Priority"
                    value={stats.mediumPriority}
                    subtitle="Standard triage tier"
                    icon="bi-dash-circle"
                    color="primary"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Low Priority"
                    value={stats.lowPriority}
                    subtitle="Routine consultations"
                    icon="bi-check-circle"
                    color="success"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Available Capacity"
                    value={stats.availableCapacity}
                    subtitle="Remaining OPD slots"
                    icon="bi-pie-chart"
                    color="purple"
                    onClick={() => navigate('/admin/capacity')}
                  />
                </div>
              </div>

              {/* Required 3 Charts */}
              <div className="row g-4 mb-4">
                <div className="col-lg-4">
                  <ChartCard
                    title="Appointments by Priority"
                    type="bar"
                    labels={['Emergency', 'High', 'Medium', 'Low']}
                    data={[8, stats.highPriority, stats.mediumPriority, stats.lowPriority]}
                    subtitle="Current triage distribution"
                  />
                </div>

                <div className="col-lg-4">
                  <ChartCard
                    title="Appointments by Department"
                    type="horizontalBar"
                    labels={['Cardiology', 'General OPD', 'Orthopedics', 'Pediatrics', 'Neurology']}
                    data={[28, 42, 18, 16, 10]}
                    subtitle="Department load distribution"
                  />
                </div>

                <div className="col-lg-4">
                  <ChartCard
                    title="Daily Queue Statistics"
                    type="bar"
                    labels={['09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM']}
                    data={[14, 26, 35, 18, 12, 8]}
                    subtitle="Hourly patient check-in volume"
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
