import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaRedoAlt } from "react-icons/fa";

const ClassRow = ({ lop, index, onToggleStatus }) => {
  const navigate = useNavigate();

  return (
    <tr
      className={`group border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 ${!lop.status ? "bg-gray-50/80" : ""}`}
    >
      <td className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
        {index}
      </td>
      <td className="px-6 py-4">
        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border">
          {lop.maLop.substring(0, 8).toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4">
        <div
          className={`text-sm font-semibold ${!lop.status ? "text-gray-400 line-through" : "text-gray-900"}`}
        >
          {lop.tenLop}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm border
          ${lop.status ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-gray-100 text-gray-500 border-gray-200"}`}
        >
          {lop.tenTemplate || "Chưa gán"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(`/admin/classes/edit/${lop.maLop}`)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => onToggleStatus(lop)}
            className={`p-2 rounded-lg transition-colors ${
              lop.status
                ? "text-red-600 hover:bg-red-100"
                : "text-green-600 hover:bg-green-100"
            }`}
            title={lop.status ? "Vô hiệu hóa" : "Kích hoạt"}
          >
            {lop.status ? <FaTrashAlt size={16} /> : <FaRedoAlt size={16} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ClassRow;
