import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage = 5,
  totalItems = 0
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  // Calculate start and end page numbers to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      gap: '10px',
      marginTop: '20px',
      padding: '15px',
      borderTop: '1px solid #e5e7eb'
    }}>

      <div style={{ 
        fontSize: '14px', 
        color: '#6b7280',
        marginBottom: '5px'
      }}>
        Showing {startItem}-{endItem} of {totalItems} items
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '5px' 
      }}>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
            color: currentPage === 1 ? '#9ca3af' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Previous
        </button>

        {/* Show first page if not in range */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '14px',
                minWidth: '40px'
              }}
            >
              1
            </button>
            {startPage > 2 && (
              <span style={{ color: '#9ca3af', padding: '0 5px' }}>...</span>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: currentPage === number ? '#8b5cf6' : 'white',
              color: currentPage === number ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: currentPage === number ? '600' : '500',
              minWidth: '40px'
            }}
          >
            {number}
          </button>
        ))}

        {/* Show last page if not in range */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span style={{ color: '#9ca3af', padding: '0 5px' }}>...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '14px',
                minWidth: '40px'
              }}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
            color: currentPage === totalPages ? '#9ca3af' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
