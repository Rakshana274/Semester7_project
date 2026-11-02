import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DashboardCard from '../../components/common/DashboardCard';
import ChartCard from '../../components/common/ChartCard';
import DataTable from '../../components/common/DataTable';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getStatistics();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch hospital statistics.');
    } finally {
      setLoading(false);
    }
  };

  const deptColumns = [
    { header: 'Department', accessor: 'department', render: (r) => <span className="fw-bold">{r.department}</span> },
    { header: 'Total Appointments', accessor: 'total' },
    { header: 'Completed Consultations', accessor: 'completed', render: (r) => <span className="text-success fw-bold">{r.completed}</span> },
    { header: 'Completion Rate', render: (r) => `${Math.round((r.completed / r.total) * 100)}%` }
  ];

  const docColumns = [
    { header: 'Doctor Name', accessor: 'name', render: (r) => <span className="fw-bold text-dark">{r.name}</span> },
    { header: 'Department', accessor: 'department' },
    { header: 'Patients Seen', accessor: 'patientsSeen', render: (r) => <span className="badge bg-primary fs-6">{r.patientsSeen}</span> },
    { header: 'Avg Consultation Time', accessor: 'avgTime' }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-1">OPD Operational Analytics & Statistics</h3>
              <p className="text-muted mb-0">Comprehensive performance reporting, priority breakdown & throughput metrics</p>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={fetchStats}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
            </button>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Generating hospital statistical reports..." />
          ) : stats ? (
            <>
              {/* Required Stat Cards */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Total Appointments"
                    value={stats.totalAppointments}
                    subtitle="System volume"
                    icon="bi-journal-medical"
                    color="primary"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Completed Appointments"
                    value={stats.completedAppointments}
                    subtitle="Successfully finished"
                    icon="bi-check-circle"
                    color="success"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="Cancelled Appointments"
                    value={stats.cancelledAppointments}
                    subtitle="Patient/System cancels"
                    icon="bi-x-circle"
                    color="danger"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <DashboardCard
                    title="No-Shows"
                    value={stats.noShows}
                    subtitle="Missed appointment slots"
                    icon="bi-person-x"
                    color="warning"
                  />
                </div>
              </div>

              {/* Priority Distribution & Capacity Utilization */}
              <div className="row g-4 mb-4">
                <div className="col-lg-6">
                  <ChartCard
                    title="Priority Distribution"
                    type="bar"
                    labels={Object.keys(stats.priorityDistribution)}
                    data={Object.values(stats.priorityDistribution)}
                    subtitle="Breakdown by urgency level"
                  />
                </div>

                <div className="col-lg-6">
                  <div className="card card-custom p-4 h-100">
                    <h6 className="fw-bold text-dark mb-3"><i className="bi bi-pie-chart me-2 text-danger"></i>Capacity Utilization Breakdown</h6>
                    <div className="text-center my-3">
                      <h1 className="display-4 fw-bold text-danger mb-0">{stats.capacityUtilization}%</h1>
                      <span className="text-muted">Global OPD Utilization</span>
                    </div>

                    <div className="progress mb-3" style={{ height: '16px' }}>
                      <div
                        className="progress-bar bg-danger"
                        role="progressbar"
                        style={{ width: `${stats.capacityUtilization}%` }}
                      ></div>
                    </div>

                    <p className="text-muted small mb-0 text-center">
                      Optimal capacity threshold set at 75-85%. Current throughput indicates balanced OPD load.
                    </p>
                  </div>
                </div>
              </div>

              {/* Department Statistics Table */}
              <div className="card card-custom p-4 mb-4">
                <h6 className="fw-bold text-dark mb-3"><i className="bi bi-building me-2 text-primary"></i>Department Statistics</h6>
                <DataTable columns={deptColumns} data={stats.departmentStats} keyField="department" />
              </div>

              {/* Doctor Statistics Table */}
              <div className="card card-custom p-4">
                <h6 className="fw-bold text-dark mb-3"><i className="bi bi-person-heart me-2 text-success"></i>Doctor Productivity Statistics</h6>
                <DataTable columns={docColumns} data={stats.doctorStats} keyField="name" />
              </div>
            </>
          ) : (
            <p>No statistics data available.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Statistics;
