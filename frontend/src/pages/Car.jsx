import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({ userId: "", userName: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cars from API
    fetch("https://car-rental-website-backend.up.railway.app/api/cars")
      .then((response) => response.json())
      .then((data) => {
        setCars(data.data || data);
        setFilteredCars(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setLoading(false);
      });

    
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
      <div style={{ maxWidth: '88%', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px', color: '#2c3e50' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
            color: '#1e293b',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Available Cars
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '400' }}>
            Select a car to make your booking
          </p>
        </div>

        {/* Search Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#1a365d',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            Search & Select Car
          </h3>
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
              outline: 'none'
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
            <p style={{
              marginTop: '8px',
              color: '#64748b',
              fontSize: '14px'
            }}>
              Showing {filteredCars.length} result{filteredCars.length !== 1 ? 's' : ''} 
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          )}
        </div>
          
        {/* Cars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2px',
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
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#2d3748'
              }}>
                {searchTerm ? 'No Cars Found' : 'No Cars Available'}
              </h3>
              <p style={{ fontSize: '16px', color: '#718096', marginBottom: '16px' }}>
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
                key={car._id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  position: 'relative'
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
                  height: '200px'
                }}>
                  <img
                    src={car.imageUrl || car.image || '/api/placeholder/400/250'}
                    alt={car.model || 'Car'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/250';
                    }}
                  />
                  
                  {/* Price Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1a365d',
                      lineHeight: '1'
                    }}>
                      Rs. {(car.rentPerDay || 0).toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#4a5568',
                      marginTop: '2px'
                    }}>
                      per day
                    </div>
                  </div>
                </div>

                {/* Car Details */}
                <div style={{ padding: '20px' }}>
                  {/* Car Model */}
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1a365d',
                    marginBottom: '16px',
                    lineHeight: '1.2'
                  }}>
                    {car.model || 'Unknown Model'}
                  </h3>
                  
                  {/* Car Specifications Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    {/* Row 1 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: '#f7fafc',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '16px', width: '16px', textAlign: 'center' }}>🏷️</span>
                      <span style={{
                        fontSize: '15px',
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
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: '#f7fafc',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '16px', width: '16px', textAlign: 'center' }}>👥</span>
                      <span style={{
                        fontSize: '15px',
                        color: '#4a5568',
                        fontWeight: '500'
                      }}>
                        {car.passengerCount || 0} seats
                      </span>
                    </div>
                    
                    {/* Row 2 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: '#f7fafc',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '16px', width: '16px', textAlign: 'center' }}>⛽</span>
                      <span style={{
                        fontSize: '15px',
                        color: '#4a5568',
                        fontWeight: '500'
                      }}>
                        {car.fuelCostPerKm || 'N/A'} km/l
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: '#f7fafc',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '16px', width: '16px', textAlign: 'center' }}>📅</span>
                      <span style={{
                        fontSize: '15px',
                        color: '#4a5568',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        Rs. {(car.longPeriodRentPerDay || 0).toLocaleString()}/day (30+)
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
                        fontSize: '18px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.querySelector('.arrow').style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
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


    </div>
  );
};

export default Car;