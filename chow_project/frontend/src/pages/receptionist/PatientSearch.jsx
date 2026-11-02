import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { receptionistApi } from '../../services/receptionistApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const PatientSearch = () => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const results = await receptionistApi.searchPatients(searchQuery);
      setPatients(results);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Patient ID', accessor: 'id', render: (r) => <span className="fw-bold">#{r.id}</span> },
    { header: 'Name', accessor: 'name', render: (r) => <span className="fw-bold text-dark">{r.name}</span> },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Age / Gender', render: (r) => `${r.age} yrs / ${r.gender}` },
    { header: 'Chronic Conditions', accessor: 'chronicConditions', render: (r) => r.chronicConditions || 'None' },
    {
      header: 'Actions',
      render: (r) => (
        <Link to={`/receptionist/patients/${r.id}`} className="btn btn-sm btn-outline-primary">
          <i className="bi bi-person-lines-fill me-1"></i> Patient File
        </Link>
      )
    }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Patient Search & Records</h3>
            <p className="text-muted">Find patients by Name, Patient ID, Phone Number, or Appointment ID</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          <div className="card card-custom p-4 mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-9">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder="Search by Patient Name, ID, Phone (+1 555-...), or Appointment ID..."
                />
              </div>
              <div className="col-md-3">
                <Link to="/receptionist/walkins" className="btn btn-primary w-100">
                  <i className="bi bi-person-plus me-1"></i> New Walk-in Registration
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Searching patient records..." />
          ) : (
            <div className="card card-custom p-3">
              <DataTable
                columns={columns}
                data={patients}
                keyField="id"
                emptyMessage="No patient record matches your search terms."
              />
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PatientSearch;
