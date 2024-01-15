import React, { useMemo, useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
//çok önemli değil gerçek projede kullanılır mı bilmiyorum
import BeatLoader from "react-spinners/BeatLoader";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <span>
      Ara:{" "}
      <input
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
        placeholder={`${count} satır bulunmaktadır.`}
      />
    </span>
  );
}

function MobileRow({ row, columnNames }) {
  return (
    <div className="mobile-row">
      {row.cells.map((cell, i) => (
        <div key={i}>
          <strong>{columnNames[i]}: </strong>
          {cell.render("Cell")}
        </div>
      ))}
    </div>
  );
}

const CustomTable = ({
  apiLink,
  columnWidths,
  textAlign,
  padding,
  centered,
  divHeight,
  divWidth,
  divPosition,
  gridRow,
  gridColumn,
  columnNames
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(apiLink);
        setData(result.data);
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
      }

      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    };

    fetchData();
  }, [apiLink]);

  const columns = useMemo(() => {
    return Object.keys(data[0] || {}).map((key, index) => ({
      Header: columnNames[index] || key,
      accessor: key,
      style: {
        width: columnWidths[index],
        textAlign: textAlign[index],
        padding: padding[index],
      },
    }));
  }, [data, columnWidths, textAlign, padding, columnNames]);

  
function getCellStyle(index) {
  return {
    width: `${columnWidths[index]}px`,
    textAlign: textAlign[index],
    padding: padding[index],
  };
}

  const {
    preGlobalFilteredRows,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns: columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div>
          <BeatLoader color="#4A90E2" />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: centered ? "flex" : "block",
        justifyContent: "center",
        width: divWidth,
        position: divPosition,
        gridRow,
        gridColumn,
      }}
    >
      <div style={{ maxHeight: divHeight, overflowY: "auto" }}>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <table className="resp-table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {isMobile
              ? page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <MobileRow key={i} row={row} columnNames={columnNames} />
                  );
                })
              : page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    style={{
                      backgroundColor: i % 2 === 0 ? "lightgrey" : "white",
                    }}
                  >
                    {row.cells.map((cell, i) => (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          ...cell.getCellProps().style,
                          ...getCellStyle(i),
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
                  
                })}
            ;
          </tbody>
        </table>
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            Sayfa{" "}
            <strong>
              {pageIndex + 1} / {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Sayfaya git:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
