import React from "react";
import "../styles/Table.css"; 

const Table = ({ columns, data, actions }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
              {columns.map((col) => (
                <td key={col.accessor}>{row[col.accessor]}</td>
              ))}
              {actions && (
                <td className="actions">
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => action.onClick(row)}
                      className={`btn ${action.type}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
