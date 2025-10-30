import React from "react";

const Table = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="px-4 py-2 text-left">
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-t hover:bg-gray-50 transition duration-150"
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-2">
                  {row[col.accessor]}
                </td>
              ))}

              {actions && (
                <td className="px-4 py-2 flex gap-2">
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => action.onClick(row)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        action.type === "approve"
                          ? "bg-green-500 text-white"
                          : action.type === "reject"
                          ? "bg-red-500 text-white"
                          : "bg-gray-200"
                      }`}
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
