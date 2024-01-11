import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import axios from 'axios';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <span>
      Ara:{' '}
      <input
        value={globalFilter || ''}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined); 
        }}
        placeholder={`${count} satır bulunmaktadır.`}
      />
    </span>
  );
}

const CustomTable = ({ apiLink, columnWidths, columnColors, fontColors, textAlign, padding, centered, divHeight, divWidth, divPosition, gridRow, gridColumn, columnNames }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(apiLink);
        setData(result.data);
        setLoading(false);
      } catch (error) {
        console.error('API Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiLink]);

  const columns = useMemo(() => {
    return Object.keys(data[0] || {}).map((key, index) => ({
      Header: columnNames[index] || key,
      accessor: key,
      style: {
        width: columnWidths[index],
        backgroundColor: columnColors[index],
        color: fontColors[index],
        textAlign: textAlign[index],
        padding: padding[index],
      },
    }));
  }, [data, columnWidths, columnColors, fontColors, textAlign, padding, columnNames]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter, 
    usePagination
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: centered ? 'flex' : 'block', justifyContent: 'center', width: divWidth, position: divPosition, gridRow, gridColumn }}>
      <div style={{ maxHeight: divHeight, overflowY: 'auto' }}>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <table {...getTableProps()} style={{ border: 'solid 1px black' }}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} style={column.style}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} style={cell.column.style}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Sayfa{' '}
            <strong>
              {pageIndex + 1} / {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Sayfaya git:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
        </div>
      </div>
    </div>
  );
};

export default CustomTable;