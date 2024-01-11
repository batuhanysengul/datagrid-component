import React, { useMemo, useEffect, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';

const CustomTable = ({ apiLink, columnWidths, columnColors, fontColors, textAlign, padding, centered, divHeight, divWidth, divPosition, gridRow, gridColumn}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(apiLink);
        setData(result.data);
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchData();
  }, [apiLink]);

  const columns = useMemo(() => {
    return Object.keys(data[0] || {}).map((key, index) => ({
      Header: key,
      accessor: key,
      style: {
        width: columnWidths[index],
        backgroundColor: columnColors[index],
        color: fontColors[index],
        textAlign: textAlign[index],
        padding: padding[index],
      },
    }));
  }, [data, columnWidths, columnColors, fontColors, textAlign, padding]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div style={{ display: centered ? 'flex' : 'block', justifyContent: 'center', width: divWidth, position: divPosition , gridRow, gridColumn}}>
      <div style={{ maxHeight: divHeight, overflowY: 'auto' }}>
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
            {rows.map(row => {
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
      </div>
    </div>
  );
};

export default CustomTable;