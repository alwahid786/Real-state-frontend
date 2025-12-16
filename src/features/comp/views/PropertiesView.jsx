// Table
import DataTable from "../../../components/DataTable";
// icons
import EditIcon from "../../../assets/SVG/EditIcon";
import DeleteIcon from "../../../assets/SVG/DeleteIcon";
import Button from "../../../components/shared/Button";
import PlusIcon from "../../../assets/SVG/PlusIcon";
const PropertiesView = () => {
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone No.",
      selector: (row) => row.phone,
    },
    {
      name: "Created At",
      selector: (row) => row.createdAt,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-3 py-1 text-xs rounded-full text-white ${
            row.status === "Active"
              ? "bg-[#34C7591A] !text-[#34C759]"
              : "bg-[#E6CE6533] !text-[#FF9500]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Action",
      cell: () => (
        <div className="flex gap-3">
          <EditIcon className="cursor-pointer" />
          <DeleteIcon className=" cursor-pointer" />
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      createdAt: "12 Sep 2024",
      status: "Active",
    },

    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      createdAt: "12 Sep 2024",
      status: "Pending",
    },
    {
      id: 3,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      createdAt: "12 Sep 2024",
      status: "Pending",
    },
  ];

  return (
    <div className=" rounded-lg p-4 bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-xl font-medium text-[#09090B] ">
            User Management
          </h1>
        </div>
        <div className="mt-2 sm:mt-0">
          <Button text="Create New Comp." cn="px-4 py-2" icon={<PlusIcon />} />
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default PropertiesView;
