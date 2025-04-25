import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './FilterPanel.css';

function FilterPanel({ doctors, setFilteredDoctors }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [consultType, setConsultType] = useState(searchParams.get('consultType') || '');
  const [specialties, setSpecialties] = useState(searchParams.getAll('specialty') || []);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');
  
  // Get unique specialties from doctors data
  const allSpecialties = [...new Set(doctors.flatMap(doctor => doctor.speciality || []))].sort();

  // Apply filters from URL on component mount
  useEffect(() => {
    applyFilters();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
    updateUrlParams();
  }, [consultType, specialties, sortBy]);

  const applyFilters = () => {
    let filtered = [...doctors];
    
    // Apply consultation type filter
    if (consultType) {
      filtered = filtered.filter(doctor => 
        consultType === 'Video Consult' ? doctor.videoConsult : !doctor.videoConsult
      );
    }
    
    // Apply specialty filters
    if (specialties.length > 0) {
      filtered = filtered.filter(doctor => 
        specialties.some(specialty => doctor.speciality && doctor.speciality.includes(specialty))
      );
    }
    
    // Apply sorting
    if (sortBy === 'fees') {
      filtered.sort((a, b) => a.fees - b.fees);
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    }
    
    setFilteredDoctors(filtered);
  };

  const updateUrlParams = () => {
    setSearchParams(params => {
      // Handle consultation type
      if (consultType) {
        params.set('consultType', consultType);
      } else {
        params.delete('consultType');
      }
      
      // Handle specialties
      params.delete('specialty');
      specialties.forEach(spec => {
        params.append('specialty', spec);
      });
      
      // Handle sorting
      if (sortBy) {
        params.set('sortBy', sortBy);
      } else {
        params.delete('sortBy');
      }
      
      return params;
    });
  };

  const handleConsultTypeChange = (type) => {
    setConsultType(prevType => prevType === type ? '' : type);
  };

  const handleSpecialtyChange = (specialty) => {
    setSpecialties(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  const handleSortChange = (sort) => {
    setSortBy(prevSort => prevSort === sort ? '' : sort);
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Consultation Mode</h3>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              checked={consultType === 'Video Consult'}
              onChange={() => handleConsultTypeChange('Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label>
            <input
              type="radio"
              checked={consultType === 'In Clinic'}
              onChange={() => handleConsultTypeChange('In Clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Speciality</h3>
        <div className="filter-options specialty-options">
          {allSpecialties.map(specialty => (
            <label key={specialty}>
              <input
                type="checkbox"
                checked={specialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
                data-testid={`filter-specialty-${specialty ? specialty.replace('/', '-') : ''}`}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort By</h3>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              checked={sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          <label>
            <input
              type="radio"
              checked={sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
