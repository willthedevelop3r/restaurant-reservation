import React from 'react';

function DisplayTables({ tables, handleFinish }) {
  return (
    <div className='container mt-3'>
      <h2 className='font-weight-bold mb-3 text-center'>Tables</h2>
      {tables.length ? (
        <div className='row justify-content-center'>
          {tables.map((table) => (
            <div
              key={table.table_id}
              className='col-lg-4 col-md-6 col-sm-12 mb-3'
            >
              <div className='card text-center' style={{ width: '100%' }}>
                <div className='card-body'>
                  <h5 className='card-title'>{table.table_name}</h5>
                  <h6 className='card-subtitle mb-2 text-muted'>
                    Capacity: {table.capacity}
                  </h6>
                  <span data-table-id-status={table.table_id}>
                    Status: {table.reservation_id ? 'Occupied' : 'Free'}
                  </span>
                  {table.reservation_id && (
                    <div className='mt-2'>
                      <button
                        data-table-id-finish={table.table_id}
                        onClick={() => handleFinish(table.table_id)}
                        className='btn btn-primary'
                      >
                        Finish
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='row justify-content-center'>
          <div className='col-lg-4 col-md-6 col-sm-12'>
            <div className='card text-center' style={{ width: '100%' }}>
              <div className='card-body'>
                <p className='card-text'>No tables available.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayTables;
