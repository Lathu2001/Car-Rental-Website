import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from '../config/api';

const Car = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({ userId: "", userName: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/cars`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const carsData = data.data || data || [];
        
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError(err.message);
        setCars([]);
        setFilteredCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filter cars based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter((car) =>
        (car.model || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (car.carId || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  }, [searchTerm, cars]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <p>Loading cars...</p>
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '24px' }}>
            Failed to Load Cars
          </h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
      padding: '20px 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    }}>
      {/* Container */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 20px',
        width: '100%'
      }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px', color: '#2c3e50' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
            color: '#1e293b',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Available Cars
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', 
            fontWeight: '400' 
          }}>
            Select a car to make your booking
          </p>
        </div>

        {/* Search Section */}
        <div style={{ marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          <h3 style={{
            color: '#1a365d',
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: 'bold',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Search & Select Car
          </h3>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by car model or registration number..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '15px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white',
                transition: 'all 0.25s ease',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f1f5f9';
                  e.target.style.color = '#1e293b';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#64748b';
                }}
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <p style={{
              marginTop: '8px',
              color: '#64748b',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              Showing {filteredCars.length} result{filteredCars.length !== 1 ? 's' : ''} 
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          )}
        </div>
          
        {/* Cars Grid - Responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'clamp(16px, 3vw, 24px)',
          marginTop: '24px'
        }}>
          {filteredCars.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 20px',
              color: '#4a5568'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {searchTerm ? '🔍' : '🚗'}
              </div>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#2d3748'
              }}>
                {searchTerm ? 'No Cars Found' : 'No Cars Available'}
              </h3>
              <p style={{ 
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                color: '#718096', 
                marginBottom: '16px',
                maxWidth: '400px',
                margin: '0 auto 16px'
              }}>
                {searchTerm 
                  ? `No cars match your search for "${searchTerm}"` 
                  : 'Check back later for new arrivals!'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredCars.map((car) => (
              <div
                key={car._id || car.carId}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  position: 'relative',
                  minWidth: '280px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Car Image Container */}
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: 'clamp(180px, 25vw, 220px)',
                  background: '#f8fafc'
                }}>
                  <img
                    src={car.imageUrl || car.image || 'https://via.placeholder.com/400x250?text=Car+Image'}
                    alt={car.model || 'Car'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=Car+Image';
                    }}
                    loading="lazy"
                  />
                  
                  {/* Price Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{
                      fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                      fontWeight: 'bold',
                      color: '#1a365d',
                      lineHeight: '1'
                    }}>
                      {formatCurrency(car.rentPerDay)}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#4a5568',
                      marginTop: '2px'
                    }}>
                      per day
                    </div>
                  </div>
                </div>

                {/* Car Details */}
                <div style={{ padding: 'clamp(16px, 3vw, 20px)' }}>
                  {/* Car Model */}
                  <h3 style={{
                    fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                    fontWeight: 'bold',
                    color: '#1a365d',
                    marginBottom: '16px',
                    lineHeight: '1.2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {car.model || 'Unknown Model'}
                  </h3>
                  
                  {/* Car Specifications Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    {/* Registration */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 8px',
                      background: '#f7fafc',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '14px', width: '14px', textAlign: 'center' }}>🏷️</span>
                      <span style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        color: '#4a5568',
                        fontWeight: '500',
                        flex: '1',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {car.carId || 'N/A'}
                      </span>
                    </div>
                    
                    {/* Seats */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 8px',
                      background: '#f7fafc',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '14px', width: '14px', textAlign: 'center' }}>👥</span>
                      <span style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        color: '#4a5568',
                        fontWeight: '500'
                      }}>
                        {car.passengerCount || 0} seats
                      </span>
                    </div>
                    
                    {/* Fuel Efficiency */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 8px',
                      background: '#f7fafc',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '14px', width: '14px', textAlign: 'center' }}>⛽</span>
                      <span style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        color: '#4a5568',
                        fontWeight: '500'
                      }}>
                        {car.fuelCostPerKm || 'N/A'} km/l
                      </span>
                    </div>
                    
                    {/* Long Period Rate */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 8px',
                      background: '#f7fafc',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '14px', width: '14px', textAlign: 'center' }}>📅</span>
                      <span style={{
                        fontSize: 'clamp(0.6rem, 1.8vw, 0.75rem)',
                        color: '#4a5568',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {formatCurrency(car.longPeriodRentPerDay)}/30+
                      </span>
                    </div>
                  </div>

                  {/* Select Button */}
                  <Link to={`/login`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        const arrow = e.currentTarget.querySelector('.arrow');
                        if (arrow) arrow.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        const arrow = e.currentTarget.querySelector('.arrow');
                        if (arrow) arrow.style.transform = 'translateX(0)';
                      }}
                    >
                      <span>Book Now</span>
                      <span 
                        className="arrow"
                        style={{
                          fontSize: '16px',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 1200px) {
          /* 3 columns on medium screens */
        }
        
        @media (max-width: 768px) {
          /* 2 columns on tablets */
        }
        
        @media (max-width: 480px) {
          /* 1 column on mobile */
        }
      `}</style>
    </div>
  );
};

export default Car;