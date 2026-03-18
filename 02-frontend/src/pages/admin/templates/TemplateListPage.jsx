import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import templateService from "../../../services/templateService";
import Swal from "sweetalert2";

const TemplateListPage = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const data = await templateService.getAllTemplates();
    setTemplates(data || []);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Xóa mẫu này?",
      text: "Dữ liệu sẽ được chuyển vào trạng thái ngưng hoạt động!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await templateService.deleteTemplate(id);
        fetchTemplates();
      }
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/admin/templates/create"
          className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-sm"
        >
          <i className="ri-add-circle-line text-xl"></i> Tạo mới template
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100 text-slate-400 uppercase text-sm tracking-wider">
              <th className="py-4 px-4 font-bold">Mã</th>
              <th className="py-4 px-4 font-bold">Tên template</th>
              <th className="py-4 px-4 font-bold text-center">Số câu hỏi</th>
              <th className="py-4 px-4 font-bold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((item, index) => (
              <tr
                key={item.maTemplate}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors group"
              >
                <td className="py-4 px-4 font-medium text-slate-600">
                  {index + 1}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  {item.tenTemplate}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold text-sm">
                    {item.danhSachCauHoi?.length || 0}
                  </span>
                </td>
                <td className="py-4 px-4 text-right space-x-2">
                  <button className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg transition-all">
                    <i className="ri-edit-line text-xl"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(item.maTemplate)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <i className="ri-delete-bin-line text-xl"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemplateListPage;
