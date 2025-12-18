import { useState } from "react";
// Table
import DataTable from "../../../components/DataTable";
import Modal from "../../../components/shared/Modal";
// icons
import EditIcon from "../../../assets/SVG/EditIcon";
import DeleteIcon from "../../../assets/SVG/DeleteIcon";
import Button from "../../../components/shared/Button";
import PlusIcon from "../../../assets/SVG/PlusIcon";
import Input from "../../../components/shared/Input";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetAllUsersQuery,
} from "../rtk/userApis";
import { toast } from "react-toastify";
import { FiLoader } from "react-icons/fi";
const UsersView = () => {
  const [isDeletingUser, setIsDeletingUser] = useState(null);
  // RTK Query Hooks
  const [createUser] = useCreateUserMutation();
  const { data, refetch: refetchAllUsers } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [editUser] = useEditUserMutation();
  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "12345678",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  // Handlers
  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingUserId) {
        // Edit
        const res = await editUser({
          id: editingUserId,
          data: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
          },
        }).unwrap();
        if (res.success) {
          toast.success("User updated successfully!");
        }
      } else {
        // Create
        const res = await createUser({
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
        }).unwrap();
        if (res.success) {
          toast.success("User created successfully!");
        }
      }

      setIsModalOpen(false);
      setEditingUserId(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "12345678",
        phone: "",
      });
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(
        error.data?.message || "Failed to save user. Please try again."
      );
    }
  };

  const deleteUserHandler = async (row) => {
    setIsDeletingUser(row._id);
    try {
      const res = await deleteUser(row._id).unwrap();
      if (res.success) {
        await refetchAllUsers();
        toast.success(res.message || "User deleted successfully!");
      }
    } catch (error) {
      toast.error(
        error.data?.message || "Failed to delete user. Please try again."
      );
    } finally {
      setIsDeletingUser(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ")[1] || "",
      email: user.email,
      password: "....",
    });
    setIsModalOpen(true);
  };
  // Table Columns
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
      name: "Password",
      selector: (row) => row.password,
    },
    {
      name: "Created At",
      selector: (row) => row.createdAt,
    },
    {
      name: "Roles",
      cell: (row) => (
        <span
          className={`px-3 py-1 text-xs rounded-full text-white ${
            row.role === "admin"
              ? "bg-[#34C7591A] text-[#34C759]!"
              : "bg-[#E6CE6533] text-[#FF9500]!"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <button>
            <EditIcon
              className="cursor-pointer"
              onClick={() => handleEdit(row)}
            />
          </button>
          <button
            disabled={isDeletingUser === row._id}
            className={`cursor-pointer ${
              isDeletingUser === row._id ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() => deleteUserHandler(row)}
          >
            {isDeletingUser === row?._id ? (
              <FiLoader className="animate-spin text-red-400" />
            ) : (
              <DeleteIcon />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className=" border-[#71717A] rounded-lg p-4 bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-xl font-medium text-[#09090B] ">
            User Management
          </h1>
        </div>
        <div className="mt-2 sm:mt-0">
          <Button
            text="Add New User"
            cn="px-4 py-2"
            icon={<PlusIcon />}
            onClick={() => {
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "12345678",
                phone: "",
              });
              setEditingUserId(null);
              setIsModalOpen(true);
            }}
          />
        </div>

        {isModalOpen && (
          <Modal
            title={editingUserId ? "Edit User" : "Add New User"}
            onClose={() => setIsModalOpen(false)}
            width="w-[400px] md:w-[500px]"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1" htmlFor="firstName">
                  First Name *
                </label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="lastName">
                  Last Name *
                </label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="email">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="password">
                  Password
                </label>
                <Input
                  type="text"
                  name="password"
                  placeholder=""
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button
                  text={editingUserId ? "Update User" : "Send Invitation"}
                  cn="text-white px-4 py-2 !w-auto"
                  full
                  width
                  onClick={handleSave}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
      <DataTable columns={columns} data={data?.data || []} />
    </div>
  );
};

export default UsersView;
