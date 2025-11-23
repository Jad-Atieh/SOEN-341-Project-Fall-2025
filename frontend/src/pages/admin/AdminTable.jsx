import React from "react";
import "../../styles/Table.css";
const AdminTable = ({ columns, data, getActions }) => {
return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
            {getActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
              {columns.map((col) => (
               <td key={col.accessor}>{row[col.accessor] == null ? "-" : row[col.accessor]}</td>
              ))}

              {getActions && (
                <td className="actions">
                  {getActions(row).map((action, i) => (
                    <button
                      key={i}
                      onClick={action.onClick}
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

export default AdminTable;
